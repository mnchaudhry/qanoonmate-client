import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Send, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LawyerData {
  name: string;
  location: {
    address: string;
  };
}

interface Props {
  lawyer: LawyerData;
}

const ContactSection = ({ lawyer }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Form */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-xl text-primary-900 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Send Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Your Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="border-secondary-200 focus:border-primary-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Your Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                  className="border-secondary-200 focus:border-primary-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Subject *
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                placeholder="Brief subject of your inquiry"
                className="border-secondary-200 focus:border-primary-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Your Message *
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Describe your legal matter or inquiry in detail..."
                className="border-secondary-200 focus:border-primary-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-xl text-primary-900">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-900 mb-1">Office Address</h4>
                <p className="text-secondary-700">{lawyer.location.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-secondary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-900 mb-1">Phone</h4>
                <p className="text-secondary-700">+92 300 1234567</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-secondary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-900 mb-1">Email</h4>
                <p className="text-secondary-700">sarah.ahmed@lawfirm.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-900 mb-1">Office Hours</h4>
                <div className="text-secondary-700 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-secondary-200 pt-6">
            <h4 className="font-medium text-primary-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-primary-200 text-primary-700 hover:bg-primary-50"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call for Consultation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-secondary-200 text-secondary-700 hover:bg-secondary-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSection;