import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, Trash, PencilLine, ShareNetwork, Link as LinkIcon, WarningCircle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { fetchBlog, fetchPublicBlog, deleteBlog, toggleBlogSharing } = useBlog();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [blog, setBlog] = useState(null);
  const [blogLoading, setBlogLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      setBlogLoading(true);
      let blogData = null;
      
      try {
        try {
          blogData = await fetchPublicBlog(id);
        } catch (error) {
          blogData = null;
        }
        
        if (!blogData && isAuthenticated) {
          try {
            blogData = await fetchBlog(id);
          } catch (error) {
            blogData = null;
          }
        }
        
        if (!blogData) {
          setBlog(null);
          return;
        }
        
        if (blogData && isAuthenticated && blogData.author === user?.name) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        
        setIsShared(blogData?.shared || false);
        setBlog(blogData);
      } catch (error) {
        setBlog(null);
      } finally {
        setBlogLoading(false);
      }
    };
    
    if (id) {
      loadBlog();
    }
  }, [id, isAuthenticated, user, fetchBlog, fetchPublicBlog]);

  const handleDelete = async () => {
    if (!isOwner) return;
    const success = await deleteBlog(id);
    if (success) {
      toast.success('Blog deleted successfully');
      navigate('/');
    }
  };

  const handleToggleShare = async () => {
    if (!isOwner) return;
    const newSharedStatus = !isShared;
    const success = await toggleBlogSharing(id, newSharedStatus);
    if (success) {
      setIsShared(newSharedStatus);
      
      if (newSharedStatus) {
        const shareUrl = `${window.location.origin}/blog/${id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Public link copied to clipboard!');
      } else {
        toast.success('Blog is now private.');
      }
    } else {
      toast.error('Failed to update share status');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  if (blogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-zinc-950">
        <div className="text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
            <WarningCircle weight="regular" size={32} className="text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-zinc-400 mb-8">The story you're looking for might have been removed or is not available.</p>
          <Link to="/" className="btn-primary inline-flex">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-white selection:text-black pb-32">
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 brightness-100 contrast-150 mix-blend-overlay"></div>
       </div>

       <div className="relative z-10 pt-32 px-6 max-w-3xl mx-auto animate-fade">
         
         <nav className="flex items-center justify-between mb-20">
            <Link
              to="/dashboard"
              className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest"
            >
              <ArrowLeft weight="light" size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </Link>

            <div className="flex items-center gap-4">
              {isOwner && (
                <>
                  <button
                    onClick={handleToggleShare}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${
                      isShared 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800'
                    }`}
                  >
                    <ShareNetwork weight="regular" size={14} />
                    <span>{isShared ? 'Public' : 'Private'}</span>
                  </button>
                  
                  <div className="w-px h-4 bg-zinc-800"></div>

                  <Link
                    to={`/blog/${id}/edit`}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    title="Edit"
                  >
                    <PencilLine weight="regular" size={18} />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash weight="regular" size={18} />
                  </button>
                </>
              )}
              {!isOwner && isShared && (
                 <button
                  onClick={() => copyToClipboard(window.location.href)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors" 
                  title="Copy Link"
                >
                  <LinkIcon weight="regular" size={18} />
                </button>
              )}
            </div>
         </nav>


         <header className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-zinc-500 mb-8 font-mono tracking-widest uppercase">
                <span>{formatDate(blog.createdAt)}</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <span>{calculateReadTime(blog.content)} min read</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white leading-[1.1] tracking-tight mb-10">
              {blog.title}
            </h1>

            <div className="flex items-center justify-center gap-3">
               <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden ring-2 ring-zinc-950">
                 <img 
                   src={blog.author?.picture || `https://ui-avatars.com/api/?name=${blog.author}&background=random`} 
                   alt={blog.author}
                   className="w-full h-full object-cover" 
                 />
               </div>
               <p className="text-sm font-serif italic text-zinc-400">by {blog.author}</p>
            </div>
         </header>


         <article className="prose prose-invert prose-lg md:prose-xl max-w-none 
            prose-headings:font-display prose-headings:font-medium prose-headings:text-white prose-headings:tracking-tight
            prose-p:font-serif prose-p:text-zinc-300 prose-p:leading-loose prose-p:mb-8
            prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:border-l-2 prose-blockquote:border-white/20 prose-blockquote:pl-6 prose-blockquote:text-zinc-400
            prose-strong:text-white prose-strong:font-medium
            prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-a:decoration-zinc-700 hover:prose-a:decoration-white transition-colors"
         >
            <div className="whitespace-pre-wrap">{blog.content}</div>
         </article>


         <div className="mt-24 flex justify-center text-zinc-800">
            <div className="flex gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </div>
         </div>

       </div>

      
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade">
           <div className="max-w-md w-full text-center">
             <h3 className="text-2xl font-serif italic text-white mb-4">Delete this story?</h3>
             <p className="text-zinc-400 mb-8 font-light">
               There is no undo button for destruction.
             </p>
             <div className="flex items-center justify-center gap-8">
               <button
                 onClick={() => setDeleteConfirm(false)}
                 className="text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
               >
                 Cancel
               </button>
               <button
                 onClick={handleDelete}
                 className="text-sm font-mono uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
               >
                 Delete
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;