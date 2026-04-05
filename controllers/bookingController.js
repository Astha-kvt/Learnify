const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { tutorId, date, timeSlot } = req.body;
    
    const booking = await Booking.create({
      student: req.user._id,
      tutor: tutorId,
      date,
      timeSlot,
      status: 'pending'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const query = req.user.role === 'tutor' 
      ? { tutor: req.user._id } 
      : { student: req.user._id };

    const bookings = await Booking.find(query)
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.tutor.toString() !== req.user._id.toString() && booking.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    if (status) booking.status = status;
    if (meetingLink) booking.meetingLink = meetingLink;

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, updateBookingStatus };
