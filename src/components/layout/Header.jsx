import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppProvider';
import { IconButton } from '../ui/Button';
import SearchBar from '../search/SearchBar';

const navLinks = [
  { to: '/about', label: 'Our Story' },
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { cartCount, wishlistCount, auth, logout } = useApp();
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

            {!auth.isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-semibold uppercase tracking-wider text-titan-secondary hover:text-white transition-colors py-2 px-3">
                  Login
                </Link>
                <Link to="/signup" className="hidden lg:inline-flex btn-primary btn-sm !px-4 !py-2 !text-xs">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg border border-white/10 hover:border-titan-red/50 hover:text-white transition-all bg-white/5"
                >
                  <span className="w-6 h-6 rounded-full bg-titan-red/20 text-titan-red text-xs font-bold flex items-center justify-center uppercase">
                    {auth.user?.name ? auth.user.name.charAt(0) : 'U'}
                  </span>
                  <span className="hidden md:inline text-sm font-semibold tracking-wide text-white">
                    {auth.user?.name || 'User'}
                  </span>
                  <i className={`fa-solid fa-chevron-down text-[10px] text-titan-secondary transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-titan-dark border border-white/10 shadow-xl overflow-hidden z-[1100]">
                    <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                      <p className="text-xs text-titan-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5">{auth.user?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-titan-secondary hover:text-white hover:bg-titan-red/10 transition-colors"
                    >
                      <i className="fa-regular fa-user text-xs" />
                      <span>Profile</span>
                    </Link>
                    
                    {auth.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-titan-secondary hover:text-white hover:bg-titan-red/10 transition-colors"
                      >
                        <i className="fa-solid fa-shield-halved text-xs" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/5"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

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
            {!auth.isAuthenticated ? (
              <>
                <li>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <div className="my-4 mx-4 pt-4 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider text-titan-muted">Account</p>
                  <p className="text-sm font-semibold text-white mt-1 truncate">{auth.user?.name || auth.user?.email}</p>
                </div>
                <li>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors">
                    <i className="fa-regular fa-user mr-2 text-sm" /> Profile
                  </Link>
                </li>
                {auth.role === 'admin' && (
                  <li>
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-lg uppercase tracking-wider hover:bg-titan-red/10 hover:text-titan-red rounded-lg transition-colors">
                      <i className="fa-solid fa-shield-halved mr-2 text-sm" /> Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="block w-full text-left py-3 px-4 text-lg uppercase tracking-wider hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-sm" /> Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
}
