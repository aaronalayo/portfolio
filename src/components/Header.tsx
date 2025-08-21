// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  VideosIcon,
  DeveloperIcon,
  PhotographyIcon,
  AboutIcon,
  ContactIcon
} from './MenuIcons';


// --- All components are now self-contained in this one file ---

// --- BurgerIcon ---
interface BurgerIconProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
}
const BurgerIcon: React.FC<BurgerIconProps> = ({ isOpen, onClick, color = 'white' }) => {
  const lineBaseStyle = `h-0.5 w-6 my-1 rounded-full bg-${color} transition ease transform duration-300`;
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className="w-12 h-12 flex flex-col justify-center items-center focus:outline-none"
    >
      <div className={`${lineBaseStyle} ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
      <div className={`${lineBaseStyle} ${isOpen ? "opacity-0" : ""}`} />
      <div className={`${lineBaseStyle} ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  );
};

// --- sections array ---
const sections = [
  { label: 'Home', value: '/', icon: HomeIcon },
  { label: 'Editorial', value: '/videos', icon: VideosIcon },
  { label: 'Dev Work', value: '/developer', icon: DeveloperIcon },
  { label: 'Photography', value: '/photos', icon: PhotographyIcon },
  { label: 'About', value: '/about', icon: AboutIcon },
  { label: 'Contact', value: '/contact', icon: ContactIcon },
];


// --- Main Header Component ---
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // The burger color is smart: black when the menu is open, otherwise depends on the page.
  const burgerColor = isMenuOpen ? 'black' : (isHomePage ? 'white' : 'black');

  // Effect to prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Container for the visible header elements */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 pointer-events-none">
        {/* Burger Icon: Absolutely positioned on the left */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-auto">
          <BurgerIcon isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} color={burgerColor} />
        </div>

        {/* Title: Absolutely positioned in the true center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Link to="/" aria-label="Go to homepage" className="transition-opacity hover:opacity-80">
            <h1 className={`font-veep text-2xl md:text-3xl uppercase tracking-wider whitespace-nowrap drop-shadow-xl ${isHomePage ? 'text-white' : 'text-black'}`}>
              Red Malanga
            </h1>
          </Link>
        </div>
      </header>

      {/* The Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg 
                   flex items-center justify-center 
                   transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className={`
          flex 
          flex-col landscape:flex-row 
          items-center 
          gap-6 md:gap-8
          transition-opacity duration-300
          ${isMenuOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.value} to={section.value} onClick={() => setIsMenuOpen(false)} title={section.label}
                className={`text-black transition-all duration-300 hover:scale-110 ${ isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0' }`}
                style={{ transitionDelay: isMenuOpen ? `${150 + index * 50}ms` : '0ms' }}
              >
                <IconComponent className="w-7 h-7 md:w-9 md:h-9" />
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
};

export default Header;