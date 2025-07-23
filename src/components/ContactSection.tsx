import React from 'react';

const ContactSection = () => (
  <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
    <h2 className="text-4xl font-bold mb-10 text-center text-blue-900 uppercase tracking-tight">
      Contact
    </h2>

    <form className="w-full max-w-[28rem] bg-gray-800 rounded-xl p-6 shadow-md space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-gray-300 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
      >
        Send Message
      </button>
    </form>
  </section>
);

export default ContactSection;
