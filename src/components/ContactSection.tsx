import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for better navigation
import ReactGA from 'react-ga4'; // Import for analytics
import sanityClient from '../sanityClient';

// --- (Your UI component imports remain the same) ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  // --- (Your state hooks remain the same) ---
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook for client-side navigation
  const navigate = useNavigate();

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

      // --- Analytics Event Tracking ---
      // Send an event to Google Analytics on successful submission
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({
          category: 'Contact Form',
          action: 'Submission Success',
          label: 'User submitted the contact form',
        });
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // --- Improved Redirection ---
      // Redirect using React Router for a smoother SPA experience
      setTimeout(() => {
        navigate('/');
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setError('There was a problem sending your message.');
       // Optional: Track submission errors as well
       if (process.env.NODE_ENV === 'production') {
        ReactGA.event({
          category: 'Contact Form',
          action: 'Submission Error',
          label: err.message || 'An unknown error occurred',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // A React Fragment (<>) wraps your original JSX and the new SEO tags
    <>
      {/* 
        React 19 SEO Tags: 
        This is the new, built-in way to add SEO metadata.
      */}
      <title>Contact Me - Red Malanga - Aaron ALAYO</title>
      <meta
        name="description"
        content="Get in touch with me for collaborations, questions, or project inquiries. Fill out the form to send a direct message."
      />
      <link rel="canonical" href="https://redmalanga.com/contact" />

      {/* --- Your original component JSX starts here --- */}
      <section className="w-full flex flex-col px-6 py-20 items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight drop-shadow-sm">
          Contact
        </h2>

        {submitted ? (
          <Card className="w-full max-w-xl bg-green-50 border-green-200 text-center">
            <CardContent className="space-y-4 p-6">
              <p className="text-green-700 text-lg font-semibold">
                Thank you! Your message has been sent. 😊
              </p>
              <p className="text-sm text-gray-600">
                You will be redirected to the homepage shortly...
              </p>
              <Button onClick={() => navigate('/')}>
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form
            className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1">
              <Input
                id="name"
                name="name"
                placeholder='Name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Textarea
                id="message"
                name="message"
                placeholder='Message'
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        )}
      </section>
    </>
  );
};

export default ContactSection;