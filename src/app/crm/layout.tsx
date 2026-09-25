import { CrmProvider } from "@/components/crm/crm-context";
import { CrmSidebar } from "@/components/crm/crm-sidebar";
import { requireCrmUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await requireCrmUser();

  return (
    <CrmProvider role={role}>
      <div className="min-h-screen bg-background text-foreground">
        <CrmSidebar />
        {/* Desktop: offset for sidebar. Mobile: offset for top bar */}
        <div className="md:pl-56 pt-14 md:pt-0">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </CrmProvider>
  );
}
