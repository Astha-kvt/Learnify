import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import CreateDoubt from '../components/CreateDoubt';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [doubts, setDoubts] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchDoubts = async () => {
    try {
      const { data } = await api.get('/doubts');
      setDoubts(data);
    } catch (error) {
      toast.error('Failed to load feed');
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Learnify Feed</h1>
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="text-sm text-slate-600 font-medium">Hello, {user.name}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-medium">Logout</button>
          </div>
        ) : null}
      </div>

      {user && <CreateDoubt onDoubtCreated={fetchDoubts} />}

      <div className="space-y-6">
        {doubts.map((doubt) => (
          <div key={doubt._id} className="bg-white overflow-hidden shadow rounded-lg border border-slate-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 flex-shrink-0 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold uppercase">
                    {doubt.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doubt.user?.name || 'Unknown User'}</p>
                    <div className="flex items-center text-xs text-slate-500">
                      <span className="capitalize">{doubt.user?.role || 'user'}</span>
                      {doubt.user?.badges?.length > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          {doubt.user.badges[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doubt.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {doubt.status}
                </span>
              </div>

              <h4 className="text-lg font-bold text-slate-900">{doubt.title}</h4>
              <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">{doubt.description}</p>
              
              {doubt.imageUrls && doubt.imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {doubt.imageUrls.map((img, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video">
                      <img src={img} alt="Question attachment" className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center text-sm text-slate-500 space-x-6">
                <button className="inline-flex items-center hover:text-brand-600">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {doubt.answers?.length || 0} Answers
                </button>
                <span className="text-slate-400">Posted on {new Date(doubt.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
        {doubts.length === 0 && (
          <div className="text-center py-12 text-slate-500">No questions posted yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}
