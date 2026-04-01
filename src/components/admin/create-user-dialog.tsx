"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateUserDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Error al crear el usuario");
        return;
      }
      toast.success("Usuario creado correctamente");
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "user" });
      router.refresh();
    } catch {
      toast.error("Error inesperado al crear el usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo usuario</DialogTitle>
          <DialogDescription>
            Completá los datos para crear una cuenta. El usuario podrá ingresar con estas credenciales.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              minLength={8}
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <Select
              value={form.role}
              onValueChange={(val) => handleChange("role", val)}
              disabled={loading}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
