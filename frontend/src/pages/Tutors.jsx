import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Calendar, User, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '' });
  const [bookingTutorId, setBookingTutorId] = useState(null);

  useEffect(() => {
    api.get('/users/tutors').then((res) => setTutors(res.data));
  }, []);

  const handleBookSession = async (e, tutorId) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.timeSlot) return toast.error('Please specify a date and time');
    
    try {
      await api.post('/bookings', {
        tutorId,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
      });
      toast.success('Booking requested successfully!');
      setBookingTutorId(null);
      setBookingData({ date: '', timeSlot: '' });
    } catch (error) {
      toast.error('Failed to book session');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Find a Tutor</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map(tutor => (
          <div key={tutor._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition relative">
             <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                     <User className="w-6 h-6" />
                   </div>
                   <div>
                     <Link to={`/profile/${tutor._id}`} className="text-lg font-bold text-slate-900 hover:text-brand-600">
                       {tutor.name}
                     </Link>
                     <div className="text-sm font-medium text-brand-600 flex items-center">
                       {tutor.points} Points
                       {tutor.badges?.includes('Expert Tutor') && <Award className="w-4 h-4 ml-2 text-yellow-500" />}
                     </div>
                   </div>
                </div>

                {bookingTutorId === tutor._id ? (
                  <form onSubmit={(e) => handleBookSession(e, tutor._id)} className="space-y-3 mt-4 border-t pt-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Date</label>
                      <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="mt-1 block w-full text-sm border-slate-300 rounded focus:border-brand-500 focus:ring-brand-500 border p-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Time</label>
                      <input type="time" required value={bookingData.timeSlot} onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})} className="mt-1 block w-full text-sm border-slate-300 rounded focus:border-brand-500 focus:ring-brand-500 border p-2" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-brand-600 text-white py-2 rounded text-sm font-medium hover:bg-brand-700">Book</button>
                      <button type="button" onClick={() => setBookingTutorId(null)} className="flex-1 bg-slate-100 text-slate-700 py-2 rounded text-sm font-medium hover:bg-slate-200">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setBookingTutorId(tutor._id)} className="mt-4 w-full flex items-center justify-center py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                    <Calendar className="w-4 h-4 mr-2" /> Book Session
                  </button>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
