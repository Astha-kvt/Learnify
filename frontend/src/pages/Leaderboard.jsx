import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Award, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users/leaderboard').then(({ data }) => setUsers(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-extrabold text-slate-900">Leaderboard</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {users.map((user, idx) => (
            <li key={user._id} className="p-4 hover:bg-slate-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-slate-300 w-8 text-center mr-4">{idx + 1}</span>
                  <div>
                    <Link to={`/profile/${user._id}`} className="text-lg font-bold text-slate-900 hover:text-brand-600">
                      {user.name}
                    </Link>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <span className="capitalize font-medium mr-3">{user.role}</span>
                      {user.badges?.map((badge, i) => (
                        <span key={i} className="inline-flex items-center text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs mr-2 border border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-brand-600">{user.points}</span>
                  <span className="text-sm font-medium text-slate-500 block uppercase tracking-wider">Points</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
