import { useEffect, useState } from 'react'
import sanityClient from '../sanityClient'

interface Developer {
  _id: string
  title: string
  description: string
  githubUrl?: string
}

const DeveloperWorkSection = () => {
  const [projects, setProjects] = useState<Developer[]>([])

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "developer"] | order(_createdAt desc) {
        _id,
        title,
        description,
        githubUrl
      }`)
      .then((data) => setProjects(data))
      .catch(console.error)
  }, [])

  return (
    <section className="bg-gray-900 py-16 px-6">
      <div style={{margin: '58px'}}className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Developer Work</h2>

        <div style={{gap: '8px', margin: '8px'}} className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          {projects.map((project) => (
            <div
              key={project._id}
              style={{borderRadius: '10px'}} className="bg-white text-black rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <h3 style={{margin: '8px'}} className="text-lg font-semibold mb-2">{project.title}</h3>
              <p style={{margin: '8px'}} className="text-sm text-gray-700 mb-4 break-words">
                {project.description}
              </p>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  style={{margin: '8px'}}
                  className="text-blue-600 text-sm font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DeveloperWorkSection
