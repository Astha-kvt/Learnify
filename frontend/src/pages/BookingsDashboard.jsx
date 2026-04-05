import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Video, Check, X, Clock, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function BookingsDashboard() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (e) {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status, link = null) => {
    try {
       const payload = { status };
       if (link) payload.meetingLink = link;
       
       await api.put(`/bookings/${id}/status`, payload);
       toast.success(`Booking ${status}`);
       fetchBookings();
    } catch (e) {
       toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center mb-10">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-brand-600 mr-4">
          <CalendarDays className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-black text-ink">Session Dashboard</h1>
      </div>
      
      <div className="space-y-4">
        {bookings.map(booking => (
          <Card key={booking._id} noPadding className="overflow-hidden bg-white/80 border-slate-200">
            <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between md:items-center">
               <div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {booking.status === 'pending' && <Badge variant="warning">Pending Approval</Badge>}
                    {booking.status === 'confirmed' && <Badge variant="success">Confirmed Room</Badge>}
                    {booking.status === 'completed' && <Badge variant="default">Completed/Closed</Badge>}
                    <span className="text-slate-500 text-sm flex items-center font-bold px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">
                      <Clock className="w-4 h-4 mr-1.5 text-brand-500" /> {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                    </span>
                  </div>

                  {user?.role === 'tutor' ? (
                    <p className="text-xl font-bold text-ink">
                      Session with <span className="text-brand-600">{booking.student?.name}</span>
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-ink">
                      Tutor: <span className="text-brand-600">{booking.tutor?.name}</span>
                    </p>
                  )}
               </div>

               <div className="mt-5 md:mt-0 flex flex-col items-end gap-3 w-full md:w-auto">
                  {/* Tutor Actions */}
                  {user?.role === 'tutor' && booking.status === 'pending' && (
                     <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full">
                        <Input 
                          type="url" 
                          placeholder="Meeting Link (Zoom/Meet)..."
                          className="w-full sm:w-64"
                          value={meetingLinks[booking._id] || ''}
                          onChange={(e) => setMeetingLinks({...meetingLinks, [booking._id]: e.target.value})}
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed', meetingLinks[booking._id])}
                            variant="primary" className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-none px-3" title="Confirm"
                          ><Check className="w-5 h-5 mx-auto" /></Button>
                          <Button 
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            variant="destructive" className="flex-[0.5] shadow-none px-3" title="Reject/Close"
                          ><X className="w-5 h-5 mx-auto" /></Button>
                        </div>
                     </div>
                  )}
                  
                  {/* Student/Tutor Link view */}
                  {booking.status === 'confirmed' && booking.meetingLink && (
                     <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                       <Button variant="primary" className="w-full shadow-glow">
                         <Video className="w-4 h-4 mr-2" /> Join Meeting
                       </Button>
                     </a>
                  )}
               </div>
            </div>
          </Card>
        ))}
        {bookings.length === 0 && (
          <Card className="p-8 text-center border-dashed border-2 bg-transparent text-slate-500 font-bold">
            No active bookings found.
          </Card>
        )}
      </div>
    </div>
  );
}
