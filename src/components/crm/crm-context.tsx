"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CrmProject = { id: string; name: string; isVisible: boolean };

export type CrmRole = "admin" | "comercial";

type CrmContextValue = {
  /** Role of the logged-in CRM user, resolved on the server from the DB. */
  role: CrmRole;
  isAdmin: boolean;
  projects: CrmProject[];
  /** Selected project id; "" means all projects. */
  projectId: string;
  setProjectId: (id: string) => void;
};

const STORAGE_KEY = "crm-project-id";
const ALL = "__all__";

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({ role, children }: { role: CrmRole; children: ReactNode }) {
  const [projects, setProjects] = useState<CrmProject[]>([]);
  const [projectId, setProjectIdState] = useState("");

  useEffect(() => {
    let stored = "";
    try {
      stored = localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      // Storage unavailable: default to all projects.
    }

    fetch("/api/crm/proyectos")
      .then((res) => (res.ok ? (res.json() as Promise<CrmProject[]>) : []))
      .then((rows) => {
        setProjects(rows);
        if (stored && rows.some((row) => row.id === stored)) setProjectIdState(stored);
      })
      .catch(() => setProjects([]));
  }, []);

  function setProjectId(id: string) {
    setProjectIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore storage errors; the selection still applies to this tab.
    }
  }

  return (
    <CrmContext.Provider
      value={{ role, isAdmin: role === "admin", projects, projectId, setProjectId }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const value = useContext(CrmContext);
  if (!value) throw new Error("useCrm must be used inside CrmProvider");
  return value;
}

/** Appends `projectId` to a CRM API query string when a project is selected. */
export function withProject(params: URLSearchParams, projectId: string) {
  if (projectId) params.set("projectId", projectId);
  return params;
}

export function CrmProjectSelector() {
  const { projects, projectId, setProjectId } = useCrm();

  return (
    <Select
      value={projectId || ALL}
      onValueChange={(value) => setProjectId(value === ALL ? "" : value)}
    >
      <SelectTrigger className="w-full" aria-label="Proyecto">
        <SelectValue placeholder="Proyecto" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Todos los proyectos</SelectItem>
        {projects.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.name}
            {item.isVisible ? "" : " (oculto)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
