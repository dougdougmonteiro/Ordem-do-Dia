# Ordem do Dia API Reference

Quick reference for all API endpoints.

## Base URL
```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
```

## Endpoints Summary

| Method | Action | Purpose |
|--------|--------|---------|
| GET | `getProjeto` | Fetch project details |
| GET | `getCronograma` | Fetch schedule items |
| GET | `getEquipe` | Fetch team members |
| GET | `getLocacoes` | Fetch locations |
| POST | `updateCronograma` | Update schedule item |
| POST | `checkIn` | Register check-in |
| GET | `getCheckIns` | Fetch check-ins |
| GET | `getConfig` | Fetch configuration |
| GET | `getAllData` | Fetch all project data |

---

## 1. Get Project

**Endpoint:** `GET ?action=getProjeto&projeto_id={ID}`

**Parameters:**
- `projeto_id` (required): Project ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "nome_projeto": "STELARA FASE 2 - SALVADOR",
    "cliente": "Stelara/Janssen",
    "data_inicio": "05/03/2024",
    "data_fim": "08/03/2024",
    "status": "ativo"
  }
}
```

---

## 2. Get Schedule

**Endpoint:** `GET ?action=getCronograma&projeto_id={ID}[&data={DATE}]`

**Parameters:**
- `projeto_id` (required): Project ID
- `data` (optional): Filter by date (DD/MM/YYYY)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1-1",
      "projeto_id": "1",
      "dia_data": "05/03/2024",
      "dia_semana": "QUINTA",
      "dia_tipo": "DESLOCAMENTO",
      "dia_locacao": "Aeroporto Congonhas/Aeroporto Salvador",
      "quadro_ordem": "1",
      "quadro_inicio": "13:00",
      "quadro_nome": "Saída CU",
      "quadro_duracao": "00:30",
      "quadro_obs": "",
      "quadro_termino": "13:30",
      "status": "pendente"
    }
  ],
  "count": 1
}
```

**Status Values:**
- `pendente` - Pending
- `em_andamento` - In progress
- `concluido` - Completed

---

## 3. Get Team Members

**Endpoint:** `GET ?action=getEquipe&projeto_id={ID}`

**Parameters:**
- `projeto_id` (required): Project ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "projeto_id": "1",
      "nome": "Vini Ribeiro",
      "funcao": "Direção",
      "email": "vini@conteudourbano.com.br",
      "telefone": ""
    }
  ],
  "count": 8
}
```

---

## 4. Get Locations

**Endpoint:** `GET ?action=getLocacoes&projeto_id={ID}`

**Parameters:**
- `projeto_id` (required): Project ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "projeto_id": "1",
      "nome": "Hotel Catharina Paraguaçu",
      "endereco": "R. João Gomes, 128 - Rio Vermelho, Salvador - BA, 41950-640",
      "tipo": "locacao",
      "observacao": "Hotel de hospedagem"
    }
  ],
  "count": 4
}
```

**Location Types:**
- `locacao` - Generic location
- `hospital` - Hospital

---

## 5. Update Schedule Item

**Endpoint:** `POST ?action=updateCronograma`

**Request Body:**
```json
{
  "id": "1-1",
  "updates": {
    "status": "em_andamento",
    "quadro_inicio": "13:15",
    "quadro_obs": "Atualizado"
  }
}
```

**Parameters:**
- `id` (required): Schedule item ID
- `updates` (required): Object with fields to update

**Updatable Fields:**
- `quadro_inicio`, `quadro_termino` - Times
- `quadro_duracao` - Duration
- `quadro_obs` - Notes
- `status` - Status (pendente/em_andamento/concluido)

**Response:**
```json
{
  "success": true,
  "message": "Cronograma atualizado com sucesso",
  "id": "1-1"
}
```

---

## 6. Register Check-In

**Endpoint:** `POST ?action=checkIn`

**Request Body:**
```json
{
  "projeto_id": "1",
  "dia_data": "06/03/2024",
  "email_usuario": "vini@conteudourbano.com.br",
  "nome_usuario": "Vini Ribeiro",
  "locacao": "Hotel Catharina Paraguaçu"
}
```

**Parameters:**
- `projeto_id` (required): Project ID
- `dia_data` (required): Date of check-in (DD/MM/YYYY)
- `email_usuario` (required): User email
- `nome_usuario` (optional): User name
- `locacao` (optional): Location

**Response:**
```json
{
  "success": true,
  "message": "Check-in registrado com sucesso",
  "id": "CI_1709762400000_a1b2c3d4",
  "horario": "2024-03-06T10:30:45.123Z"
}
```

---

## 7. Get Check-Ins

**Endpoint:** `GET ?action=getCheckIns&projeto_id={ID}[&data={DATE}]`

**Parameters:**
- `projeto_id` (required): Project ID
- `data` (optional): Filter by date (DD/MM/YYYY)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "CI_1709762400000_a1b2c3d4",
      "projeto_id": "1",
      "dia_data": "06/03/2024",
      "email_usuario": "vini@conteudourbano.com.br",
      "nome_usuario": "Vini Ribeiro",
      "horario_checkin": "2024-03-06T10:30:45.123Z",
      "locacao": "Hotel Catharina Paraguaçu"
    }
  ],
  "count": 1
}
```

---

## 8. Get Configuration

**Endpoint:** `GET ?action=getConfig[&chave={KEY}]`

**Parameters:**
- `chave` (optional): Specific config key to fetch

**Response (All):**
```json
{
  "success": true,
  "data": {
    "projeto_nome": "STELARA FASE 2 - SALVADOR",
    "cliente": "Stelara/Janssen",
    "clima": "Parcialmente nublado",
    "temperatura": "28°C"
  }
}
```

**Response (Specific Key):**
```json
{
  "success": true,
  "data": {
    "chave": "projeto_nome",
    "valor": "STELARA FASE 2 - SALVADOR"
  }
}
```

---

## 9. Get All Data

**Endpoint:** `GET ?action=getAllData&projeto_id={ID}`

**Parameters:**
- `projeto_id` (required): Project ID

**Response:**
```json
{
  "success": true,
  "data": {
    "projeto": { /* full project object */ },
    "cronograma": [ /* array of schedule items */ ],
    "equipe": [ /* array of team members */ ],
    "locacoes": [ /* array of locations */ ],
    "config": { /* all config */ }
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error description"
}
```

**Common Errors:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Unauthorized" | User email doesn't end with @conteudourbano.com.br | Login with correct account |
| "Unknown action" | Invalid action parameter | Check action name spelling |
| "Projeto não encontrado" | Project ID doesn't exist | Verify projeto_id value |
| "Payload deve conter id e updates" | Missing required fields in POST | Include all required fields |

---

## Examples

### JavaScript Fetch
```javascript
// Get project
fetch('BASE_URL?action=getProjeto&projeto_id=1')
  .then(r => r.json())
  .then(d => console.log(d.data));

// Check in a team member
fetch('BASE_URL?action=checkIn', {
  method: 'POST',
  body: JSON.stringify({
    projeto_id: '1',
    dia_data: '06/03/2024',
    email_usuario: 'vini@conteudourbano.com.br',
    nome_usuario: 'Vini Ribeiro'
  })
})
.then(r => r.json())
.then(d => console.log(d));

// Update schedule status
fetch('BASE_URL?action=updateCronograma', {
  method: 'POST',
  body: JSON.stringify({
    id: '1-1',
    updates: { status: 'em_andamento' }
  })
})
.then(r => r.json())
.then(d => console.log(d));
```

### cURL
```bash
# Get team
curl "BASE_URL?action=getEquipe&projeto_id=1"

# Register check-in
curl -X POST "BASE_URL?action=checkIn" \
  -H "Content-Type: application/json" \
  -d '{
    "projeto_id": "1",
    "dia_data": "06/03/2024",
    "email_usuario": "vini@conteudourbano.com.br",
    "nome_usuario": "Vini Ribeiro"
  }'
```

---

## Rate Limiting

No explicit rate limiting is configured. Google Apps Script has quota limits:
- 6 minutes of execution time per day (with interruptions)
- Sheets API quota limits apply

For high-volume applications, consider implementing additional caching or batching.

---

## Authentication

Authentication is automatic via Google OAuth. The script validates:
1. User is logged into their Google Account
2. User email ends with `@conteudourbano.com.br`

No API keys or tokens required.

---

## Date Format

All dates use: `DD/MM/YYYY`
All times use: `HH:MM` (24-hour format)
Timestamps use: ISO 8601 with timezone

Examples:
- Date: `06/03/2024`
- Time: `13:30`
- Timestamp: `2024-03-06T13:30:45.123Z`
