---
name: fitzroya-design-guidelines
description: "Diseñar y revisar las superficies públicas de Fitzroya Desarrollos con una identidad inmobiliaria clara, evidencia comercial verificable, componentes existentes y recorridos orientados a comparar, calcular y consultar."
---

# Diseño de Fitzroya Desarrollos

Este archivo gobierna el diseño de las páginas públicas de Fitzroya Desarrollos. No reemplaza `AGENTS.md`: lo complementa con criterios de marca, composición, contenido y evaluación visual.

El objetivo no es imitar a Vercel ni convertir el sitio en una interfaz de software. Se adopta su método: decisiones observables, mecánicas compartidas y revisiones repetibles. La expresión visual debe seguir siendo la de Fitzroya.

## 1. Propósito y prioridad

Las páginas deben ayudar a una persona a:

1. Entender qué proyecto se ofrece y dónde está.
2. Reconocer los datos comerciales confirmados.
3. Comparar alternativas cuando corresponda.
4. Estimar una financiación sin confundirla con una oferta.
5. Consultar disponibilidad y condiciones actuales.

Cuando dos requisitos compitan, proteger este orden:

1. Hechos, fórmulas, unidades, restricciones y privacidad.
2. Funcionalidad, rutas, visibilidad y datos existentes.
3. Tarea principal del visitante.
4. Identidad de Fitzroya.
5. Composición y refinamiento visual.

Nunca inventar precios, anticipos, cuotas, tasas, disponibilidad, superficies, cantidad de lotes, servicios, distancias, documentación, fechas, obras, aprobaciones ni plazos de respuesta. Si un dato no está confirmado, omitirlo o presentarlo como pendiente de consulta.

## 2. Identidad visual

La marca combina naturaleza, tierra y confianza comercial. La interfaz debe sentirse:

- Clara y directa.
- Cálida, no corporativa ni tecnológica.
- Sólida, sin grandilocuencia.
- Visualmente contenida para que las fotografías y los datos tengan protagonismo.

### Paleta

Usar siempre los tokens semánticos definidos en `src/app/globals.css`:

- `background` y `foreground` para el lienzo y el texto.
- `primary` para acciones, foco y acentos relevantes.
- `secondary`, `muted` y `accent` para jerarquía secundaria.
- `destructive` exclusivamente para errores o acciones destructivas.
- `border`, `input` y `ring` para límites y estados de control.

El verde de marca es el acento principal. No incorporar colores crudos de Tailwind ni crear una segunda paleta paralela. Los colores de gráficos se reservan para comparaciones de datos que realmente los necesiten.

La fotografía aporta variedad cromática. No compensarla con degradados decorativos, brillos, blobs, texturas ni fondos de colores arbitrarios.

### Temas

El sitio admite tema claro y oscuro mediante tokens. Toda composición debe conservar jerarquía, contraste y legibilidad en ambos. No agregar overrides manuales `dark:` cuando exista un token semántico equivalente.

### Forma y profundidad

- Usar la escala de radios existente; reservar radios grandes para contenedores realmente destacados.
- Preferir separación por espacio, alineación o cambio sutil de superficie.
- Usar bordes y sombras solo cuando comuniquen agrupación, interacción o elevación real.
- Evitar tarjetas anidadas y una tarjeta por cada frase, cifra o servicio.
- No envolver automáticamente mapas, videos, gráficos o calculadoras en rectángulos oscuros decorativos.

## 3. Tipografía y redacción

La base actual es:

- Space Grotesk para interfaz, títulos, cuerpo, controles y cifras.
- PT Serif solo cuando una composición editorial concreta lo justifique.
- Space Mono para código, identificadores o valores operativos; no para texto comercial corriente.

### Jerarquía

- Una sola declaración dominante por pantalla o sección.
- Usar `font-semibold` para títulos importantes; no depender sistemáticamente de `font-bold` o `font-black`.
- Mantener el cuerpo en un tamaño cómodo y con interlineado amplio.
- Limitar el ancho de lectura del texto; las tablas, mapas, planos, galerías y calculadoras pueden ocupar más columnas.
- Los elementos equivalentes deben compartir tamaño, peso, alineación y tratamiento numérico.

### Voz

Escribir en español rioplatense claro, usando voseo de manera consistente. Preferir verbos y sustantivos concretos.

Los títulos deben comunicar una respuesta, diferencia o tarea. Evitar títulos genéricos como "Una oportunidad única" o "El hogar de tus sueños" si no están respaldados por evidencia.

Evitar:

- Mayúsculas sostenidas y tracking ornamental.
- Repetir la misma promesa en hero, tarjetas, resumen y cierre.
- Superlativos y urgencia no demostrables.
- Terminología interna de diseño o implementación en el contenido visible.
- Mensajes de error que no expliquen cómo continuar.

Los botones deben nombrar la acción: "Simular financiación", "Ver ubicación", "Consultar disponibilidad". Evitar rótulos ambiguos como "Continuar" o "Conocer más" cuando pueda nombrarse el destino.

## 4. Composición

Antes de escribir JSX, establecer de forma privada:

- Quién visita la página.
- Qué necesita entender o decidir.
- Cuál es la respuesta más fuerte respaldada por datos.
- Qué evidencia la sostiene.
- Qué condición o incertidumbre cambia su interpretación.

La primera pantalla debe presentar la identidad del proyecto, la pregunta principal y la evidencia decisiva. No usar por defecto un hero centrado seguido por una grilla de tarjetas.

Elegir la apertura según la tarea:

- Proyecto individual: ubicación, escala, condición comercial confirmada y siguiente acción.
- Listado de proyectos: comparación sobre una base común.
- Calculadora: controles y resultado como objeto principal.
- Página institucional: evidencia de proceso y confianza, no frases abstractas.

Cada sección debe responder una pregunta nueva. Si dos secciones comunican lo mismo, combinarlas. La página debe terminar en una acción, una conclusión o una consulta clara; no simplemente después de una galería o lista.

### Grilla y ritmo

- Usar `container`, grillas y flexbox existentes.
- Mantener bordes, textos y objetos alineados a ejes compartidos.
- No dejar tablas o evidencia ancha comprimidas junto a una columna vacía.
- Reorganizar contenido antes de reducir el tamaño del texto.
- Usar `gap-*` para espaciado; no usar `space-x-*` ni `space-y-*` en código nuevo.
- Cada grupo debe tener un solo propietario del espaciado.
- Variar densidad y descanso a lo largo de la página sin perder una gramática común.

## 5. Proyectos inmobiliarios

Una página de proyecto debe distinguir:

- Hechos del proyecto.
- Datos comerciales actuales.
- Estimaciones calculadas.
- Evidencia visual.
- Información sujeta a consulta.

Los hechos decisivos deben ser escaneables y comparables. No convertir cada dato en una tarjeta independiente si una fila, lista de definiciones o composición compartida es más clara.

### Medios

- Conservar fotografías, videos, planos y mapas existentes salvo pedido explícito de eliminación.
- No sustituir fotografías reales por imágenes de stock o generadas.
- Usar `object-cover` cuando el recorte sea intencional y seguro.
- Usar `object-contain` sobre fondo neutro u oscuro cuando deba verse la imagen completa.
- Reservar dimensiones para evitar cambios de layout.
- Videos esenciales deben tener poster, controles o interacción comprensible y alternativa compatible con movimiento reducido cuando corresponda.
- Los carruseles deben tener controles accesibles y texto alternativo significativo.

Para Google Maps, conservar el bloque responsive y usar el `src` completo provisto. Nunca editar manualmente la cadena opaca `pb` para cambiar el zoom.

### Servicios, accesos y cercanías

Solo publicar elementos confirmados. Presentarlos como listas o relaciones espaciales antes de recurrir a tarjetas con íconos. Los íconos deben ayudar a reconocer contenido o acciones; no funcionar como decoración repetitiva.

## 6. Financiación

La calculadora es evidencia interactiva. Debe explicar qué puede estimar y qué no puede confirmar.

- Mantener una sola fuente de estado para precio, anticipo, plazo, tasa, cuota y dependencias.
- Calcular con precisión completa y formatear solo para mostrar.
- Mostrar unidades, moneda y periodicidad junto a los valores.
- Con anticipo por el precio total, la cuota debe ser cero.
- Respetar los pisos y topes comerciales tanto en UI como en API.
- No recalcular condiciones de reservas existentes por cambios destinados a ventas nuevas.
- No bloquear silenciosamente una entrada inválida; conservarla y explicar cómo corregirla.
- Presentar la simulación como estimativa cuando corresponda.
- Atribuir correctamente cada consulta al proyecto real.

Si usar la calculadora es la tarea principal, debe aparecer temprano y con suficiente espacio. No repetir su escenario predeterminado en una segunda sección de cifras.

## 7. Componentes e implementación

El proyecto usa Next.js App Router, Tailwind CSS 4 y shadcn/ui estilo `new-york`, con Radix y Lucide.

- Reutilizar componentes instalados antes de crear markup personalizado.
- Usar variantes propias de `Button`, `Card`, `Badge` y demás componentes antes de sobrescribir sus colores o tipografía.
- Usar clases semánticas: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`.
- Usar `size-*` cuando ancho y alto sean iguales.
- Los íconos dentro de botones usan `data-icon="inline-start"` o `data-icon="inline-end"` y no reciben tamaño manual.
- Usar `cn()` para clases condicionales.
- Usar la composición completa de los componentes. Por ejemplo, una tarjeta con contenido editorial debe tener `CardHeader`, `CardTitle`, `CardDescription` cuando corresponda y `CardContent`.
- Formularios usan `FieldGroup`, `Field`, etiquetas asociadas, `data-invalid` y `aria-invalid`.
- Usar elementos nativos y `Link` para navegación; no reemplazarlos con `div` interactivos.
- Mantener Server Components por defecto. Agregar `"use client"` solo cuando haya estado, efectos, eventos o APIs del navegador.

No agregar otra biblioteca visual, preset, sistema de tokens, set de íconos o dependencia sin necesidad confirmada.

## 8. Accesibilidad y responsive

- Un `h1` descriptivo por página y jerarquía ordenada de encabezados.
- Enlace para saltar al contenido y landmarks semánticos.
- Foco visible y sin quedar oculto por el header fijo.
- Controles con etiquetas y áreas táctiles adecuadas.
- Inputs de al menos 16 px en móvil para evitar zoom automático.
- Estados y diferencias nunca comunicados solo mediante color.
- Tablas semánticas con encabezados alineados con sus datos.
- Mapas, imágenes, videos y gráficos con nombres o alternativas accesibles.
- Sin overflow oculto para disimular errores de layout.
- Verificar móvil, tablet, escritorio y pantallas anchas.
- En móvil, recomponer antes de encoger tipografía o controles.

## 9. Patrones que no deben publicarse

- Hero genérico centrado seguido de tres tarjetas intercambiables.
- Una tarjeta, badge o píldora por cada dato.
- Íconos grandes en cajas de color sin función.
- Gradientes, brillos, vidrio, texturas o sombras ornamentales.
- Imágenes de stock cuando existe material real del proyecto.
- Varias llamadas a la acción con igual jerarquía.
- Cifras sin unidad, período, moneda o base de comparación.
- Barras cuyo largo no comparte una escala documentada.
- Tablas estrechas dentro de secciones anchas.
- Texto pequeño y gris usado para hacer entrar contenido.
- Animaciones de entrada por cada sección, parallax innecesario o movimiento decorativo.
- Afirmaciones comerciales no confirmadas presentadas como hechos.
- Narración visible sobre cómo fue diseñada la página.

La sobriedad no debe producir una plantilla estéril. La identidad se construye con fotografía real, verde Fitzroya, tipografía consistente, relaciones claras y una composición específica para cada proyecto.

## 10. Flujo de evaluación

Para cambios visuales importantes:

1. Guardar una referencia del estado anterior con la misma ruta, datos y viewport.
2. Definir la tarea del visitante y una rúbrica breve.
3. Implementar una sola hipótesis de composición claramente distinta.
4. Comparar ambas versiones sin cambiar los datos de entrada.
5. Registrar correcciones observables, no preferencias vagas.
6. Llevar cada corrección al lugar más estrecho que pueda imponerla:
   - Criterio y juicio: `DESIGN.md`.
   - Mecánica reutilizable: componente o tokens existentes.
   - Fallo verificable: test, lint o comprobación determinista.
7. Repetir hasta que no queden problemas materiales conocidos.

La rúbrica mínima debe comprobar:

- Los hechos suministrados se preservaron.
- La tarea principal se entiende en la primera pantalla.
- Existe una sola jerarquía dominante por momento de lectura.
- La evidencia ocupa el espacio que necesita.
- No se repite una conclusión sin agregar una nueva tarea.
- Formularios, calculadoras y navegación funcionan con teclado.
- No hay overflow, saltos de layout ni texto ilegible.
- Tema claro, oscuro y reflow conservan la misma jerarquía.
- La página no expone proyectos ocultos a usuarios públicos.

Antes de entregar cambios de código ejecutar, como mínimo:

```powershell
pnpm typecheck
pnpm lint
git diff --check
```

Para cambios amplios de página, rutas o estructura ejecutar también:

```powershell
pnpm build:ci
```

La validación automática no sustituye la revisión visual humana. No afirmar que una página fue verificada visualmente si no se renderizó e inspeccionó.
