'use client';

import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <section className="relative bg-background text-neutral overflow-hidden antialiased min-h-[100vh] flex items-center">
      <div className="absolute inset-0">
        {/* <BackgroundBeams /> */}
      </div>

      <div className="container h-full relative z-10 px-4 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="flex flex-col gap-2.5 text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-loose mb-6">
            <span className="block">Redefining Legal Access</span>
            <span className="text-primary drop-shadow-md">AI Meets Law in Pakistan</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            From instant legal insights to custom document generation and lawyer consultations —
            LegalEase is your smart legal companion, accessible anywhere, anytime.
          </p>

          <div className="flex flex-wrap gap-4">
            {isAuthenticated && user ? (
              <Link href="/dashboard">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button className="">
                    Get Started
                  </Button>
                </Link>
                <Button variant='outline' >
                  Explore Features
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Image / Visual */}
        <div className="relative rounded-lg overflow-hidden">
          <Image
            src="/Pictures/pk-map.svg"
            alt="LegalEase preview"
            width={600}
            height={600}
            className="object-cover wfit h-fit"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
