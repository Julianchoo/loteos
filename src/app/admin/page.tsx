import Link from "next/link";
import { Building2, FileText, Users, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/blog">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Blog
              </CardTitle>
              <CardDescription>Crear, editar y publicar artículos del blog</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestioná los posts del blog desde acá.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Usuarios
              </CardTitle>
              <CardDescription>Crear y gestionar usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Agregá admins u otros usuarios desde acá.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/proyectos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Proyectos
              </CardTitle>
              <CardDescription>Ver y editar datos de los proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Editá precios, financiación y datos clave de cada proyecto.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/leads">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Leads
              </CardTitle>
              <CardDescription>Ver todos los contactos recibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consultá los leads con su estado, canal y proyecto de interés.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
