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

      <div className="container h-full relative z-10 px-4 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-top">

        <div>
          <h1 className="flex flex-col gap-2 text-5xl sm:text-5xl font-bold tracking-tight text-foreground leading-loose mb-6">
            <span className="block">Redefining Legal Access</span>
            <span className="text-primary drop-shadow-md">AI Meets Law in Pakistan</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            From instant legal insights to custom document generation and lawyer consultations —
            QanoonMate is your smart legal companion, accessible anywhere, anytime.
          </p>

          <div className="flex flex-wrap gap-4">
            {isAuthenticated && user ? (
              <Link href="/client/dashboard">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-up">
                  <Button className="">
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById("core-features");
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                >
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
            alt="QanoonMate preview"
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
