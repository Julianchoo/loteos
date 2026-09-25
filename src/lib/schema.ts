import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  numeric,
  integer,
  date,
} from "drizzle-orm/pg-core";

// IMPORTANT! ID fields should ALWAYS use UUID types, EXCEPT the BetterAuth tables.

// ─── CRM Enums ────────────────────────────────────────────────────────────────

export const estadoLoteEnum = pgEnum("estado_lote", [
  "disponible",
  "no_disponible",
  "reservado",
  "vendido",
]);

export const estadoReservaEnum = pgEnum("estado_reserva", [
  "activa",
  "cancelada",
  "vencida",
  "realizada",
]);

export const modalidadContratoEnum = pgEnum("modalidad_contrato", [
  "usd_fijo",
  "pesos_cac",
  "requiere_revision",
]);

export const estadoCuotaEnum = pgEnum("estado_cuota", [
  "pendiente",
  "pendiente_indice",
  "parcial",
  "pagada",
  "vencida",
  "calculada",
  "proyectada",
  "parcial_vencida",
  "cancelada",
]);

export const monedaPagoEnum = pgEnum("moneda_pago", ["usd", "ars"]);

export const estadoPagoEnum = pgEnum("estado_pago", ["activo", "anulado"]);


export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role").default("user").notNull(), // "user" | "admin" | "comercial"
    mustChangePassword: boolean("must_change_password").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  totalArea: text("total_area"),
  totalLots: text("total_lots"),
  isVisible: boolean("is_visible").default(true).notNull(),

  // Pricing and Financing Configuration (synced from Airtable)
  basePrice: numeric("base_price", { precision: 10, scale: 2 }), // Base price in USD
  minCashDown: numeric("min_cash_down", { precision: 10, scale: 2 }), // Minimum down payment in USD
  maxFinancingMonths: integer("max_financing_months"), // Maximum financing term in months
  tna: numeric("tna", { precision: 5, scale: 4 }), // Annual interest rate (e.g., 0.1500 for 15%)

  // Airtable sync tracking
  airtableRecordId: text("airtable_record_id"),
  lastSyncedAt: timestamp("last_synced_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const lot = pgTable(
  "lot",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    size: text("size").notNull(), // e.g., "300m2"
    price: text("price").notNull(), // e.g., "17500"
    // Legacy public-map status (available, reserved, sold). The CRM keeps it in
    // sync with `estado`, which is the source of truth.
    status: text("status").notNull().default("available"),
    image: text("image"),
    coordinates: text("coordinates"), // for clickable map areas

    // CRM: estado comercial
    estado: estadoLoteEnum("estado").default("disponible").notNull(),

    // CRM: datos catastrales
    circunscripcion: text("circunscripcion"),
    seccion: text("seccion"),
    manzana: text("manzana"),
    parcela: text("parcela"),
    partidaArba: text("partida_arba"),
    partidaMunicipal: text("partida_municipal"),
    escritura: text("escritura"),
    matriculaFolio: text("matricula_folio"),
    certificadoCatastral: text("certificado_catastral"),
    valuacionFiscal: numeric("valuacion_fiscal"),
    vfAlActo: numeric("vf_al_acto"),
    superficieM2: numeric("superficie_m2"),
    metrosFrente: numeric("metros_frente"),
    metrosFondo: numeric("metros_fondo"),
    calleFrente: text("calle_frente"),
    calleLindera1: text("calle_lindera_1"),
    calleLindera2: text("calle_lindera_2"),

    // CRM: pricing
    precioBase: numeric("precio_base"),
    precioEtapa1: numeric("precio_etapa1"),
    valorM2: numeric("valor_m2"),
    anticipoPct: numeric("anticipo_pct"),
    tasaMensual: numeric("tasa_mensual"),
    anticipoUsd: numeric("anticipo_usd"),
    saldoUsd: numeric("saldo_usd"),
    cuotas48: numeric("cuotas_48"),
    cuotas60: numeric("cuotas_60"),
    nota: text("nota"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("lot_project_idx").on(table.projectId),
    index("lot_estado_idx").on(table.estado),
    index("lot_manzana_idx").on(table.manzana),
  ]
);

export const contactRequest = pgTable("contact_request", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  lotId: text("lot_id").references(() => lot.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lead Management System Tables
export const lead = pgTable(
  "lead",
  {
    id: text("id").primaryKey(),

    // Contact Information
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),

    // Lead Source & Attribution
    contactChannel: text("contact_channel").notNull(), // web_form_general, web_form_project, whatsapp, phone, in_person
    marketingSource: text("marketing_source"), // facebook, google, instagram, referral, organic
    marketingCampaign: text("marketing_campaign"),

    // Lead Status
    status: text("status").notNull().default("new"), // new, contacted, interested, visit_scheduled, proposal_sent, sold, lost

    // Content
    initialMessage: text("initial_message"),
    notes: text("notes"),

    // CRM: comercial asignado y datos personales del comprador
    asignadoA: text("asignado_a").references(() => user.id, { onDelete: "set null" }),
    dniCuit: text("dni_cuit"),
    domicilio: text("domicilio"),
    nacionalidad: text("nacionalidad"),
    fechaNacimiento: date("fecha_nacimiento"),
    estadoCivil: text("estado_civil"),
    cuitComprador: text("cuit_comprador"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    // Airtable Sync
    airtableRecordId: text("airtable_record_id"),
    lastSyncedAt: timestamp("last_synced_at"),
    syncStatus: text("sync_status").default("pending"), // pending, synced, error
    syncError: text("sync_error"),
  },
  (table) => [
    index("lead_email_idx").on(table.email),
    index("lead_status_idx").on(table.status),
    index("lead_channel_idx").on(table.contactChannel),
    index("lead_created_at_idx").on(table.createdAt),
    index("lead_sync_status_idx").on(table.syncStatus),
    index("lead_asignado_a_idx").on(table.asignadoA),
  ]
);

export const leadFinancingPreference = pgTable(
  "lead_financing_preference",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),

    anticipoAmount: text("anticipo_amount").notNull(), // Down payment (USD)
    plazoMonths: text("plazo_months").notNull(), // Financing term (months)
    calculatedCuota: text("calculated_cuota").notNull(), // Monthly payment (USD)
    interestedPrice: text("interested_price"), // Total lot price

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("lead_financing_lead_id_idx").on(table.leadId)]
);

export const leadProject = pgTable(
  "lead_project",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    interestLevel: text("interest_level"), // high, medium, low
    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("lead_project_lead_idx").on(table.leadId),
    index("lead_project_project_idx").on(table.projectId),
  ]
);

export const blogPost = pgTable(
  "blog_post",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""), // HTML from Tiptap
    featuredImageUrl: text("featured_image_url"),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    status: text("status").notNull().default("draft"), // "draft" | "published"
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("blog_post_slug_idx").on(table.slug),
    index("blog_post_status_idx").on(table.status),
    index("blog_post_author_idx").on(table.authorId),
  ]
);

// ─── CRM Tables ───────────────────────────────────────────────────────────────
// Lote → reserva (con lead) → contrato → cuotas / pagos. Las cuentas corrientes
// se ajustan por dólar BNA (tipos_cambio) o por índice CAC (indices_cac).

export const reservas = pgTable(
  "reservas",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    lotId: text("lot_id")
      .notNull()
      .references(() => lot.id, { onDelete: "cascade" }),
    leadId: text("lead_id").references(() => lead.id, { onDelete: "set null" }),
    estado: estadoReservaEnum("estado").default("activa").notNull(),

    nombreComprador: text("nombre_comprador"),
    dniCuit: text("dni_cuit"),
    telefono: text("telefono"),
    emailComprador: text("email_comprador"),
    domicilioComprador: text("domicilio_comprador"),
    nacionalidad: text("nacionalidad"),
    fechaNacimiento: date("fecha_nacimiento"),
    estadoCivil: text("estado_civil"),
    cuitComprador: text("cuit_comprador"),

    nombreCoComprador: text("nombre_co_comprador"),
    dniCoComprador: text("dni_co_comprador"),
    nacionalidadCoComprador: text("nacionalidad_co_comprador"),
    fechaNacimientoCoComprador: date("fecha_nacimiento_co_comprador"),
    domicilioCoComprador: text("domicilio_co_comprador"),
    cuitCoComprador: text("cuit_co_comprador"),
    estadoCivilCoComprador: text("estado_civil_co_comprador"),
    porcentajeCoComprador: text("porcentaje_co_comprador"),

    tipoEntrega: text("tipo_entrega"),
    mesEntrega: text("mes_entrega"),
    anioEntrega: text("anio_entrega"),
    nombreCorredor: text("nombre_corredor"),
    emailCorredor: text("email_corredor"),
    formaPago: text("forma_pago"),
    fechaReserva: date("fecha_reserva"),
    fechaVencimiento: date("fecha_vencimiento"),
    fechaFirma: date("fecha_firma"),
    modificadoPor: text("modificado_por"),
    reservadoPor: text("reservado_por"),
    observaciones: text("observaciones"),

    precioTotalPalabras: text("precio_total_palabras"),
    precioTotalNum: text("precio_total_num"),
    reservaPalabras: text("reserva_palabras"),
    reservaNum: text("reserva_num"),
    anticipoPalabras: text("anticipo_palabras"),
    anticipoNum: text("anticipo_num"),
    saldoPalabras: text("saldo_palabras"),
    saldoNum: text("saldo_num"),
    cantidadCuotas: text("cantidad_cuotas"),
    cuotaMensualPalabras: text("cuota_mensual_palabras"),
    cuotaMensual: text("cuota_mensual"),
    modalidadContrato: modalidadContratoEnum("modalidad_contrato"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("reservas_lot_idx").on(table.lotId),
    index("reservas_lead_idx").on(table.leadId),
    uniqueIndex("reservas_active_lot_idx")
      .on(table.lotId)
      .where(sql`${table.estado} = 'activa'`),
  ]
);

export const contratos = pgTable(
  "contratos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    reservaId: text("reserva_id")
      .notNull()
      .references(() => reservas.id, { onDelete: "cascade" }),
    modalidad: modalidadContratoEnum("modalidad").notNull(),
    fechaInicio: date("fecha_inicio").notNull(),
    fechaPrimerVencimiento: date("fecha_primer_vencimiento").notNull(),
    cantidadCuotas: integer("cantidad_cuotas").notNull(),
    diaVencimiento: integer("dia_vencimiento").notNull(),
    saldoInicial: numeric("saldo_inicial").notNull(),
    cuotaBase: numeric("cuota_base").notNull(),
    monedaBase: monedaPagoEnum("moneda_base").notNull(),
    tipoCambioBna: numeric("tipo_cambio_bna"),
    periodoBaseCac: text("periodo_base_cac"),
    indiceBaseCac: numeric("indice_base_cac"),
    requiereRevision: boolean("requiere_revision").default(false).notNull(),
    observaciones: text("observaciones"),
    creadoPor: text("creado_por"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("contratos_reserva_idx").on(table.reservaId),
    index("contratos_modalidad_idx").on(table.modalidad),
  ]
);

export const cuotas = pgTable(
  "cuotas",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    contratoId: text("contrato_id")
      .notNull()
      .references(() => contratos.id, { onDelete: "cascade" }),
    numero: integer("numero").notNull(),
    fechaVencimiento: date("fecha_vencimiento").notNull(),
    periodoCac: text("periodo_cac"),
    indiceCac: numeric("indice_cac"),
    importeBase: numeric("importe_base").notNull(),
    importeAjustado: numeric("importe_ajustado"),
    moneda: monedaPagoEnum("moneda").notNull(),
    saldo: numeric("saldo").notNull(),
    estado: estadoCuotaEnum("estado").default("pendiente").notNull(),
    observaciones: text("observaciones"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("cuotas_contrato_numero_idx").on(table.contratoId, table.numero),
    index("cuotas_contrato_idx").on(table.contratoId),
    index("cuotas_vencimiento_idx").on(table.fechaVencimiento),
    index("cuotas_estado_idx").on(table.estado),
  ]
);

export const pagos = pgTable(
  "pagos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    contratoId: text("contrato_id")
      .notNull()
      .references(() => contratos.id, { onDelete: "cascade" }),
    cuotaId: text("cuota_id").references(() => cuotas.id, { onDelete: "set null" }),
    fechaPago: date("fecha_pago").notNull(),
    monto: numeric("monto").notNull(),
    moneda: monedaPagoEnum("moneda").notNull(),
    tipoCambioAplicado: numeric("tipo_cambio_aplicado"),
    montoUsd: numeric("monto_usd"),
    medio: text("medio"),
    observacion: text("observacion"),
    comprobanteUrl: text("comprobante_url"),
    comprobantePathname: text("comprobante_pathname"),
    comprobanteNombre: text("comprobante_nombre"),
    estado: estadoPagoEnum("estado").default("activo").notNull(),
    creadoPor: text("creado_por"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("pagos_contrato_idx").on(table.contratoId),
    index("pagos_cuota_idx").on(table.cuotaId),
    index("pagos_fecha_idx").on(table.fechaPago),
  ]
);

export const tiposCambio = pgTable(
  "tipos_cambio",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    fecha: date("fecha").notNull(),
    tipo: text("tipo").default("bna_vendedor").notNull(),
    valor: numeric("valor").notNull(),
    fuente: text("fuente"),
    creadoPor: text("creado_por"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("tipos_cambio_fecha_tipo_idx").on(table.fecha, table.tipo)]
);

export const indicesCac = pgTable(
  "indices_cac",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    periodo: text("periodo").notNull(),
    valor: numeric("valor").notNull(),
    fuente: text("fuente"),
    nota: text("nota"),
    creadoPor: text("creado_por"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("indices_cac_periodo_idx").on(table.periodo)]
);

// ─── CRM Types ────────────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type Project = typeof project.$inferSelect;
export type Lot = typeof lot.$inferSelect;
export type Lead = typeof lead.$inferSelect;
export type Reserva = typeof reservas.$inferSelect;
export type Contrato = typeof contratos.$inferSelect;
export type Cuota = typeof cuotas.$inferSelect;
export type Pago = typeof pagos.$inferSelect;
export type TipoCambio = typeof tiposCambio.$inferSelect;
export type IndiceCac = typeof indicesCac.$inferSelect;
export type EstadoLote = (typeof estadoLoteEnum.enumValues)[number];
export type EstadoReserva = (typeof estadoReservaEnum.enumValues)[number];
export type ModalidadContrato = (typeof modalidadContratoEnum.enumValues)[number];
export type EstadoCuota = (typeof estadoCuotaEnum.enumValues)[number];
export type MonedaPago = (typeof monedaPagoEnum.enumValues)[number];

/** Lote con los datos de su reserva vigente (activa o realizada), aplanados. */
export type LoteConReserva = Lot &
  Partial<
    Pick<
      Reserva,
      | "leadId"
      | "nombreComprador"
      | "dniCuit"
      | "telefono"
      | "emailComprador"
      | "domicilioComprador"
      | "nacionalidad"
      | "fechaNacimiento"
      | "estadoCivil"
      | "cuitComprador"
      | "nombreCoComprador"
      | "dniCoComprador"
      | "nacionalidadCoComprador"
      | "fechaNacimientoCoComprador"
      | "domicilioCoComprador"
      | "cuitCoComprador"
      | "estadoCivilCoComprador"
      | "porcentajeCoComprador"
      | "tipoEntrega"
      | "mesEntrega"
      | "anioEntrega"
      | "nombreCorredor"
      | "emailCorredor"
      | "formaPago"
      | "fechaReserva"
      | "fechaVencimiento"
      | "fechaFirma"
      | "modificadoPor"
      | "reservadoPor"
      | "observaciones"
      | "precioTotalPalabras"
      | "precioTotalNum"
      | "reservaPalabras"
      | "reservaNum"
      | "anticipoPalabras"
      | "anticipoNum"
      | "saldoPalabras"
      | "saldoNum"
      | "cantidadCuotas"
      | "cuotaMensualPalabras"
      | "cuotaMensual"
      | "modalidadContrato"
    >
  > & {
    projectName: string | null;
    reservaId: string | null;
    reservaEstado?: Reserva["estado"] | null;
    leadStatus?: Lead["status"] | null;
    leadAsignadoA?: string | null;
  };
