import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogo } from '@phosphor-icons/react';
import { BACKEND_URL } from '../config/config';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
        
       {/* Left Side - Image (Desktop Only) */}
       <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
          <img 
            src="/editorial_hero_image_1768204267018.png" 
            alt="Editorial Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950"></div>
          
          <div className="absolute bottom-16 left-16 max-w-md">
             <blockquote className="text-3xl font-serif italic text-white leading-relaxed mb-4">
               "The scariest moment is always just before you start."
             </blockquote>
             <p className="text-zinc-400 text-sm uppercase tracking-widest">— Stephen King</p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative">
          
          <div className="max-w-md w-full mx-auto lg:mx-0">
             <div className="mb-12">
               <h1 className="text-4xl lg:text-5xl font-display font-medium text-white mb-4">
                 Welcome back.
               </h1>
               <p className="text-zinc-400 text-lg font-light">
                 Sign in to your sanctuary.
               </p>
             </div>

             <div className="space-y-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-zinc-200 text-zinc-900 rounded-xl font-medium transition-colors text-base"
                >
                  <GoogleLogo weight="bold" className="w-5 h-5" />
                  <span>Continue with Google</span>
                </button>
                
                <div className="relative">
                   <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800"></div>
                   </div>
                   <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-zinc-950 px-4 text-zinc-600 tracking-widest">Secure Login</span>
                   </div>
                </div>

                <p className="text-center text-zinc-500 text-xs">
                  By clicking continue, you agree to our <br/>
                  <Link to="/terms" className="underline hover:text-zinc-300">Terms of Service</Link> and <Link to="/privacy" className="underline hover:text-zinc-300">Privacy Policy</Link>.
                </p>
             </div>
          </div>
       </div>
      
    </div>
  );
};

export default Login;