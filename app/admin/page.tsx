import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { PageFrame } from "@/components/layout/PageFrame";
import {
  getAllEventsAdmin,
  getAllShopsAdmin,
  getPendingEvents,
  getPendingShops,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  let userEmail: string | undefined;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  }

  const [pendingEvents, pendingShops, allEvents, allShops] = await Promise.all([
    getPendingEvents(),
    getPendingShops(),
    getAllEventsAdmin(),
    getAllShopsAdmin(),
  ]);

  return (
    <PageFrame className="max-w-7xl">
      <h1 className="font-display text-3xl font-bold text-periwinkle">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {isSupabaseConfigured()
          ? `Signed in as ${userEmail ?? "unknown"}`
          : "Demo mode — configure Supabase for auth and submissions"}
      </p>
      <div className="mt-8">
        <AdminDashboard
          pendingEvents={pendingEvents}
          pendingShops={pendingShops}
          allEvents={allEvents}
          allShops={allShops}
          isAdmin={!isSupabaseConfigured() || isAdminEmail(userEmail)}
        />
      </div>
    </PageFrame>
  );
}
