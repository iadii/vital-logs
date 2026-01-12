import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-950 relative flex flex-col">
      {/* Background Image & Overlay */} 
       <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src="/editorial_hero_image_1768204267018.png" 
            alt="Editorial Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/90 to-zinc-950"></div>
       </div>

      <div className="relative z-10 flex-1 pt-32 pb-20 px-8 max-w-2xl mx-auto w-full animate-fade">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-16 uppercase tracking-widest text-xs font-medium pl-1">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        
        <header className="mb-20">
          <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-8 tracking-tight leading-[0.9]">
            The Manifesto
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-serif italic leading-relaxed border-l-2 border-white/20 pl-6">
            In a world of noise, we choose signal.
          </p>
        </header>

        <article className="prose prose-invert prose-lg prose-zinc font-serif text-zinc-300 leading-loose max-w-none">
          <p>
            Writing is not content creation. It is thinking. It is the crystallization of thought into something tangible, something sharable, something permanent.
          </p>
          <p>
            The modern web has become a noisy place. Algorithms dictate what we see. Ads clutter our view. The actual act of reading—and writing—has been relegated to the sidelines.
          </p>
          <p>
            <strong className="text-white font-sans font-medium">Vital Logs</strong> is our answer to the chaos.
          </p>
          <p>
             We stripped away the likes, the endless scroll, the gamification. We left only what matters: the blank page, the cursor, and your words. This is a sanctuary for writers who believe that simplicity is the ultimate sophistication.
          </p>
          <p>
            We built this for the dreamers, the thinkers, and the storytellers. For those who write not for the algorithm, but for the soul.
          </p>
          <p className="pt-12 text-white text-lg font-sans not-italic tracking-wide">
            Welcome home.
          </p>
        </article>
      </div>

    </div>
  );
};

export default About;
