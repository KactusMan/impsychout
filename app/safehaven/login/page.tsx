import { authConfigured } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sign in" };

export default function Login() {
  return (
    <main className="sh-login">
      <div className="sh-login__card">
        <p className="sh-brand">im psych out</p>
        <h1>Safe Haven</h1>
        <p className="sh-muted">Your private space to edit the website.</p>
        {authConfigured() ? (
          <LoginForm />
        ) : (
          <div className="sh-alert">
            <b>Almost ready.</b> Add <code>SAFEHAVEN_PASSWORD</code> and <code>SAFEHAVEN_SECRET</code> in Vercel
            (Project → Settings → Environment Variables), then redeploy.
          </div>
        )}
      </div>
    </main>
  );
}
