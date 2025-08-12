import { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

interface Developer {
  _id: string;
  title: string;
  description: string;
  githubUrl?: string;
}

const DeveloperWorkSection = () => {
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
    <section className="w-full bg-gray-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-12 uppercase tracking-wide">
          Developer Work
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white text-gray-800 rounded-2xl shadow-lg p-6 transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap break-words">
                {project.description}
              </p>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  className="text-blue-600 text-sm font-medium hover:underline"
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
  );
};

export default DeveloperWorkSection;
