// src/lib/emailService.ts
import emailjs from "@emailjs/browser";
import { format } from "date-fns";

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentType: string;
  practitionerName: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const emailService = {
  async sendContactFormEmail(data: ContactFormData) {
    try {
      return await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        {
          to_email: "delraydental.notifications@gmail.com",
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          phone: data.phone || "Not provided",
          subject: data.subject,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Failed to send contact form email:", error);
      throw error;
    }
  },

  async sendAppointmentEmail(data: AppointmentEmailData) {
    try {
      console.log("Email service received appointment times:", {
        startTimeHours: data.startTime.getHours(),
        startTimeMinutes: data.startTime.getMinutes(),
      });

      // Format the appointment date and time in Eastern Time
      const formattedDate = format(data.startTime, "EEEE, MMMM d, yyyy");
      const formattedTime = format(data.startTime, "h:mm a");

      console.log("Email formatted times (ET):", {
        formattedDate,
        formattedTime,
      });

      // Create the email content exactly matching the template structure
      const emailContent = `New Appointment Request

Patient Details:
Name: ${data.patientName}
Email: ${data.patientEmail}
Phone: ${data.patientPhone}

Appointment Details:
Type: ${data.appointmentType}
Date: ${formattedDate}
Time: ${formattedTime} ET
Practitioner: ${data.practitionerName}

Additional Notes:
${data.notes || "No additional notes"}

---
This appointment was booked through the Delray Dental Arts website.`;

      const templateParams = {
        to_email: "delraydental.notifications@gmail.com", // Explicitly set recipient email
        patient_name: data.patientName,
        patient_email: data.patientEmail,
        patient_phone: data.patientPhone,
        appointment_type: data.appointmentType,
        appointment_date: formattedDate,
        appointment_time: formattedTime + " ET",
        practitioner_name: data.practitionerName,
        notes: data.notes || "No additional notes",
        message: emailContent, // Add the full message content
        subject: `New Appointment Request from ${data.patientName}`,
      };

      console.log("Sending appointment email with params:", templateParams);

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      console.log("Appointment email sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to send appointment email:", error);
      console.error("Error details:", error);
      throw error;
    }
  },
};
