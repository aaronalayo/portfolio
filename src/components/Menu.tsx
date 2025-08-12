import { useState } from 'react';
import { Link } from 'react-router-dom';

const StarIcon = ({ className = '', size = 400, style = {} }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="red"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const CloseIcon = ({ className = '', size = 48 }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const sections = [
  { label: 'EDITOR', value: 'videos' },
  { label: 'PHOTOGRAPHY', value: 'photos' },
  { label: 'WEB', value: 'developer' },
  { label: 'ABOUT', value: 'about' },
  { label: 'CONTACT', value: 'contact' },
];

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="w-12 h-12 flex items-center justify-center bg-transparent rounded-full focus:outline-none"
        >
          <StarIcon
            size={64}
            className={`transition-transform duration-500 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      </div>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/60 backdrop-blur-md transition-opacity duration-300 ${
          open ? 'flex' : 'hidden'
        } flex-col items-center justify-center`}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-4 z-50"
        >
          <CloseIcon size={40} />
        </button>

        {/* Navigation links */}
        <nav className="flex flex-col items-center gap-6 text-center">
  {sections.map((section) => (
    <Link
      key={section.value}
      to={`/${section.value}`}
      onClick={() => setOpen(false)}
      className="
        font-bold uppercase text-blue-900 transition
        text-2xl sm:text-4xl md:text-5xl
        max-w-[90vw]
      "
      style={{
        fontSize: 'clamp(1.2rem, 6vw, 3rem)', // scales with viewport
      }}
    >
      {section.label}
    </Link>
  ))}
</nav>

      </div>
    </>
  );
};

export default Menu;
