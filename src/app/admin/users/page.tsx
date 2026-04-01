import { requireAdmin } from "@/lib/session";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(user.createdAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <CreateUserDialog />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Rol</th>
              <th className="text-left px-4 py-3 font-medium">Verificado</th>
              <th className="text-left px-4 py-3 font-medium">Creado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                    {u.role === "admin" ? "Admin" : "Usuario"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.emailVerified ? "default" : "outline"} className="text-xs">
                    {u.emailVerified ? "Sí" : "No"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
