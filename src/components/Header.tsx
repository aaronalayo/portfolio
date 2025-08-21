// src/components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Menu from './Menu';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const burgerColor = isHomePage ? 'white' : 'black';

  return (
    // The header is a fixed container at the top of the screen.
    <header className="fixed top-0 left-0 right-0 z-50 p-4 h-20 flex items-center">
      
      {/* --- THIS IS THE FIX: A Three-Column Grid --- */}
      {/* This grid spans the full width and has three equal columns. */}
      <div className="w-full grid grid-cols-3 items-center">

        {/* Column 1: Left (Menu Icon) */}
        {/* `justify-self-start` pins the menu to the far left of its column. */}
        <div className="justify-self-start">
          <Menu burgerColor={burgerColor} />
        </div>

        {/* Column 2: Center (Title/Home Link) */}
        {/* This column's content is perfectly centered in the middle of the screen. */}
        <div className="text-center">
          <Link
            to="/"
            aria-label="Go to homepage"
            className="transition-opacity hover:opacity-80"
          >
            <h1 className={`
              font-veep 
              text-2xl md:text-3xl 
              uppercase 
              tracking-wider 
              whitespace-nowrap 
              drop-shadow-xl 
              ${isHomePage ? 'text-white' : 'text-black'}
            `}>
              Red Malanga
            </h1>
          </Link>
        </div>

        {/* Column 3: Right (The Crucial Empty Spacer) */}
        {/* This invisible div takes up the third column, forcing the middle column
            to stay in the exact center. */}
        <div className="justify-self-end"></div>
        
      </div>
    </header>
  );
};

export default Header;