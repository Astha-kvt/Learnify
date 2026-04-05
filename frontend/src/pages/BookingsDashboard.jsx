import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Video, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Bookings</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {bookings.map(booking => (
            <li key={booking._id} className="p-6 hover:bg-slate-50 transition">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                        ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-slate-500 text-sm flex items-center font-medium">
                        <Clock className="w-4 h-4 mr-1" /> {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                      </span>
                    </div>

                    {user?.role === 'tutor' ? (
                      <p className="text-lg font-bold text-slate-900 mt-2">
                        Session with <span className="text-brand-600">{booking.student?.name}</span>
                      </p>
                    ) : (
                      <p className="text-lg font-bold text-slate-900 mt-2">
                        Tutor: <span className="text-brand-600">{booking.tutor?.name}</span>
                      </p>
                    )}
                 </div>

                 <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
                    {/* Tutor Actions */}
                    {user?.role === 'tutor' && booking.status === 'pending' && (
                       <div className="flex items-center gap-2">
                          <input 
                            type="url" 
                            placeholder="Zoom/Meet Link..."
                            className="text-sm border border-slate-300 rounded p-2 focus:ring-brand-500 focus:border-brand-500 w-48"
                            value={meetingLinks[booking._id] || ''}
                            onChange={(e) => setMeetingLinks({...meetingLinks, [booking._id]: e.target.value})}
                          />
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed', meetingLinks[booking._id])}
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700" title="Confirm"
                          ><Check className="w-4 h-4" /></button>
                          <button 
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="bg-slate-200 text-slate-700 p-2 rounded hover:bg-slate-300" title="Reject/Close"
                          ><X className="w-4 h-4" /></button>
                       </div>
                    )}
                    
                    {/* Student/Tutor Link view */}
                    {booking.status === 'confirmed' && booking.meetingLink && (
                       <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="flex items-center px-4 py-2 bg-brand-600 text-white font-medium rounded shadow hover:bg-brand-700">
                         <Video className="w-4 h-4 mr-2" /> Join Meeting
                       </a>
                    )}
                 </div>
              </div>
            </li>
          ))}
          {bookings.length === 0 && <li className="p-8 text-center text-slate-500">No bookings found.</li>}
        </ul>
      </div>
    </div>
  );
}
