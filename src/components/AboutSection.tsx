import React, { useEffect, useState } from 'react'
import sanityClient from '../sanityClient'
import imageUrlBuilder from '@sanity/image-url'

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
      .fetch(`*[_type == "about"][0]{ bio, image }`)
      .then(setAboutData)
      .catch(console.error)
  }, [])

  if (!aboutData) {
    return <p className="text-center text-white mt-10">Loading...</p>
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 py-16">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg w-full max-w-[920px] px-10 py-10">
        <div className="flex flex-wrap justify-start gap-6">
          
          {/* Image */}
          <img
            src={urlFor(aboutData.image).width(400).height(400).url()}
            alt="About me"
            className="w-82 h-82 object-cover rounded-xl p-[20px]"
          />

          {/* Text */}
          <div className="text-base text-gray-200 leading-relaxed flex-1">
            <h2 className="text-2xl font-semibold text-white text-left">About Me</h2>
            {aboutData.bio.split('\n').map((para, idx) => (
              <p key={idx} className="mb-3">{para.trim()}</p>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutSection