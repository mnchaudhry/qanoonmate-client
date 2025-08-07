import { Button } from '@/components/ui/button';
import { About } from '@/constants/images';
import Link from 'next/link';
import Image from 'next/image';

const CTA = () => {
    return (
        <section className="bg-gradient-to-r from-primary-dark to-primary text-neutral">
            <div className="container px-4 mx-auto md:px-6 grid md:grid-cols-2 gap-10 items-center">

                {/* Text Content */}
                <div>
                    <h2 className="text-neutra text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Empower Your Legal Journey with QanoonMate
                    </h2>
                    <p className="text-lg text-neutral/90 mb-8">
                        Whether you’re seeking legal answers, drafting documents, or booking expert consultations — QanoonMate brings the legal world to your fingertips. Trusted by professionals, accessible to everyone.
                    </p>
                    <Link href="/client/consultations" className="flex items-center gap-2 mb-6 text-primary hover:underline">
                        <Button variant='secondary' >
                            Start Your Free Trial
                        </Button>
                    </Link>
                </div>

                {/* Image or Illustration */}
                <div className="relative w-full">
                    <Image
                        src={About}
                        alt="QanoonMate dashboard preview"
                        width={400}
                        height={400}
                        className="w-full object-cover rounded-lg shadow-2xl"
                    />
                </div>
            </div>
        </section>
    );
};

export default CTA;
