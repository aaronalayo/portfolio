// src/components/ContactSection.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';
import ReactGA from 'react-ga4';
// --- THIS IS THE CORRECT IMPORT ---
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// --- (Your UI component imports remain the same) ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  // We manage our own state because we are not using the Formspree hook.
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get the function to generate a token from the provider
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!executeRecaptcha) {
      console.error("reCAPTCHA hook not ready");
      setError("reCAPTCHA is not ready. Please refresh and try again.");
      setLoading(false);
      return;
    }

    try {
      // --- Step 1: Get the reCAPTCHA token from Google ---
      const token = await executeRecaptcha('contactForm');

      // --- Step 2: Create the data payload for Formspree ---
      const submissionData = {
        ...formData,
        'g-recaptcha-response': token, // This is the required field for the token
      };

      // --- Step 3: Send the data to Formspree using a POST request ---
      const formspreeResponse = await fetch('https://formspree.io/f/mgvzqzbl', { // <-- PASTE YOUR FORM ID HERE
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!formspreeResponse.ok) {
        throw new Error('Formspree submission failed.');
      }
      
      // --- If Formspree succeeds, then save to Sanity ---
      await sanityClient.create({
        _type: 'contact',
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      
      // --- Handle successful submission ---
      setSubmitted(true);
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'Contact Form', action: 'Submission Success' });
      }
      setTimeout(() => navigate('/'), 5000);

    } catch (err) {
      console.error(err);
      setError('There was a problem sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [executeRecaptcha, formData, navigate]);

  return (
    <>
      <title>Contact Me - Red Malanga</title>
      <meta name="description" content="Get in touch for collaborations, questions, or project inquiries." />
      <link rel="canonical" href="https://redmalanga.com/contact" />

      <section className="w-full flex flex-col px-6 py-20 items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight drop-shadow-sm">Contact</h2>

        {submitted ? (
          <Card className="w-full max-w-xl bg-green-50 border-green-200 text-center">
             <CardContent className="space-y-4 p-6"><p className="text-green-700 text-lg font-semibold">Thank you! Your message has been sent. 😊</p><p className="text-sm text-gray-600">You will be redirected to the homepage shortly...</p><Button onClick={() => navigate('/')}>Go to Homepage</Button></CardContent>
          </Card>
        ) : (
          <form className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1"><Input id="name" name="name" placeholder='Name' value={formData.name} onChange={handleChange} required /></div>
            <div className="space-y-1"><Input id="email" name="email" type="email" placeholder='Email' value={formData.email} onChange={handleChange} required /></div>
            <div className="space-y-1"><Textarea id="message" name="message" placeholder='Message' rows={6} value={formData.message} onChange={handleChange} required /></div>
            <div className="flex justify-center"><Button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button></div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>
        )}
      </section>
    </>
  );
};

export default ContactSection;