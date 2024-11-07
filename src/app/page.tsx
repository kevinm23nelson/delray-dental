// src/app/page.tsx
import HeroSection from '@/components/home/HeroSection';
import CalendlyEmbed from '@/components/home/CalendlyEmbed';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection />
      
      {/* Calendar Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-montserrat tracking-tight">
              Schedule Your Visit Today
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Select your appointment type and choose a time that works best for you.
            </p>
          </div>
          <CalendlyEmbed />
        </div>
      </section>
    </main>
  );
}