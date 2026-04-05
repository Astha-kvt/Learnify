import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { User, Award, CheckCircle } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}/profile`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div className="p-8 text-center">Loading...</div>;

  const { user, doubts, answers } = data;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-8 mb-8 text-center">
        <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-200">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{user.name}</h1>
        <p className="text-slate-500 mt-1 uppercase tracking-widest text-sm font-bold">{user.role}</p>
        
        <div className="mt-4 flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 border-2">
            <span className="text-2xl font-black text-brand-600">{user.points}</span>
            <span className="text-sm text-slate-500 font-medium ml-2 uppercase">Points</span>
          </div>
          {user.badges?.map((badge, i) => (
             <div key={i} className="flex flex-col items-center">
                <Award className="w-8 h-8 text-yellow-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">{badge}</span>
             </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Doubts Column */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Questions Asked ({doubts.length})</h2>
          <div className="space-y-4">
            {doubts.map(doubt => (
              <div key={doubt._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <Link to={`/doubts/${doubt._id}`} className="text-lg font-bold text-brand-600 hover:underline">
                  {doubt.title}
                </Link>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${doubt.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {doubt.status}
                  </span>
                  <span className="text-slate-400">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {doubts.length === 0 && <div className="text-slate-500 italic">No questions asked yet.</div>}
          </div>
        </div>

        {/* Answers Column */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Answers Provided ({answers.length})</h2>
          <div className="space-y-4">
            {answers.map(ans => (
              <div key={ans._id} className={`bg-white p-4 rounded-lg shadow-sm border ${ans.isBestAnswer ? 'border-green-300 bg-green-50' : 'border-slate-200'}`}>
                <p className="text-slate-700 line-clamp-3 mb-2">{ans.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <Link to={`/doubts/${ans.doubt?._id}`} className="text-brand-600 hover:underline font-medium truncate">
                    Re: {ans.doubt?.title || 'Unknown Post'}
                  </Link>
                  {ans.isBestAnswer && (
                    <span className="flex items-center text-green-700 font-bold ml-2 shrink-0">
                      <CheckCircle className="w-4 h-4 mr-1" /> Best
                    </span>
                  )}
                </div>
              </div>
            ))}
            {answers.length === 0 && <div className="text-slate-500 italic">No answers provided yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
