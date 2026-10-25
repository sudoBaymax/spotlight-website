import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Spotlight",
  description: "Get in touch with the Spotlight team.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-bg-dark pt-28 pb-16 md:pt-36 md:pb-20 border-b border-bg-border">
        <div className="section-container">
          <p className="section-label mb-5">Contact</p>
          <h1 className="font-serif text-[clamp(36px,5vw,68px)] text-text-primary leading-tight mb-5 max-w-xl">
            Get in touch.
          </h1>
          <p className="text-text-muted text-[17px] leading-relaxed max-w-md">
            If you have a specific question before booking a call, send it here.
            We respond the same day.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="bg-bg-dark py-16 md:py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-[1fr_380px] gap-12 lg:gap-20 max-w-4xl">
            <ContactForm />

            {/* Side info */}
            <div className="space-y-8">
              <div>
                <p className="text-text-primary font-semibold text-[15px] mb-2">
                  Email
                </p>
                <a
                  href="mailto:hello@spotlight.ai"
                  className="text-text-muted hover:text-text-primary text-sm transition-colors"
                >
                  hello@spotlight.ai
                </a>
              </div>
              <div>
                <p className="text-text-primary font-semibold text-[15px] mb-2">
                  Faster option
                </p>
                <p className="text-text-muted text-sm leading-relaxed mb-3">
                  Book a 15-minute audit call. It&apos;s the fastest way to get
                  direct answers for your specific team setup.
                </p>
                <Link href="/audit" className="btn-primary text-sm">
                  Book an audit call
                </Link>
              </div>
              <div className="border-t border-bg-border pt-6">
                <p className="text-text-muted text-sm leading-relaxed">
                  We work with real estate teams across the US. If you&apos;re
                  not sure if Spotlight is a fit for your team size or lead
                  setup, the audit call will tell you either way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
