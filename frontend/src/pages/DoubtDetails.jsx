import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageCircle, Send, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function DoubtDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [doubt, setDoubt] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const fetchDoubt = async () => {
    try {
      const { data } = await api.get(`/doubts/${id}`);
      setDoubt(data);
    } catch (error) {
      toast.error('Failed to load doubt details');
    }
  };

  useEffect(() => {
    fetchDoubt();
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText) return;
    try {
      await api.post(`/doubts/${id}/answers`, { text: answerText });
      toast.success('Answer posted!');
      setAnswerText('');
      fetchDoubt();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    }
  };

  const handleMarkBest = async (answerId) => {
    try {
      await api.put(`/answers/${answerId}/best`);
      toast.success('Marked as best answer');
      fetchDoubt();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as best');
    }
  };

  const handleVote = async (answerId, voteType) => {
    try {
      await api.put(`/answers/${answerId}/vote`, { voteType });
      fetchDoubt();
    } catch (error) {
      toast.error('Vote failed');
    }
  };

  if (!doubt) return <div className="p-8 text-center text-slate-500 font-bold mt-20 animate-pulse">Fetching details...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Doubt Section */}
      <Card className="mb-6 relative overflow-hidden bg-white/80 border-slate-200/60 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-black text-ink leading-tight pr-4">{doubt.title}</h1>
          {doubt.status === 'resolved' ? <Badge variant="success" className="text-sm px-3 py-1">Resolved</Badge> : <Badge variant="warning" className="text-sm px-3 py-1">Open</Badge>}
        </div>
        
        <div className="flex items-center space-x-3 mb-6 bg-slate-50/50 p-3 rounded-xl border border-slate-100 w-fit">
          <Link to={`/profile/${doubt.user?._id}`}>
             <div className="h-10 w-10 flex-shrink-0 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-black shadow-sm border border-white">
               {doubt.user?.name?.charAt(0) || '?'}
             </div>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${doubt.user?._id}`} className="font-bold text-ink hover:text-brand-600 transition-colors">
              {doubt.user?.name}
            </Link>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Posted {new Date(doubt.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed md:text-lg font-medium">{doubt.description}</p>
        
        {doubt.imageUrls?.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doubt.imageUrls.map((img, i) => (
              <a href={img} target="_blank" rel="noreferrer" key={i} className="block rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img src={img} alt="Attachment" className="object-cover w-full h-48 hover:scale-105 transition-transform duration-500" />
              </a>
            ))}
          </div>
        )}
      </Card>

      <h3 className="text-2xl font-black text-ink mb-6 flex items-center bg-white px-5 py-3 rounded-xl w-fit shadow-sm border border-slate-200/50">
        <MessageCircle className="mr-2 text-brand-500 w-6 h-6" />
        {doubt.answers?.length} Answers
      </h3>

      {/* Answers Section */}
      <div className="space-y-5 mb-8">
        {doubt.answers?.map(answer => (
          <Card key={answer._id} noPadding className={`overflow-hidden border-2 ${answer.isBestAnswer ? 'border-emerald-400 bg-emerald-50/30 shadow-emerald-100/50 shadow-xl' : 'border-slate-100 bg-white/70'}`}>
            <div className="flex flex-col sm:flex-row">
              {/* Voting Column */}
              <div className={`flex sm:flex-col items-center justify-center gap-4 sm:gap-2 p-4 sm:p-6 sm:w-24 shrink-0 border-b sm:border-b-0 sm:border-r ${answer.isBestAnswer ? 'border-emerald-200 bg-emerald-100/30' : 'border-slate-100 bg-slate-50/50'}`}>
                <button 
                  onClick={() => handleVote(answer._id, 'upvote')} 
                  className={`p-2 rounded-full transition-spring ${answer.upvotes?.includes(user?._id) ? 'text-brand-600 bg-brand-100 scale-110 shadow-sm' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                >
                  <ThumbsUp className="w-6 h-6" />
                </button>
                <span className="text-xl font-black text-ink">
                  {(answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)}
                </span>
                <button 
                  onClick={() => handleVote(answer._id, 'downvote')}
                  className={`p-2 rounded-full transition-spring ${answer.downvotes?.includes(user?._id) ? 'text-red-500 bg-red-100 scale-110 shadow-sm' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'}`}
                >
                  <ThumbsDown className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 relative">
                {answer.isBestAnswer && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm flex items-center">
                     <CheckCircle className="w-3 h-3 mr-1.5" /> Best Answer
                  </div>
                )}
                
                <p className={`text-slate-800 whitespace-pre-wrap leading-relaxed font-medium ${answer.isBestAnswer ? 'mt-4' : ''}`}>{answer.text}</p>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Link to={`/profile/${answer.user?._id}`} className="font-bold text-ink hover:text-brand-600 text-sm">
                      {answer.user?.name}
                    </Link>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm font-semibold text-slate-400">{new Date(answer.createdAt).toLocaleDateString()}</span>
                  </div>

                  {user?._id === doubt.user?._id && !answer.isBestAnswer && doubt.status !== 'resolved' && (
                    <Button onClick={() => handleMarkBest(answer._id)} variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300">
                      <CheckCircle className="w-4 h-4 mr-1.5" /> Mark as Best
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      {user ? (
        <Card className="border-brand-200 shadow-md">
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <h4 className="text-xl font-bold text-ink flex items-center"><Send className="w-5 h-5 mr-2 text-brand-500" /> Post an Answer</h4>
            <Input 
              type="textarea"
              required
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your explanation here. Use clear descriptions..."
            />
            <div className="flex justify-end">
              <Button type="submit" size="lg" className="w-full sm:w-auto px-8 shadow-glow">Submit Answer</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="text-center bg-slate-100/50 border-dashed border-2 border-slate-300">
          <p className="text-slate-500 font-medium">Have an answer?</p>
          <div className="mt-3">
             <Link to="/login"><Button variant="primary">Log in to join discussion</Button></Link>
          </div>
        </Card>
      )}
    </div>
  );
}
