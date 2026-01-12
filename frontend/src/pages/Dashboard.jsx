import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  FileText, 
  TrendUp, 
  SquaresFour, 
  List, 
  Plus, 
  MagnifyingGlass, 
  Clock, 
  Eye, 
  PencilLine, 
  Trash 
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { loading: authLoading } = useAuth();
  const { blogs, loading: blogLoading, deleteBlog, fetchBlogs } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('list');
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-white selection:text-black pb-32">
       {/* Global Background Noise */}
       <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 brightness-100 contrast-150 mix-blend-overlay"></div>
       </div>

       <div className="relative z-10 pt-32 px-6 max-w-5xl mx-auto animate-fade">
         
          {/* Header Section */}
          <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4 tracking-tight">
                Your Sanctuary.
              </h1>
              <div className="flex items-center gap-4 text-sm font-mono text-zinc-500 uppercase tracking-widest">
                <span>{blogs.length} Stories</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <span>
                  {blogs.filter(b => {
                    const d = new Date(b.createdAt);
                    const n = new Date();
                    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
                  }).length} This Month
                </span>
              </div>
            </div>

            <Link 
              to="/create" 
              className="group inline-flex items-center gap-3 text-white border-b border-whitepb-1 hover:text-zinc-400 transition-colors font-serif italic text-lg"
            >
              <Plus weight="light" size={24} className="group-hover:rotate-90 transition-transform duration-300"/>
              <span>New Story</span>
            </Link>
          </header>

          {/* Minimal Toolbar */}
          <div className="mb-16 flex flex-col md:flex-row gap-8 md:items-center justify-between border-b border-white/5 pb-8">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="text"
                placeholder="Search your archives..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-xl font-serif text-white placeholder-zinc-700 focus:outline-none focus:placeholder-zinc-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-zinc-500 font-mono tracking-wider">
                 <button 
                    onClick={() => setSortBy('newest')}
                    className={`hover:text-white transition-colors ${sortBy === 'newest' ? 'text-white underline underline-offset-4 decoration-zinc-700' : ''}`}
                 >
                   NEWEST
                 </button>
                 <button 
                    onClick={() => setSortBy('oldest')}
                    className={`hover:text-white transition-colors ${sortBy === 'oldest' ? 'text-white underline underline-offset-4 decoration-zinc-700' : ''}`}
                 >
                   OLDEST
                 </button>
              </div>
              
              <div className="w-px h-4 bg-zinc-800"></div>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full hover:bg-white/5 transition-colors ${viewMode === 'list' ? 'text-white' : 'text-zinc-600'}`}
                >
                  <List weight="light" size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full hover:bg-white/5 transition-colors ${viewMode === 'grid' ? 'text-white' : 'text-zinc-600'}`}
                >
                  <SquaresFour weight="light" size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Stories List */}
          {filteredAndSortedBlogs.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20" : "space-y-16"}>
              {filteredAndSortedBlogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className={`group relative ${viewMode === 'grid' ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline'}`}
                >
                   {/* Meta (Date) */}
                   <div className={`${viewMode === 'grid' ? 'mb-4 order-1' : 'col-span-3 md:text-right order-2 md:order-1'}`}>
                      <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{formatDate(blog.createdAt)}</p>
                      <p className="font-mono text-[10px] text-zinc-700 mt-1 uppercase tracking-widest">{getReadTime(blog.content)} min read</p>
                   </div>

                   {/* Main Content */}
                   <div className={`${viewMode === 'grid' ? 'order-2' : 'col-span-8 order-1 md:order-2'}`}>
                      <Link to={`/blog/${blog._id}`} className="block group-hover:opacity-70 transition-opacity duration-500">
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 leading-tight">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="text-zinc-400 font-serif text-lg leading-relaxed line-clamp-2 max-w-2xl">
                        {blog.content}
                      </p>
                      
                      {/* Hover Actions */}
                      <div className="flex items-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                         <Link to={`/blog/${blog._id}/edit`} className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
                            Edit
                         </Link>
                         <button onClick={() => setDeleteConfirm(blog._id)} className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors border-b border-transparent hover:border-red-400 pb-0.5">
                            Delete
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-50">
               <FileText weight="thin" size={64} className="text-zinc-700 mb-6" />
               <p className="font-serif italic text-2xl text-zinc-500 mb-2">The page is blank.</p>
               <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Time to fill it.</p>
            </div>
          )}

          {/* Delete Modal - Minimal */}
          {deleteConfirm && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade">
               <div className="max-w-md w-full text-center">
                 <h3 className="text-2xl font-serif italic text-white mb-4">Are you sure?</h3>
                 <p className="text-zinc-400 mb-8 font-light">
                   "To delete is to destroy." — This action is permanent.
                 </p>
                 <div className="flex items-center justify-center gap-8">
                   <button
                     onClick={() => setDeleteConfirm(null)}
                     className="text-sm font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                   >
                     Keep it
                   </button>
                   <button
                     onClick={() => handleDelete(deleteConfirm)}
                     className="text-sm font-mono uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                   >
                     Destroy
                   </button>
                 </div>
               </div>
             </div>
          )}

       </div>
    </div>
  );
};

export default Dashboard;