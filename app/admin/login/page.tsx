import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { PageFrame } from "@/components/layout/PageFrame";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <PageFrame>
      <h1 className="font-display text-3xl font-bold text-periwinkle">Admin</h1>
      <p className="mt-2 text-ink-muted">Sign in to review submissions and manage listings.</p>
      <div className="mt-8">
        <AdminLoginForm />
      </div>
    </PageFrame>
  );
}
