// src/components/Menu.tsx
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

// --- (BurgerIcon component remains the same) ---
interface BurgerIconProps {
  open: boolean;
  onClick: () => void;
  color?: string;
}
const BurgerIcon: React.FC<BurgerIconProps> = ({ open, onClick, color = 'white' }) => {
  const lineBaseStyle = `h-0.5 w-6 my-1 rounded-full bg-${color} transition ease transform duration-300`;
  return (
    <button onClick={onClick} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className="w-12 h-12 flex flex-col justify-center items-center focus:outline-none">
      <div className={`${lineBaseStyle} ${open ? "rotate-45 translate-y-2" : ""}`} />
      <div className={`${lineBaseStyle} ${open ? "opacity-0" : ""}`} />
      <div className={`${lineBaseStyle} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  );
};

// --- UPDATED SECTIONS ARRAY ---
// Now we just store the component reference, not the rendered element.
const sections = [
  { label: 'Home', value: '/', icon: HomeIcon },
  { label: 'Editorial', value: '/videos', icon: VideosIcon },
  { label: 'Dev Work', value: '/developer', icon: DeveloperIcon },
  { label: 'Photography', value: '/photos', icon: PhotographyIcon },
  { label: 'About', value: '/about', icon: AboutIcon },
  { label: 'Contact', value: '/contact', icon: ContactIcon },
];

const Menu: React.FC<{ burgerColor: string }> = ({ burgerColor }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <BurgerIcon
          open={open}
          onClick={() => setOpen(!open)}
          color={open ? 'black' : burgerColor}
        />
      </div>
   
      <div
        className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg 
                   flex items-center justify-center 
                   transition-all duration-500 ease-in-out ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* --- THIS IS THE FIX --- */}
        {/* This <nav> now intelligently switches between a column and a row */}
        <nav className={`
          flex 
          flex-col landscape:flex-row 
          items-center 
          gap-6 md:gap-8
        `}>
          {sections.map((section, index) => {
            // Get the component type from our array
            const IconComponent = section.icon;
            return (
              <Link
                key={section.value}
                to={section.value}
                onClick={() => setOpen(false)}
                title={section.label}
                className={`text-black transition-all duration-300 hover:scale-110 ${
                  open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
                style={{
                  transitionDelay: open ? `${150 + index * 50}ms` : '0ms'
                }}
              >
                {/* Render the icon with responsive size classes */}
                <IconComponent className="w-7 h-7 md:w-9 md:h-9" />
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
};

export default Menu;