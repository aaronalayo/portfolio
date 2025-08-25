// src/components/ContactSection.tsx
import React, { useState, useCallback, useEffect } from 'react'; // <-- Add useEffect
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';
import ReactGA from 'react-ga4';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// --- (Your UI component imports remain the same) ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- THIS IS THE FIX ---
    // If the executeRecaptcha function isn't available yet, do nothing.
    // The button will be disabled, so this is a double safeguard.
    if (!executeRecaptcha) {
      console.error("Attempted to submit before reCAPTCHA was ready.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await executeRecaptcha('contactForm');
      
      const submissionData = { ...formData, 'g-recaptcha-response': token };

      const formspreeResponse = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // <-- PASTE YOUR FORM ID
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
            {/* ... success message ... */}
          </Card>
        ) : (
          <form className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1"><Input id="name" name="name" placeholder='Name' value={formData.name} onChange={handleChange} required /></div>
            <div className="space-y-1"><Input id="email" name="email" type="email" placeholder='Email' value={formData.email} onChange={handleChange} required /></div>
            <div className="space-y-1"><Textarea id="message" name="message" placeholder='Message' rows={6} value={formData.message} onChange={handleChange} required /></div>
            
            <div className="flex justify-center">
              {/* --- THIS IS THE FIX --- */}
              {/* The button is now disabled if loading OR if the reCAPTCHA hook is not ready. */}
              <Button type="submit" disabled={loading || !executeRecaptcha}>
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