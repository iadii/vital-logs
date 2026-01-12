import { ArrowLeft } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
 

const Privacy = () => {
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
          <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-8 tracking-tight leading-none">
            Privacy
          </h1>
          <p className="text-xl text-zinc-400 font-light border-l-2 border-white/20 pl-6">
            Short, simple, and transparent.
          </p>
        </header>

        <article className="space-y-20 text-zinc-300">
          <section>
            <h2 className="text-sm text-white font-bold mb-6 uppercase tracking-widest">01 — Ownership & Rights</h2>
            <p className="leading-relaxed font-serif text-lg text-zinc-400">
              Your words belong to you. Unconditionally. We do not claim any copyright or ownership over the content you publish on Vital Logs. You retain full rights to your intellectual property. We will never sell your personal data or your content to third parties, advertisers, or data brokers.
            </p>
          </section>

          <section>
            <h2 className="text-sm text-white font-bold mb-6 uppercase tracking-widest">02 — Security</h2>
            <p className="leading-relaxed font-serif text-lg text-zinc-400">
              We employ industry-standard encryption and security practices to protect your data both in transit and at rest. While no digital platform can guarantee absolute security, we prioritize the safety of your digital sanctuary.
            </p>
          </section>

          <section>
            <h2 className="text-sm text-white font-bold mb-6 uppercase tracking-widest">03 — Cookies</h2>
            <p className="leading-relaxed font-serif text-lg text-zinc-400">
              We use cookies solely for authentication purposes—to keep you logged in. We do not use third-party tracking cookies or pixels to follow you around the internet.
            </p>
          </section>

          <section>
             <h2 className="text-sm text-white font-bold mb-6 uppercase tracking-widest">04 — Contact</h2>
             <p className="leading-relaxed font-serif text-lg text-zinc-400">
               If you have questions about your privacy or wish to request the deletion of your data, please contact us directly.
             </p>
          </section>
        </article>

        <div className="mt-20 pt-12 border-t border-white/10">
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

    </div>
  );
};

export default Privacy;
