// src/components/AboutSection.tsx
import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import type { PortableTextBlock } from '@portabletext/types';
import { PortableText } from '@portabletext/react';

const builder = imageUrlBuilder(sanityClient);
const urlFor = (source: any) => builder.image(source);

interface AboutData {
  bio: PortableTextBlock[];
  image: any;
}

const ptComponents = {
  marks: {
    link: ({ value, children }: any) => {
      return ( <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a> );
    },
  },
};

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "about"][0]{ bio, image }`)
      .then(setAboutData)
      .catch(console.error);
  }, []);

  if (!aboutData) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  return (
    <>
      <title>About Me - Red Malanga</title>
      <meta name="description" content="Learn more about my background, skills, and creative journey in development, video production, and photography." />
      <link rel="canonical" href="https://redmalanga.com/about" />

      <section className="w-full bg-white px-4 md:px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl w-full">
          
          <div className="w-full md:w-1/3 flex justify-center flex-shrink-0">
            <img
              src={urlFor(aboutData.image).width(400).height(400).url()}
              alt="A portrait photo of Aaron Alayo"
              className="object-cover w-[250px] h-[250px] md:w-[300px] md:h-[300px] rounded shadow-lg"
            />
          </div>

          <div className="w-[250px] md:w-2/3 text-gray-800 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            
            {/* --- THIS IS THE FIX --- */}
            {/* We apply `text-justify` to the container for the PortableText */}
            <div className="prose prose-lg max-w-none text-wrap text-justify">
              <PortableText value={aboutData.bio} components={ptComponents} />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;