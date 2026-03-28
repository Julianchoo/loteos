import os, json
from urllib import request

with open('.env') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            os.environ[k.strip()] = v.strip().strip('"')

token = os.environ.get('AIRTABLE_API_TOKEN')
base = os.environ.get('AIRTABLE_BASE_ID')
table = os.environ.get('AIRTABLE_TICKETS_TABLE_ID')

name = "Crear seccion /guias — contenido informacional SEO"

desc = """OBJETIVO
Crear seccion de guias informacionales en /guias/* para capturar trafico de compradores en etapa temprana de busqueda. Olimpo no tiene nada de esto. Estas paginas son las de menor competencia y mayor potencial para aparecer en Google AI Overviews. Todas son paginas estaticas, sin base de datos.

ESTRUCTURA DE ARCHIVOS
src/app/guias/
  layout.tsx          <- breadcrumb + sidebar de navegacion entre guias
  page.tsx            <- indice de guias
  que-es-un-loteo/page.tsx
  barrio-abierto-vs-cerrado/page.tsx
  como-comprar-un-lote/page.tsx
  sin-expensas-ventajas/page.tsx
  financiar-lote-argentina/page.tsx
  que-infraestructura-debe-tener-un-loteo/page.tsx

---
GUIA 1: /guias/que-es-un-loteo

title: "Que es un Loteo: Guia Completa para Compradores | Fitzroya"
description: "Aprende que es un loteo, como funciona, tipos (abierto vs cerrado), y todo lo que necesitas saber antes de comprar un terreno en Buenos Aires."
Keywords: que es un loteo, loteo definicion, que es un loteo abierto, tipos de loteos Argentina

H1: Que es un loteo: guia completa

Contenido (600-800 palabras):
- Definicion: subdivision de una parcela en lotes individuales con infraestructura basica, para venta con escritura individual.
- Como funciona: desarrollador adquiere terreno, obtiene permisos de subdivision, instala infraestructura, vende con boleto y escritura a cada comprador.
- Tipos: barrio abierto (sin expensas, escritura propia, libertad de construccion) / barrio cerrado (seguridad, amenities, expensas mensuales) / club de campo (lotes grandes, enfoque deportivo).
- Que incluye la infraestructura: calles, red electrica, agua, alumbrado, cordon cuneta. Gas y cloacas dependen del proyecto.
- Diferencia con terreno sin subdividir: en un loteo la subdivision esta aprobada, hay infraestructura garantizada y el proceso de escrituracion es estandar.
- CTA final: link a /proyectos

Schema: Article + FAQPage

---
GUIA 2: /guias/barrio-abierto-vs-cerrado

title: "Barrio Abierto vs Barrio Cerrado: Cual Conviene | Fitzroya"
description: "Comparamos barrio abierto y barrio cerrado: costos, libertad, seguridad y plusvalia. Descubri cual es la mejor opcion segun tu situacion."
Keywords: diferencia barrio abierto y cerrado, barrio cerrado vs abierto, barrio sin expensas ventajas

H1: Barrio abierto vs barrio cerrado: cual te conviene?

Contenido (800-1000 palabras):
- Tabla comparativa al inicio: expensas, seguridad, libertad de construccion, precio de entrada, amenities.
- Seccion Barrio Abierto (300w): sin expensas, escritura propia, libertad total, mantenimiento municipal. Calcular ahorro en 10 anos asumiendo USD 200/mes de expensas = USD 24.000 ahorrados.
- Seccion Barrio Cerrado (300w): seguridad 24hs, amenities, restricciones de construccion, expensas obligatorias, mayor precio de entrada.
- Cual conviene segun caso (200w): hijos y seguridad prioritaria -> cerrado; construir a ritmo propio y ahorrar -> abierto; inversion pura -> abierto tiene menor barrera.
- CTA: link a /proyectos/san-matias como ejemplo de barrio abierto.

Schema: Article

---
GUIA 3: /guias/como-comprar-un-lote

title: "Como Comprar un Lote en Argentina: Paso a Paso | Fitzroya"
description: "Guia completa para comprar un terreno en Argentina: desde definir el presupuesto hasta la escrituracion."
Keywords: como comprar un lote en Argentina, comprar terreno Buenos Aires, documentacion para comprar lote

H1: Como comprar un lote en Argentina: guia paso a paso

Contenido (1000-1200w) en 9 pasos numerados:
1. Definir presupuesto (precio lote + escrituracion 3-5% + impuestos + construccion futura)
2. Elegir zona (GBA norte/oeste/sur, distancia, accesos, servicios)
3. Elegir tipo de barrio (abierto vs cerrado)
4. Elegir desarrollador (antecedentes, proyectos anteriores, situacion legal) <- CTA a /proyectos aqui
5. Verificar estado legal del lote (sin hipotecas, subdivision aprobada, planos visados)
6. Firmar boleto de compraventa (descripcion, precio, plan de pago, fecha escritura, penalidades)
7. Pagar anticipo y cuotas
8. Escrituracion ante escribano, inscripcion en Registro de la Propiedad
9. Inicio de obra: permisos municipales, planos, profesional habilitado

Schema: HowTo con los 9 pasos

---
GUIAS 4, 5 Y 6 (600-800 palabras cada una, estructura similar):

/guias/sin-expensas-ventajas
Keywords: barrio sin expensas ventajas, loteo sin expensas Buenos Aires
Angulo: calculo financiero del ahorro en 10 y 20 anos. Pros y contras honestos.

/guias/financiar-lote-argentina
Keywords: financiar compra lote Argentina, lotes en cuotas, financiacion directa terrenos
Angulo: opciones (desarrollador directo, credito hipotecario, ahorro). Detalle de como funciona la financiacion del desarrollador.

/guias/que-infraestructura-debe-tener-un-loteo
Keywords: que infraestructura debe tener un loteo, servicios barrio loteo
Angulo: checklist tecnico para evaluar un loteo antes de comprar. Que es imprescindible (agua, electricidad, calles) vs deseable (gas, cloacas, internet).

---
INDICE /guias/page.tsx
H1: Guias para compradores de terrenos en Buenos Aires
Parrafo intro (100 palabras)
Grid de cards con las 6 guias: titulo, descripcion, link.
Schema: CollectionPage

LAYOUT /guias/layout.tsx
Breadcrumb: Inicio > Guias > [Titulo actual]
Sidebar en desktop con links a otras guias
Sin elementos dinamicos

NOTAS TECNICAS
- Todas Server Components estaticos (sin force-dynamic)
- export const revalidate = 86400 en cada pagina
- Usar clases de typography del design system existente para el prose (revisar si hay componente Typography en el proyecto antes de crear uno)
- Revisar si hay sitemap.ts y agregar las 7 URLs nuevas (/guias + 6 articulos)

ARCHIVOS A CREAR
- src/app/guias/layout.tsx
- src/app/guias/page.tsx
- src/app/guias/que-es-un-loteo/page.tsx
- src/app/guias/barrio-abierto-vs-cerrado/page.tsx
- src/app/guias/como-comprar-un-lote/page.tsx
- src/app/guias/sin-expensas-ventajas/page.tsx
- src/app/guias/financiar-lote-argentina/page.tsx
- src/app/guias/que-infraestructura-debe-tener-un-loteo/page.tsx

ARCHIVOS A MODIFICAR
- src/components/site-header.tsx (agregar Guias en nav)
- sitemap.ts si existe (agregar las 7 nuevas URLs)"""

payload = json.dumps({"fields": {
    "Name": name,
    "Description": desc,
    "Status": "Todo",
    "Priority": "Medium",
    "Type": "Marketing"
}}).encode()

req = request.Request(
    f"https://api.airtable.com/v0/{base}/{table}",
    data=payload, method="POST",
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
)
with request.urlopen(req) as resp:
    data = json.loads(resp.read())
    print("Created:", data.get("id"), "| Ticket ID:", data.get("fields", {}).get("Ticket ID"))
