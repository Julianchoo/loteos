---
description: tackle a product ticket given a ticket ID
---

# tackle ticket Implementation

This command finds a given ticket id (field "ID") in a google sheet base of tickets, prepares an action plan to tackle this ticket, asks approval from the user, and proceeds to tackle the ticket.

Make sure to read all the existing fields, especially name (ie summary) and description, and ask any clarifying questions you need, only if relevant

After implementation, add final notes if relevant

The airtable tickets base is https://airtable.com/appTHgujV5mqJWcjo/tblgR8ytXe3LOJbwg/viwXxajw659mHrYY9?blocks=hide

Envs file has the airtable_api_token variable to consume the airtable API

When picking up the ticket, come up with a comprehensive action plan and, when approved by the user, update the ticket adding this plan to the "Action Plan" field, as well updating the Status to "In progress"

After implementing the solution, mark the ticket's status as "Testing"