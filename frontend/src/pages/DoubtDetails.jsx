import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, CheckCircle, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

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

  if (!doubt) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Doubt Section */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{doubt.title}</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doubt.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {doubt.status}
          </span>
        </div>
        
        <p className="mt-4 text-slate-700 whitespace-pre-wrap">{doubt.description}</p>
        
        {doubt.imageUrls?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            {doubt.imageUrls.map((img, i) => (
              <img key={i} src={img} alt="Attachment" className="rounded-lg border border-slate-200" />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center text-sm text-slate-500">
          <Link to={`/profile/${doubt.user?._id}`} className="font-medium text-brand-600 hover:text-brand-800 mr-2">
            {doubt.user?.name}
          </Link>
          <span>asked this on {new Date(doubt.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
        <MessageCircle className="mr-2" />
        {doubt.answers?.length} Answers
      </h3>

      {/* Answers Section */}
      <div className="space-y-4 mb-8">
        {doubt.answers?.map(answer => (
          <div key={answer._id} className={`bg-white rounded-lg shadow border p-5 ${answer.isBestAnswer ? 'border-green-400 bg-green-50' : 'border-slate-200'}`}>
            <div className="flex gap-4">
              {/* Voting Column */}
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={() => handleVote(answer._id, 'upvote')} 
                  className={`p-1 rounded ${answer.upvotes?.includes(user?._id) ? 'text-brand-600 bg-brand-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span className="font-bold text-slate-700">
                  {(answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)}
                </span>
                <button 
                  onClick={() => handleVote(answer._id, 'downvote')}
                  className={`p-1 rounded ${answer.downvotes?.includes(user?._id) ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1">
                <p className="text-slate-800 whitespace-pre-wrap">{answer.text}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-slate-500">
                    <Link to={`/profile/${answer.user?._id}`} className="font-medium text-brand-600 hover:text-brand-800">
                      {answer.user?.name}
                    </Link>
                    <span className="mx-2">•</span>
                    {new Date(answer.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-3">
                    {answer.isBestAnswer && (
                      <span className="inline-flex items-center text-sm font-semibold text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Best Answer
                      </span>
                    )}
                    
                    {user?._id === doubt.user?._id && !answer.isBestAnswer && doubt.status !== 'resolved' && (
                      <button
                        onClick={() => handleMarkBest(answer._id)}
                        className="text-xs border border-green-500 text-green-600 hover:bg-green-50 font-medium px-3 py-1 rounded transition"
                      >
                        Mark as Best
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {user ? (
        <form onSubmit={handleSubmitAnswer} className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <h4 className="text-sm font-bold text-slate-900 mb-2">Your Answer</h4>
          <textarea
            required
            rows={4}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm p-3 border"
            placeholder="Type your explanation here..."
          />
          <button type="submit" className="mt-3 flex items-center justify-center w-full px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 font-medium">
            <Send className="w-4 h-4 mr-2" />
            Submit Answer
          </button>
        </form>
      ) : (
        <div className="bg-slate-100 p-5 rounded-lg text-center text-slate-600">
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Log in</Link> to post an answer.
        </div>
      )}
    </div>
  );
}
