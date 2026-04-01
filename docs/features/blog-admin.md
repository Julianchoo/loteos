# Sistema de Blog Admin

## Contexto

Se migró el blog de WordPress (hosted en Hostinger, consumido via GraphQL) a un sistema propio almacenado en la base de datos PostgreSQL del proyecto. La razón fue la baja del hosting de Hostinger.

---

## Arquitectura

### Base de datos

**Tabla `blog_post`** (`src/lib/schema.ts`):
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | text (UUID) | Clave primaria |
| `slug` | text (unique) | URL del post: `/blog/[slug]` |
| `title` | text | Título |
| `excerpt` | text (nullable) | Resumen visible en la lista |
| `content` | text | HTML generado por Tiptap |
| `featuredImageUrl` | text (nullable) | URL de imagen destacada |
| `authorId` | text (FK → user) | Autor del post |
| `status` | text | `"draft"` \| `"published"` |
| `publishedAt` | timestamp (nullable) | Fecha de publicación |

**Campo `role` en tabla `user`**:
- Valores: `"user"` (default) \| `"admin"`
- Para asignar admin a un usuario existente:
  ```sql
  UPDATE "user" SET role = 'admin' WHERE email = 'email@ejemplo.com';
  ```
- Usuarios admin hardcodeados (auto-asignados al registrarse): `cohenmat@hotmail.com`, `juliankorn@gmail.com`

---

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/lib/blog.ts` | Capa de datos: `getPublishedPosts`, `getPublishedPostBySlug`, `getAllPosts`, `createPost`, `updatePost`, `deletePost` |
| `src/lib/admin-auth.ts` | Helper `getAdminSession()` — verifica rol admin consultando la DB directamente (BetterAuth no expone campos custom en la sesión) |
| `src/lib/session.ts` | `requireAdmin()` — para Server Components, consulta DB para verificar rol |
| `src/components/admin/blog-editor.tsx` | Editor WYSIWYG Tiptap con toolbar y subida de imágenes |
| `src/components/admin/blog-post-form.tsx` | Formulario compartido para crear/editar posts |
| `src/components/admin/delete-post-button.tsx` | Botón de eliminar con confirmación |

---

## Rutas

### Panel admin (requiere rol `admin`)
| Ruta | Descripción |
|---|---|
| `/admin` | Panel principal |
| `/admin/blog` | Lista de todos los posts (draft + published) |
| `/admin/blog/new` | Crear nuevo post |
| `/admin/blog/[id]/edit` | Editar post existente |

### API (todas verifican rol admin via `getAdminSession()`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/blog` | Listar todos los posts |
| POST | `/api/admin/blog` | Crear post |
| GET | `/api/admin/blog/[id]` | Obtener post por ID |
| PUT | `/api/admin/blog/[id]` | Actualizar post |
| DELETE | `/api/admin/blog/[id]` | Eliminar post |
| POST | `/api/admin/upload` | Subir imagen al editor |
| POST | `/api/auth/set-admin-role` | Asigna rol admin (solo emails permitidos) |
| GET | `/api/auth/me` | Devuelve `{ isAdmin: boolean }` |

### Blog público
| Ruta | Descripción |
|---|---|
| `/blog` | Lista posts publicados (fuente: DB) |
| `/blog/[slug]` | Post individual |

---

## Autenticación y roles

### Problema conocido de BetterAuth
BetterAuth **no expone campos custom** (`role`) en el objeto de sesión por defecto. Por eso **nunca** verificar el rol así:
```ts
// ❌ INCORRECTO — role siempre será undefined
session.user.role

// ✅ CORRECTO — consultar la DB directamente
import { getAdminSession } from "@/lib/admin-auth";
const session = await getAdminSession(); // null si no es admin
```

### Protección de rutas
- **Server Components**: usar `requireAdmin()` de `src/lib/session.ts`
- **API Routes**: usar `getAdminSession()` de `src/lib/admin-auth.ts`
- **Middleware (proxy.ts)**: `/admin/:path*` está en el matcher para redirect optimista si no hay cookie

---

## Editor de contenido

Se usa **Tiptap** con las siguientes extensiones:
- `StarterKit` — negritas, cursiva, headings, listas, código, citas
- `Image` — imágenes (subidas via `/api/admin/upload`)
- `Link` — enlaces
- `Placeholder` — texto placeholder

**Importante**: `immediatelyRender: false` es obligatorio para evitar errores de hidratación SSR con Next.js.

### Subida de imágenes
Las imágenes subidas desde el editor se procesan por `src/lib/storage.ts`:
- En desarrollo: se guardan en `public/uploads/blog/`
- En producción: se suben a Vercel Blob (requiere `BLOB_READ_WRITE_TOKEN`)

---

## Agregar un nuevo admin

1. El usuario debe registrarse en `/register`
2. Ejecutar en la DB:
   ```sql
   UPDATE "user" SET role = 'admin' WHERE email = 'nuevo@admin.com';
   ```
   O agregarlo a la lista `ADMIN_EMAILS` en `src/components/auth/sign-up-form.tsx` y `src/app/api/auth/set-admin-role/route.ts` antes de que se registre.
