import Link from "next/link";
import { TreePine } from "lucide-react";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <TreePine className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Fitzroya Desarrollos
            </span>
          </Link>
          <h1 className="text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ingresá con tu cuenta para continuar
          </p>
        </div>

        {/* Form */}
        <div className="bg-background border rounded-xl p-6 shadow-sm">
          <SignInButton />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
