'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Message sent! We'll get back to you soon.", 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            We&apos;d love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Get In Touch</h2>
              {[
                {
                  icon: MapPin,
                  title: 'Address',
                  text: '123 Auto Drive\nCar City, CA 90210',
                },
                { icon: Phone, title: 'Phone', text: '(555) 123-4567' },
                { icon: Mail, title: 'Email', text: 'info@drivehub.com' },
                {
                  icon: Clock,
                  title: 'Hours',
                  text: 'Mon-Fri: 9AM-7PM\nSat: 10AM-5PM\nSun: Closed',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    label="Subject"
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button type="submit" size="lg">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12 h-64 bg-gray-200 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">
              Map Integration — 123 Auto Drive, Car City, CA 90210
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
