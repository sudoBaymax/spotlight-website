import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-bg-dark min-h-screen flex items-center">
      <div className="section-container text-center py-32">
        <p className="section-label mb-4">404</p>
        <h1 className="font-serif text-[clamp(36px,5vw,64px)] text-text-primary leading-tight mb-5">
          Page not found.
        </h1>
        <p className="text-text-muted text-[16px] mb-8 max-w-sm mx-auto">
          That page doesn&apos;t exist. If you were looking for something
          specific, start here.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/audit" className="btn-ghost">
            Book an audit
          </Link>
        </div>
      </div>
    </section>
  );
}
