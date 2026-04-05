import { EditProjectDialog } from "@/components/admin/edit-project-dialog";
import { getProjects } from "@/lib/actions/project-actions";
import { requireAdmin } from "@/lib/session";

export default async function AdminProyectosPage() {
  await requireAdmin();

  const { data: projects } = await getProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Proyectos</h1>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Ubicación</th>
              <th className="text-left px-4 py-3 font-medium">Precio base</th>
              <th className="text-left px-4 py-3 font-medium">TNA</th>
              <th className="text-left px-4 py-3 font-medium">Plazo máx.</th>
              <th className="text-left px-4 py-3 font-medium">Lotes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.location ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.basePrice ? `USD ${p.basePrice}` : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.tna ? `${p.tna}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.maxFinancingMonths ? `${p.maxFinancingMonths} meses` : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.totalLots ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <EditProjectDialog project={p} />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No hay proyectos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
