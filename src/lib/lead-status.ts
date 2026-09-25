// Lead vocabulary shared by the public forms and the CRM (/crm/leads).

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "interested",
  "visit_scheduled",
  "proposal_sent",
  "sold",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  interested: "Interesado",
  visit_scheduled: "Visita agendada",
  proposal_sent: "Propuesta enviada",
  sold: "Vendido",
  lost: "Perdido",
};

export const LEAD_CHANNELS = [
  "web_form_general",
  "web_form_project",
  "whatsapp",
  "phone",
  "in_person",
] as const;

export const LEAD_CHANNEL_LABELS: Record<(typeof LEAD_CHANNELS)[number], string> = {
  web_form_general: "Web general",
  web_form_project: "Web proyecto",
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  in_person: "Presencial",
};
