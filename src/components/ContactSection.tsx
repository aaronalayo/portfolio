import React, { useState } from 'react';
import sanityClient from '../sanityClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 uppercase tracking-tight drop-shadow-sm">
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
            <Button onClick={() => (window.location.href = '/')}>
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
  );
};

export default ContactSection;
