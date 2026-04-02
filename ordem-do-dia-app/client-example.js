/**
 * Ordem do Dia API Client Library
 *
 * Example usage of the Google Apps Script backend for the Ordem do Dia app.
 * This file demonstrates how to interact with all API endpoints.
 */

class OrdemDoDiaClient {
  /**
   * Initialize the client with the deployment URL
   * @param {string} baseUrl - The Web App deployment URL
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Internal method to make API requests
   */
  async request(action, params = {}, method = 'GET', body = null) {
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('action', action);

      // Add query parameters
      for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, value);
        }
      }

      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url.toString(), options);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      return data.data || data;
    } catch (error) {
      console.error(`API Error (${action}):`, error.message);
      throw error;
    }
  }

  // ========================================================================
  // Projetos (Projects)
  // ========================================================================

  /**
   * Get project information by ID
   * @param {string} projetoId - Project ID
   * @returns {Promise<Object>} Project data
   */
  async getProjeto(projetoId) {
    return this.request('getProjeto', { projeto_id: projetoId });
  }

  // ========================================================================
  // Cronograma (Schedule)
  // ========================================================================

  /**
   * Get schedule items for a project
   * @param {string} projetoId - Project ID
   * @param {string} [data] - Optional date filter (DD/MM/YYYY)
   * @returns {Promise<Object>} Schedule data with count
   */
  async getCronograma(projetoId, data = null) {
    return this.request('getCronograma', { projeto_id: projetoId, data });
  }

  /**
   * Update a schedule item
   * @param {string} id - Schedule item ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Update confirmation
   */
  async updateCronograma(id, updates) {
    return this.request('updateCronograma', {}, 'POST', { id, updates });
  }

  // ========================================================================
  // Equipe (Team)
  // ========================================================================

  /**
   * Get team members for a project
   * @param {string} projetoId - Project ID
   * @returns {Promise<Object>} Team data with count
   */
  async getEquipe(projetoId) {
    return this.request('getEquipe', { projeto_id: projetoId });
  }

  // ========================================================================
  // Locacoes (Locations)
  // ========================================================================

  /**
   * Get locations for a project
   * @param {string} projetoId - Project ID
   * @returns {Promise<Object>} Locations data with count
   */
  async getLocacoes(projetoId) {
    return this.request('getLocacoes', { projeto_id: projetoId });
  }

  // ========================================================================
  // CheckIns
  // ========================================================================

  /**
   * Register a check-in
   * @param {Object} checkInData - Check-in information
   * @param {string} checkInData.projeto_id - Project ID
   * @param {string} checkInData.dia_data - Date (DD/MM/YYYY)
   * @param {string} checkInData.email_usuario - User email
   * @param {string} [checkInData.nome_usuario] - User name
   * @param {string} [checkInData.locacao] - Location
   * @returns {Promise<Object>} Check-in confirmation with ID
   */
  async checkIn(checkInData) {
    return this.request('checkIn', {}, 'POST', checkInData);
  }

  /**
   * Get check-ins for a project
   * @param {string} projetoId - Project ID
   * @param {string} [data] - Optional date filter (DD/MM/YYYY)
   * @returns {Promise<Object>} Check-ins data with count
   */
  async getCheckIns(projetoId, data = null) {
    return this.request('getCheckIns', { projeto_id: projetoId, data });
  }

  // ========================================================================
  // Config
  // ========================================================================

  /**
   * Get configuration
   * @param {string} [chave] - Optional specific config key
   * @returns {Promise<Object>} Config data
   */
  async getConfig(chave = null) {
    if (chave) {
      return this.request('getConfig', { chave });
    }
    return this.request('getConfig', {});
  }

  // ========================================================================
  // Bulk Operations
  // ========================================================================

  /**
   * Get all data for a project in one call
   * @param {string} projetoId - Project ID
   * @returns {Promise<Object>} Complete project data
   */
  async getAllData(projetoId) {
    return this.request('getAllData', { projeto_id: projetoId });
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Initialize client and load project data
 */
async function example_loadProject() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    // Get complete project data
    const allData = await client.getAllData('1');
    console.log('Project:', allData.data.projeto);
    console.log('Team members:', allData.data.equipe);
    console.log('Schedule items:', allData.data.cronograma.length);
    console.log('Locations:', allData.data.locacoes);
  } catch (error) {
    console.error('Failed to load project:', error);
  }
}

/**
 * Example 2: Get schedule for a specific date
 */
async function example_getScheduleByDate() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const schedule = await client.getCronograma('1', '06/03/2024');
    console.log(`Schedule for 06/03/2024 (${schedule.count} items):`);
    schedule.data.forEach(item => {
      console.log(`- ${item.quadro_inicio} - ${item.quadro_nome} (${item.quadro_duracao})`);
    });
  } catch (error) {
    console.error('Failed to get schedule:', error);
  }
}

/**
 * Example 3: Register a check-in
 */
async function example_checkIn() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const checkInResult = await client.checkIn({
      projeto_id: '1',
      dia_data: '06/03/2024',
      email_usuario: 'vini@conteudourbano.com.br',
      nome_usuario: 'Vini Ribeiro',
      locacao: 'Hotel Catharina Paraguaçu'
    });

    console.log('Check-in registered:', checkInResult.id);
    console.log('Time:', checkInResult.horario);
  } catch (error) {
    console.error('Failed to register check-in:', error);
  }
}

/**
 * Example 4: Update schedule status
 */
async function example_updateSchedule() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const result = await client.updateCronograma('1-1', {
      status: 'em_andamento',
      quadro_inicio: '13:15',
      quadro_obs: 'Running 15 minutes late'
    });

    console.log('Update result:', result.message);
  } catch (error) {
    console.error('Failed to update schedule:', error);
  }
}

/**
 * Example 5: Get team members and display
 */
async function example_displayTeam() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const team = await client.getEquipe('1');
    console.log(`Team (${team.count} members):`);
    team.data.forEach(member => {
      console.log(`- ${member.nome} (${member.funcao}) - ${member.email}`);
    });
  } catch (error) {
    console.error('Failed to get team:', error);
  }
}

/**
 * Example 6: Get locations
 */
async function example_getLocations() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const locations = await client.getLocacoes('1');
    console.log(`Locations (${locations.count}):`);
    locations.data.forEach(loc => {
      console.log(`- ${loc.nome} (${loc.tipo})`);
      console.log(`  ${loc.endereco}`);
      if (loc.observacao) {
        console.log(`  ${loc.observacao}`);
      }
    });
  } catch (error) {
    console.error('Failed to get locations:', error);
  }
}

/**
 * Example 7: Get check-ins for a date
 */
async function example_getCheckinsForDate() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const checkIns = await client.getCheckIns('1', '06/03/2024');
    console.log(`Check-ins for 06/03/2024 (${checkIns.count}):`);
    checkIns.data.forEach(checkin => {
      const time = new Date(checkin.horario_checkin).toLocaleTimeString();
      console.log(`- ${checkin.nome_usuario} at ${time} (${checkin.locacao})`);
    });
  } catch (error) {
    console.error('Failed to get check-ins:', error);
  }
}

/**
 * Example 8: Get configuration
 */
async function example_getConfig() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    // Get all config
    const allConfig = await client.getConfig();
    console.log('Config:', allConfig.data);

    // Get specific config value
    const projectName = await client.getConfig('projeto_nome');
    console.log('Project Name:', projectName.data.valor);
  } catch (error) {
    console.error('Failed to get config:', error);
  }
}

/**
 * Example 9: Real-time status monitoring
 * Check schedule status every minute and display pending items
 */
async function example_monitorSchedule() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  setInterval(async () => {
    try {
      const schedule = await client.getCronograma('1');
      const pending = schedule.data.filter(item => item.status === 'pendente');
      const inProgress = schedule.data.filter(item => item.status === 'em_andamento');

      console.log(`[${new Date().toLocaleTimeString()}] Pending: ${pending.length}, In progress: ${inProgress.length}`);

      // Show next pending item
      if (pending.length > 0) {
        const next = pending[0];
        console.log(`Next: ${next.quadro_inicio} - ${next.quadro_nome}`);
      }
    } catch (error) {
      console.error('Monitoring error:', error);
    }
  }, 60000); // Check every minute
}

/**
 * Example 10: Batch check-ins for all team members
 */
async function example_batchCheckIn() {
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  const teamMembers = [
    { email: 'vini@conteudourbano.com.br', name: 'Vini Ribeiro' },
    { email: 'fausto@conteudourbano.com.br', name: 'Fausto Fernandes' },
    { email: 'alessandra@conteudourbano.com.br', name: 'Alessandra Araújo' },
    { email: 'bruno@conteudourbano.com.br', name: 'Bruno Marçal' }
  ];

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  try {
    const results = await Promise.all(
      teamMembers.map(member =>
        client.checkIn({
          projeto_id: '1',
          dia_data: dateStr,
          email_usuario: member.email,
          nome_usuario: member.name,
          locacao: 'Hotel Catharina Paraguaçu'
        })
      )
    );

    console.log(`Batch check-in complete: ${results.length} team members checked in`);
  } catch (error) {
    console.error('Batch check-in failed:', error);
  }
}

// ============================================================================
// HTML FORM INTEGRATION EXAMPLE
// ============================================================================

/**
 * Example HTML form handler for check-in
 */
async function handleCheckInForm(event) {
  event.preventDefault();

  const form = event.target;
  const client = new OrdemDoDiaClient('https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb');

  try {
    const result = await client.checkIn({
      projeto_id: form.projeto_id.value,
      dia_data: form.dia_data.value,
      email_usuario: form.email_usuario.value,
      nome_usuario: form.nome_usuario.value,
      locacao: form.locacao.value
    });

    // Display success message
    const successMsg = document.getElementById('success-message');
    if (successMsg) {
      successMsg.textContent = `Check-in successful! ID: ${result.id}`;
      successMsg.style.display = 'block';
    }

    // Clear form
    form.reset();
  } catch (error) {
    // Display error message
    const errorMsg = document.getElementById('error-message');
    if (errorMsg) {
      errorMsg.textContent = `Error: ${error.message}`;
      errorMsg.style.display = 'block';
    }
  }
}

// ============================================================================
// EXPORT FOR USE IN OTHER FILES
// ============================================================================

// If using ES6 modules
// export { OrdemDoDiaClient };

// If using CommonJS
// module.exports = OrdemDoDiaClient;
