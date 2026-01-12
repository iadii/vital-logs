import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="py-12 border-t border-white/5 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Minimal Logo */}
        <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
           <span className="text-zinc-500 font-serif italic">write with intention.</span>
        </div>

        {/* Minimal Links */}
        <div className="flex items-center gap-8 text-sm text-zinc-600 font-medium tracking-wide uppercase">
           <Link to="/about" className="hover:text-zinc-300 transition-colors">Manifesto</Link>
           <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
           <a href="https://twitter.com/iadii" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">X</a>
           <a href="https://github.com/iadii" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">Hub</a>
        </div>

      </div>
      <div className="mt-12 text-center">
         <p className="text-[10px] text-zinc-800 uppercase tracking-widest">© {new Date().getFullYear()} All rights reversed.</p>
      </div>
    </footer>
);

export default Footer;
