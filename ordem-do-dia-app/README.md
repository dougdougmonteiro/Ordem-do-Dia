# Ordem do Dia - Film Production Backend

Complete Google Apps Script backend for the "Ordem do Dia" (Call Sheet) film production application.

## What's Included

This package contains everything needed to deploy a production-ready API backend for managing film production schedules, team members, locations, and check-ins.

### Files

1. **google-apps-script.js** - Main backend code
   - Web App handlers (doGet/doPost)
   - 9 API endpoints
   - Database operations
   - Setup and example data functions

2. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment instructions
   - Setup Google Sheets and Apps Script
   - Initialize the database
   - Deploy as Web App
   - Authorization configuration

3. **API_REFERENCE.md** - Complete API documentation
   - All endpoint specifications
   - Request/response examples
   - Error handling
   - Date/time formats

4. **client-example.js** - JavaScript client library and examples
   - OrdemDoDiaClient class for easy API access
   - 10 usage examples
   - Form integration example
   - Real-time monitoring example

5. **README.md** - This file

## Quick Start

### 1. Create Google Sheet
- Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
- Name it "Ordem do Dia"

### 2. Add Apps Script
- Click **Tools** → **Script Editor**
- Copy the entire contents of `google-apps-script.js` into the editor
- Click **Save**

### 3. Initialize Database
- In the Apps Script editor, select `setupSheets` from the function dropdown
- Click **Run**
- Authorize when prompted
- All 6 sheets will be created with proper headers

### 4. (Optional) Add Example Data
- Select `populateExampleData` from the function dropdown
- Click **Run**
- The Stelara Fase 2 - Salvador project will be populated with example data

### 5. Deploy as Web App
- Click **Deploy** → **New deployment**
- Select type: **Web app**
- Execute as: Your Google Account
- Who has access: "Anyone"
- Click **Deploy**
- Copy the deployment URL

### 6. Use the API
```javascript
const client = new OrdemDoDiaClient('YOUR_DEPLOYMENT_URL');

// Load all project data
const data = await client.getAllData('1');
console.log(data);

// Register check-in
await client.checkIn({
  projeto_id: '1',
  dia_data: '06/03/2024',
  email_usuario: 'vini@conteudourbano.com.br',
  nome_usuario: 'Vini Ribeiro'
});
```

## Database Schema

### Projetos (Projects)
Track all film production projects with client and status information.

### Equipe (Team)
Manage team members assigned to each project with contact information.

### Locacoes (Locations)
Track filming locations including addresses and type (location vs hospital).

### Cronograma (Schedule)
Detailed production schedule with time blocks, activities, and status tracking.

### CheckIns (Check-ins)
Automatic logging of team member arrivals and attendance.

### Config (Configuration)
Global settings for the application (project name, weather, etc.).

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| getProjeto | Get project details |
| getCronograma | Get schedule items (with optional date filter) |
| getEquipe | Get team members |
| getLocacoes | Get locations |
| updateCronograma | Update schedule status/times |
| checkIn | Register team member check-in |
| getCheckIns | Get check-ins (with optional date filter) |
| getConfig | Get configuration values |
| getAllData | Get complete project data in one call |

All responses are in JSON format with consistent error handling.

## Authentication

Users must be logged in with a Google Account that has an email ending with `@conteudourbano.com.br`. This is validated server-side automatically.

## Example Data

The script includes example data from the actual Stelara Fase 2 - Salvador project:

**Project:** STELARA FASE 2 - SALVADOR
**Client:** Stelara/Janssen
**Dates:** 05/03/2024 - 08/03/2024

**Team (8 members):**
- Vini Ribeiro (Direção)
- Fausto Fernandes (AD)
- Alessandra Araújo (Produção)
- Bruno Marçal (Fotógrafo Still)
- Rodrigo "Diguin" Fordiani (Dir. Foto)
- Pedro "PH" Davila (Op. Cam)
- Marco Mattos (Op. Áudio)
- Jade Alves (Make)

**Locations (4):**
- Hotel Catharina Paraguaçu (Hotel)
- Clínica Cilagem (Clínica)
- Hospital Português da Bahia (Hospital)
- Hospital Aeroporto (Hospital)

**Schedule (4 days):**
- Day 1 (05/Mar/Thu): Travel to Salvador
- Day 2 (06/Mar/Fri): Filming at Hotel Catharina Paraguaçu
- Day 3 (07/Mar/Sat): Filming at Clínica Cilagem
- Day 4 (08/Mar/Sun): Return to São Paulo

## Code Features

### Well-Documented
- Portuguese comments for user-facing strings
- Detailed JSDoc comments for all functions
- Clear section organization

### Production-Ready
- Comprehensive error handling
- CORS support for cross-origin requests
- Input validation
- Consistent response format

### Scalable
- Efficient database queries
- Support for filtering and pagination concepts
- Easy to extend with new endpoints

### Secure
- Server-side email validation
- OAuth-based authentication
- No sensitive data in responses

## CORS Support

API includes CORS headers for cross-origin requests:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Error Handling

All endpoints return structured error responses:
```json
{
  "success": false,
  "error": "Error description"
}
```

Common scenarios handled:
- Unauthorized user access
- Invalid action parameter
- Missing required fields
- Resource not found
- Invalid JSON payload

## Extending the API

To add new endpoints:

1. Create a new function in the script:
```javascript
function myNewEndpoint(param) {
  // Implementation
  return { success: true, data: result };
}
```

2. Add a case in the `handleRequest` function:
```javascript
case 'myNewEndpoint':
  return createJsonResponse(myNewEndpoint(e.parameter.param));
```

3. Call from client:
```javascript
const result = await fetch(baseUrl + '?action=myNewEndpoint&param=value');
```

## Performance Notes

Google Apps Script has execution limits:
- 6 minutes of execution time per day (usually)
- 20 second timeout per request
- Sheets API quota limits

For most film production uses, this is more than adequate. Consider caching data on the client side for frequently accessed information.

## Troubleshooting

### "Unauthorized" Error
- User must be logged in with a @conteudourbano.com.br email
- Check Google Account permissions

### Empty Response
- Verify project_id exists in the Projetos sheet
- Check date format (DD/MM/YYYY)
- Review Apps Script Execution Log

### Script Not Running
- Check sheet headers match expected names
- Verify all sheets exist
- Review Execution Log for errors

See DEPLOYMENT_GUIDE.md for more troubleshooting.

## Support & Development

### Debugging
Use the included development functions:
```javascript
// Get current user info
getUserInfo()

// List all sheets
listSheets()
```

### Version History
Google Apps Script automatically maintains version history. Click the version history icon to revert changes if needed.

### Monitoring
Check the Execution Log regularly (View → Execution log) to monitor API usage and errors.

## License & Attribution

This script is provided as-is for use with the Ordem do Dia application. Developed for Conteúdo Urbano.

## Next Steps

1. **Read DEPLOYMENT_GUIDE.md** for detailed setup instructions
2. **Review API_REFERENCE.md** for complete endpoint documentation
3. **Check client-example.js** for JavaScript integration examples
4. **Deploy and test** using the included example data

## Contact

For issues or questions about deployment and usage, refer to the documentation files included in this package.

---

**Version:** 1.0
**Last Updated:** 2024
**Status:** Production Ready
