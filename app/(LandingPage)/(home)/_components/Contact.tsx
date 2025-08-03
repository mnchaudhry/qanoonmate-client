import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import SectionHeading from './SectionHeading';

const Contact: React.FC = () => {
  return (
    <section className="bg-surface">

      <div className="container px-4 mx-auto max-w-7xl md:px-6 flex flex-col">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Title + Form */}
          <div>

            <SectionHeading
              title='Get in Touch'
              topTitle='We&apos;re here to assist you anytime.'
              description=''
            />

            {/* Contact Form */}
            <form className="flex flex-col gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-neutral-foreground mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  className="w-full border-border rounded-md"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-foreground mb-2">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@example.com"
                  className="w-full border-border rounded-md"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-neutral-foreground mb-2">
                  Phone number
                </label>
                <Input
                  id="phone"
                  placeholder="(123) 456-7890"
                  className="w-full border-border rounded-md"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-neutral-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full border-border rounded-md"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-2">
                <input type="checkbox" id="consent" className="mt-1 cursor-pointer " />
                <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the terms and conditions and give my consent to be contacted by the firm.
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className='w-full py-2.5' >
                SUBMIT
              </Button>
            </form>
          </div>

          {/* Right Side: Contact Info */}

          <div className="space-y-12 bg-background p-8 rounded-lg shadow-sm">
            {/* Get in Touch */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Get in touch</h3>
              <Link
                href="mailto:naumanch969@gmail.com"
                className="flex items-center space-x-2 text-muted-foreground hover:underline"
              >
                <FaEnvelope className="text-neutral-foreground" />
                <span>naumanch969@gmail.com</span>
              </Link>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Location</h3>
              <Link
                href="https://www.google.com/maps/place/Islamabad,+IS+PK"
                target="_blank"
                className="flex items-center space-x-2 text-muted-foreground hover:underline"
              >
                <FaMapMarkerAlt className="text-neutral-foreground" />
                <span>Islamabad, IS PK</span>
              </Link>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Hours</h3>
              <div className="grid grid-cols-[auto,3fr] gap-y-2 gap-x-6 text-sm text-muted-foreground">
                <span>Monday</span><span>9:00am – 10:00pm</span>
                <span>Tuesday</span><span>9:00am – 10:00pm</span>
                <span>Wednesday</span><span>9:00am – 10:00pm</span>
                <span>Thursday</span><span>9:00am – 10:00pm</span>
                <span>Friday</span><span>9:00am – 10:00pm</span>
                <span>Saturday</span><span>9:00am – 6:00pm</span>
                <span>Sunday</span><span>9:00am – 12:00pm</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Contact;
