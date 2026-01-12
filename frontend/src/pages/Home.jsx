import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from '@phosphor-icons/react';
import Footer from '../components/Footer';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 relative">
      
      {/* Full Screen Hero with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center lg:justify-start px-8 lg:px-24 overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/editorial_hero_image_1768204267018.png" 
            alt="Editorial Background" 
            className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-2xl pt-20">
          <p className="text-zinc-400 text-xs sm:text-sm uppercase tracking-[0.3em] mb-6 sm:mb-8 font-medium pl-1">
            A writing sanctuary
          </p>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-medium text-white leading-[0.9] mb-8 sm:mb-12 tracking-tighter">
            Your words,<br />
            <span className="text-zinc-500 font-serif italic">beautifully simple.</span>
          </h1>
          
          <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed mb-12 max-w-md font-light border-l border-white/20 pl-6">
            This platform strips away distractions so you can focus on what matters — the craft of writing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
              >
                Go to Dashboard
                <ArrowRight weight="bold" size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5"
                >
                  Start Writing
                  <ArrowRight weight="bold" size={18} />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white hover:text-zinc-300 transition-colors backdrop-blur-sm bg-white/5 rounded-full border border-white/10"
                >
                  Explore Stories
                </Link>
              </>
            )}
          </div>
        </div>


        
      </section>

      {/* Stats Section */}
      <section className="py-24 px-8 border-t border-white/5 bg-zinc-950 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
          <div className="text-center group cursor-default">
            <p className="text-4xl lg:text-6xl font-display font-medium text-zinc-800 group-hover:text-white transition-colors duration-500 mb-2">∞</p>
            <p className="text-[10px] sm:text-xs text-zinc-600 uppercase tracking-widest">Stories Written</p>
          </div>
          <div className="text-center group cursor-default">
            <p className="text-4xl lg:text-6xl font-display font-medium text-zinc-800 group-hover:text-white transition-colors duration-500 mb-2">0</p>
            <p className="text-[10px] sm:text-xs text-zinc-600 uppercase tracking-widest">Distractions</p>
          </div>
          <div className="text-center group cursor-default">
            <p className="text-4xl lg:text-6xl font-display font-medium text-zinc-800 group-hover:text-white transition-colors duration-500 mb-2">1</p>
            <p className="text-[10px] sm:text-xs text-zinc-600 uppercase tracking-widest">Focus</p>
          </div>
          <div className="text-center group cursor-default">
            <p className="text-4xl lg:text-6xl font-display font-medium text-zinc-800 group-hover:text-white transition-colors duration-500 mb-2">∞</p>
            <p className="text-[10px] sm:text-xs text-zinc-600 uppercase tracking-widest">Possibilities</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8 border-t border-white/5 bg-zinc-950 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-7xl font-display font-medium text-white mb-8 tracking-tight">
            Ready to write?
          </h2>
          <p className="text-zinc-500 text-lg sm:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
            Join writers who've chosen simplicity over complexity.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-200 transition-colors shadow-2xl shadow-white/10 text-lg"
          >
            Get Started — It's Free
            <ArrowRight weight="bold" size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;