// src/app/patient-resources/pre-operative/page.tsx
import Image from "next/image";
import React from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import ArrowCircleIcon from "@/components/shared/ArrowCircleIcon";

const DrySocket = () => {
  const instructions = [
    {
      //   title: "BLEEDING",
      content:
        "In individuals who smoke too soon! before adequate healing occurs. Smoking: decreases healing, decrease blood supply to the protective blood clot, brings toxic products to the area, injuries the gum tissue and the negative pressure of sucking removes the blood clot from the surgery site.",
    },
    {
      //   title: "MEDICATIONS",
      content:
        "If you do not care for your extraction site as instructed by staff.",
    },
    {
      //   title: "EATING",
      content: "Not following your home care instruction.",
    },
    {
      //   title: "RINSING AND BRUSHING",
      content:
        "Sucking action from smoking, sneezing, coughing, spitting or sucking, within the first 24 hours.",
    },
    {
      //   title: "ICE PACKS",
      content: "Women taking oral contraceptives are more susceptible.",
    },
  ];

  const preventionInstruction = [
    {
      content:
        "Women who use birth control pills or have their teeth removed in the first 22 days of the menstrual cycle are twice as likely to develop dry socket after an extraction. Schedule extractions during the last week of your menstrual cycle (days 23 through 28) ** when estrogen levels are low or inactive.",
    },
    {
      content: "Avoid drinking through a straw.",
    },
    {
      content: "Avoid smoking, it contaminates the extraction sit.",
    },
    {
      content:
        "Avoid excessive mouth rinsing, it interferes with blood clotting.",
    },
    {
      content:
        "Keeping food from impacting in this area.  Chew on the other side of your mouth and gently rinse your mouth with warm salt water after the first 48 hours.",
      bigDetail: "DO NOT RINSE FOR THE FIRST TWO DAYS!",
    },
  ];

  const treatmentInstruction = [
    `Medication applied to the site.`,
    `Clove oil technique.`,
    `Gauze with medication.`,
  ];

  const additionalInstruction = [
    `Applying topical anesthetic.`,
    `Alvogyl by Septodont.`,
  ];

  const threeFourDaysInstruction = [
    `Good oral health care.`,
    `Avoid food with any residuals…popcorn, peanuts and pasta`,
    `Eat soft foods…mashed potatoes, clear or cream soups that don’t contain any residue, puddings.`,
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[500px] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/patient-resources.jpg"
            alt="Dental Office"
            fill
            className="object-cover"
            priority
          />
          {/* Enhanced overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
            Dry Socket Treatment in Delray Beach, Florida{" "}
          </h1>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200 ease-in-out"
          >
            Appointments
          </Link>
        </div>
      </div>

      {/* Commonly Found Section */}
      <section className="py-16 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-left mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What is a Dry Socket?{" "}
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                A “socket” is the area where the tooth was removed.
              </p>
              <p className="text-xl text-gray-600 mb-4">
                Dry socket is the most common complication of an extraction. It
                develops in about 5% of tooth extractions. It is very painful
                condition that is easily treated.
              </p>
              <p className="text-xl text-gray-600 mb-4">
                Any socket in which a patient is having pain due to the loss of
                the blood clot thus exposing the bone to air, food, and fluids
                along with an offensive odor. This often occurs two or more days
                after an extraction and can last about 5-6 days. It is normal to
                have soreness and discomfort following an extraction. However,
                pain should be lessening by the second day.
              </p>
              <p className="text-xl text-gray-600 mb-4">
                This condition exist when a blood clot is dislodged from the
                surgery site thus exposing the bone and fine nerve endings. The
                blood clot helps in the stopping of bleeding and lays the
                foundation or framework for new tissue and bone to develop over
                a two-month healing process. This condition is more common in
                the mandibular area and in back teeth due to poorer circulation
                in this area, with wisdom teeth being the most common site. Dry
                socket delays the healing process.
              </p>
              <p className="text-xl text-gray-600">
                It usually takes gum tissue about 3-4 weeks to heal where as the
                bone can take up to six months to heal.
              </p>
            </div>
            <div className="text-left mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                This condition is most commonly found:{" "}
              </h2>
            </div>
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-5 items-start bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {" "}
                    {/* Removed pt-1 and added flex-shrink-0 */}
                    <ArrowCircleIcon />
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {instruction.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Prevention Section */}
            <div className="text-left mb-6 mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Prevention of dry socket:{" "}
              </h2>
            </div>
            <div className="space-y-4">
              {preventionInstruction.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-5 items-start bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {" "}
                    {/* Removed pt-1 and added flex-shrink-0 */}
                    <ArrowCircleIcon />
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {instruction.content}
                    <span className="font-bold">
                      {" "}
                      {instruction.bigDetail}
                    </span>{" "}
                  </div>
                </div>
              ))}
            </div>

            {/* Treatment Section */}
            <div className="text-left mb-6 mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Treatment could include the following:{" "}
              </h2>
            </div>
            <div className="space-y-6">
              {treatmentInstruction.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm" // Changed items-start to items-center
                >
                  <div className="flex-shrink-0">
                    {" "}
                    {/* Removed pt-1 and added flex-shrink-0 */}
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>

            {/* 3-4 Day Care Section */}
            <div className="text-left mb-6 mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Continue these instructions for 3-4 days:{" "}
              </h2>
            </div>
            <div className="space-y-6">
              {threeFourDaysInstruction.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm" // Changed items-start to items-center
                >
                  <div className="flex-shrink-0">
                    {" "}
                    {/* Removed pt-1 and added flex-shrink-0 */}
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
            {/* At Home Care Section */}
            <div className="text-left mb-6 mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Additonal home care instructions:{" "}
              </h2>
            </div>
            <div className="space-y-6">
              {additionalInstruction.map((instruction, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm" // Changed items-start to items-center
                >
                  <div className="flex-shrink-0">
                    {" "}
                    {/* Removed pt-1 and added flex-shrink-0 */}
                    <ArrowCircleIcon />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
            {/* Bottom Informational Section */}
            <div className="text-left mt-12 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                News Updates on Dry Socket
              </h2>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Oral Contraceptives May Increase Pain After Wisdom Tooth
                Extraction
              </h2>
              <p className="text-xl text-gray-600">
                That tests on 267 women showed that those on the birth control
                pill were more susceptible than non-users to both postoperative
                pain and a condition known as “dry socket”. In this condition,
                normal healing of the vacant tooth socket is delayed by the
                failure of a blood clot to form. Infection instead causes the
                socket to remain empty. In the study, pain on the day after the
                operation was experienced by 30 percent of pill takers compared
                to just 11 percent of non-users. Five days after the operation
                the difference was 14 percent compared to 5 percent. The
                researchers said these results suggest that the pill may reduce
                the pain threshold. The differential was similar when the
                development of dry socket was compared. Here, 11 percent of pill
                users were affected compared to 4 percent of non-pill users.
              </p>
              <p className="mt-2 text-xl text-gray-600">
                SOURCE: British Dental Journal 2003;194:453-455.
              </p>
              <p className="mt-2 text-xl text-gray-600">
                ** Academy of General Dentistry.{" "}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default DrySocket;
