import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Calendar, User, Award, Compass } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-10 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-2">Find a Tutor</h1>
          <p className="text-slate-500 font-medium">Book 1-on-1 sessions with top contributors.</p>
        </div>
        <div className="hidden md:flex w-16 h-16 bg-brand-100 rounded-2xl items-center justify-center text-brand-600 rotate-3 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map(tutor => (
          <Card key={tutor._id} noPadding className="overflow-hidden bg-white/80 border-slate-200 group">
             <div className="p-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-300 to-indigo-400" />
                
                <div className="flex items-center gap-4 mb-6">
                   <Link to={`/profile/${tutor._id}`}>
                     <div className="w-16 h-16 bg-gradient-to-br from-brand-100 to-sky-100 text-brand-700 rounded-full flex items-center justify-center font-black text-2xl shadow-inner border border-white group-hover:scale-110 transition-spring">
                       {tutor.name.charAt(0)}
                     </div>
                   </Link>
                   <div className="flex-1">
                     <Link to={`/profile/${tutor._id}`} className="text-xl font-bold text-ink hover:text-brand-600 block leading-tight">
                       {tutor.name}
                     </Link>
                     <div className="mt-1 flex items-center flex-wrap gap-1">
                       <span className="text-xs font-black text-slate-400 tracking-widest">{tutor.points} PTS</span>
                       {tutor.badges?.includes('Expert Tutor') && <Award className="w-4 h-4 ml-1 text-yellow-500 max-w-min drop-shadow-sm" />}
                     </div>
                   </div>
                </div>

                {bookingTutorId === tutor._id ? (
                  <form onSubmit={(e) => handleBookSession(e, tutor._id)} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Input label="Session Date" type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                    <Input label="Session Time" type="time" required value={bookingData.timeSlot} onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})} />
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setBookingTutorId(null)} className="flex-[0.5]">Cancel</Button>
                      <Button type="submit" variant="primary" className="flex-1 shadow-glow w-full">Confirm</Button>
                    </div>
                  </form>
                ) : (
                  <Button onClick={() => setBookingTutorId(tutor._id)} variant="primary" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" /> Book Session
                  </Button>
                )}
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
