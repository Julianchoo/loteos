import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const token = envContent.match(/AIRTABLE_API_TOKEN=(.+)/)?.[1]?.trim();
const baseId = envContent.match(/AIRTABLE_BASE_ID=(.+)/)?.[1]?.trim();
const tableId = envContent.match(/AIRTABLE_TICKETS_TABLE_ID=(.+)/)?.[1]?.trim();

if (!token || !baseId || !tableId) {
  console.error('Missing Airtable configuration in .env');
  process.exit(1);
}

const ticketId = process.argv[2];
const status = process.argv[3];
const actionPlan = process.argv[4];

if (!ticketId) {
  console.error('Usage: node update-ticket.js <ticketId> [status] [actionPlan]');
  process.exit(1);
}

// First, get all records to find the one with matching ID
const getResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await getResponse.json();
const ticket = data.records.find(r => r.fields['ID'] === parseInt(ticketId));

if (!ticket) {
  console.error(`Ticket #${ticketId} not found`);
  process.exit(1);
}

// Build update payload
const fields = {};
if (status) {
  fields['Status'] = status;
}
if (actionPlan) {
  fields['Action Plan'] = actionPlan;
}

// Update the ticket
const updateResponse = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${ticket.id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ fields })
});

const result = await updateResponse.json();
console.log('Ticket updated successfully:');
console.log(JSON.stringify(result, null, 2));
