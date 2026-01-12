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
      toast.success(newSharedStatus ? 'Blog shared successfully!' : 'Blog unshared successfully!');
      if (newSharedStatus) {
        const shareUrl = `${window.location.origin}/blog/${id}`;
        copyToClipboard(shareUrl);
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

      <div className="relative z-10 pt-24 pb-12 px-4 animate-fade mx-auto max-w-4xl">
         {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium group px-4 py-2 rounded-full hover:bg-white/5"
          >
            <ArrowLeft weight="bold" size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <button
                  onClick={handleToggleShare}
                  className={`p-2.5 rounded-full border transition-colors ${
                    isShared 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={isShared ? 'Shared (Click to Unshare)' : 'Private (Click to Share)'}
                >
                  <ShareNetwork weight="regular" size={18} />
                </button>
                <Link
                  to={`/blog/${id}/edit`}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Edit"
                >
                  <PencilLine weight="regular" size={18} />
                </Link>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash weight="regular" size={18} />
                </button>
              </>
            )}
            {!isOwner && isShared && (
               <button
                onClick={() => copyToClipboard(window.location.href)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" 
                title="Copy Link"
              >
                <LinkIcon weight="regular" size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Blog Article Container */}
        <article className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/20">
          <header className="mb-12 text-center">
             <div className="inline-flex items-center gap-3 text-xs md:text-sm text-zinc-400 mb-6 font-mono tracking-wide uppercase">
                 <span>{formatDate(blog.createdAt)}</span>
                 <span className="text-zinc-600">•</span>
                 <span className="flex items-center gap-1">
                   <Clock weight="regular" size={14} />
                   {calculateReadTime(blog.content)} min read
                 </span>
             </div>

             <h1 className="text-4xl md:text-6xl font-display font-medium text-white leading-tight tracking-tight mb-8">
               {blog.title}
             </h1>

             <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
                  <img 
                    src={blog.author?.picture || `https://ui-avatars.com/api/?name=${blog.author}&background=random`} 
                    alt={blog.author}
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
                <div className="text-left">
                    <p className="text-white text-base font-medium">{blog.author}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Author</p>
                </div>
             </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-p:font-serif prose-p:text-zinc-300 prose-p:leading-loose">
             <div className="whitespace-pre-wrap">{blog.content}</div>
          </div>
        </article>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-zinc-900 border border-zinc-800 max-w-sm w-full p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Story?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone. This will permanently delete your story.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
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