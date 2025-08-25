// src/components/ContactSection.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';
import ReactGA from 'react-ga4';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// --- Your UI component imports ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// --- This is the INNER component that contains the form logic and UI ---
const ContactForm = () => {
  // We use uncontrolled inputs but can add controlled state if needed for other features
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      console.error("reCAPTCHA hook not ready");
      setError("reCAPTCHA not ready. Please refresh and try again.");
      return;
    }
    setLoading(true);
    setError(null);

    // Get fresh form data directly from the form event. This is robust.
    const formData = new FormData(e.currentTarget);
    const submissionObject = {
      name: String(formData.get('name')),
      email: String(formData.get('email')),
      message: String(formData.get('message')),
    };

    try {
      const token = await executeRecaptcha('contactForm');
      const submissionData = { ...submissionObject, 'g-recaptcha-response': token };
      
      const formspreeResponse = await fetch('https://formspree.io/f/mgvzqzbl', { // <-- PASTE YOUR FORM ID
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (!formspreeResponse.ok) { 
        const errorData = await formspreeResponse.json();
        throw new Error(errorData.error || 'Formspree submission failed.');
      }
      
      await sanityClient.create({ _type: 'contact', ...submissionObject, submittedAt: new Date().toISOString() });
      
      setSubmitted(true);
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'Contact Form', action: 'Submission Success' });
      }
      // The redirect is removed because the success message now handles it.

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'There was a problem sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [executeRecaptcha, navigate]);

  // If the form was submitted successfully, show the success message
  if (submitted) {
    return (
      <Card className="w-full max-w-xl bg-green-50 border-green-200 text-center">
        <CardContent className="space-y-4 p-6">
          <p className="text-green-700 text-lg font-semibold">Thank you! Your message has been sent. 😊</p>
          <Button onClick={() => navigate('/')}>
            Back to Homepage
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Otherwise, show the form
  return (
    <form className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Input id="name" name="name" placeholder='Name' required />
      </div>
      <div className="space-y-1">
        <Input id="email" name="email" type="email" placeholder='Email' required />
      </div>
      <div className="space-y-1">
        <Textarea id="message" name="message" placeholder='Message' rows={6} required />
      </div>
      <div className="flex justify-center">
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </form>
  );
};


// --- This is the OUTER component that we EXPORT ---
// Its only job is to provide the reCAPTCHA context and the main section layout.
const ContactSection = () => (
  <>
    <title>Contact Me - Red Malanga</title>
    <meta name="description" content="Get in touch for collaborations, questions, or project inquiries." />
    <link rel="canonical" href="https://redmalanga.com/contact" />

    <section className="w-full flex flex-col px-6 py-20 items-center justify-center">
      <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight drop-shadow-sm">Contact</h2>
      <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY || ''}>
        <ContactForm />
      </GoogleReCaptchaProvider>
    </section>
  </>
);

export default ContactSection;