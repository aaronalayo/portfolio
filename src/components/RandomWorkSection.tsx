import { useMemo } from 'react';

const projects = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio built with React, TypeScript, and Tailwind CSS.',
    link: '#',
  },
  {
    title: 'Photo Gallery',
    description: 'A responsive photo gallery app using Unsplash API.',
    link: '#',
  },
  {
    title: 'Video Showcase',
    description: 'A video showcase platform with YouTube integration.',
    link: '#',
  },
  {
    title: 'Blog Platform',
    description: 'A full-stack blog platform with authentication and markdown support.',
    link: '#',
  },
];

const RandomWorkSection = () => {
  const randomProject = useMemo(() => {
    return projects[Math.floor(Math.random() * projects.length)];
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Random Work</h2>
      <div className="bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-2">{randomProject.title}</h3>
        <p className="text-gray-300 mb-2">{randomProject.description}</p>
        <a href={randomProject.link} className="text-blue-400 hover:underline">View Project</a>
      </div>
    </section>
  );
};

export default RandomWorkSection; 