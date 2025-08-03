"use client";

interface RelatedInformationProps {
  faqs: string[];
  guides: string[];
  laws: string[];
}

export default function RelatedInformation({ faqs, guides, laws, }: RelatedInformationProps) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
      <h2 className="text-xl font-bold mb-6">Related Information</h2>

      {/* FAQs Section */}
      <section className="mb-6 py-0 ">
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
          Related FAQs
        </h3>
        <ul className="space-y-2 text-sm">
          {faqs.map((faq, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <a href="#" className="text-primary hover:underline">
                {faq}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Legal Guides Section */}
      <section className="mb-6 py-0 ">
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
          Related Legal Guides
        </h3>
        <ul className="space-y-2 text-sm">
          {guides.map((guide, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <a href="#" className="text-primary hover:underline">
                {guide}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Related Laws Section */}
      <section className="py-0" >
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
          Related Laws
        </h3>
        <ul className="space-y-2 text-sm">
          {laws.map((law, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <a href="#" className="text-primary hover:underline">
                {law}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
