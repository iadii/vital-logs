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
  Calendar
} from '@phosphor-icons/react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 animate-fade mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar / Profile Card */}
        <div className="md:col-span-4 space-y-6">
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-800 mx-auto mb-4 overflow-hidden border-2 border-zinc-800">
                 <img
                   src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                   alt={user?.name}
                   className="w-full h-full object-cover"
                 />
              </div>
              <h2 className="text-xl font-semibold text-white mb-1">{user?.name}</h2>
              <p className="text-zinc-500 text-sm mb-6">{user?.email}</p>
              
              <div className="grid grid-cols-2 gap-2 text-left">
                 <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                    <span className="block text-2xl font-bold text-white">{blogs.length}</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Posts</span>
                 </div>
                 <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">
                    <span className="block text-2xl font-bold text-white">{thisMonthBlogs}</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Month</span>
                 </div>
              </div>
           </div>

           <nav className="space-y-1">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-zinc-900 text-white border border-zinc-800'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Icon weight="regular" size={16} />
                    {tab.label}
                  </button>
                );
              })}
           </nav>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-8">
           {activeTab === 'blogs' && (
             <div className="space-y-4">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">Your Stories</h3>
                  <Link to="/create" className="text-sm text-blue-400 hover:text-blue-300">New Story</Link>
               </div>
               
               {blogs.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                     <p className="text-zinc-500">You haven't written any stories yet.</p>
                  </div>
               ) : (
                  blogs.map((blog) => (
                    <div key={blog._id} className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-5 transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="text-base font-medium text-white group-hover:text-blue-400 transition-colors">
                            <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                          </h4>
                          <span className="text-xs text-zinc-500 font-mono">{formatDate(blog.createdAt)}</span>
                       </div>
                       <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                          {blog.content}
                       </p>
                       <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                          <span className="text-xs text-zinc-600 flex items-center gap-1">
                             <Clock weight="regular" size={12} /> {Math.ceil(blog.content.split(/\s+/).length / 200)} min read
                          </span>
                          <div className="flex gap-2">
                             <Link to={`/blog/${blog._id}/edit`} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><PencilLine weight="regular" size={16}/></Link>
                             <button onClick={() => setDeleteConfirm(blog._id)} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"><Trash weight="regular" size={16}/></button>
                          </div>
                       </div>
                    </div>
                  ))
               )}
             </div>
           )}

           {activeTab === 'analytics' && (
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                       <TrendUp weight="fill" size={16} className="text-green-500" />
                       <span className="text-sm font-medium text-zinc-400">Total Reach</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{(blogs.length * 124) + 42}</p>
                    <p className="text-xs text-zinc-500">Estimated views across all posts</p>
                 </div>
                 
                 <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                       <FileText weight="fill" size={16} className="text-blue-500" />
                       <span className="text-sm font-medium text-zinc-400">Content Volume</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{totalWords.toLocaleString()}</p>
                    <p className="text-xs text-zinc-500">Total words written</p>
                 </div>

                 <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl col-span-2">
                    <h4 className="text-sm font-medium text-zinc-400 mb-4">Reading Time Impact</h4>
                    <div className="flex items-end gap-1 h-32">
                       {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                          <div key={i} className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-zinc-600 font-mono">
                       <span>Mon</span>
                       <span>Sun</span>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'settings' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                 <h3 className="text-lg font-medium text-white mb-6">Account Settings</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Display Name</label>
                       <input type="text" value={user?.name} disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Email Address</label>
                       <input type="email" value={user?.email} disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-400 cursor-not-allowed" />
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade">
          <div className="bg-zinc-900 border border-zinc-800 max-w-sm w-full p-6 rounded-xl shadow-2xl">
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

export default Profile; 