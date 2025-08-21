import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  VideosIcon,
  DeveloperIcon,
  PhotographyIcon,
  AboutIcon,
  ContactIcon
} from './MenuIcons';


// --- All components are now inside this one file ---

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
const sections = [ { label: 'Home', value: '/', icon: HomeIcon }, { label: 'Editorial', value: '/videos', icon: VideosIcon }, { label: 'Dev Work', value: '/developer', icon: DeveloperIcon }, { label: 'Photography', value: '/photos', icon: PhotographyIcon }, { label: 'About', value: '/about', icon: AboutIcon }, { label: 'Contact', value: '/contact', icon: ContactIcon }, ];


// --- Main Menu Component ---
const Menu: React.FC<{ burgerColor: string }> = ({ burgerColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* The Burger Icon is now positioned fixed, independent of the Header */}
      <div className="fixed top-4 left-4 z-50">
        <BurgerIcon
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          color={isOpen ? 'black' : burgerColor}
        />
      </div>
   
      {/* The Menu Overlay. This is the guaranteed centering method. */}
      <div
        className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg 
                   flex items-center justify-center 
                   transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className={`
          flex 
          flex-col landscape:flex-row 
          items-center 
          gap-6 md:gap-8
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Link
                key={section.value}
                to={section.value}
                onClick={() => setIsOpen(false)}
                title={section.label}
                className={`text-black transition-all duration-300 hover:scale-110 ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: isOpen ? `${150 + index * 50}ms` : '0ms'
                }}
              >
                <IconComponent className="w-7 h-7 md:w-9 md-h-9" />
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
};

export default Menu;