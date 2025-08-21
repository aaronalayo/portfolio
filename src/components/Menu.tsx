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

// --- (sections array remains the same) ---
const sections = [
  { label: 'Home', value: '/', icon: <HomeIcon size={36} /> },
  { label: 'Editorial', value: '/videos', icon: <VideosIcon size={36} /> },
  { label: 'Dev Work', value: '/developer', icon: <DeveloperIcon size={36} /> },
  { label: 'Photography', value: '/photos', icon: <PhotographyIcon size={36} /> },
  { label: 'About', value: '/about', icon: <AboutIcon size={36} /> },
  { label: 'Contact', value: '/contact', icon: <ContactIcon size={36} /> },
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
   
      {/* --- THIS IS THE FIX --- */}
      {/* This overlay is now a simple, powerful flex container. */}
      {/* It is guaranteed to center its content (the <nav>) both vertically and horizontally. */}
      <div
        className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg 
                   flex flex-col items-center justify-center 
                   transition-all duration-500 ease-in-out ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-8 text-center">
          {sections.map((section, index) => (
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
              {section.icon}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Menu;