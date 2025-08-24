import React from 'react'
import Breadcrumbs from "@/components/bread-crumb"

const TermsOfServices = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using QanoonMate
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs />
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">1</span>
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern your use of QanoonMate (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), 
                a legal technology platform incorporated in Pakistan. By accessing or using QanoonMate, you agree to be 
                bound by these Terms. If you do not agree, you must not use the platform.
              </p>
            </section>

            {/* Services */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">2</span>
                Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                QanoonMate provides access to legal resources, blogs, AI-powered tools, consultations, and subscription-based 
                services (&ldquo;Services&rdquo;). Services may be free or paid, subject to the packages available at the time of subscription.
              </p>
            </section>

            {/* Eligibility */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">3</span>
                Eligibility
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years of age or the age of majority in your jurisdiction to use the Services. 
                By using QanoonMate, you represent that you meet this requirement.
              </p>
            </section>

            {/* User Accounts */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">4</span>
                User Accounts
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You are required to create an account to access certain Services.</li>
                <li>You must provide accurate and complete information during registration.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              </ul>
            </section>

            {/* User Content */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">5</span>
                User Content
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Users may submit blogs, comments, and other content (&ldquo;User Content&rdquo;).</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You retain ownership of your User Content but grant QanoonMate a worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, and display it in connection with the Services.</li>
                  <li>You must not post content that is unlawful, defamatory, obscene, threatening, infringing, or otherwise objectionable.</li>
                  <li>We reserve the right to remove or restrict any User Content at our discretion.</li>
                </ul>
              </div>
            </section>

            {/* Paid Services and Subscriptions */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">6</span>
                Paid Services and Subscriptions
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Certain features require payment under subscription packages.</li>
                <li>Fees are payable in advance and are non-refundable unless required by law.</li>
                <li>QanoonMate may suspend or revoke your access if you violate these Terms.</li>
                <li>We reserve the right to modify or discontinue packages with notice.</li>
              </ul>
            </section>

            {/* Data Collection and Privacy */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">7</span>
                Data Collection and Privacy
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>We collect and store personal data as outlined in our Privacy Policy.</li>
                <li>By using QanoonMate, you consent to such collection and use.</li>
                <li>You are responsible for maintaining the accuracy of your personal information.</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">8</span>
                Intellectual Property
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>All materials on QanoonMate, including software, design, trademarks, and content (excluding User Content), are the property of QanoonMate or its licensors.</p>
                <p>You may not reproduce, distribute, or create derivative works without prior written permission.</p>
              </div>
            </section>

            {/* Prohibited Conduct */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">9</span>
                Prohibited Conduct
              </h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Use the Services for unlawful purposes.</li>
                <li>Impersonate any person or entity.</li>
                <li>Attempt to interfere with the platform&apos;s operation.</li>
                <li>Circumvent access controls or security measures.</li>
                <li>Engage in automated data collection, including but not limited to web scraping, crawling, or harvesting of content without express written permission.</li>
              </ul>
            </section>

            {/* Disclaimer of Legal Advice */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">10</span>
                Disclaimer of Legal Advice
              </h2>
              <div className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>QanoonMate provides general legal information, tools, and resources for educational purposes.</li>
                  <li>QanoonMate is not a law firm and does not provide legal advice.</li>
                  <li>Use of the Services does not create a lawyer-client relationship.</li>
                  <li>Users must consult a qualified lawyer for specific legal matters.</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">11</span>
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>To the maximum extent permitted by law, QanoonMate is not liable for any indirect, incidental, or consequential damages arising from your use of the Services.</p>
                <p>Our total liability shall not exceed the amount paid by you in the twelve months preceding the claim.</p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">12</span>
                Third-Party Services
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>QanoonMate may integrate with third-party services (e.g., payment processors, storage providers).</p>
                <p>We are not responsible for third-party services and disclaim all liability arising from their use.</p>
              </div>
            </section>

            {/* Termination */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">13</span>
                Termination
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>We may suspend or terminate your access without notice if you breach these Terms.</li>
                <li>You may stop using the Services at any time by deactivating your account.</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">14</span>
                Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of Pakistan. Any disputes shall be subject to the exclusive 
                jurisdiction of the courts of Pakistan.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="!py-0 mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm mr-3">15</span>
                Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms at any time. Continued use of the Services after changes take effect 
                constitutes acceptance of the revised Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="!py-6 mt-16 !px-6 bg-muted/30 rounded-lg border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Contact Us</h3>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="text-sm text-muted-foreground">
                <p><strong>Email:</strong> support@qanoonmate.com</p>
                <p><strong>Address:</strong> QanoonMate, Pakistan</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServices