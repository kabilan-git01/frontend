import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppProvider';
import { IconButton } from '../ui/Button';
import SearchBar from '../search/SearchBar';

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/membership', label: 'Pricing' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount } = useApp();
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div id="scroll-progress" className="fixed top-0 left-0 h-1 bg-accent-gradient z-[1001] transition-all duration-100" style={{ width: '0%' }} />

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled ? 'bg-titan-black/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container-titan flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl md:text-2xl font-bold tracking-wider shrink-0">
            <i className="fa-solid fa-dumbbell text-titan-red" />
            TITAN <span className="text-titan-red">FITNESS</span>
          </Link>

          <nav className="hidden xl:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm uppercase tracking-wider text-titan-secondary hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-titan-red after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg border border-white/10 hover:border-titan-red/50 hover:text-titan-red transition-all"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>

            <IconButton icon="fa-heart" badge={wishlistCount} to="/wishlist" label="Wishlist" />
            <IconButton icon="fa-cart-shopping" badge={cartCount} to="/cart" label="Cart" />

            <Link to="/membership" className="hidden lg:inline-flex btn-primary btn-sm !px-4 !py-2 !text-xs">
              Join Now
            </Link>

            <button
              className="xl:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="hidden md:block border-t border-white/5 bg-titan-black/98 backdrop-blur-md">
            <div className="container-titan py-4">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[999] xl:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/80 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMenuOpen(false)} />
        <nav className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-titan-dark border-l border-white/10 p-6 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <span className="font-heading text-lg font-bold">MENU</span>
            <button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center">
              <i className="fa-solid fa-xmark text-xl" />
            </button>
          </div>

          <div className="mb-6 md:hidden">
            <SearchBar onClose={() => setMenuOpen(false)} />
          </div>

          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/bmi-calculator" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors">
                BMI Calculator
              </Link>
            </li>
            <li>
              <Link to="/membership" onClick={() => setMenuOpen(false)} className="block mt-4 btn-primary text-center">
                Join Now
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
