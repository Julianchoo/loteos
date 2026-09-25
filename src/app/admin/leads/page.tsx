import { redirect } from "next/navigation";

// Leads are managed in the CRM (assignment, buyer data, reservas).
export default function AdminLeadsPage() {
  redirect("/crm/leads");
}
