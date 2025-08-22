// src/components/ContactSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import sanityClient from '../sanityClient';
// --- NEW: Import the Formspree hook and error component ---
import { useForm, ValidationError } from '@formspree/react';

// --- (Your UI component imports remain the same) ---
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ContactSection = () => {
  // --- NEW: Initialize the Formspree hook ---
  // It handles its own state (submitting, succeeded, errors)
  const [formspreeState, handleFormspreeSubmit] = useForm("mgvzqzbl"); // <-- PASTE YOUR FORM ID HERE

  // We only need our own loading state for the combined process
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use a different name for the local submitted state to avoid conflict
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  // This is a new useEffect to handle the success state from Formspree
  useEffect(() => {
    if (formspreeState.succeeded) {
      console.log("Formspree submission succeeded.");
      setShowSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    }
  }, [formspreeState.succeeded, navigate]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- Create the Sanity request ---
    const formData = new FormData(e.currentTarget);
    const sanityRequest = sanityClient.create({
      _type: 'contact',
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      submittedAt: new Date().toISOString(),
    });

    // --- Create the Formspree request using its handler ---
    const formspreeRequest = handleFormspreeSubmit(e);

    try {
      // --- Run both in parallel ---
      await Promise.all([sanityRequest, formspreeRequest]);
      
      // If we reach here, Sanity succeeded. The Formspree hook handles its own success state.
      console.log("Sanity submission succeeded.");
      
      // Analytics Event Tracking
      if (process.env.NODE_ENV === 'production') {
        ReactGA.event({ category: 'Contact Form', action: 'Submission Success' });
      }

    } catch (error) {
      console.error("Submission Error:", error);
      // The Formspree ValidationError component will handle its own errors.
      // You could add a generic error for the Sanity part if needed.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Contact Me - Red Malanga - Aaron ALAYO</title>
      <meta name="description" content="Get in touch with me for collaborations, questions, or project inquiries." />
      <link rel="canonical" href="https://redmalanga.com/contact" />

      <section className="w-full flex flex-col px-6 py-20 items-center justify-center">
        <h2 className="text-2xl mb-6 text-center uppercase tracking-tight drop-shadow-sm">Get in touch</h2>

        {showSuccess ? (
          <Card className="w-full max-w-xl bg-green-50 border-green-200 text-center">
            <CardContent className="space-y-4 p-6">
              <p className="text-green-700 text-lg font-semibold">Thank you! Your message has been sent. 😊</p>
              <p className="text-sm text-gray-600">You will be redirected to the homepage shortly...</p>
              <Button onClick={() => navigate('/')}>Go to Homepage</Button>
            </CardContent>
          </Card>
        ) : (
          <form className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-lg space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Input id="name" name="name" placeholder='Name' required />
            </div>
            <div className="space-y-1">
              <Input id="email" name="email" type="email" placeholder='Email' required />
              {/* --- NEW: Field-specific error handling --- */}
              <ValidationError prefix="Email" field="email" errors={formspreeState.errors} className="text-red-500 text-sm" />
            </div>
            <div className="space-y-1">
              <Textarea id="message" name="message" placeholder='Message' rows={6} required />
              <ValidationError prefix="Message" field="message" errors={formspreeState.errors} className="text-red-500 text-sm" />
            </div>
            <div className="flex justify-center">
              {/* Use the combined loading state */}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        )}
      </section>
    </>
  );
};

export default ContactSection;