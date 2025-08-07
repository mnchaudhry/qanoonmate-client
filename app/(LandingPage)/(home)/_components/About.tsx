"use client";

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { About as AboutImage } from '@/constants/images'

const About: React.FC = () => {
  return (
    <section className="bg-neutral">
      <div className="container px-4 mx-auto max-w-7xl md:px-6">
        <div className="text-sm text-primary font-semibold uppercase mb-4 tracking-wider">
          Your Legal Partner
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl font-bold mb-6 leading-snug text-foreground">
              Simplifying Legal Access for Everyone
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              At <span className="font-medium text-foreground">QanoonMate</span>, we&apos;re reimagining how people interact with the legal world. Our AI-powered platform offers instant legal insights, document analysis, and seamless access to verified legal professionals — all at your fingertips.
              <br /><br />
              Whether you&apos;re an individual seeking clarity or a business managing legal complexities, we provide smart, affordable, and accessible solutions right when you need them. Headquartered in Islamabad, our mission is to empower informed legal decisions for everyone.
            </p>
            <Button
              onClick={() => {
                const el = document.getElementById("Contact")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get in Touch
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <Image
              src={AboutImage}
              alt="About QanoonMate"
              height={400}
              width={400}
              objectFit="cover"
              className="rounded-xl w-full shadow-md"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
