import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[80vh]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4 shadow-inner">
           <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-extrabold text-ink">Sign in</h2>
        <p className="mt-2 text-slate-500 font-medium">Welcome back to Learnify</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input 
              label="Email Address" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@university.edu"
            />
            <Input 
              label="Password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-lg">
                <LogIn className="w-5 h-5 mr-2" /> Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-sm font-semibold text-slate-500">
            Don't have an account? <Link to="/register" className="text-brand-600 hover:text-brand-700 underline decoration-2 underline-offset-4">Sign up</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
