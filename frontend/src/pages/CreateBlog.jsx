import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FloppyDisk, ArrowLeft, Eye, PenNib } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createBlog } = useBlog();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }
    setIsSubmitting(true);
    const blog = await createBlog({
      title: title.trim(),
      content: content.trim(),
    });
    if (blog) {
      toast.success('Blog created successfully!');
      navigate('/dashboard');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Background Image & Overlay */}
       <div className="fixed inset-0 z-0">
          <img 
            src="/editorial_hero_image_1768204267018.png" 
            alt="Editorial Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950"></div>
       </div>

      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto h-screen flex flex-col animate-fade">
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          
          {/* Editor Section */}
          <div className="flex-1 flex flex-col bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
            {/* Toolbar */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
               <button
                 onClick={() => navigate('/dashboard')}
                 className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
               >
                 <ArrowLeft weight="bold" className="w-4 h-4" />
                 <span className="text-sm font-medium tracking-wide uppercase">Back</span>
               </button>
               
               <div className="flex items-center gap-4">
                 <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest hidden sm:inline-block">
                    {title ? 'Unsaved changes' : 'New Draft'}
                 </span>
                 <button
                   onClick={handleSubmit}
                   disabled={isSubmitting || !title.trim() || !content.trim()}
                   className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? <LoadingSpinner size="small" /> : <FloppyDisk weight="bold" size={14} />}
                   Publish
                 </button>
               </div>
            </div>

            {/* Edit Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 scrollbar-hide">
               <div className="max-w-3xl mx-auto space-y-8">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your title..."
                    className="w-full bg-transparent border-none text-4xl md:text-5xl font-display font-medium text-white placeholder-zinc-600 focus:outline-none focus:ring-0 p-0 leading-tight"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your story..."
                    className="w-full h-full min-h-[500px] bg-transparent border-none text-lg text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-0 p-0 resize-none leading-relaxed font-serif"
                  />
               </div>
            </div>
          </div>

          {/* Preview Section - Hidden on mobile */}
          <div className="hidden lg:flex w-1/2 flex-col bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
              <div className="h-16 border-b border-white/5 flex items-center px-6 bg-white/5">
                 <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                   <Eye weight="bold" className="w-4 h-4" /> Live Preview
                 </span>
              </div>
              <div className="flex-1 overflow-y-auto p-12">
                 <div className="max-w-2xl mx-auto prose prose-invert prose-zinc prose-lg">
                    {title ? (
                       <h1 className="font-display font-medium">{title}</h1>
                    ) : (
                       <h1 className="opacity-20 font-display font-medium">Post Title</h1>
                    )}
                    {content ? (
                       <div className="whitespace-pre-wrap font-serif text-zinc-300">{content}</div>
                    ) : (
                       <p className="opacity-20 whitespace-pre-wrap font-serif">
                          Nothing to preview yet. Start writing on the left to see it appear here.
                       </p>
                    )}
                 </div>
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;