// src/components/ContactSection.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';
import ReactGA from 'react-ga4';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// --- (UI component imports) ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// A simple spinner component for the loading state
const Spinner = () => (
  <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    // A small delay to prevent a "flash" of the loader on fast connections
    const timer = setTimeout(() => {
      if (executeRecaptcha) {
        setRecaptchaReady(true);
      }
    }, 200); // 200ms delay
    
    return () => clearTimeout(timer);
  }, [executeRecaptcha]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaReady || !executeRecaptcha) { return; }

    setLoading(true);
    setError(null);
    try {
      const token = await executeRecaptcha('contactForm');
      const submissionData = { ...formData, 'g-recaptcha-response': token };
      const formspreeResponse = await fetch('https://formspree.io/f/mgvzqzbl', { // <-- PASTE YOUR FORM ID
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      if (!formspreeResponse.ok) { throw new Error('Formspree submission failed.'); }
      await sanityClient.create({ _type: 'contact', ...formData, submittedAt: new Date().toISOString() });
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
  }, [executeRecaptcha, recaptchaReady, formData, navigate]);

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
          // --- THIS IS THE FIX ---
          // This container now controls what is shown: the loader or the form.
          <div className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg">
            {!recaptchaReady ? (
              // If reCAPTCHA is not ready, show a clean spinner
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : (
              // If reCAPTCHA is ready, show the form
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-1"><Input id="name" name="name" placeholder='Name' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                <div className="space-y-1"><Input id="email" name="email" type="email" placeholder='Email' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
                <div className="space-y-1"><Textarea id="message" name="message" placeholder='Message' rows={6} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required /></div>
                <div className="flex justify-center">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default ContactSection;