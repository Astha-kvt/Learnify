import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ImagePlus, Send } from 'lucide-react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

export default function CreateDoubt({ onDoubtCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    try {
      await api.post('/doubts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Question posted successfully!');
      setTitle('');
      setDescription('');
      setImages(null);
      if (onDoubtCreated) onDoubtCreated();
    } catch (error) {
      toast.error('Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8 border-brand-200 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-ink flex items-center">Ask a Question</h3>
        <Input 
          placeholder="What's your question? Be specific." 
          required 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="font-bold text-lg"
        />
        <Input 
          type="textarea"
          rows={3} 
          placeholder="Provide all the details, context, and what you've tried..." 
          required 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="font-medium"
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
          <label className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl cursor-pointer hover:bg-slate-200 transition-spring font-semibold text-sm border border-slate-200 w-full sm:w-auto justify-center">
            <ImagePlus className="w-5 h-5 mr-2 text-brand-600" />
            {images ? `${images.length} file(s)` : 'Attach Images'}
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="hidden" />
          </label>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto px-6 h-11">
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Posting...' : 'Post Question'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
