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

      setTimeout(() => {
        window.location.href = '/';
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setError('There was a problem sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 py-20">
      <h2 className="text-5xl font-extrabold mb-6 text-center text-blue-900 uppercase tracking-tight drop-shadow-sm">
        Contact
      </h2>

      {submitted ? (
        <div className="text-center space-y-4 bg-green-50 p-6 rounded-xl shadow-md border border-green-200">
          <p className="text-green-700 text-lg font-semibold">
            Thank you! Your message has been sent. 😊
          </p>
          <p className="text-sm text-gray-600">
            You will be redirected to the homepage shortly...
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl transition shadow-sm"
          >
            Go to Homepage
          </button>
        </div>
      ) : (
        <form
          className="w-full max-w-[36rem] bg-white rounded-3xl p-10 shadow-lg space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition shadow-sm"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </form>
      )}
    </section>
  );
};

export default ContactSection;
