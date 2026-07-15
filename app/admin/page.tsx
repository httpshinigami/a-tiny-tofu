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

// check who’s signed in and grab their email — used later to decide if they can use admin stuff
export default async function AdminPage() {
  let userEmail: string | undefined;
  // only try login lookup if Supabase is set up
  if (isSupabaseConfigured()) {
    // connects to Supabase
    const supabase = await createClient();
    const {
      data: { user },
    // asks Supabase “is someone logged in?”
    } = await supabase.auth.getUser();
    // if yes, save their email; if not, leave it empty
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
      <h1 className="font-display text-3xl font-bold text-cocoa">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {isSupabaseConfigured()
        // show "unknown" only if user.email is missing — successful login should always show the real email
          ? `Signed in as ${userEmail ?? "unknown"}`
          // If Supabase isn’t set up → show the demo-mode message
          : "Demo mode — configure Supabase for auth and submissions"}
      </p>
      <div className="mt-8">
        <AdminDashboard
          pendingEvents={pendingEvents}
          pendingShops={pendingShops}
          allEvents={allEvents}
          allShops={allShops}
          // in demo mode → everyone is admin; otherwise only allowlisted emails in Supabase
          isAdmin={!isSupabaseConfigured() || isAdminEmail(userEmail)}
        />
      </div>
    </PageFrame>
  );
}
