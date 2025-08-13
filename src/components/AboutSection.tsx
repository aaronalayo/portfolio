import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

// --- (Your existing helper functions remain the same) ---
const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

interface AboutData {
  bio: string;
  image: any;
}

const AboutSection = () => {
  // --- (Your state and useEffect hooks remain the same) ---
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "about"][0]{ bio, image }`)
      .then(setAboutData)
      .catch(console.error);
  }, []);

  // The loading state remains the same
  if (!aboutData) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return (
    // A React Fragment (<>) wraps your original JSX and the new SEO tags
    <>
      {/* 
        React 19 SEO Tags: 
        This is the new, built-in way to add SEO metadata.
      */}
      <title>About Me - Red Malanga - Aaron ALAYO</title>
      <meta 
        name="description" 
        content="Learn more about my background, skills, and creative journey in development, video production, and photography." 
      />
      <link rel="canonical" href="https://redmalanga.om/about" />

      {/* --- Your original component JSX starts here, completely unchanged --- */}
      <section className="w-full bg-white px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl w-full">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={urlFor(aboutData.image).width(400).height(400).url()}
              alt="A portrait photo of me" // More descriptive alt text
              className="object-cover w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full shadow-lg" // Added rounded-full and shadow
            />
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 text-gray-800 text-left">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            {aboutData.bio.split('\n').map((para, idx) => (
              <p key={idx} className="mb-3 leading-relaxed text-base">
                {para.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;