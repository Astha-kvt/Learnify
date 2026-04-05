import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Award, Trophy, Crown, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users/leaderboard').then(({ data }) => setUsers(data));
  }, []);

  const getRankIcon = (idx) => {
    if (idx === 0) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (idx === 1) return <Medal className="w-7 h-7 text-slate-400" />;
    if (idx === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="text-xl font-black text-slate-300 w-8 text-center">{idx + 1}</span>;
  };

  const getRankGlow = (idx) => {
    if (idx === 0) return 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)] bg-gradient-to-r from-yellow-50 to-white';
    if (idx === 1) return 'border-slate-300 shadow-[0_0_20px_rgba(148,163,184,0.2)] bg-gradient-to-r from-slate-50 to-white';
    if (idx === 2) return 'border-amber-200 shadow-[0_0_15px_rgba(180,83,9,0.1)] bg-gradient-to-r from-amber-50 to-white';
    return 'border-slate-100 bg-white/70 hover:border-brand-200';
  };

  // Extract top 3 for podium visualization if there are enough users
  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-200 shadow-inner mb-4">
           <Trophy className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">Hall of Fame</h1>
        <p className="text-slate-500 font-medium mt-3 max-w-lg">The top contributors shaping the community through excellent answers and support.</p>
      </div>

      {topThree.length >= 3 && (
        <div className="hidden sm:flex items-end justify-center gap-4 mb-20 mt-12 pt-16">
          {/* Rank 2 */}
          <div className="flex flex-col items-center">
             <Link to={`/profile/${topThree[1]._id}`} className="mb-2 text-center group">
               <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-slate-300 flex items-center justify-center font-black text-slate-800 text-xl mx-auto mb-2 group-hover:scale-110 transition-spring shadow-lg">
                 {topThree[1].name.charAt(0)}
               </div>
               <span className="font-bold text-ink">{topThree[1].name.split(' ')[0]}</span>
               <div className="text-brand-600 font-black">{topThree[1].points} pts</div>
             </Link>
             <div className="podium-2 w-32 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg shadow-inner flex justify-center pt-4">
               <span className="text-4xl font-black text-slate-300/50">2</span>
             </div>
          </div>
          {/* Rank 1 */}
          <div className="flex flex-col items-center -mt-8">
             <Link to={`/profile/${topThree[0]._id}`} className="mb-2 text-center group">
               <div className="relative">
                 <Crown className="w-8 h-8 text-yellow-500 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-md" />
                 <div className="w-20 h-20 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center font-black text-yellow-800 text-2xl mx-auto mb-2 group-hover:scale-110 transition-spring shadow-glow z-10 relative">
                   {topThree[0].name.charAt(0)}
                 </div>
               </div>
               <span className="font-black text-ink text-lg">{topThree[0].name.split(' ')[0]}</span>
               <div className="text-brand-600 font-black">{topThree[0].points} pts</div>
             </Link>
             <div className="podium-1 w-36 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg shadow-inner flex justify-center pt-4 border-x border-t border-yellow-300 z-0">
               <span className="text-5xl font-black text-yellow-600/30">1</span>
             </div>
          </div>
          {/* Rank 3 */}
          <div className="flex flex-col items-center">
             <Link to={`/profile/${topThree[2]._id}`} className="mb-2 text-center group">
               <div className="w-16 h-16 rounded-full bg-amber-50 border-4 border-amber-600 flex items-center justify-center font-black text-amber-900 text-xl mx-auto mb-2 group-hover:scale-110 transition-spring shadow-lg">
                 {topThree[2].name.charAt(0)}
               </div>
               <span className="font-bold text-ink">{topThree[2].name.split(' ')[0]}</span>
               <div className="text-brand-600 font-black">{topThree[2].points} pts</div>
             </Link>
             <div className="podium-3 w-32 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg shadow-inner flex justify-center pt-4">
               <span className="text-4xl font-black text-amber-700/30">3</span>
             </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {users.map((user, idx) => (
          <Card key={user._id} noPadding interactive className={`border-2 ${getRankGlow(idx)} overflow-hidden`}>
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 sm:w-16 flex justify-center mr-2 sm:mr-4 shrink-0">
                  {getRankIcon(idx)}
                </div>
                <div>
                  <Link to={`/profile/${user._id}`} className="text-lg sm:text-xl font-bold text-ink hover:text-brand-600 transition-colors">
                    {user.name}
                  </Link>
                  <div className="flex items-center mt-1.5 gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-xs uppercase font-black text-slate-400 tracking-widest">{user.role}</span>
                    {user.badges?.map((badge, i) => (
                      <Badge key={i} variant="brand" icon={Award}>{badge}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right px-4">
                <span className="text-2xl sm:text-3xl font-black text-ink">{user.points}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 block uppercase tracking-widest">Points</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
