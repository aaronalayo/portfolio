import React, { useEffect, useState } from 'react'
import sanityClient from '../sanityClient'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'

const builder = imageUrlBuilder(sanityClient)
const urlFor = (source: any) => builder.image(source)

interface AboutData {
  bio: string
  image: any
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "about"][0]{
          bio,
          image
        }`
      )
      .then((data) => setAboutData(data))
      .catch(console.error)
  }, [])

  if (!aboutData) return <p className="text-center text-white">Loading...</p>

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-6">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-3xl font-bold text-center uppercase mb-8">About Me</h2>
        <div className="flex flex-row items-center justify-center bg-gray-800 rounded-2xl p-10 shadow-lg max-w-3xl mx-auto">
          {/* Image */}
          {aboutData.image && (
            <img
              src={urlFor(aboutData.image).width(300).height(300).url()}
              alt="About me"
              className="w-64 h-64 object-cover rounded-xl shadow-lg flex-shrink-0 mr-10"
            />
          )}
          {/* Text */}
          <div className="text-gray-300 text-lg leading-relaxed max-w-md w-full space-y-4">
            {aboutData.bio.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph.trim()}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
