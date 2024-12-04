-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_practitionerId_fkey";

-- DropForeignKey
ALTER TABLE "PractitionerNote" DROP CONSTRAINT "PractitionerNote_practitionerId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_practitionerId_fkey";

-- AddForeignKey
ALTER TABLE "PractitionerNote" ADD CONSTRAINT "PractitionerNote_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "Practitioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
