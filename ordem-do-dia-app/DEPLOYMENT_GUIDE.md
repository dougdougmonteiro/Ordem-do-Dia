# Ordem do Dia - Google Apps Script Deployment Guide

## Overview

This is a Google Apps Script backend for the "Ordem do Dia" (Call Sheet) film production application. It provides a REST API for managing film schedules, team members, locations, and check-ins.

## Prerequisites

1. A Google Account with Google Sheets access
2. Access to Google Apps Script (available through Google Cloud Console)
3. Authorization domain requirement: User must have an email ending with `@conteudourbano.com.br`

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Ordem do Dia"
3. Open the spreadsheet

### Step 2: Add Apps Script

1. Click **Tools** → **Script Editor**
2. A new Google Apps Script project will open
3. Clear any default code
4. Copy and paste the entire contents of `google-apps-script.js` into the editor
5. Click **Save** (Ctrl+S / Cmd+S)
6. Give the project a name, e.g., "Ordem do Dia API"

### Step 3: Initialize the Spreadsheet

1. In the Apps Script editor, find the function dropdown near the top (likely shows "myFunction")
2. Select `setupSheets` from the dropdown
3. Click **Run** (the play icon)
4. Authorize the script when prompted
5. Check the Sheets tab - all 6 tabs should now exist with proper headers:
   - Projetos
   - Equipe
   - Locacoes
   - Cronograma
   - CheckIns
   - Config

### Step 4: Populate Example Data (Optional)

1. Back in the Apps Script editor, select `populateExampleData` from the function dropdown
2. Click **Run**
3. This will populate the "Stelara Fase 2 - Salvador" project with all example data

### Step 5: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. In the "Select type" dropdown, choose **Web app**
3. Configure:
   - **Execute as**: Select your Google Account (the account that owns the spreadsheet)
   - **Who has access**: "Anyone" (the script validates authorization server-side)
4. Click **Deploy**
5. Copy the deployment URL (format: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb`)
6. Click **Done**

## API Usage

### Base URL

```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb
```

All requests require a user to be logged in via Google OAuth (handled by Apps Script automatically when accessed through a browser).

### Request Format

All requests use the following format:

```
{BASE_URL}?action={ACTION}&{OPTIONAL_PARAMS}
```

For POST requests with JSON payload:
```
POST {BASE_URL}?action={ACTION}
Content-Type: application/json

{JSON_PAYLOAD}
```

### Authentication

Authentication is automatic via Google OAuth. The script validates that the user's email ends with `@conteudourbano.com.br`.

### Available Endpoints

#### 1. Get Project by ID

```
GET ?action=getProjeto&projeto_id=1
```

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

#### 2. Get Schedule (Cronograma)

```
GET ?action=getCronograma&projeto_id=1
GET ?action=getCronograma&projeto_id=1&data=05/03/2024
```

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

#### 3. Get Team Members (Equipe)

```
GET ?action=getEquipe&projeto_id=1
```

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

#### 4. Get Locations (Locacoes)

```
GET ?action=getLocacoes&projeto_id=1
```

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

#### 5. Update Schedule Item (Cronograma)

```
POST ?action=updateCronograma
Content-Type: application/json

{
  "id": "1-1",
  "updates": {
    "status": "em_andamento",
    "quadro_inicio": "13:15",
    "quadro_obs": "Atualizado"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cronograma atualizado com sucesso",
  "id": "1-1"
}
```

#### 6. Register Check-In

```
POST ?action=checkIn
Content-Type: application/json

{
  "projeto_id": "1",
  "dia_data": "06/03/2024",
  "email_usuario": "vini@conteudourbano.com.br",
  "nome_usuario": "Vini Ribeiro",
  "locacao": "Hotel Catharina Paraguaçu"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check-in registrado com sucesso",
  "id": "CI_1709762400000_a1b2c3d4",
  "horario": "2024-03-06T10:30:45.123Z"
}
```

#### 7. Get Check-Ins

```
GET ?action=getCheckIns&projeto_id=1
GET ?action=getCheckIns&projeto_id=1&data=06/03/2024
```

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

#### 8. Get Config Value

```
GET ?action=getConfig
GET ?action=getConfig&chave=projeto_nome
```

**Response (all config):**
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

**Response (specific key):**
```json
{
  "success": true,
  "data": {
    "chave": "projeto_nome",
    "valor": "STELARA FASE 2 - SALVADOR"
  }
}
```

#### 9. Get All Data (Complete Load)

```
GET ?action=getAllData&projeto_id=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projeto": { /* project object */ },
    "cronograma": [ /* array of schedule items */ ],
    "equipe": [ /* array of team members */ ],
    "locacoes": [ /* array of locations */ ],
    "config": { /* config object */ }
  }
}
```

## Database Schema

### Projetos (Projects)
```
- id: Unique identifier
- nome_projeto: Project name
- cliente: Client name
- data_inicio: Start date
- data_fim: End date
- status: "ativo" or "inativo"
```

### Equipe (Team)
```
- id: Unique identifier
- projeto_id: Foreign key to Projetos.id
- nome: Team member name
- funcao: Job title/role
- email: Email address
- telefone: Phone number
```

### Locacoes (Locations)
```
- id: Unique identifier
- projeto_id: Foreign key to Projetos.id
- nome: Location name
- endereco: Address
- tipo: "locacao" or "hospital"
- observacao: Notes/observations
```

### Cronograma (Schedule)
```
- id: Unique identifier
- projeto_id: Foreign key to Projetos.id
- dia_data: Date (DD/MM/YYYY format)
- dia_semana: Day of week (SEGUNDA, TERÇA, etc.)
- dia_tipo: Type of day (DESLOCAMENTO, GRAVAÇÃO, etc.)
- dia_locacao: Location for the day
- quadro_ordem: Order/sequence number
- quadro_inicio: Start time (HH:MM)
- quadro_nome: Activity name
- quadro_duracao: Duration (HH:MM)
- quadro_obs: Notes
- quadro_termino: End time (HH:MM)
- status: "pendente", "em_andamento", or "concluido"
```

### CheckIns (Check-ins)
```
- id: Unique identifier
- projeto_id: Foreign key to Projetos.id
- dia_data: Date of check-in
- email_usuario: User email
- nome_usuario: User name
- horario_checkin: Check-in timestamp (ISO 8601)
- locacao: Location
```

### Config (Configuration)
```
- chave: Configuration key
- valor: Configuration value
```

## CORS Support

The API includes CORS headers for cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Error Handling

All endpoints return a standard error response format:

```json
{
  "success": false,
  "error": "Error description"
}
```

Common error scenarios:
- Unauthorized user (email not ending with @conteudourbano.com.br)
- Invalid action parameter
- Missing required parameters
- Resource not found (projeto_id, cronograma id, etc.)
- Invalid JSON in request body

## Deployment Best Practices

1. **Keep Credentials Secure**: The deployment URL should be treated like an API key
2. **Monitor Usage**: Regularly check the Apps Script Execution Log for errors
3. **Backups**: Google Sheets automatically backs up data, but consider regular exports
4. **Testing**: Test all endpoints before deploying to production
5. **Version Control**: Keep track of script changes using the Apps Script Version History

## Updating the Script

To update the script:

1. Open the Google Apps Script project
2. Edit the code
3. Click **Save**
4. The changes are automatically deployed to all Web App users
5. No need to re-deploy unless the deployment settings change

## Troubleshooting

### "Unauthorized" Error
- Verify the user is logged in with a Google Account ending in @conteudourbano.com.br
- Check that the Apps Script execution permissions are set correctly

### Script Not Executing
- Check the Apps Script Execution Log (View → Execution Log)
- Ensure all sheets exist and have proper headers
- Verify spreadsheet permissions

### API Returning Empty Results
- Ensure data exists in the corresponding sheet
- Check that projeto_id values match correctly
- Verify date formats are consistent (DD/MM/YYYY)

### CORS Issues
- CORS headers are included automatically
- If issues persist, test from the same domain or use a CORS proxy

## Support & Development

For issues or feature requests:
1. Check the script logs (View → Execution log)
2. Review the example data to understand expected formats
3. Use the development functions (`getUserInfo()`, `listSheets()`) for debugging
