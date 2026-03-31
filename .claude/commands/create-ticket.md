---
description: Create a new Airtable ticket for a task
---

# Create Ticket

This command creates a new ticket in the Airtable tickets base for tracking tasks and implementation work.

## Airtable Configuration

The tickets are stored in:
- **Airtable Base**: https://airtable.com/appTHgujV5mqJWcjo/tblgR8ytXe3LOJbwg/viwXxajw659mHrYY9
- **Base ID**: `appTHgujV5mqJWcjo` (stored in `.env` as `AIRTABLE_BASE_ID`)
- **Table ID**: `tblgR8ytXe3LOJbwg` (stored in `.env` as `AIRTABLE_TICKETS_TABLE_ID`)
- **API Token**: Stored in `.env` as `AIRTABLE_API_TOKEN`

All credentials are loaded from the `.env` file by the script.

## When to Use

Use this command when:
- Starting a new feature or bug fix
- Planning work that needs to be tracked
- Creating documentation of implementation tasks
- User explicitly requests ticket creation

## Usage Flow

When user requests to create a ticket, gather the following information:

1. **Name/Summary** (required)
   - Brief, clear title of the task
   - Example: "Add dark mode toggle to header"

2. **Description** (required)
   - Detailed description of what needs to be done
   - Include acceptance criteria, technical details, or context
   - Example: "Implement a theme toggle button in the site header that switches between light and dark modes using next-themes"

3. **Status** (optional, default: "Todo")
   - Options: `Todo`, `In progress`, `Testing`, `Done`
   - Set to "In progress" if starting work immediately

4. **Priority** (optional, default: "Medium")
   - Options: `Critical`, `High`, `Medium`, `Low`
   - Critical: Blocking issues, security vulnerabilities
   - High: Important features, significant bugs
   - Medium: Standard features, minor bugs
   - Low: Nice-to-have improvements, refactoring

5. **Type** (optional, default: "Infrastructure")
   - Options: `Infrastructure`, `Marketing`, `Design & UX`, `Auth`, `Product Page`
   - Infrastructure: Technical improvements, setup, configuration
   - Marketing: Content, SEO, branding, link building
   - Design & UX: UI components, layout, visual design
   - Auth: Authentication, permissions, session management
   - Product Page: Project pages, landing pages, content pages

> ⚠️ **Note:** The `ID` field in Airtable is auto-computed. Never include it in create/update API calls — it will throw `INVALID_VALUE_FOR_COLUMN`.

## Implementation Steps

After gathering the information:

1. Run the create-ticket script with the provided details:
   ```bash
   pnpm tsx scripts/create-ticket.ts "Ticket Name" "Ticket Description" "Status" "Priority" "Type"
   ```

2. The script will:
   - Load Airtable credentials from `.env`
   - Create the ticket in Airtable base `appTHgujV5mqJWcjo`
   - Return the Airtable Record ID
   - Provide a direct link to view the ticket in Airtable

3. Display the ticket details to the user

4. Ask if they want to start working on it immediately

## Examples

### Example 1: Infrastructure task
```bash
pnpm tsx scripts/create-ticket.ts "Add security headers to Next.js config" "Add X-Content-Type-Options, X-Frame-Options, Referrer-Policy to next.config.js" "Todo" "Medium" "Infrastructure"
```

### Example 2: SEO/Marketing with Immediate Start
```bash
pnpm tsx scripts/create-ticket.ts "Configurar Google Search Console" "Verificar dominio, enviar sitemap, revisar Core Web Vitals baseline" "In progress" "High" "Marketing"
```

### Example 3: Product page
```bash
pnpm tsx scripts/create-ticket.ts "Crear página /proyectos hub" "Página índice de proyectos para rankear búsquedas genéricas de lotes" "Todo" "High" "Product Page"
```

## Technical Details

- **Script location**: `scripts/create-ticket.ts`
- **API**: Uses Airtable REST API via the `airtable` npm package
- **Environment variables** (all loaded from `.env`):
  - `AIRTABLE_API_TOKEN` - API authentication token
  - `AIRTABLE_BASE_ID=appTHgujV5mqJWcjo` - The Loteos project base
  - `AIRTABLE_TICKETS_TABLE_ID=tblgR8ytXe3LOJbwg` - The tickets table
- **Returns**: Airtable Record ID and direct link to ticket

## Related Commands & Scripts

- `/tackle-ticket` - Fetch and work on an existing ticket by ID
- `scripts/fetch-ticket.js` - View ticket details
- `scripts/update-ticket.js` - Update ticket status/action plan
- `scripts/inspect-tickets-table.ts` - Inspect table structure

## Notes

- Always use quotes around arguments that contain spaces
- The ticket will be immediately visible in the Airtable base at https://airtable.com/appTHgujV5mqJWcjo/tblgR8ytXe3LOJbwg
- You can update the ticket later using the Airtable web interface or the `update-ticket.js` script
- Reference the ticket ID in commit messages when completing work
