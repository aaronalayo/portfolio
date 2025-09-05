import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import type { PortableTextBlock } from '@portabletext/types';
import { PortableText } from '@portabletext/react';

// --- (Your PortableText components object remains the same) ---
const components = {
  marks: {
    link: ({ value, children }: { value?: { href?: string; blank?: boolean }; children?: React.ReactNode }) => {
      const { href, blank } = value || {};
      return (
        <a
          href={href}
          target={blank ? '_blank' : '_self'}
          rel={blank ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};
interface Developer {
  _id: string;
  title: string;
  description: PortableTextBlock[]; // rich text blocks
  githubUrl?: string;
}

const DeveloperWorkSection = () => {
  // --- (Your state and useEffect hooks remain the same) ---
  const [projects, setProjects] = useState<Developer[]>([]);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "developer"] | order(_createdAt desc) {
        _id,
        title,
        description,
        githubUrl
      }`)
      .then((data) => setProjects(data))
      .catch(console.error);
  }, []);

  return (
    // A React Fragment (<>) wraps your original JSX and the new SEO tags
    <>
      {/* 
        React 19 SEO Tags: 
        This is the new, built-in way to add SEO metadata.
      */}
      <title>Developer Portfolio - Red Malanga - Aaron ALAYO</title>
      <meta
        name="description"
        content="Explore my software development projects, including work with React, TypeScript, and other modern web technologies."
      />
      <link rel="canonical" href="https://redmalanga.com/developer" />

      {/* --- Your original component JSX starts here, completely unchanged --- */}
      <section className="w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-veep text-2xl font-bold text-center mb-12 uppercase tracking-wide">
            Developer Work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-yellow-100 text-black rounded-2xl shadow-xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <div className="text-sm text-black mb-4 break-words prose prose-sm">
                    <PortableText value={project.description} components={components} />
                  </div>
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    className="text-blue-600 text-sm font-medium hover:underline mt-auto pt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DeveloperWorkSection;