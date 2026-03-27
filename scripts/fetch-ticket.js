import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const token = envContent.match(/AIRTABLE_API_TOKEN=(.+)/)?.[1]?.trim();

if (!token) {
  console.error('AIRTABLE_API_TOKEN not found in .env');
  process.exit(1);
}

const baseId = envContent.match(/AIRTABLE_BASE_ID=(.+)/)?.[1]?.trim();
const tableId = envContent.match(/AIRTABLE_TICKETS_TABLE_ID=(.+)/)?.[1]?.trim();
const ticketId = process.argv[2] || '13';

const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

// Show first record structure to understand fields
if (data.records.length > 0) {
  console.log('First record structure:');
  console.log(JSON.stringify(data.records[0], null, 2));
  console.log('\n===================\n');
}

const ticket = data.records.find(r =>
  r.fields['ID'] === parseInt(ticketId) ||
  r.fields['ID'] === ticketId ||
  r.fields['Ticket ID'] === parseInt(ticketId) ||
  r.fields['Ticket ID'] === ticketId ||
  r.id === ticketId
);

if (ticket) {
  console.log('Found ticket:');
  console.log(JSON.stringify(ticket, null, 2));
} else {
  console.error('Ticket #' + ticketId + ' not found');
  console.log('Total records:', data.records.length);
}
