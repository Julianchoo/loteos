"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCrm, withProject } from "@/components/crm/crm-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import {
  LEAD_CHANNEL_LABELS,
  LEAD_CHANNELS,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
} from "@/lib/lead-status";
import type { LeadStatus } from "@/lib/lead-status";

type LeadChannel = (typeof LEAD_CHANNELS)[number];

type LeadRow = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  contactChannel: string;
  marketingSource: string | null;
  marketingCampaign: string | null;
  initialMessage: string | null;
  projectNames: string | null;
  anticipoAmount: string | null;
  plazoMonths: string | null;
  calculatedCuota: string | null;
  interestedPrice: string | null;
  status: LeadStatus;
  notes: string | null;
  asignadoA: string | null;
  asignadoNombre: string | null;
  dniCuit: string | null;
  domicilio: string | null;
  nacionalidad: string | null;
  fechaNacimiento: string | null;
  estadoCivil: string | null;
  cuitComprador: string | null;
  createdAt: string;
};

type UsuarioRow = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  interested: "bg-purple-100 text-purple-700",
  visit_scheduled: "bg-orange-100 text-orange-700",
  proposal_sent: "bg-indigo-100 text-indigo-700",
  sold: "bg-green-100 text-green-700",
  lost: "bg-muted text-muted-foreground",
};

function statusColor(status: string) {
  return statusColors[status as LeadStatus] ?? "bg-muted text-muted-foreground";
}

function statusLabel(status: string) {
  return LEAD_STATUS_LABELS[status as LeadStatus] ?? status;
}

function leadNombre(lead: Pick<LeadRow, "firstName" | "lastName">) {
  return `${lead.firstName} ${lead.lastName}`.trim();
}

const EMPTY_CREATE_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  contactChannel: "in_person" as LeadChannel,
  initialMessage: "",
  dniCuit: "",
  domicilio: "",
  nacionalidad: "",
  fechaNacimiento: "",
  estadoCivil: "",
  cuitComprador: "",
  notes: "",
};

export default function LeadsPage() {
  const { data: session } = useSession();
  const { isAdmin, projectId } = useCrm();
  const canEditLead = (lead: LeadRow) => isAdmin || lead.asignadoA === session?.user?.id;

  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkEstado, setBulkEstado] = useState<LeadStatus | "">("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const lastCheckedIndexRef = useRef<number | null>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [editLead, setEditLead] = useState<LeadRow | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    contactChannel: "in_person" as LeadChannel,
    marketingSource: "",
    marketingCampaign: "",
    dniCuit: "",
    domicilio: "",
    nacionalidad: "",
    fechaNacimiento: "",
    estadoCivil: "",
    cuitComprador: "",
    notes: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [createSaving, setCreateSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/crm/usuarios")
        .then((r) => r.json())
        .then(setUsuarios)
        .catch(() => {});
    }
  }, [isAdmin]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = withProject(new URLSearchParams(), projectId);
    if (filterEstado !== "all") params.set("status", filterEstado);
    const res = await fetch(`/api/crm/leads?${params}`);
    const data = await res.json();
    setLeads(data);
    setSelected(new Set());
    lastCheckedIndexRef.current = null;
    setLoading(false);
  }, [filterEstado, projectId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleEstadoChange = async (id: string, status: LeadStatus) => {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setLeads(prev);
      toast.error("No se pudo actualizar el estado");
    }
  };

  const handleAsignacionChange = async (id: string, userId: string | null) => {
    const prev = leads;
    const usuarioNombre = userId
      ? (usuarios.find((u) => u.id === userId)?.name ?? null)
      : null;
    setLeads((ls) =>
      ls.map((l) =>
        l.id === id
          ? { ...l, asignadoA: userId, asignadoNombre: usuarioNombre }
          : l
      )
    );
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asignadoA: userId }),
    });
    if (!res.ok) {
      setLeads(prev);
      toast.error("No se pudo asignar el lead");
    }
  };

  const handleCheckbox = (id: string, index: number, shiftKey: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shiftKey && lastCheckedIndexRef.current !== null) {
        const from = Math.min(lastCheckedIndexRef.current, index);
        const to = Math.max(lastCheckedIndexRef.current, index);
        const isSelecting = !prev.has(id);
        for (let i = from; i <= to; i++) {
          const lead = leads[i];
          if (!lead) continue;
          if (isSelecting) next.add(lead.id);
          else next.delete(lead.id);
        }
      } else {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      }
      return next;
    });
    lastCheckedIndexRef.current = index;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(new Set(leads.map((l) => l.id)));
    } else {
      setSelected(new Set());
    }
    lastCheckedIndexRef.current = null;
  };

  const handleBulkUpdate = async () => {
    if (!bulkEstado || selected.size === 0) return;
    setBulkLoading(true);
    const ids = Array.from(selected);
    const prev = leads;
    setLeads((ls) =>
      ls.map((l) => (selected.has(l.id) ? { ...l, status: bulkEstado as LeadStatus } : l))
    );
    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`/api/crm/leads/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: bulkEstado }),
          })
        )
      );
      const failed = results.filter((r) => !r.ok).length;
      if (failed > 0) {
        setLeads(prev);
        toast.error(`${failed} actualizacion(es) fallaron`);
      } else {
        toast.success(`${ids.length} lead(s) actualizados`);
        setSelected(new Set());
        setBulkEstado("");
      }
    } catch {
      setLeads(prev);
      toast.error("Error al actualizar");
    } finally {
      setBulkLoading(false);
    }
  };

  function openEditDialog(lead: LeadRow) {
    setEditLead(lead);
    setEditForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      phone: lead.phone ?? "",
      email: lead.email,
      contactChannel: lead.contactChannel as LeadChannel,
      marketingSource: lead.marketingSource ?? "",
      marketingCampaign: lead.marketingCampaign ?? "",
      dniCuit: lead.dniCuit ?? "",
      domicilio: lead.domicilio ?? "",
      nacionalidad: lead.nacionalidad ?? "",
      fechaNacimiento: lead.fechaNacimiento ?? "",
      estadoCivil: lead.estadoCivil ?? "",
      cuitComprador: lead.cuitComprador ?? "",
      notes: lead.notes ?? "",
    });
  }

  async function handleEditSave() {
    if (!editLead) return;
    setEditSaving(true);
    // Only send changed fields
    const changed: Record<string, string | null> = {};
    if (editForm.firstName !== editLead.firstName) changed.firstName = editForm.firstName;
    if (editForm.lastName !== editLead.lastName) changed.lastName = editForm.lastName;
    if (editForm.phone !== (editLead.phone ?? "")) changed.phone = editForm.phone;
    if (editForm.email !== editLead.email) changed.email = editForm.email;
    if (editForm.contactChannel !== editLead.contactChannel) changed.contactChannel = editForm.contactChannel;
    if (editForm.marketingSource !== (editLead.marketingSource ?? "")) changed.marketingSource = editForm.marketingSource || null;
    if (editForm.marketingCampaign !== (editLead.marketingCampaign ?? "")) changed.marketingCampaign = editForm.marketingCampaign || null;
    if (editForm.dniCuit !== (editLead.dniCuit ?? "")) changed.dniCuit = editForm.dniCuit || null;
    if (editForm.domicilio !== (editLead.domicilio ?? "")) changed.domicilio = editForm.domicilio || null;
    if (editForm.nacionalidad !== (editLead.nacionalidad ?? "")) changed.nacionalidad = editForm.nacionalidad || null;
    if (editForm.fechaNacimiento !== (editLead.fechaNacimiento ?? "")) changed.fechaNacimiento = editForm.fechaNacimiento || null;
    if (editForm.estadoCivil !== (editLead.estadoCivil ?? "")) changed.estadoCivil = editForm.estadoCivil || null;
    if (editForm.cuitComprador !== (editLead.cuitComprador ?? "")) changed.cuitComprador = editForm.cuitComprador || null;
    if (editForm.notes !== (editLead.notes ?? "")) changed.notes = editForm.notes || null;

    if (Object.keys(changed).length === 0) {
      setEditLead(null);
      setEditSaving(false);
      return;
    }

    const res = await fetch(`/api/crm/leads/${editLead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changed),
    });
    if (res.ok) {
      setLeads((ls) =>
        ls.map((l) =>
          l.id === editLead.id
            ? {
                ...l,
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                phone: editForm.phone || null,
                email: editForm.email,
                contactChannel: editForm.contactChannel,
                marketingSource: editForm.marketingSource || null,
                marketingCampaign: editForm.marketingCampaign || null,
                dniCuit: editForm.dniCuit || null,
                domicilio: editForm.domicilio || null,
                nacionalidad: editForm.nacionalidad || null,
                fechaNacimiento: editForm.fechaNacimiento || null,
                estadoCivil: editForm.estadoCivil || null,
                cuitComprador: editForm.cuitComprador || null,
                notes: editForm.notes || null,
              }
            : l
        )
      );
      toast.success("Lead actualizado");
      setEditLead(null);
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(data?.error ?? "Error al actualizar el lead");
    }
    setEditSaving(false);
  }

  async function handleCreateSave() {
    if (!canCreate) return;
    setCreateSaving(true);
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        phone: createForm.phone,
        email: createForm.email,
        contactChannel: createForm.contactChannel,
        initialMessage: createForm.initialMessage || null,
        dniCuit: createForm.dniCuit || null,
        domicilio: createForm.domicilio || null,
        nacionalidad: createForm.nacionalidad || null,
        fechaNacimiento: createForm.fechaNacimiento || null,
        estadoCivil: createForm.estadoCivil || null,
        cuitComprador: createForm.cuitComprador || null,
        notes: createForm.notes || null,
      }),
    });
    if (res.ok) {
      toast.success("Lead creado");
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE_FORM);
      fetchLeads();
    } else {
      toast.error("Error al crear el lead");
    }
    setCreateSaving(false);
  }

  async function handleDeleteLead(lead: LeadRow) {
    if (!isAdmin) return;
    if (!window.confirm(`Borrar el lead de ${leadNombre(lead)}?`)) return;

    setDeletingId(lead.id);
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLeads((ls) => ls.filter((l) => l.id !== lead.id));
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(lead.id);
          return next;
        });
        toast.success("Lead borrado");
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error(data?.error ?? "No se pudo borrar el lead");
    } catch {
      toast.error("No se pudo borrar el lead");
    } finally {
      setDeletingId(null);
    }
  }

  const allSelected = leads.length > 0 && selected.size === leads.length;
  const someSelected = selected.size > 0 && selected.size < leads.length;
  const colCount = 11;
  const canCreate = Boolean(
    createForm.firstName.trim() &&
      createForm.lastName.trim() &&
      createForm.phone.trim() &&
      createForm.email.trim()
  );

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consultas del sitio web y leads cargados por el equipo comercial
          {!loading && ` · ${leads.length} en total`}
        </p>
      </div>

      <div className="flex gap-3">
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo lead
        </Button>
        <Select value={filterEstado} onValueChange={setFilterEstado}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {LEAD_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-background overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                  className="size-4 cursor-pointer accent-primary"
                />
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Canal / fuente</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: colCount }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : leads.map((lead, index) => (
                  <TableRow
                    key={lead.id}
                    data-state={selected.has(lead.id) ? "selected" : undefined}
                    className={selected.has(lead.id) ? "bg-blue-50" : undefined}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selected.has(lead.id)}
                        onChange={(e) => handleCheckbox(lead.id, index, (e.nativeEvent as MouseEvent).shiftKey)}
                        aria-label={`Seleccionar ${leadNombre(lead)}`}
                        className="size-4 cursor-pointer accent-primary"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{leadNombre(lead)}</TableCell>
                    <TableCell className="text-sm">{lead.phone ?? "—"}</TableCell>
                    <TableCell className="text-sm">{lead.email}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {LEAD_CHANNEL_LABELS[lead.contactChannel as LeadChannel] ?? lead.contactChannel}
                      {lead.marketingSource && (
                        <span className="block text-xs text-muted-foreground">{lead.marketingSource}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.projectNames ?? "—"}
                      {lead.calculatedCuota && (
                        <span className="block text-xs text-muted-foreground whitespace-nowrap">
                          Cuota USD {lead.calculatedCuota}
                          {lead.plazoMonths ? ` · ${lead.plazoMonths}m` : ""}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {lead.initialMessage ?? "—"}
                    </TableCell>
                    <TableCell>
                      {canEditLead(lead) ? (
                        <Select
                          value={lead.status}
                          onValueChange={(v) =>
                            handleEstadoChange(lead.id, v as LeadStatus)
                          }
                        >
                          <SelectTrigger className="h-7 w-36 text-xs border-0 p-0 shadow-none focus:ring-0">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(lead.status)}`}
                            >
                              {statusLabel(lead.status)}
                            </span>
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {LEAD_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {LEAD_STATUS_LABELS[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(lead.status)}`}>
                          {statusLabel(lead.status)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isAdmin ? (
                        <Select
                          value={lead.asignadoA ?? "__none__"}
                          onValueChange={(v) =>
                            handleAsignacionChange(lead.id, v === "__none__" ? null : v)
                          }
                        >
                          <SelectTrigger className="h-7 w-40 text-xs">
                            <SelectValue placeholder="Sin asignar" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="__none__">
                              <span className="text-muted-foreground">— Sin asignar —</span>
                            </SelectItem>
                            {usuarios.map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {u.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {lead.asignadoNombre ?? "—"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {canEditLead(lead) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(lead)}
                            aria-label={`Editar ${leadNombre(lead)}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLead(lead)}
                            disabled={deletingId === lead.id}
                            aria-label={`Borrar ${leadNombre(lead)}`}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {!loading && leads.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No hay leads aún
          </p>
        )}
      </div>

      {/* Create lead dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) setCreateOpen(false); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="create-firstName">Nombre *</Label>
              <Input id="create-firstName" value={createForm.firstName} onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-lastName">Apellido *</Label>
              <Input id="create-lastName" value={createForm.lastName} onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-phone">Teléfono *</Label>
              <Input id="create-phone" value={createForm.phone} onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-email">Email *</Label>
              <Input id="create-email" type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-contactChannel">Canal de contacto</Label>
              <Select
                value={createForm.contactChannel}
                onValueChange={(v) => setCreateForm((f) => ({ ...f, contactChannel: v as LeadChannel }))}
              >
                <SelectTrigger id="create-contactChannel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_CHANNELS.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {LEAD_CHANNEL_LABELS[channel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-dniCuit">DNI / CUIT</Label>
              <Input id="create-dniCuit" value={createForm.dniCuit} onChange={(e) => setCreateForm((f) => ({ ...f, dniCuit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-domicilio">Domicilio</Label>
              <Input id="create-domicilio" value={createForm.domicilio} onChange={(e) => setCreateForm((f) => ({ ...f, domicilio: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-nacionalidad">Nacionalidad</Label>
              <Input id="create-nacionalidad" value={createForm.nacionalidad} onChange={(e) => setCreateForm((f) => ({ ...f, nacionalidad: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-fechaNacimiento">Fecha de nacimiento</Label>
              <Input id="create-fechaNacimiento" type="date" value={createForm.fechaNacimiento} onChange={(e) => setCreateForm((f) => ({ ...f, fechaNacimiento: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-estadoCivil">Estado civil</Label>
              <Input id="create-estadoCivil" value={createForm.estadoCivil} onChange={(e) => setCreateForm((f) => ({ ...f, estadoCivil: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-cuitComprador">CUIT comprador</Label>
              <Input id="create-cuitComprador" value={createForm.cuitComprador} onChange={(e) => setCreateForm((f) => ({ ...f, cuitComprador: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-initialMessage">Mensaje</Label>
              <Textarea id="create-initialMessage" rows={2} value={createForm.initialMessage} onChange={(e) => setCreateForm((f) => ({ ...f, initialMessage: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="create-notes">Notas</Label>
              <Textarea id="create-notes" rows={2} value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateSave} disabled={createSaving || !canCreate}>
              {createSaving ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit lead dialog */}
      <Dialog open={editLead !== null} onOpenChange={(open) => { if (!open) setEditLead(null); }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {editLead && (editLead.initialMessage || editLead.projectNames || editLead.calculatedCuota) && (
              <div className="space-y-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {editLead.projectNames && (
                  <p>
                    <span className="text-muted-foreground">Proyecto de interés: </span>
                    {editLead.projectNames}
                  </p>
                )}
                {editLead.calculatedCuota && (
                  <p>
                    <span className="text-muted-foreground">Financiación simulada: </span>
                    {[
                      editLead.interestedPrice && `precio USD ${editLead.interestedPrice}`,
                      editLead.anticipoAmount && `anticipo USD ${editLead.anticipoAmount}`,
                      editLead.plazoMonths && `${editLead.plazoMonths} meses`,
                      `cuota USD ${editLead.calculatedCuota}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {editLead.initialMessage && (
                  <p className="whitespace-pre-wrap">
                    <span className="text-muted-foreground">Mensaje: </span>
                    {editLead.initialMessage}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="edit-firstName">Nombre</Label>
              <Input id="edit-firstName" value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-lastName">Apellido</Label>
              <Input id="edit-lastName" value={editForm.lastName} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Teléfono</Label>
              <Input id="edit-phone" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-contactChannel">Canal de contacto</Label>
              <Select
                value={editForm.contactChannel}
                onValueChange={(v) => setEditForm((f) => ({ ...f, contactChannel: v as LeadChannel }))}
              >
                <SelectTrigger id="edit-contactChannel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_CHANNELS.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {LEAD_CHANNEL_LABELS[channel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-marketingSource">Fuente</Label>
                <Input id="edit-marketingSource" value={editForm.marketingSource} onChange={(e) => setEditForm((f) => ({ ...f, marketingSource: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-marketingCampaign">Campaña</Label>
                <Input id="edit-marketingCampaign" value={editForm.marketingCampaign} onChange={(e) => setEditForm((f) => ({ ...f, marketingCampaign: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-dniCuit">DNI / CUIT</Label>
              <Input id="edit-dniCuit" value={editForm.dniCuit} onChange={(e) => setEditForm((f) => ({ ...f, dniCuit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-domicilio">Domicilio</Label>
              <Input id="edit-domicilio" value={editForm.domicilio} onChange={(e) => setEditForm((f) => ({ ...f, domicilio: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-nacionalidad">Nacionalidad</Label>
              <Input id="edit-nacionalidad" value={editForm.nacionalidad} onChange={(e) => setEditForm((f) => ({ ...f, nacionalidad: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-fechaNacimiento">Fecha de nacimiento</Label>
              <Input id="edit-fechaNacimiento" type="date" value={editForm.fechaNacimiento} onChange={(e) => setEditForm((f) => ({ ...f, fechaNacimiento: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-estadoCivil">Estado civil</Label>
              <Input id="edit-estadoCivil" value={editForm.estadoCivil} onChange={(e) => setEditForm((f) => ({ ...f, estadoCivil: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-cuitComprador">CUIT comprador</Label>
              <Input id="edit-cuitComprador" value={editForm.cuitComprador} onChange={(e) => setEditForm((f) => ({ ...f, cuitComprador: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-notes">Notas</Label>
              <Textarea id="edit-notes" rows={3} value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLead(null)}>Cancelar</Button>
            <Button onClick={handleEditSave} disabled={editSaving}>
              {editSaving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border bg-background px-5 py-3 shadow-xl">
          <span className="text-sm font-medium text-foreground">
            {selected.size} seleccionado{selected.size !== 1 ? "s" : ""}
          </span>
          <Select value={bulkEstado} onValueChange={(v) => setBulkEstado(v as LeadStatus)}>
            <SelectTrigger className="h-8 w-40 text-sm">
              <SelectValue placeholder="Cambiar estado..." />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleBulkUpdate}
            disabled={!bulkEstado || bulkLoading}
          >
            {bulkLoading ? "Aplicando..." : "Aplicar"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setSelected(new Set()); setBulkEstado(""); }}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
