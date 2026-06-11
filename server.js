// Qoyod Marketing Ops Dashboard - v2
const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const ASANA_TOKEN   = process.env.ASANA_TOKEN;
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
const DASH_USER     = process.env.DASH_USER || 'shatha';
const DASH_PASS     = process.env.DASH_PASS;
const WORKSPACE     = '1201388260892354';

app.use(basicAuth({ users: { [DASH_USER]: DASH_PASS }, challenge: true, realm: 'Qoyod Marketing Ops' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/asana/projects', async (req, res) => {
  try {
    const r = await fetch('https://app.asana.com/api/1.0/projects?workspace=' + WORKSPACE + '&opt_fields=name,task_counts,current_status_update,due_date,color&limit=100&archived=false', { headers: { Authorization: 'Bearer ' + ASANA_TOKEN } });
    res.status(r.status).json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/asana/tasks', async (req, res) => {
  try {
    const r = await fetch('https://app.asana.com/api/1.0/tasks?assignee=me&workspace=' + WORKSPACE + '&opt_fields=name,due_on,projects,completed&completed_since=now&limit=100', { headers: { Authorization: 'Bearer ' + ASANA_TOKEN } });
    res.status(r.status).json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/hubspot/deals', async (req, res) => {
  try {
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/deals/search', { method: 'POST', headers: { Authorization: 'Bearer ' + HUBSPOT_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(req.body) });
    res.status(r.status).json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/hubspot/contacts', async (req, res) => {
  try {
    const r = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', { method: 'POST', headers: { Authorization: 'Bearer ' + HUBSPOT_TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(req.body) });
    res.status(r.status).json(await r.json());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, '0.0.0.0', () => console.log('Qoyod Dashboard on port ' + PORT));
