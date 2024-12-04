"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WhiteCheckCircleIcon from "@/components/shared/WhiteCheckCircleIcon";

const Footer = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {/* Appointment Section */}
      <div className="w-full bg-sky-500 animate-in fade-in duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center items-center gap-4">
              {" "}
              <div className="flex-shrink-0">
                {" "}
                <WhiteCheckCircleIcon />
              </div>
              <h2 className="text-3xl font-semibold text-white font-montserrat animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 ease-in-out">
                Start Your Journey Today{" "}
              </h2>
            </div>
            <p className="text-white font-montserrat text-lg px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ease-in-out">
              <span className="font-bold">
                If you have issues with the homepage calendar
              </span>
              , please call the office:{" "}
              <a
                href="tel:+15612726664"
                className="underline hover:no-underline"
              >
                (561) 272-6664
              </a>{" "}
              for immediate assistance. Thanks for your understanding.
            </p>
            {!isHomePage && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 ease-in-out">
                <Link
                  href="/"
                  className="inline-block bg-white text-sky-500 font-montserrat font-semibold px-8 py-3 rounded-lg hover:bg-sky-50 transition-colors duration-200"
                >
                  Request an appointment on the home page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="bg-gray-100 animate-in fade-in duration-1000 ease-in-out">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:space-y-0 space-y-8">
            {/* Hours Section - Desktop */}
            <div className="hidden lg:block lg:w-1/4 px-4 animate-in fade-in slide-in-from-left-8 duration-700 delay-200 ease-in-out">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center lg:text-left">
                <span className="border-b-2 border-gray-300 pb-2">Hours</span>
              </h3>
              <div className="space-y-0.5 max-w-xs mx-auto lg:mx-0">
                {[
                  { day: "Mon", hours: "9am – 5pm" },
                  { day: "Tue", hours: "8am – 5pm" },
                  { day: "Wed", hours: "8am – 2pm" },
                  { day: "Thu", hours: "9am – 5pm" },
                  { day: "Fri", hours: "9am – 1pm" },
                  { day: "Sat", hours: "Closed" },
                  { day: "Sun", hours: "Closed" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center">
                    <span className="font-medium text-gray-900 w-8">{day}</span>
                    <span className="text-gray-600 ml-4">{hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center lg:text-left">
                <Link
                  href="/admin/login"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            {/* Map Section - Centered and Larger */}
            <div className="w-full lg:w-2/4 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 ease-in-out">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                <span className="border-b-2 border-gray-300 pb-2">
                  Visit Our Office
                </span>
              </h3>
              <div
                className="w-full h-96 lg:h-screen mb-4"
                style={{ maxHeight: "400px" }}
              >
                <div className="shadow-lg shadow-gray-300 h-full rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC1h7w0gjR4gdkVEdxlfFiKjRaHKPqzXE4&q=place_id:ChIJY_y__EDg2IgRgLI0mNHs_aw`}
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="hidden lg:block lg:w-1/4 px-4 animate-in fade-in slide-in-from-right-8 duration-700 delay-200 ease-in-out">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center lg:text-right">
                <span className="border-b-2 border-gray-300 pb-2">
                  Contact Us
                </span>
              </h3>
              <div className="text-center lg:text-right space-y-2 max-w-xs mx-auto lg:ml-auto lg:mr-0">
                <p className="text-gray-900 font-medium">
                  Ritota & Ritota, P.A.
                </p>
                <p className="text-gray-600">3401 S Federal Hwy</p>
                <p className="text-gray-600">Delray Beach, FL 33483</p>
                <div className="pt-4">
                  <a
                    href="tel:555-555-5555"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    (561) 272-6664
                  </a>
                  <p className="text-gray-600">
                    Available for{" "}
                    <span className="font-bold">all emergencies</span> during
                    business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Hours and Address for medium and small screens - Hidden on large screens */}
            <div className="lg:hidden w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-in-out">
              <div className="flex flex-row justify-between max-w-3xl mx-auto">
                {/* Hours Section */}
                <div className="w-1/2 px-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 text-left">
                    <span className="border-b-2 border-gray-300 pb-2">
                      Hours
                    </span>
                  </h3>
                  <div className="space-y-0.5">
                    {[
                      { day: "Mon", hours: "9am – 5pm" },
                      { day: "Tue", hours: "8am – 5pm" },
                      { day: "Wed", hours: "8am – 2pm" },
                      { day: "Thu", hours: "9am – 5pm" },
                      { day: "Fri", hours: "9am – 1pm" },
                      { day: "Sat", hours: "Closed" },
                      { day: "Sun", hours: "Closed" },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex items-center">
                        <span className="font-medium text-gray-900 w-8">
                          {day}
                        </span>
                        <span className="text-gray-600 ml-4">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address Section */}
                <div className="w-1/2 px-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 text-right">
                    <span className="border-b-2 border-gray-300 pb-2">
                      Contact Us
                    </span>
                  </h3>
                  <div className="text-right space-y-2">
                    <p className="text-gray-900 font-medium">
                      Ritota & Ritota, P.A.
                    </p>
                    <p className="text-gray-600">3401 S Federal Hwy</p>
                    <p className="text-gray-600">Delray Beach, FL 33483</p>
                    <div className="pt-4">
                      <a
                        href="tel:555-555-5555"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        (561) 272-6664
                      </a>
                      <p className="text-gray-600">
                        Available for{" "}
                        <span className="font-bold">all emergencies</span>{" "}
                        during business hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
