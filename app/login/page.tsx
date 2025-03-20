import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login | Personal Branding Website",
  description: "Login to manage your Website Nishi",
};

export default async function LoginPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <LoginForm />
    </div>
  );
}
