---
description: tackle a product ticket given a ticket ID
---

# tackle ticket Implementation

This command finds a given ticket id (field "ID") in the Airtable tickets base, prepares an action plan to tackle this ticket, asks approval from the user, and proceeds to tackle the ticket.

Make sure to read all the existing fields, especially name (ie summary) and description, and ask any clarifying questions you need, only if relevant

After implementation, add final notes if relevant

The airtable tickets base is https://airtable.com/appTHgujV5mqJWcjo/tblgR8ytXe3LOJbwg/viwXxajw659mHrYY9?blocks=hide

Envs file has the airtable_api_token variable to consume the airtable API

When picking up the ticket, come up with a comprehensive action plan and, when approved by the user, update the ticket adding this plan to the "Action Plan" field, as well updating the Status to "In progress"

After implementing the solution, mark the ticket's status as "Testing"

## Airtable Field Constraints

When making API calls to create or update tickets, keep in mind:

- **`ID` field is auto-computed** — never include it in POST/PATCH requests or you'll get `INVALID_VALUE_FOR_COLUMN`
- **`Status`** valid values: `Todo`, `In progress`, `Testing`, `Done`, `Blocked`
- **`Priority`** valid values: `Critical`, `High`, `Medium`, `Low`
- **`Type`** valid values: `Infrastructure`, `Marketing`, `Design & UX`, `Auth`, `Product Page`

If unsure of valid options for a select field, call the Airtable meta API first:
```bash
curl "https://api.airtable.com/v0/meta/bases/$BASE_ID/tables" \
  -H "Authorization: Bearer $TOKEN"
```