import { NextResponse } from "next/server";
import { and, asc, eq, gte, inArray, lt } from "drizzle-orm";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { lead, leadFinancingPreference, leadProject, project } from "@/lib/schema";

export const dynamic = "force-dynamic";

const RECIPIENTS = [
  "juliankorn@gmail.com",
  "cohenmat@hotmail.com",
  "matias@fitzroyadesarrollos.com",
];
const BUENOS_AIRES_OFFSET = "-03:00";
const BUENOS_AIRES_TIME_ZONE = "America/Argentina/Buenos_Aires";

function getBuenosAiresDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUENOS_AIRES_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  if (!year || !month || !day) {
    throw new Error("No se pudo determinar la fecha de Buenos Aires");
  }

  return { year, month, day };
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year.toString().padStart(4, "0")}-${month
    .toString()
    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function getPreviousBuenosAiresDay(now: Date) {
  const today = getBuenosAiresDateParts(now);
  const todayKey = formatDateKey(today.year, today.month, today.day);
  const yesterdayUtc = new Date(Date.UTC(today.year, today.month - 1, today.day - 1));
  const yesterdayKey = formatDateKey(
    yesterdayUtc.getUTCFullYear(),
    yesterdayUtc.getUTCMonth() + 1,
    yesterdayUtc.getUTCDate()
  );

  return {
    dateKey: yesterdayKey,
    start: new Date(`${yesterdayKey}T00:00:00${BUENOS_AIRES_OFFSET}`),
    end: new Date(`${todayKey}T00:00:00${BUENOS_AIRES_OFFSET}`),
  };
}

function escapeHtml(value: string | null | undefined) {
  return (value || "-")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(value: string | null) {
  if (!value) return "-";
  const amount = Number(value);
  return Number.isFinite(amount)
    ? `USD ${amount.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
    : `USD ${value}`;
}

async function sendDailyLeads(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!cronSecret || !gmailUser || !gmailAppPassword) {
    console.error("Daily leads cron is missing required environment variables");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const range = getPreviousBuenosAiresDay(new Date());
    const leadRows = await db
      .select({
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        initialMessage: lead.initialMessage,
        createdAt: lead.createdAt,
        projectName: project.name,
        anticipoAmount: leadFinancingPreference.anticipoAmount,
        plazoMonths: leadFinancingPreference.plazoMonths,
        calculatedCuota: leadFinancingPreference.calculatedCuota,
      })
      .from(lead)
      .leftJoin(leadProject, eq(leadProject.leadId, lead.id))
      .leftJoin(project, eq(project.id, leadProject.projectId))
      .leftJoin(leadFinancingPreference, eq(leadFinancingPreference.leadId, lead.id))
      .where(
        and(
          inArray(lead.contactChannel, ["web_form_general", "web_form_project"]),
          gte(lead.createdAt, range.start),
          lt(lead.createdAt, range.end)
        )
      )
      .orderBy(asc(lead.createdAt));

    const leadsById = new Map<string, (typeof leadRows)[number] & { projectNames: string[] }>();

    for (const item of leadRows) {
      const existing = leadsById.get(item.id);
      if (existing) {
        if (item.projectName && !existing.projectNames.includes(item.projectName)) {
          existing.projectNames.push(item.projectName);
        }
        continue;
      }

      leadsById.set(item.id, {
        ...item,
        projectNames: item.projectName ? [item.projectName] : [],
      });
    }

    const leads = Array.from(leadsById.values());

    const rows = leads.length
      ? leads
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(`${item.firstName} ${item.lastName}`)}</td>
                <td>${escapeHtml(item.email)}</td>
                <td>${escapeHtml(item.phone)}</td>
                <td>${escapeHtml(item.projectNames.join(", "))}</td>
                <td>${escapeHtml(formatCurrency(item.anticipoAmount))}</td>
                <td>${escapeHtml(item.plazoMonths ? `${item.plazoMonths} meses` : null)}</td>
                <td>${escapeHtml(formatCurrency(item.calculatedCuota))}</td>
                <td>${escapeHtml(item.initialMessage)}</td>
                <td>${escapeHtml(
                  item.createdAt.toLocaleTimeString("es-AR", {
                    timeZone: BUENOS_AIRES_TIME_ZONE,
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}</td>
              </tr>`
          )
          .join("")
      : '<tr><td colspan="9">No se registraron leads.</td></tr>';

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const info = await transporter.sendMail({
      from: `Fitzroya Desarrollos <${gmailUser}>`,
      to: RECIPIENTS,
      subject: `Leads web del ${range.dateKey} (${leads.length})`,
      text:
        leads.length === 0
          ? `No se registraron leads web el ${range.dateKey}.`
          : `Se registraron ${leads.length} leads web el ${range.dateKey}. Revisá el detalle en el cuerpo del correo.`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1f2937">
          <h1 style="font-size:22px">Leads web del ${range.dateKey}</h1>
          <p>Total: <strong>${leads.length}</strong></p>
          <div style="overflow-x:auto">
            <table style="border-collapse:collapse;width:100%;font-size:13px" border="1" cellpadding="8">
              <thead style="background:#f3f4f6">
                <tr>
                  <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Proyecto</th>
                  <th>Anticipo</th><th>Plazo</th><th>Cuota</th><th>Mensaje</th><th>Hora</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`,
    });

    return NextResponse.json({
      success: true,
      date: range.dateKey,
      leads: leads.length,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Daily leads cron failed:", error);
    return NextResponse.json({ error: "Failed to send daily leads" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return sendDailyLeads(request);
}

export async function POST(request: Request) {
  return sendDailyLeads(request);
}
