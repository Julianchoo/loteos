import { and, asc, eq, notInArray, sql } from "drizzle-orm";
import { StatsCard } from "@/components/crm/stats-card";
import { db } from "@/lib/db";
import { LEAD_STATUS_LABELS } from "@/lib/lead-status";
import { lead, lot, project } from "@/lib/schema";
import { requireCrmUser } from "@/lib/session";
import { tones, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

// Admin ve todos los leads; el comercial, solo los asignados a él ("Mis leads").
async function getStats(userId: string | null) {
  const misLeads = userId ? eq(lead.asignadoA, userId) : undefined;
  const [
    totalParcelas,
    disponibles,
    reservadas,
    vendidas,
    totalLeads,
    leadsNuevos,
    recentLeads,
    porProyecto,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(lot),
    db.select({ count: sql<number>`count(*)` }).from(lot).where(eq(lot.estado, "disponible")),
    db.select({ count: sql<number>`count(*)` }).from(lot).where(eq(lot.estado, "reservado")),
    db.select({ count: sql<number>`count(*)` }).from(lot).where(eq(lot.estado, "vendido")),
    db.select({ count: sql<number>`count(*)` }).from(lead).where(misLeads),
    db
      .select({ count: sql<number>`count(*)` })
      .from(lead)
      .where(
        userId
          ? and(misLeads, notInArray(lead.status, ["sold", "lost"]))
          : eq(lead.status, "new")
      ),
    db.select({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      createdAt: lead.createdAt,
    })
      .from(lead)
      .where(misLeads)
      .orderBy(sql`${lead.createdAt} desc`)
      .limit(5),
    db
      .select({
        id: project.id,
        name: project.name,
        total: sql<number>`count(${lot.id})`,
        disponibles: sql<number>`count(*) filter (where ${lot.estado} = 'disponible')`,
        reservados: sql<number>`count(*) filter (where ${lot.estado} = 'reservado')`,
        vendidos: sql<number>`count(*) filter (where ${lot.estado} = 'vendido')`,
      })
      .from(project)
      .innerJoin(lot, eq(lot.projectId, project.id))
      .groupBy(project.id, project.name)
      .orderBy(asc(project.name)),
  ]);

  return {
    totalParcelas: Number(totalParcelas[0]?.count ?? 0),
    disponibles: Number(disponibles[0]?.count ?? 0),
    reservadas: Number(reservadas[0]?.count ?? 0),
    vendidas: Number(vendidas[0]?.count ?? 0),
    totalLeads: Number(totalLeads[0]?.count ?? 0),
    leadsNuevos: Number(leadsNuevos[0]?.count ?? 0),
    recentLeads,
    porProyecto,
  };
}

const statusTone: Record<string, Tone> = {
  new: "info",
  contacted: "warning",
  interested: "warning",
  visit_scheduled: "warning",
  proposal_sent: "info",
  sold: "positive",
  lost: "neutral",
};

export default async function CrmDashboard() {
  const { session, role } = await requireCrmUser();
  const esAdmin = role === "admin";
  const stats = await getStats(esAdmin ? null : session.user.id);

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="font-serif text-3xl font-normal text-foreground">Dashboard</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Resumen general de los proyectos</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          href="/crm/lotes?estado=disponible"
          title="Lotes disponibles"
          value={stats.disponibles}
          description={`de ${stats.totalParcelas} totales`}
        />
        <StatsCard href="/crm/lotes?estado=reservado" title="Reservados" value={stats.reservadas} />
        <StatsCard href="/crm/lotes?estado=vendido" title="Vendidos" value={stats.vendidas} />
        {esAdmin ? (
          <StatsCard
            href="/crm/leads?status=new"
            title="Leads nuevos"
            value={stats.leadsNuevos}
            description={`de ${stats.totalLeads} totales`}
          />
        ) : (
          <StatsCard
            href="/crm/leads"
            title="Mis leads"
            value={stats.leadsNuevos}
            description={`activos de ${stats.totalLeads} asignados`}
          />
        )}
      </div>

      {stats.porProyecto.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-body text-sm font-semibold text-foreground">Lotes por proyecto</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-6 py-2 text-left font-medium">Proyecto</th>
                  <th className="px-6 py-2 text-right font-medium">Total</th>
                  <th className="px-6 py-2 text-right font-medium">Disponibles</th>
                  <th className="px-6 py-2 text-right font-medium">Reservados</th>
                  <th className="px-6 py-2 text-right font-medium">Vendidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.porProyecto.map((row) => (
                  <tr key={row.id}>
                    <td className="px-6 py-3 font-medium">{row.name}</td>
                    <td className="px-6 py-3 text-right">{Number(row.total)}</td>
                    <td className="px-6 py-3 text-right">{Number(row.disponibles)}</td>
                    <td className="px-6 py-3 text-right">{Number(row.reservados)}</td>
                    <td className="px-6 py-3 text-right">{Number(row.vendidos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-medium text-foreground">
            {esAdmin ? "Últimos leads recibidos" : "Mis últimos leads"}
          </h2>
        </div>
        {stats.recentLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            {esAdmin ? "No hay leads aún." : "Todavía no tenés leads asignados."}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.recentLeads.map((item) => {
              const tone = statusTone[item.status] ?? "neutral";
              const label = LEAD_STATUS_LABELS[item.status as keyof typeof LEAD_STATUS_LABELS] ?? item.status;
              return (
                <li key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.firstName} {item.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[item.email, item.phone].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className={cn("ml-4 flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
