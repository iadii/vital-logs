import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  TrendUp, 
  Eye, 
  PencilLine, 
  Trash,
  User,
  ChartBar,
  Gear,
  Clock,
  SignOut
} from '@phosphor-icons/react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { blogs, loading, deleteBlog } = useBlog();
  const [activeTab, setActiveTab] = useState('blogs');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Memoize calculations
  const {
    totalWords,
    totalReadTime,
    thisMonthBlogs,
  } = useMemo(() => {
    const getWordCount = (content) => content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    const getReadTime = (content) => {
      const wordCount = getWordCount(content);
      return Math.max(1, Math.ceil(wordCount / 200));
    };

    const totalWords = blogs.reduce((total, blog) => total + getWordCount(blog.content), 0);
    const totalReadTime = blogs.reduce((total, blog) => total + getReadTime(blog.content), 0);
    const thisMonthBlogs = blogs.filter(blog => {
      const blogDate = new Date(blog.createdAt);
      const now = new Date();
      return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalWords,
      totalReadTime,
      thisMonthBlogs
    };
  }, [blogs]);

  const handleDelete = async (id) => {
    const success = await deleteBlog(id);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading || authLoading) {
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

      <div className="relative z-10 pt-24 pb-12 px-4 animate-fade mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="md:col-span-4 space-y-6">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl shadow-black/20">
                <div className="w-24 h-24 rounded-full bg-white/5 mx-auto mb-4 overflow-hidden border-2 border-white/10 ring-4 ring-black/20">
                   <img
                     src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                     alt={user?.name}
                     className="w-full h-full object-cover"
                   />
                </div>
                <h2 className="text-2xl font-display font-medium text-white mb-1">{user?.name}</h2>
                <p className="text-zinc-400 text-sm mb-8 font-light">{user?.email}</p>
                
                <div className="grid grid-cols-2 gap-3 text-left">
                   <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <span className="block text-2xl font-display font-medium text-white">{blogs.length}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Posts</span>
                   </div>
                   <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                      <span className="block text-2xl font-display font-medium text-white">{thisMonthBlogs}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Month</span>
                   </div>
                </div>
             </div>
  
             <nav className="space-y-2">
                {[
                  { id: 'blogs', label: 'Stories', icon: FileText },
                  { id: 'analytics', label: 'Analytics', icon: ChartBar },
                  { id: 'settings', label: 'Settings', icon: Gear }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all text-sm font-medium border ${
                        activeTab === tab.id
                          ? 'bg-white/10 text-white border-white/10 shadow-lg'
                          : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      <Icon weight={activeTab === tab.id ? "fill" : "regular"} size={18} />
                      {tab.label}
                    </button>
                  );
                })}
             </nav>
             
             <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all text-sm font-medium border border-transparent text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
             >
                <SignOut weight="regular" size={18} />
                Sign Out
             </button>
          </div>
  
          {/* Main Content Area */}
          <div className="md:col-span-8">
             {activeTab === 'blogs' && (
               <div className="space-y-6">
                 <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-xl font-display font-medium text-white">Your Stories</h3>
                    <Link to="/create" className="text-sm font-medium text-white hover:text-zinc-300 border-b border-white/20 pb-0.5 transition-colors">Write New</Link>
                 </div>
                 
                 {blogs.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                       <p className="text-zinc-400 font-light">You haven't written any stories yet.</p>
                       <Link to="/create" className="mt-4 inline-block px-6 py-2 bg-white text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">Start Writing</Link>
                    </div>
                 ) : (
                    blogs.map((blog) => (
                      <div key={blog._id} className="group bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all shadow-lg shadow-black/5">
                         <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-display text-zinc-100 group-hover:text-white transition-colors">
                              <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                            </h4>
                            <span className="text-xs text-zinc-500 font-mono tracking-tight">{formatDate(blog.createdAt)}</span>
                         </div>
                         <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-light leading-relaxed">
                            {blog.content}
                         </p>
                         <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-xs text-zinc-500 flex items-center gap-2">
                               <Clock weight="regular" size={14} /> {Math.ceil(blog.content.split(/\s+/).length / 200)} min read
                            </span>
                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                               <Link to={`/blog/${blog._id}/edit`} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><PencilLine weight="regular" size={18}/></Link>
                               <button onClick={() => setDeleteConfirm(blog._id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash weight="regular" size={18}/></button>
                            </div>
                         </div>
                      </div>
                    ))
                 )}
               </div>
             )}
  
             {activeTab === 'analytics' && (
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                      <div className="flex items-center gap-2 mb-6">
                         <TrendUp weight="duotone" size={20} className="text-green-400" />
                         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Reach</span>
                      </div>
                      <p className="text-4xl font-display font-medium text-white mb-2">{(blogs.length * 124) + 42}</p>
                      <p className="text-xs text-zinc-500">Estimated views across all posts</p>
                   </div>
                   
                   <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                      <div className="flex items-center gap-2 mb-6">
                         <FileText weight="duotone" size={20} className="text-blue-400" />
                         <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Content Volume</span>
                      </div>
                      <p className="text-4xl font-display font-medium text-white mb-2">{totalWords.toLocaleString()}</p>
                      <p className="text-xs text-zinc-500">Total words written</p>
                   </div>
  
                   <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl col-span-2">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-8">Reading Time Impact</h4>
                      <div className="flex items-end gap-2 h-40">
                         {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/10 hover:bg-white/20 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                         ))}
                      </div>
                      <div className="flex justify-between mt-4 text-xs text-zinc-600 font-mono uppercase">
                         <span>Mon</span>
                         <span>Sun</span>
                      </div>
                   </div>
                </div>
             )}
  
             {activeTab === 'settings' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                   <h3 className="text-xl font-display font-medium text-white mb-8">Account Settings</h3>
                   <div className="space-y-8">
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Display Name</label>
                         <input type="text" value={user?.name} disabled className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed font-light" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Email Address</label>
                         <input type="email" value={user?.email} disabled className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed font-light" />
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
  
        {/* Delete Confirmation Modal */}
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

export default Profile; 