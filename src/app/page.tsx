import HeroSection from "@/components/home/HeroSection";
import CalendlyEmbed from "@/components/home/CalendlyEmbed";
import WhiteCheckCircleIcon from "@/components/shared/WhiteCheckCircleIcon";

export default function HomePage() {
  return (
    <main className="bg-gray-100">
      <HeroSection />
      <div className="w-full bg-sky-500 animate-in fade-in duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              <div className="flex-shrink-0">
                <WhiteCheckCircleIcon />
              </div>
              <h2 className="text-3xl font-semibold text-white font-montserrat animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-in-out">
                Easy Online Scheduling
              </h2>
            </div>
            <p className="text-white font-montserrat text-lg px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ease-in-out">
              We are still privately owned and are{" "}
              <span className="font-black text-indigo-200 underline decoration-4">
                NOT
              </span>{" "}
              part of a Wall Street Conglomerate or Hedge Fund.{" "}
              <span className="font-bold">
                We work for you, not someone else.{" "}
              </span>
              We have no "
              <span className="font-black text-indigo-200 underline decoration-2">
                quota
              </span>
              " to meet!
            </p>
          </div>
        </div>
      </div>
      {/* Calendar Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <CalendlyEmbed />
        </div>
      </section>
    </main>
  );
}