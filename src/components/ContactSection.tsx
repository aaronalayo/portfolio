import React, { useState } from 'react';
import sanityClient from '../sanityClient';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sanityClient.create({
        _type: 'contact',
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setError('There was a problem sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-20">
      <h2 className="text-4xl font-bold mb-10 text-center text-blue-900 uppercase tracking-tight">
        Contact
      </h2>

      {submitted ? (
        <p className="text-green-700 text-lg font-semibold">Thank you! Your message has been sent. 😊</p>
      ) : (
        <form
          className="w-full max-w-[36rem] bg-gray-800 rounded-xl p-6 shadow-md space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}
    </section>
  );
};

export default ContactSection;
