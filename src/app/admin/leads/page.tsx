import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { lead, leadProject, project } from "@/lib/schema";
import { requireAdmin } from "@/lib/session";

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  interested: "Interesado",
  visit_scheduled: "Visita agendada",
  proposal_sent: "Propuesta enviada",
  sold: "Vendido",
  lost: "Perdido",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "outline",
  contacted: "secondary",
  interested: "secondary",
  visit_scheduled: "default",
  proposal_sent: "default",
  sold: "default",
  lost: "destructive",
};

const CHANNEL_LABELS: Record<string, string> = {
  web_form_general: "Web general",
  web_form_project: "Web proyecto",
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  in_person: "Presencial",
};

export default async function AdminLeadsPage() {
  await requireAdmin();

  const leads = await db
    .select({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      contactChannel: lead.contactChannel,
      status: lead.status,
      initialMessage: lead.initialMessage,
      createdAt: lead.createdAt,
      projectName: project.name,
    })
    .from(lead)
    .leftJoin(leadProject, eq(leadProject.leadId, lead.id))
    .leftJoin(project, eq(project.id, leadProject.projectId))
    .orderBy(desc(lead.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <span className="text-sm text-muted-foreground">{leads.length} en total</span>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Teléfono</th>
              <th className="text-left px-4 py-3 font-medium">Canal</th>
              <th className="text-left px-4 py-3 font-medium">Estado</th>
              <th className="text-left px-4 py-3 font-medium">Proyecto</th>
              <th className="text-left px-4 py-3 font-medium">Mensaje</th>
              <th className="text-left px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium whitespace-nowrap">
                  {l.firstName} {l.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.phone ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {CHANNEL_LABELS[l.contactChannel] ?? l.contactChannel}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[l.status] ?? "outline"}>
                    {STATUS_LABELS[l.status] ?? l.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {l.projectName ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                  {l.initialMessage ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No hay leads registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
