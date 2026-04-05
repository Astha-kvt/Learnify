import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Image as ImageIcon } from 'lucide-react';

export default function CreateDoubt({ onDoubtCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error('Please fill in title and description');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('images', file);
        });
      }

      const { data } = await api.post('/doubts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Doubt posted successfully!');
      setTitle('');
      setDescription('');
      setFiles(null);
      if (onDoubtCreated) onDoubtCreated(data); // callback to refresh feed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post doubt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 mb-8 border border-slate-200">
      <h3 className="text-lg font-medium leading-6 text-slate-900 mb-4">Have a doubt? Ask away!</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm px-4 py-2 border"
            placeholder="What's your question?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            rows={3}
            className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm px-4 py-2 border"
            placeholder="Provide some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="cursor-pointer inline-flex items-center text-sm text-slate-600 hover:text-brand-600">
            <ImageIcon className="w-5 h-5 mr-2" />
            <span>Attach Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
          <span className="text-xs text-slate-400">
            {files ? `${files.length} file(s) selected` : 'Max 5 images allowed'}
          </span>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Posting...' : <><Send className="w-4 h-4 mr-2" /> Post Doubt</>}
          </button>
        </div>
      </form>
    </div>
  );
}
