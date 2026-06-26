import Link from "next/link";
import Image from "next/image";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Image
                src="/images/logo-icon/icon-192x192.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 dark:hidden"
                aria-hidden="true"
              />
              <Image
                src="/images/logo-green-2FBC5B-transparent.png"
                alt=""
                width={40}
                height={40}
                className="hidden h-10 w-10 dark:block"
                aria-hidden="true"
              />
            </div>
            <span className="text-xl font-bold text-[#143827] dark:text-[#2FBC5B]">
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
