import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { User, Award, CheckCircle, Activity, LayoutGrid } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function UserProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}/profile`).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div className="p-8 text-center mt-20 font-bold animate-pulse text-slate-500">Loading Profile...</div>;

  const { user, doubts, answers } = data;

  return (
    <div className="max-w-5xl mx-auto py-6">
      {/* Banner / Header */}
      <Card className="mb-8 border-slate-200/60 shadow-lg relative overflow-hidden bg-white/80">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-brand-300 via-indigo-300 to-sky-200"></div>
        <div className="relative pt-16 flex flex-col items-center">
          <div className="w-28 h-28 bg-white text-ink rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4 font-black text-4xl">
             {user.name.charAt(0)}
          </div>
          <h1 className="text-4xl font-black text-ink tracking-tight">{user.name}</h1>
          <p className="text-slate-400 mt-1 uppercase tracking-widest text-sm font-black">{user.role}</p>
          
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
            <div className="px-5 py-2.5 bg-brand-50 rounded-xl border border-brand-200 shadow-sm flex items-center">
              <span className="text-2xl font-black text-brand-700 mr-2">{user.points}</span>
              <span className="text-xs text-brand-600/70 font-black uppercase tracking-widest">Points</span>
            </div>
            {user.badges?.map((badge, i) => (
               <Badge key={i} variant="brand" icon={Award} className="px-4 py-2 text-sm shadow-sm">{badge}</Badge>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Doubts Column */}
        <div>
          <h2 className="text-2xl font-black text-ink mb-6 flex items-center">
             <LayoutGrid className="w-6 h-6 mr-2 text-brand-500" />
             Questions Asked <span className="ml-2 text-sm bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{doubts.length}</span>
          </h2>
          <div className="space-y-4">
            {doubts.map(doubt => (
              <Card key={doubt._id} noPadding interactive className="bg-white/70">
                <div className="p-5">
                  <Link to={`/doubts/${doubt._id}`} className="text-lg font-bold text-ink hover:text-brand-600 leading-tight block mb-3 line-clamp-2">
                    {doubt.title}
                  </Link>
                  <div className="flex items-center justify-between">
                    {doubt.status === 'resolved' ? <Badge variant="success">Resolved</Badge> : <Badge variant="warning">Open</Badge>}
                    <span className="text-xs font-bold text-slate-400">{new Date(doubt.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
            {doubts.length === 0 && <div className="text-slate-400 font-bold italic p-4 text-center bg-white/40 rounded-xl border border-slate-200/50">No questions asked yet.</div>}
          </div>
        </div>

        {/* Answers Column */}
        <div>
          <h2 className="text-2xl font-black text-ink mb-6 flex items-center">
             <Activity className="w-6 h-6 mr-2 text-emerald-500" />
             Answers Provided <span className="ml-2 text-sm bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{answers.length}</span>
          </h2>
          <div className="space-y-4">
            {answers.map(ans => (
              <Card key={ans._id} noPadding interactive className={ans.isBestAnswer ? 'border-2 border-emerald-300 bg-emerald-50/50 shadow-emerald-100 shadow-md' : 'bg-white/70'}>
                <div className="p-5 relative">
                  {ans.isBestAnswer && (
                     <div className="absolute top-0 right-0 bg-emerald-500 text-white p-1 rounded-bl-lg flex items-center px-3 py-1 text-xs font-bold uppercase">
                       <CheckCircle className="w-3 h-3 mr-1" /> Best
                     </div>
                  )}
                  <p className="text-slate-600 font-medium line-clamp-3 mb-4 leading-relaxed">{ans.text}</p>
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                    <Link to={`/doubts/${ans.doubt?._id}`} className="font-bold text-ink hover:text-brand-600 truncate flex-1">
                      <span className="text-slate-400 font-normal mr-1">Re:</span> {ans.doubt?.title || 'Unknown Post'}
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
            {answers.length === 0 && <div className="text-slate-400 font-bold italic p-4 text-center bg-white/40 rounded-xl border border-slate-200/50">No answers provided yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
