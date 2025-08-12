import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaClock, FaExternalLinkAlt } from 'react-icons/fa';
import SectionHeading from './SectionHeading';

const Contact: React.FC = () => {
  return (
    <section id="Contact" className="Xbg-surface relative overflow-hidden py-24">

      <div aria-hidden className="pointer-events-none absolute -top-40 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container px-4 mx-auto max-w-7xl md:px-6 flex flex-col gap-12">

        <SectionHeading
          title="Get in Touch"
          topTitle="We're here to assist you anytime."
          description=""
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Sleek Contact Form */}
          <div className="bg-background rounded-xl border !border-border shadow-sm p-6 md:p-8">
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-neutral-foreground">Name</Label>
                  <Input id="name" placeholder="Your full name" className="w-full !border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-neutral-foreground">Email address</Label>
                  <Input id="email" type="email" placeholder="yourname@example.com" className="w-full !border-border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-neutral-foreground">Phone number</Label>
                  <Input id="phone" placeholder="(123) 456-7890" className="w-full !border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-semibold text-neutral-foreground">Reason</Label>
                  <Select>
                    <SelectTrigger id="reason" className="w-full">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General inquiry</SelectItem>
                      <SelectItem value="consultation">Legal consultation</SelectItem>
                      <SelectItem value="support">Product support</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-neutral-foreground">Preferred contact method</Label>
                <RadioGroup defaultValue="email" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 rounded-md border !border-border p-3">
                    <RadioGroupItem value="email" id="pref-email" />
                    <Label htmlFor="pref-email" className="text-sm text-muted-foreground">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border !border-border p-3">
                    <RadioGroupItem value="phone" id="pref-phone" />
                    <Label htmlFor="pref-phone" className="text-sm text-muted-foreground">Phone</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-neutral-foreground">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" rows={6} className="w-full !border-border" />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="consent" />
                <Label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the terms and conditions and give my consent to be contacted by the firm.
                </Label>
              </div>
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full py-2.5">SUBMIT</Button>
                <p className="text-xs text-muted-foreground text-center">We typically reply within 24 hours.</p>
              </div>
            </form>
          </div>

          {/* Right: Other ways to contact + info */}
          <div className="space-y-8">
            {/* Contact methods */}
            <div className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Contact methods</h3>
              <div className="space-y-4">
                <Link href="mailto:contact@qanoonmate.com" className="flex items-center gap-3 text-muted-foreground hover:underline">
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <FaEnvelope />
                  </span>
                  <span>contact@qanoonmate.com</span>
                </Link>
                <Link href="tel:+923001234567" className="flex items-center gap-3 text-muted-foreground hover:underline">
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <FaPhoneAlt />
                  </span>
                  <span>+92 300 1234567</span>
                </Link>
                <Link href="https://wa.me/923001234567" target="_blank" className="flex items-center gap-3 text-muted-foreground hover:underline">
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <FaWhatsapp />
                  </span>
                  <span>WhatsApp us</span>
                </Link>
              </div>
            </div>

            {/* Office & hours */}
            <div className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Office & hours</h3>
              <div className="space-y-4">
                <Link href="https://www.google.com/maps/place/Islamabad,+IS+PK" target="_blank" className="flex items-center gap-3 text-muted-foreground hover:underline">
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <FaMapMarkerAlt />
                  </span>
                  <span>Islamabad, IS PK</span>
                </Link>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <FaClock />
                  </span>
                  <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
                    <span>Mon–Fri</span><span>9:00am – 10:00pm</span>
                    <span>Saturday</span><span>9:00am – 6:00pm</span>
                    <span>Sunday</span><span>9:00am – 12:00pm</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Average response time: under 24 hours.</p>
              </div>
            </div>

            {/* Helpful links */}
            <div className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 p-6">
              <h3 className="font-bold text-lg mb-4 text-foreground">Helpful links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Link href="/help" className="flex items-center gap-2 text-muted-foreground hover:underline">
                  <FaExternalLinkAlt className="text-primary" />
                  <span>Help Center</span>
                </Link>
                <Link href="/faq" className="flex items-center gap-2 text-muted-foreground hover:underline">
                  <FaExternalLinkAlt className="text-primary" />
                  <span>FAQs</span>
                </Link>
                <Link href="/support" className="flex items-center gap-2 text-muted-foreground hover:underline">
                  <FaExternalLinkAlt className="text-primary" />
                  <span>Customer Support</span>
                </Link>
                <Link href="/privacy" className="flex items-center gap-2 text-muted-foreground hover:underline">
                  <FaExternalLinkAlt className="text-primary" />
                  <span>Privacy Policy</span>
                </Link>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Contact;
