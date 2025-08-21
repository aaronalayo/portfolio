// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import Menu from './Menu';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const burgerColor = isHomePage ? 'white' : 'black';

  return (
    // The header is a fixed element with the highest z-index
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* --- THIS IS THE FIX: A Three-Column Grid --- */}
      {/* This grid spans the full width and has three columns. */}
      <div className="grid grid-cols-3 items-center h-12">
        
        {/* Column 1: Left (Menu Icon) */}
        {/* `justify-self-start` pins this to the left side of its column. */}
        <div className="justify-self-start">
          <Menu burgerColor={burgerColor} />
        </div>

        {/* Column 2: Center (Title/Home Link) */}
        {/* This column is automatically centered. */}
        <div className="text-center">
          <Link
            to="/"
            aria-label="Go to homepage"
            className="transition-opacity hover:opacity-80"
          >
            <h1 className={`font-veep text-2xl md:text-4xl uppercase tracking-wider drop-shadow-xl ${
              isHomePage ? 'text-white' : 'text-black'
            }`}>
              Red Malanga
            </h1>
          </Link>
        </div>

        {/* Column 3: Right (Empty Spacer) */}
        {/* This empty div ensures the center column is perfectly centered. */}
        <div></div>
        
      </div>
    </header>
  );
};

export default Header;