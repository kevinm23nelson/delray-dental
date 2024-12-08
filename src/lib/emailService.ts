// src/lib/emailService.ts
import emailjs from "@emailjs/browser";

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

emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);

export const emailService = {
  async sendContactFormEmail(data: ContactFormData) {
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
        {
          to_email: "delraydental.notifications@gmail.com",
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          phone: data.phone || "Not provided",
          subject: data.subject,
          message: data.message,
        }
      );
    } catch (error) {
      console.error("Failed to send contact form email:", error);
      throw error;
    }
  },

  async sendAppointmentEmail(data: AppointmentEmailData) {
    try {
      const formattedDate = new Date(data.startTime).toLocaleDateString();
      const formattedStartTime = new Date(data.startTime).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
      const formattedEndTime = new Date(data.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const templateParams = {
        to_email: "delraydental.notifications@gmail.com",
        patient_name: data.patientName,
        patient_email: data.patientEmail,
        patient_phone: data.patientPhone,
        appointment_type: data.appointmentType,
        practitioner_name: data.practitionerName,
        appointment_date: formattedDate,
        appointment_time: `${formattedStartTime} - ${formattedEndTime}`,
        notes: data.notes || "No additional notes",
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_APPOINTMENT_TEMPLATE_ID!,
        templateParams
      );
    } catch (error) {
      console.error("Failed to send appointment email:", error);
      throw error;
    }
  }
};
