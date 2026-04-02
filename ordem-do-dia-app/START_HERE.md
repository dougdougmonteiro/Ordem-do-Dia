# START HERE - Ordem do Dia Backend

Welcome! This package contains a complete Google Apps Script backend for the Ordem do Dia film production management application.

## What You Have

A production-ready backend consisting of:
- **9 API endpoints** for managing projects, team, schedules, and check-ins
- **6 Google Sheets tabs** for data storage
- **JavaScript client library** for frontend integration
- **Complete documentation** for setup and usage

## Quick Timeline

| Time | Action |
|------|--------|
| 5 min | Read README.md |
| 10 min | Follow DEPLOYMENT_GUIDE.md steps 1-5 |
| 2 min | Run setupSheets() function |
| 2 min | Run populateExampleData() function (optional) |
| 5 min | Follow DEPLOYMENT_GUIDE.md step 6 (deploy) |
| **24 min** | **Total setup time** |

## Reading Order

### 1. First Time? Start Here
**README.md** (7 min read)
- Overview of what's in this package
- Quick 6-step setup guide
- Key features and database structure

### 2. Ready to Deploy? Follow This
**DEPLOYMENT_GUIDE.md** (15 min read)
- Complete step-by-step setup instructions
- Screenshots of what you'll see
- Troubleshooting tips

### 3. While Building Your Frontend
**API_REFERENCE.md** (5 min browse)
- Quick lookup for all 9 endpoints
- Request/response examples
- cURL and JavaScript examples

### 4. Building Your Frontend App
**client-example.js** (10 min review)
- Copy-paste ready JavaScript library
- 10 complete usage examples
- HTML form integration example

## The 9 API Endpoints

```
1. getProjeto          - Get project information
2. getCronograma       - Get schedule (with optional date filter)
3. getEquipe           - Get team members
4. getLocacoes         - Get filming locations
5. updateCronograma    - Update schedule status/times
6. checkIn             - Register team member check-in
7. getCheckIns         - Get check-ins (with optional date filter)
8. getConfig           - Get configuration settings
9. getAllData          - Get everything in one call
```

## Files in This Package

| File | Size | Purpose |
|------|------|---------|
| **google-apps-script.js** | 20 KB | Backend code - copy to Apps Script |
| **client-example.js** | 14 KB | JavaScript client library |
| **README.md** | 7.7 KB | Start here |
| **DEPLOYMENT_GUIDE.md** | 11 KB | Setup instructions |
| **API_REFERENCE.md** | 7.8 KB | Endpoint reference |
| **ARCHITECTURE.md** | 27 KB | System design (optional read) |
| **INDEX.md** | 9.4 KB | File navigation |
| **COMPLETION_REPORT.md** | 11 KB | What was delivered |
| **START_HERE.md** | This file | Quick reference |

## What's Included

### Backend Code
- Web App entry points (doGet/doPost)
- 9 fully implemented endpoints
- Database operations
- Error handling and validation
- CORS support
- OAuth authorization

### Database
- 6 Google Sheets tabs ready to use
- Automatic setup function
- Example data from Stelara Fase 2 - Salvador project
- 8 team members, 4 locations, 18 schedule items

### Security
- OAuth 2.0 via Google (automatic)
- Email domain validation (@conteudourbano.com.br)
- Server-side authorization
- No API keys needed

### Documentation
- Step-by-step deployment guide
- Complete API specification
- Code examples and patterns
- Architecture overview
- Troubleshooting guide

## Deployment Steps

### Step 1: Create Google Sheet
Go to sheets.google.com and create a new sheet named "Ordem do Dia"

### Step 2: Add the Script
1. Click Tools → Script Editor
2. Copy entire contents of google-apps-script.js
3. Paste into editor
4. Click Save

### Step 3: Initialize Database
1. Click function dropdown (near play button)
2. Select `setupSheets`
3. Click Run
4. Authorize if prompted
5. Done! All sheets created

### Step 4: Add Example Data (Optional)
1. Select `populateExampleData` from dropdown
2. Click Run
3. Data added!

### Step 5: Deploy as Web App
1. Click Deploy → New deployment
2. Type: Web app
3. Execute as: Your account
4. Access: Anyone
5. Click Deploy
6. Copy the URL

### Step 6: You're Done!
Use the deployment URL with the client library to connect your frontend

## Example Usage

```javascript
// Initialize client with your deployment URL
const client = new OrdemDoDiaClient('YOUR_DEPLOYMENT_URL');

// Load all project data
const data = await client.getAllData('1');

// Register a check-in
await client.checkIn({
  projeto_id: '1',
  dia_data: '06/03/2024',
  email_usuario: 'user@conteudourbano.com.br',
  nome_usuario: 'John Doe'
});

// Update schedule status
await client.updateCronograma('1-1', {
  status: 'em_andamento'
});
```

See client-example.js for 10 complete examples.

## Troubleshooting

### "Unauthorized" Error
- User must be logged in with @conteudourbano.com.br email
- Check Google Account permissions

### API Returns Empty
- Verify projeto_id exists in Projetos sheet
- Check date format (DD/MM/YYYY)
- See DEPLOYMENT_GUIDE.md Troubleshooting section

### Sheet Tabs Not Created
- Check Apps Script Execution Log
- Make sure you ran setupSheets()
- See DEPLOYMENT_GUIDE.md for more

## Next Steps

1. Read README.md (quick overview)
2. Follow DEPLOYMENT_GUIDE.md (exact setup steps)
3. Test with example data
4. Review API_REFERENCE.md (while building)
5. Use client-example.js as template
6. Build your frontend

## Support Files

- **README.md** - Overview and quick start
- **DEPLOYMENT_GUIDE.md** - Detailed setup guide
- **API_REFERENCE.md** - Endpoint specifications
- **INDEX.md** - File navigation
- **ARCHITECTURE.md** - System design (deep dive)
- **COMPLETION_REPORT.md** - What was delivered

## Key Features

✓ Production-ready backend
✓ 9 API endpoints
✓ Google Sheets database
✓ OAuth 2.0 authentication
✓ Email domain validation
✓ CORS enabled
✓ Complete documentation
✓ Example data included
✓ JavaScript client library
✓ No dependencies

## Zero Setup Required

- No additional tools needed
- No dependencies to install
- No API keys to manage
- Uses only Google services
- Works in 15 minutes

## Questions?

All answers are in the documentation files. Use INDEX.md to find what you need.

---

**Ready?** Start with README.md
**Want to deploy?** Go to DEPLOYMENT_GUIDE.md
**Building frontend?** Use API_REFERENCE.md and client-example.js

Good luck!
