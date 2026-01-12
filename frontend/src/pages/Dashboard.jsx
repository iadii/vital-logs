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

       <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-8 animate-fade">
         
          {/* Header & Stats (Glass Bento Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Welcome / Main Action */}
            <div className="md:col-span-2 lg:col-span-2 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between shadow-2xl shadow-black/20 group hover:bg-white/10 transition-colors">
                <div>
                   <h1 className="text-3xl font-display font-medium text-white mb-2">Explore</h1>
                   <p className="text-zinc-400 font-light">Manage your sanctuary of stories.</p>
                </div>
                <div className="mt-8">
                   <Link to="/create" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                      <Plus weight="bold" size={16} />
                      New Story
                   </Link>
                </div>
            </div>

            {/* Stat 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Total Stories</span>
                <FileText weight="duotone" size={20} className="text-zinc-400" />
              </div>
              <p className="text-4xl font-display font-medium text-white">{blogs.length}</p>
            </div>

            {/* Stat 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium">This Month</span>
                <TrendUp weight="duotone" size={20} className="text-zinc-400" />
              </div>
               <p className="text-4xl font-display font-medium text-white">
                  {blogs.filter(blog => {
                    const blogDate = new Date(blog.createdAt);
                    const now = new Date();
                    return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
            </div>
          </div>

          {/* Glass Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center py-4 px-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/5">
            <div className="relative w-full md:w-96">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/20 focus:bg-black/40 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-black/20 border border-white/10 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 hover:bg-black/40 transition-all cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900">Newest First</option>
                <option value="oldest" className="bg-zinc-900">Oldest First</option>
                <option value="title" className="bg-zinc-900">Alphabetical</option>
              </select>
              
              <div className="flex bg-black/20 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <List weight="bold" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <SquaresFour weight="bold" size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area - Glass Cards */}
          {viewMode === 'list' ? (
             <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                   <div className="col-span-6">Title</div>
                   <div className="col-span-2">Date</div>
                   <div className="col-span-2">Read Time</div>
                   <div className="col-span-2 text-right">Actions</div>
                </div>
                
                <div className="divide-y divide-white/5">
                   {filteredAndSortedBlogs.map((blog) => (
                      <div key={blog._id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-white/5 transition-colors items-center">
                         <div className="col-span-6">
                            <h3 className="text-lg font-display text-zinc-200 group-hover:text-white transition-colors truncate">
                               {blog.title}
                            </h3>
                            <p className="md:hidden text-zinc-500 text-xs mt-1 truncate">{blog.content}</p>
                         </div>
                         <div className="col-span-2 text-zinc-400 text-sm font-mono tracking-tight">
                            {formatDate(blog.createdAt)}
                         </div>
                          <div className="col-span-2 text-zinc-500 text-sm flex items-center gap-2">
                            <Clock weight="regular" size={14} />
                            {getReadTime(blog.content)} min
                         </div>
                         <div className="col-span-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/blog/${blog._id}`} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="View"><Eye weight="regular" size={18}/></Link>
                            <Link to={`/blog/${blog._id}/edit`} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Edit"><PencilLine weight="regular" size={18}/></Link>
                            <button onClick={() => setDeleteConfirm(blog._id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete"><Trash weight="regular" size={18}/></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBlogs.map((blog) => (
                <div 
                  key={blog._id} 
                  className="group flex flex-col p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300"
                >
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-mono text-zinc-500 tracking-tight">{formatDate(blog.createdAt)}</span>
                       </div>
                       <h3 className="text-xl font-display text-zinc-100 mb-3 line-clamp-2 group-hover:text-white transition-colors">
                          {blog.title}
                       </h3>
                       <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-6 font-light">
                          {blog.content}
                       </p>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <span className="text-xs text-zinc-500 flex items-center gap-2">
                           <Clock weight="regular" size={14} /> {getReadTime(blog.content)} min
                        </span>
                        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/blog/${blog._id}/edit`} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><PencilLine weight="regular" size={16}/></Link>
                            <button onClick={() => setDeleteConfirm(blog._id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash weight="regular" size={16}/></button>
                        </div>
                    </div>
                </div>
              ))}
             </div>
          )}

           {filteredAndSortedBlogs.length === 0 && (
             <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MagnifyingGlass weight="light" size={28} className="text-zinc-400" />
               </div>
               <h3 className="text-lg font-display text-white mb-2">No stories found</h3>
               <p className="text-zinc-400 text-sm font-light">Your canvas is empty. Start writing today.</p>
             </div>
           )}

          {/* Delete Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
              <div className="bg-zinc-900 border border-zinc-800 max-w-sm w-full p-6 rounded-2xl shadow-2xl">
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
    </div>
  );
};

export default Dashboard;