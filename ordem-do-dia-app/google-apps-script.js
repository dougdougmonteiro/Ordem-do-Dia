/**
 * Ordem do Dia - Film Production Google Apps Script Backend
 *
 * This script provides a Web App API for managing film production schedules,
 * team, locations, and check-ins for the Ordem do Dia application.
 *
 * Deployment: Deploy as a Web App with execute permissions as the current user
 *
 * Structure:
 * - Projetos: Project registry
 * - Equipe: Team members per project
 * - Locacoes: Location registry
 * - Cronograma: Detailed schedule with time blocks
 * - CheckIns: Team member check-ins
 * - Config: Global configuration
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const AUTHORIZED_DOMAIN = '@conteudourbano.com.br';
const SHEET_NAMES = {
  PROJETOS: 'Projetos',
  EQUIPE: 'Equipe',
  LOCACOES: 'Locacoes',
  CRONOGRAMA: 'Cronograma',
  CHECKINS: 'CheckIns',
  CONFIG: 'Config'
};

const HEADERS = {
  [SHEET_NAMES.PROJETOS]: ['id', 'nome_projeto', 'cliente', 'data_inicio', 'data_fim', 'status'],
  [SHEET_NAMES.EQUIPE]: ['id', 'projeto_id', 'nome', 'funcao', 'email', 'telefone'],
  [SHEET_NAMES.LOCACOES]: ['id', 'projeto_id', 'nome', 'endereco', 'tipo', 'observacao'],
  [SHEET_NAMES.CRONOGRAMA]: [
    'id', 'projeto_id', 'dia_data', 'dia_semana', 'dia_tipo',
    'dia_locacao', 'quadro_ordem', 'quadro_inicio', 'quadro_nome',
    'quadro_duracao', 'quadro_obs', 'quadro_termino', 'status'
  ],
  [SHEET_NAMES.CHECKINS]: ['id', 'projeto_id', 'dia_data', 'email_usuario', 'nome_usuario', 'horario_checkin', 'locacao'],
  [SHEET_NAMES.CONFIG]: ['chave', 'valor']
};

// ============================================================================
// WEB APP ENTRY POINTS
// ============================================================================

/**
 * Main GET handler for API requests
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Main POST handler for API requests
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * Central request handler - routes to appropriate function based on action
 */
function handleRequest(e) {
  try {
    // Validate authorization
    const userEmail = Session.getActiveUser().getEmail();
    if (!isAuthorized(userEmail)) {
      return createJsonResponse({
        success: false,
        error: 'Unauthorized. User must belong to ' + AUTHORIZED_DOMAIN
      }, 403);
    }

    const action = e.parameter.action || '';
    const payload = e.postData ? JSON.parse(e.postData.contents || '{}') : {};

    // Route to appropriate handler
    switch (action) {
      case 'getProjeto':
        return createJsonResponse(getProjeto(e.parameter.projeto_id));

      case 'getCronograma':
        return createJsonResponse(getCronograma(
          e.parameter.projeto_id,
          e.parameter.data || null
        ));

      case 'getEquipe':
        return createJsonResponse(getEquipe(e.parameter.projeto_id));

      case 'getLocacoes':
        return createJsonResponse(getLocacoes(e.parameter.projeto_id));

      case 'updateCronograma':
        return createJsonResponse(updateCronograma(payload));

      case 'checkIn':
        return createJsonResponse(checkIn(payload));

      case 'getCheckIns':
        return createJsonResponse(getCheckIns(
          e.parameter.projeto_id,
          e.parameter.data || null
        ));

      case 'getConfig':
        return createJsonResponse(getConfig(e.parameter.chave || null));

      case 'getAllData':
        return createJsonResponse(getAllData(e.parameter.projeto_id));

      default:
        return createJsonResponse({
          success: false,
          error: 'Unknown action: ' + action
        }, 400);
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    }, 500);
  }
}

// ============================================================================
// API ENDPOINT IMPLEMENTATIONS
// ============================================================================

/**
 * Get project data by ID
 */
function getProjeto(projetoId) {
  const sheet = getSheet(SHEET_NAMES.PROJETOS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0].toString() === projetoId.toString()) {
      return {
        success: true,
        data: rowToObject(headers, row)
      };
    }
  }

  return {
    success: false,
    error: 'Projeto não encontrado: ' + projetoId
  };
}

/**
 * Get schedule for a project, optionally filtered by date
 * Returns array of schedule items
 */
function getCronograma(projetoId, filterData = null) {
  const sheet = getSheet(SHEET_NAMES.CRONOGRAMA);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1].toString() === projetoId.toString()) {
      if (filterData === null || row[2].toString() === filterData.toString()) {
        results.push(rowToObject(headers, row));
      }
    }
  }

  return {
    success: true,
    data: results,
    count: results.length
  };
}

/**
 * Get team members for a project
 */
function getEquipe(projetoId) {
  const sheet = getSheet(SHEET_NAMES.EQUIPE);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1].toString() === projetoId.toString()) {
      results.push(rowToObject(headers, row));
    }
  }

  return {
    success: true,
    data: results,
    count: results.length
  };
}

/**
 * Get locations for a project
 */
function getLocacoes(projetoId) {
  const sheet = getSheet(SHEET_NAMES.LOCACOES);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1].toString() === projetoId.toString()) {
      results.push(rowToObject(headers, row));
    }
  }

  return {
    success: true,
    data: results,
    count: results.length
  };
}

/**
 * Update a schedule row (status, times, etc)
 * Expected payload: { id: string, updates: { field: value, ... } }
 */
function updateCronograma(payload) {
  if (!payload.id || !payload.updates) {
    return {
      success: false,
      error: 'Payload deve conter id e updates'
    };
  }

  const sheet = getSheet(SHEET_NAMES.CRONOGRAMA);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      // Update specified fields
      for (const field in payload.updates) {
        const colIndex = headers.indexOf(field);
        if (colIndex !== -1) {
          data[i][colIndex] = payload.updates[field];
        }
      }
      // Write back to sheet
      sheet.getRange(i + 1, 1, 1, headers.length).setValues([data[i]]);
      return {
        success: true,
        message: 'Cronograma atualizado com sucesso',
        id: payload.id
      };
    }
  }

  return {
    success: false,
    error: 'Item do cronograma não encontrado: ' + payload.id
  };
}

/**
 * Register a team member check-in
 * Expected payload: { projeto_id, dia_data, email_usuario, nome_usuario, locacao }
 */
function checkIn(payload) {
  if (!payload.projeto_id || !payload.dia_data || !payload.email_usuario) {
    return {
      success: false,
      error: 'Payload deve conter projeto_id, dia_data e email_usuario'
    };
  }

  const sheet = getSheet(SHEET_NAMES.CHECKINS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Generate ID
  const newId = 'CI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const horarioCheckin = new Date().toISOString();

  const newRow = [
    newId,
    payload.projeto_id,
    payload.dia_data,
    payload.email_usuario,
    payload.nome_usuario || '',
    horarioCheckin,
    payload.locacao || ''
  ];

  sheet.appendRow(newRow);

  return {
    success: true,
    message: 'Check-in registrado com sucesso',
    id: newId,
    horario: horarioCheckin
  };
}

/**
 * Get check-ins for a project, optionally filtered by date
 */
function getCheckIns(projetoId, filterData = null) {
  const sheet = getSheet(SHEET_NAMES.CHECKINS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const results = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1].toString() === projetoId.toString()) {
      if (filterData === null || row[2].toString() === filterData.toString()) {
        results.push(rowToObject(headers, row));
      }
    }
  }

  return {
    success: true,
    data: results,
    count: results.length
  };
}

/**
 * Get config values
 * If chave is specified, return just that value; otherwise return all config
 */
function getConfig(chave = null) {
  const sheet = getSheet(SHEET_NAMES.CONFIG);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  if (chave) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === chave) {
        return {
          success: true,
          data: {
            chave: chave,
            valor: data[i][1]
          }
        };
      }
    }
    return {
      success: false,
      error: 'Config chave não encontrada: ' + chave
    };
  }

  // Return all config
  const configs = {};
  for (let i = 1; i < data.length; i++) {
    configs[data[i][0]] = data[i][1];
  }

  return {
    success: true,
    data: configs
  };
}

/**
 * Get everything for a project in one call (initial load)
 */
function getAllData(projetoId) {
  const projeto = getProjeto(projetoId);
  const cronograma = getCronograma(projetoId);
  const equipe = getEquipe(projetoId);
  const locacoes = getLocacoes(projetoId);
  const config = getConfig();

  if (!projeto.success) {
    return projeto;
  }

  return {
    success: true,
    data: {
      projeto: projeto.data,
      cronograma: cronograma.data,
      equipe: equipe.data,
      locacoes: locacoes.data,
      config: config.data
    }
  };
}

// ============================================================================
// SETUP & INITIALIZATION
// ============================================================================

/**
 * Create all sheets with headers
 * Run this once to initialize the spreadsheet
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Save reference to existing sheets (to delete later)
  const oldSheets = ss.getSheets();

  // Create each sheet with headers FIRST
  for (const sheetName in HEADERS) {
    const headers = HEADERS[sheetName];
    const newSheet = ss.insertSheet(sheetName);
    newSheet.appendRow(headers);

    // Format header row
    const headerRange = newSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1f73e6')
      .setFontColor('#ffffff')
      .setFontWeight('bold');
  }

  // NOW remove old default sheets (safe because new ones already exist)
  oldSheets.forEach(sheet => {
    try { ss.deleteSheet(sheet); } catch(e) { /* ignore if already removed */ }
  });

  Logger.log('Sheets criadas com sucesso!');
}

/**
 * Populate example data based on Stelara Fase 2 Salvador project
 * Run this after setupSheets() to fill in example data
 */
function populateExampleData() {
  // Project
  const projetoSheet = getSheet(SHEET_NAMES.PROJETOS);
  projetoSheet.appendRow([
    '1',
    'STELARA FASE 2 - SALVADOR',
    'Stelara/Janssen',
    '05/03/2024',
    '08/03/2024',
    'ativo'
  ]);

  // Team members
  const equipeSheet = getSheet(SHEET_NAMES.EQUIPE);
  const teamData = [
    ['1', '1', 'Vini Ribeiro', 'Direção', 'vini@conteudourbano.com.br', ''],
    ['2', '1', 'Fausto Fernandes', 'AD', 'fausto@conteudourbano.com.br', ''],
    ['3', '1', 'Alessandra Araújo', 'Produção', 'alessandra@conteudourbano.com.br', ''],
    ['4', '1', 'Bruno Marçal', 'Fotógrafo Still', 'bruno@conteudourbano.com.br', ''],
    ['5', '1', 'Rodrigo Fordiani', 'Dir. Foto', 'diguin@conteudourbano.com.br', ''],
    ['6', '1', 'Pedro Davila', 'Op. Cam', 'ph@conteudourbano.com.br', ''],
    ['7', '1', 'Marco Mattos', 'Op. Áudio', 'marco@conteudourbano.com.br', ''],
    ['8', '1', 'Jade Alves', 'Make', 'jade@conteudourbano.com.br', '']
  ];
  teamData.forEach(row => equipeSheet.appendRow(row));

  // Locations
  const locacoesSheet = getSheet(SHEET_NAMES.LOCACOES);
  const locationsData = [
    ['1', '1', 'Hotel Catharina Paraguaçu', 'R. João Gomes, 128 - Rio Vermelho, Salvador - BA, 41950-640', 'locacao', 'Hotel de hospedagem'],
    ['2', '1', 'Clínica Cilagem', 'Av. Luiz Viana Filho, 13223, Hangar Business Park, Torre 7, Salas 410/411, Salvador, Bahia, 41500-300', 'locacao', 'Clínica para gravações'],
    ['3', '1', 'Hospital Português da Bahia', 'Av. Princesa Isabel, 914 - Graça, Salvador - BA, 40130-030', 'hospital', 'Hospital'],
    ['4', '1', 'Hospital Aeroporto', 'Av. Santos Dumont, 2028. Centro, Lauro de Freitas, CEP: 2702-400', 'hospital', 'Hospital']
  ];
  locationsData.forEach(row => locacoesSheet.appendRow(row));

  // Schedule - Cronograma
  const cronogramaSheet = getSheet(SHEET_NAMES.CRONOGRAMA);

  // Day 1 - March 5 (Thursday)
  cronogramaSheet.appendRow([
    '1-1', '1', '05/03/2024', 'QUINTA', 'DESLOCAMENTO',
    'Aeroporto Congonhas/Aeroporto Salvador', '1', '13:00', 'Saída CU', '00:30', '', '13:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '1-2', '1', '05/03/2024', 'QUINTA', 'DESLOCAMENTO',
    'Aeroporto Congonhas/Aeroporto Salvador', '2', '13:30', 'Chegada Aeroporto Congonhas (equipe SP)', '01:10', 'Deslocamento SP > Salvador', '14:40', 'pendente'
  ]);

  // Day 2 - March 6 (Friday)
  cronogramaSheet.appendRow([
    '2-1', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Hotel Catharina Paraguaçu', '1', '09:00', 'Montagem + Make + Áudio', '01:30', 'Talento também chega', '10:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '2-2', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Hotel Catharina Paraguaçu', '2', '09:30', 'Make Talento', '01:00', '', '10:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '2-3', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Hotel Catharina Paraguaçu', '3', '10:30', 'Gravação + Fotos', '03:00', 'Paciente Cristina Peleteiro', '13:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '2-4', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Hotel Catharina Paraguaçu', '4', '13:30', 'Desprodução', '01:00', '', '14:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '2-5', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Hotel Catharina Paraguaçu', '5', '14:30', 'Almoço', '01:00', '', '15:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '2-6', '1', '06/03/2024', 'SEXTA', 'GRAVAÇÃO',
    'Clínica Cilagem', '6', '17:00', 'Gravação Establishing Shots', '02:00', 'sem elenco', '19:00', 'pendente'
  ]);

  // Day 3 - March 7 (Saturday)
  cronogramaSheet.appendRow([
    '3-1', '1', '07/03/2024', 'SÁBADO', 'GRAVAÇÃO',
    'Clínica Cilagem', '1', '08:00', 'Chegada + Montagem', '02:30', 'Equipe Geral', '10:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '3-2', '1', '07/03/2024', 'SÁBADO', 'GRAVAÇÃO',
    'Clínica Cilagem', '2', '09:30', 'Make Talento', '01:00', '', '10:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '3-3', '1', '07/03/2024', 'SÁBADO', 'GRAVAÇÃO',
    'Clínica Cilagem', '3', '10:30', 'Gravação + Fotos', '02:00', '', '12:30', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '3-4', '1', '07/03/2024', 'SÁBADO', 'GRAVAÇÃO',
    'Clínica Cilagem', '4', '12:00', 'Desprodução + Almoço', '', '', '', 'pendente'
  ]);

  // Day 4 - March 8 (Sunday)
  cronogramaSheet.appendRow([
    '4-1', '1', '08/03/2024', 'DOMINGO', 'DESLOCAMENTO',
    'Aeroporto Salvador/Aeroporto Congonhas', '1', '', 'Chegada Aeroporto (Fausto + Bruno)', '', '', '', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '4-2', '1', '08/03/2024', 'DOMINGO', 'DESLOCAMENTO',
    'Aeroporto Salvador/Aeroporto Congonhas', '2', '', 'Deslocamento Salvador > SP', '01:15', '', '', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '4-3', '1', '08/03/2024', 'DOMINGO', 'DESLOCAMENTO',
    'Aeroporto Salvador/Aeroporto Congonhas', '3', '', 'Chegada Aeroporto (Vini + Ale + Diguin + PH)', '', '', '', 'pendente'
  ]);
  cronogramaSheet.appendRow([
    '4-4', '1', '08/03/2024', 'DOMINGO', 'DESLOCAMENTO',
    'Aeroporto Salvador/Aeroporto Congonhas', '4', '', 'Deslocamento Salvador > SP', '01:15', '', '', 'pendente'
  ]);

  // Config
  const configSheet = getSheet(SHEET_NAMES.CONFIG);
  configSheet.appendRow(['projeto_nome', 'STELARA FASE 2 - SALVADOR']);
  configSheet.appendRow(['cliente', 'Stelara/Janssen']);
  configSheet.appendRow(['clima', 'Parcialmente nublado']);
  configSheet.appendRow(['temperatura', '28°C']);

  Logger.log('Dados de exemplo adicionados com sucesso!');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get or create a sheet by name
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (HEADERS[sheetName]) {
      sheet.appendRow(HEADERS[sheetName]);
    }
  }

  return sheet;
}

/**
 * Convert a spreadsheet row to an object using headers
 */
function rowToObject(headers, row) {
  const obj = {};
  for (let i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i] !== undefined ? row[i] : '';
  }
  return obj;
}

/**
 * Create a JSON response with CORS headers
 */
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.addHeader('Access-Control-Max-Age', '86400');
  output.setHeader('Access-Control-Allow-Credentials', 'true');

  // Note: In Google Apps Script, we cannot directly set HTTP status codes in responses.
  // The statusCode parameter is noted here for documentation purposes.
  // HTTP 200 is the default for all successful responses.

  return output;
}

/**
 * Check if user email is authorized
 */
function isAuthorized(userEmail) {
  return userEmail && userEmail.endsWith(AUTHORIZED_DOMAIN);
}

/**
 * Handle CORS preflight OPTIONS requests
 */
function doOptions(e) {
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.JSON);
  output.addHeader('Access-Control-Allow-Origin', '*');
  output.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.addHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  output.addHeader('Access-Control-Max-Age', '86400');
  output.setHeader('Access-Control-Allow-Credentials', 'true');
  return output;
}

// ============================================================================
// DEVELOPMENT/DEBUG FUNCTIONS
// ============================================================================

/**
 * Get current user info (for debugging)
 */
function getUserInfo() {
  const user = Session.getActiveUser();
  return {
    email: user.getEmail(),
    isAuthorized: isAuthorized(user.getEmail())
  };
}

/**
 * Log all sheets in the spreadsheet (for debugging)
 */
function listSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  const result = [];

  sheets.forEach(sheet => {
    result.push({
      name: sheet.getName(),
      rows: sheet.getLastRow(),
      columns: sheet.getLastColumn()
    });
  });

  return result;
}
