import Link from "next/link";
import { LayoutDashboard, FileText, ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al sitio
          </Link>
          <span className="text-muted-foreground">|</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4" />
              Blog
            </Link>
          </nav>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
