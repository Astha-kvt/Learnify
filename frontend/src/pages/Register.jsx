import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[80vh] py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
           <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-extrabold text-ink">Join Learnify</h2>
        <p className="mt-2 text-slate-500 font-medium">Ignite your collaborative learning</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Jane Doe" />
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="jane@example.com" />
            <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="Min 6 characters" />
            
            <div className="pt-2">
              <label className="block text-sm font-bold text-ink mb-2">I am signing up as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, role: 'student'})} className={`p-3 rounded-xl border-2 font-bold transition-all ${formData.role === 'student' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white/50 text-slate-500 hover:border-slate-300'}`}>
                  Student
                </button>
                <button type="button" onClick={() => setFormData({...formData, role: 'tutor'})} className={`p-3 rounded-xl border-2 font-bold transition-all ${formData.role === 'tutor' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white/50 text-slate-500 hover:border-slate-300'}`}>
                  Tutor
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full h-12 text-lg">
                <UserPlus className="w-5 h-5 mr-2" /> Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm font-semibold text-slate-500">
            Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700 underline decoration-2 underline-offset-4">Log in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
