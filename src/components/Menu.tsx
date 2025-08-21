
// src/components/Menu.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import all your navigation icons
import {
  HomeIcon,
  VideosIcon,
  DeveloperIcon,
  PhotographyIcon,
  AboutIcon,
  ContactIcon
} from './MenuIcons';


// --- NEW: Animated Burger Icon Component ---
// This self-contained component handles its own animation based on the `open` prop.
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


const Menu: React.FC<{ burgerColor: string }> = ({ burgerColor }) => {
  const [open, setOpen] = useState(false);

  // When the menu is open, we want to prevent the background from scrolling
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to reset the style when the component unmounts
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  return (
    <>
      {/* Toggle button now uses the animated BurgerIcon */}
      <BurgerIcon open={open} onClick={() => setOpen(!open)} color={burgerColor} />
   
      {/* 
        Fullscreen menu overlay with a smoother transition.
        The `transform` property makes it slide in from the top.
      */}
      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        {/* The Close button is no longer needed since the burger icon animates to an X */}

        {/* Navigation links with a staggered animation effect */}
        <nav className="flex flex-col items-center gap-8 text-center">
          {sections.map((section, index) => (
            <Link
              key={section.value}
              to={section.value}
              onClick={() => setOpen(false)}
              title={section.label}
              className={`text-white transition-all duration-300 hover:scale-110 ${
                open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{
                // This creates a beautiful staggered animation effect
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



// // src/components/Menu.tsx
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// // Import all the new icons
// import {
//   HomeIcon,
//   VideosIcon,
//   DeveloperIcon,
//   PhotographyIcon,
//   AboutIcon,
//   ContactIcon
// } from './MenuIcons';

// // --- (Your StarIcon and CloseIcon components remain the same) ---
// const StarIcon = ({ className = '', size = 400, style = {} }) => (
//   <svg className={className} style={style} viewBox="0 0 24 24" width={size} height={size} fill="red" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//   </svg>
// );

// const CloseIcon = ({ className = '', size = 48 }) => (
//   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// // --- UPDATED SECTIONS ARRAY ---
// // We now add an `icon` property and keep the `label` for the tooltip.
// const sections = [
//   { label: 'Home', value: '/', icon: <HomeIcon /> },
//   { label: 'Editorial', value: '/videos', icon: <VideosIcon /> },
//   { label: 'Dev Work', value: '/developer', icon: <DeveloperIcon /> },
//   { label: 'Photography', value: '/photos', icon: <PhotographyIcon /> },
//   { label: 'About', value: '/about', icon: <AboutIcon /> },
//   { label: 'Contact', value: '/contact', icon: <ContactIcon /> },
// ];

// const Menu = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <div className="fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setOpen(!open)}
//           aria-label={open ? 'Close menu' : 'Open menu'}
//           aria-expanded={open}
//           className="w-12 h-12 flex items-center justify-center bg-transparent rounded-full focus:outline-none cursor-pointer transition-transform hover:scale-110"
//         >
//           <StarIcon size={64} className={`transition-transform duration-500 ${open ? 'rotate-180' : 'rotate-0'}`} />
//         </button>
//       </div>
   
//       <div className={`fixed inset-0 z-40 bg-white backdrop-blur-md transition-opacity duration-300 ${open ? 'flex' : 'hidden'} flex-col items-center justify-center`}>
//         <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-2 z-50">
//           <CloseIcon size={40} />
//         </button>

//         {/* --- UPDATED NAVIGATION LOGIC --- */}
//         <nav className="flex flex-col items-center gap-8 text-center">
//           {sections.map((section) => (
//             <Link
//               key={section.value}
//               to={section.value}
//               onClick={() => setOpen(false)}
//               // This `title` attribute creates the hover tooltip for usability
//               title={section.label}
//               className="text-black transition-transform duration-300 hover:scale-125"
//             >
//               {/* Render the icon component instead of the text label */}
//               {section.icon}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Menu;