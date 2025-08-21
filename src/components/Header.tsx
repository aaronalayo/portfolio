// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import Menu from './Menu';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const burgerColor = isHomePage ? 'white' : 'black';

  return (
    // The header is now a simple relative container for its absolute children.
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      
      {/* --- Menu Icon Container --- */}
      {/* This is positioned absolutely on the left, centered vertically. */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <Menu burgerColor={burgerColor} />
      </div>

      {/* --- Title/Home Link Container --- */}
      {/* This is positioned absolutely in the exact center of the screen. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link
          to="/"
          aria-label="Go to homepage"
          className="transition-opacity hover:opacity-80"
        >
          <h1 className={`
            font-veep 
            text-2xl md:text-4xl 
            uppercase 
            tracking-normal md:tracking-wider 
            whitespace-nowrap 
            drop-shadow-xl 
            ${isHomePage ? 'text-white' : 'text-black'}
          `}>
            Red Malanga
          </h1>
        </Link>
      </div>
      
    </header>
  );
};

export default Header;