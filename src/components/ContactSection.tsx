// src/components/ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sanityClient from '../sanityClient';
import ReactGA from 'react-ga4';
import { useForm, ValidationError } from '@formspree/react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

// --- Your UI component imports ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [state, handleSubmit] = useForm("mgvzqzbl", { // <-- PASTE YOUR FORM ID
    data: { "g-recaptcha-response": executeRecaptcha }
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.succeeded) {
      setShowSuccessMessage(true);
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'Contact Form', action: 'Submission Success' });
      }
      setTimeout(() => navigate('/'), 5000);
    }
  }, [state.succeeded, navigate]);

  const handleCombinedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // First, save the form data to Sanity
    const formData = new FormData(e.currentTarget);
    sanityClient.create({
        _type: 'contact',
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        message: String(formData.get('message')),
        submittedAt: new Date().toISOString(),
    }).then(() => {
        console.log("Sanity submission successful.");
    }).catch((err) => {
        console.error("Sanity submission error:", err);
    });

    // Then, trigger the Formspree submission which handles reCAPTCHA
    handleSubmit(e);
  };

  return (
    <>
      <title>Contact Me - Red Malanga</title>
      <meta name="description" content="Get in touch for collaborations, questions, or project inquiries." />
      <link rel="canonical" href="https://redmalanga.com/contact" />

      <section className="w-full flex flex-col px-6 py-20 items-center justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tight drop-shadow-sm">Contact</h2>

        {showSuccessMessage ? (
          <Card className="w-full max-w-xl bg-green-50 border-green-200 text-center">
            <CardContent className="space-y-4 p-6">
              <p className="text-green-700 text-lg font-semibold">Thank you! Your message has been sent. 😊</p>
              <p className="text-sm text-gray-600">You will be redirected to the homepage shortly...</p>
              <Button onClick={() => navigate('/')}>Go to Homepage</Button>
            </CardContent>
          </Card>
        ) : (
          <form className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6" onSubmit={handleCombinedSubmit}>
            <div className="space-y-1">
              <Input id="name" name="name" placeholder='Name' required />
            </div>
            <div className="space-y-1">
              <Input id="email" name="email" type="email" placeholder='Email' required />
              <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
            </div>
            <div className="space-y-1">
              <Textarea id="message" name="message" placeholder='Message' rows={6} required />
              <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
            </div>
            
            <div className="flex justify-center">
              <Button type="submit" disabled={state.submitting}>
                {state.submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
            <ValidationError errors={state.errors} className="text-red-500 text-sm text-center" />
          </form>
        )}
      </section>
    </>
  );
};

export default ContactSection;