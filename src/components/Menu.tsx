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

// --- Animated Burger Icon Component ---
// This component remains the same. Its animation is perfect.
interface BurgerIconProps {
  open: boolean;
  onClick: () => void;
  color?: string;
}
const BurgerIcon: React.FC<BurgerIconProps> = ({ open, onClick, color = 'white' }) => {
  const lineBaseStyle = `h-0.5 w-6 my-1 rounded-full bg-${color} transition ease transform duration-300`;
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className="w-12 h-12 flex flex-col justify-center items-center focus:outline-none"
    >
      <div className={`${lineBaseStyle} ${open ? "rotate-45 translate-y-2" : ""}`} />
      <div className={`${lineBaseStyle} ${open ? "opacity-0" : ""}`} />
      <div className={`${lineBaseStyle} ${open ? "-rotate-45 -translate-y-2" : ""}`} />
    </button>
  );
};

// --- The list of sections with their icons ---
const sections = [
  { label: 'Home', value: '/', icon: <HomeIcon size={36} /> },
  { label: 'Editorial', value: '/videos', icon: <VideosIcon size={36} /> },
  { label: 'Dev Work', value: '/developer', icon: <DeveloperIcon size={36} /> },
  { label: 'Photography', value: '/photos', icon: <PhotographyIcon size={36} /> },
  { label: 'About', value: '/about', icon: <AboutIcon size={36} /> },
  { label: 'Contact', value: '/contact', icon: <ContactIcon size={36} /> },
];

// --- Main Menu Component ---
const Menu: React.FC<{ burgerColor: string }> = ({ burgerColor }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <>
      {/* --- THIS IS THE FIX --- */}
      {/* The container for the button now has a z-index of 50, which is HIGHER than the overlay's 40. */}
      {/* This ensures the button always stays on top. */}
      <div className="fixed top-4 left-4 z-50">
        {/*
          When the menu is open, the burger icon itself will be an "X".
          We need to ensure its color is black so it's visible against the white menu.
        */}
        <BurgerIcon
          open={open}
          onClick={() => setOpen(!open)}
          color={open ? 'black' : burgerColor}
        />
      </div>
   
      {/* The menu overlay remains at z-index 40, so it slides in UNDER the button */}
      <div
        className={`fixed inset-0 z-40 bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        {/* The separate close button is no longer needed */}

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