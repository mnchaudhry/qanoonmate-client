import Link from 'next/link';
import React from 'react';

const GetInTouch: React.FC = () => {
  return (
    <section className="bg-green-500 text-neutral py-16 px-8 flex justify-center gap-52 items-center">
      <div>
        <h2 className="text-4xl font-bold mb-2">Let&apos;s talk</h2>
        <p className="text-lg">We would love to hear from you!</p>
      </div>
      <Link
        href="./contact"
        className="border-2 border-white text-neutral py-2 px-6 rounded-lg hover:bg-neutral hover:text-green-500 transition duration-300"
      >
        GET IN TOUCH
      </Link>
    </section>
  );
};

export default GetInTouch;
