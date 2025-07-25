import { useState } from 'react';
import { Link } from 'react-router-dom';

const StarIcon = ({ className = '', size = 68, style = {} }) => (
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
  { label: 'VIDEOS', value: 'videos' },
  { label: 'PHOTOS', value: 'photos' },
  { label: 'WEB', value: 'developer' },
  { label: 'ABOUT', value: 'about' },
  { label: 'CONTACT', value: 'contact' },
];

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Star toggle button */}
      <div className="fixed top-4 left-4 z-100">
        <button
  onClick={() => setOpen(!open)}
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-expanded={open}
  className="w-12 h-12 flex items-center justify-center bg-transparent rounded-full focus:outline-none focus:ring-0 focus:shadow-none outline-none shadow-none border-none"
>
  <StarIcon
    size={68}
    className={`transform transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}
  />
</button>
      </div>

      {/* Menu overlay */}
      <div
        aria-hidden={!open}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.57)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          display: open ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          flexDirection: 'column',
          paddingTop: '3rem',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            padding: '0.25rem',
            cursor: 'pointer',
            zIndex: 60,
            border: 'none',
          }}
        >
          <CloseIcon size={48} />
        </button>

        {/* Menu links container */}
        <div
          style={{
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}
          >
            {sections.map((section) => (
              <Link
                key={section.value}
                to={`/${section.value}`}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, sans-serif',
                  color: '#000000',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                className="focus:outline-none focus-visible:outline-0"
              >
                {section.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Menu;
