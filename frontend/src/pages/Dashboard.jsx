import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  PencilSimple, 
  Trash, 
  Eye, 
  Plus, 
  MagnifyingGlass, 
  Clock,
  FileText,
  PencilLine,
  ShareNetwork,
  TrendUp,
  SquaresFour,
  List,
  DotsThree
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { loading: authLoading } = useAuth();
  const { blogs, loading: blogLoading, deleteBlog, fetchBlogs } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // Default to list for "Pro" feel
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const success = await deleteBlog(id);
    if (success) {
      setDeleteConfirm(null);
      toast.success('Blog deleted successfully');
    }
  };

  const handleShare = async (blog) => {
    const shareUrl = `${window.location.origin}/blog/${blog._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 100) + '...',
          url: shareUrl,
        });
      } catch (error) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReadTime = (content) => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  if (authLoading || blogLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade mx-auto max-w-6xl">
      {/* Header & Stats (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Welcome / Main Action */}
        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div>
               <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
               <p className="text-zinc-400 text-sm">Manage your content and analytics.</p>
            </div>
            <div className="mt-6">
               <Link to="/create" className="btn-primary inline-flex items-center gap-2">
                  <Plus weight="bold" size={16} />
                  New Story
               </Link>
            </div>
        </div>

        {/* Stat 1 */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm font-medium">Total Stories</span>
            <FileText weight="regular" size={16} />
          </div>
          <p className="text-3xl font-mono font-bold text-white">{blogs.length}</p>
        </div>

        {/* Stat 2 */}
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-500 text-sm font-medium">This Month</span>
            <TrendUp weight="regular" size={16} />
          </div>
           <p className="text-3xl font-mono font-bold text-white">
              {blogs.filter(blog => {
                const blogDate = new Date(blog.createdAt);
                const now = new Date();
                return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center py-4 border-b border-zinc-800">
        <div className="relative w-full md:w-96">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-pro pl-10 bg-transparent"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 hover:border-zinc-600 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
          
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <List weight="bold" size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <SquaresFour weight="bold" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
         // List View Table-ish
         <div className="w-full">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
               <div className="col-span-6">Title</div>
               <div className="col-span-2">Date</div>
               <div className="col-span-2">Read Time</div>
               <div className="col-span-2 text-right">Actions</div>
            </div>
            
            <div className="space-y-1 mt-2">
               {filteredAndSortedBlogs.map((blog) => (
                  <div key={blog._id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all items-center">
                     <div className="col-span-6">
                        <h3 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                           {blog.title}
                        </h3>
                        {/* Mobile only content preview */}
                         <p className="md:hidden text-zinc-500 text-xs mt-1 truncate">{blog.content}</p>
                     </div>
                     <div className="col-span-2 text-zinc-400 text-sm font-mono">
                        {formatDate(blog.createdAt)}
                     </div>
                      <div className="col-span-2 text-zinc-400 text-sm">
                        {getReadTime(blog.content)} min
                     </div>
                     <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/blog/${blog._id}`} className="p-1.5 text-zinc-400 hover:text-white transition-colors" title="View"><Eye weight="regular" size={16}/></Link>
                        <Link to={`/blog/${blog._id}/edit`} className="p-1.5 text-zinc-400 hover:text-white transition-colors" title="Edit"><PencilLine weight="regular" size={16}/></Link>
                        <button onClick={() => setDeleteConfirm(blog._id)} className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors" title="Delete"><Trash weight="regular" size={16}/></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      ) : (
         // Grid View
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBlogs.map((blog) => (
            <div 
              key={blog._id} 
              className="group flex flex-col p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all duration-200"
            >
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-mono text-zinc-500">{formatDate(blog.createdAt)}</span>
                   </div>
                   <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {blog.title}
                   </h3>
                   <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed mb-4">
                      {blog.content}
                   </p>
                </div>
                
                <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between mt-auto">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                       <Clock weight="regular" size={12} /> {getReadTime(blog.content)} min
                    </span>
                    <div className="flex gap-1">
                        <Link to={`/blog/${blog._id}/edit`} className="p-2 text-zinc-500 hover:text-white transition-colors"><PencilLine weight="regular" size={16}/></Link>
                        <button onClick={() => setDeleteConfirm(blog._id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash weight="regular" size={16}/></button>
                    </div>
                </div>
            </div>
          ))}
         </div>
      )}

       {filteredAndSortedBlogs.length === 0 && (
         <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-xl">
           <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
             <MagnifyingGlass weight="regular" size={20} />
           </div>
           <h3 className="text-lg font-medium text-white mb-1">No stories found</h3>
           <p className="text-zinc-500 text-sm">Create a new story to get started.</p>
         </div>
       )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-zinc-900 max-w-sm w-full p-6 border border-zinc-800 rounded-xl shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Story?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone. This will permanently delete your story.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
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

export default Dashboard;