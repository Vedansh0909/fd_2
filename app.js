/* ==========================================================================
   GameZone - Gaming Dashboard Interactivity & Data Visualizations (Chart.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Charts
  initPerformanceChart();
  initGenreChart();

  // Initialize Event Listeners
  initChartFilters();
  initSearchFilters();
  initGameLaunchers();
  initSquadActions();
  initHeaderButtons();
});

// Global references for charts
let performanceChart = null;
let genreChart = null;

/* --------------------------------------------------------------------------
   1. PERFORMANCE LINE CHART (Match Win/Loss History)
   -------------------------------------------------------------------------- */
function initPerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;

  const canvasCtx = ctx.getContext('2d');

  // Gradient fill for Cyan Wins dataset
  const cyanGradient = canvasCtx.createLinearGradient(0, 0, 0, 250);
  cyanGradient.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
  cyanGradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

  // Gradient fill for Purple Losses dataset
  const purpleGradient = canvasCtx.createLinearGradient(0, 0, 0, 250);
  purpleGradient.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
  purpleGradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');

  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Victories (Wins)',
        data: [8, 12, 10, 15, 14, 22, 18],
        borderColor: '#22d3ee',
        backgroundColor: cyanGradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22d3ee',
        pointBorderColor: '#090a10',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      },
      {
        label: 'Defeats (Losses)',
        data: [2, 3, 1, 4, 2, 5, 3],
        borderColor: '#a855f7',
        backgroundColor: purpleGradient,
        borderWidth: 2,
        borderDash: [4, 4],
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#090a10',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  performanceChart = new Chart(ctx, {
    type: 'line',
    data: defaultData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#94a3b8',
            font: {
              family: 'Rajdhani',
              size: 13,
              weight: 'bold'
            },
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          backgroundColor: '#131626',
          titleColor: '#22d3ee',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(34, 211, 238, 0.3)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: { family: 'Orbitron', size: 12 },
          bodyFont: { family: 'Inter', size: 12 }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Rajdhani', size: 12, weight: '600' }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Rajdhani', size: 12, weight: '600' },
            stepSize: 5
          }
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. GENRE DOUGHNUT CHART (Playtime Distribution)
   -------------------------------------------------------------------------- */
function initGenreChart() {
  const ctx = document.getElementById('genreChart');
  if (!ctx) return;

  genreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['FPS Shooter', 'Cyberpunk RPG', 'Dark Fantasy', 'Neon Racing', 'Strategy'],
      datasets: [
        {
          data: [40, 32, 14, 9, 5],
          backgroundColor: [
            '#22d3ee', // Cyan
            '#a855f7', // Purple
            '#f43f5e', // Rose
            '#f59e0b', // Amber
            '#22c55e'  // Emerald
          ],
          borderWidth: 2,
          borderColor: '#131626',
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            font: { family: 'Rajdhani', size: 12, weight: '600' },
            usePointStyle: true,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: '#131626',
          titleColor: '#22d3ee',
          bodyColor: '#f8fafc',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (context) => ` ${context.label}: ${context.raw}% Playtime`
          }
        }
      }
    }
  });
}

/* --------------------------------------------------------------------------
   3. CHART PERIOD FILTER TABS INTERACTIVITY
   -------------------------------------------------------------------------- */
function initChartFilters() {
  const filterGroup = document.getElementById('chart-time-filter');
  if (!filterGroup || !performanceChart) return;

  const filterDataMap = {
    '7d': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      wins: [8, 12, 10, 15, 14, 22, 18],
      losses: [2, 3, 1, 4, 2, 5, 3]
    },
    '30d': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      wins: [48, 65, 82, 94],
      losses: [14, 18, 20, 15]
    },
    'season': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      wins: [140, 185, 210],
      losses: [42, 50, 46]
    }
  };

  filterGroup.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-tab-btn')) return;

    // Toggle active button state
    filterGroup.querySelectorAll('.filter-tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    const period = e.target.getAttribute('data-period');
    const newData = filterDataMap[period];

    if (newData && performanceChart) {
      performanceChart.data.labels = newData.labels;
      performanceChart.data.datasets[0].data = newData.wins;
      performanceChart.data.datasets[1].data = newData.losses;
      performanceChart.update();
    }
  });
}

/* --------------------------------------------------------------------------
   4. LIVE SEARCH & FILTERING (Games Grid & Leaderboard)
   -------------------------------------------------------------------------- */
function initSearchFilters() {
  const globalSearch = document.getElementById('global-search-input');
  const leaderboardFilter = document.getElementById('leaderboard-filter');
  const gameCards = document.querySelectorAll('.game-item-card');
  const tableRows = document.querySelectorAll('.leaderboard-row');

  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      // Filter Games
      gameCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(term) ? '' : 'none';
      });

      // Filter Leaderboard
      tableRows.forEach(row => {
        const name = row.getAttribute('data-name').toLowerCase();
        row.style.display = name.includes(term) ? '' : 'none';
      });
    });
  }

  if (leaderboardFilter) {
    leaderboardFilter.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      tableRows.forEach(row => {
        const name = row.getAttribute('data-name').toLowerCase();
        row.style.display = name.includes(term) ? '' : 'none';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE GAME LAUNCHER MODAL & TOASTS
   -------------------------------------------------------------------------- */
function initGameLaunchers() {
  const launchButtons = document.querySelectorAll('.btn-launch-game');
  const gameLaunchModalElement = document.getElementById('gameLaunchModal');
  const launchingGameName = document.getElementById('launchingGameName');
  
  if (!gameLaunchModalElement) return;

  const bsModal = new bootstrap.Modal(gameLaunchModalElement);

  launchButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const gameName = btn.getAttribute('data-game') || 'Selected Game';
      if (launchingGameName) {
        launchingGameName.textContent = gameName;
      }
      bsModal.show();

      // Auto dismiss after 3.5 seconds to simulate launch finish
      setTimeout(() => {
        bsModal.hide();
        showToast('Game Started', `${gameName} launched in Fullscreen mode! Have fun!`);
      }, 3200);
    });
  });
}

/* --------------------------------------------------------------------------
   6. SQUAD INVITE & FRIEND ACTIONS
   -------------------------------------------------------------------------- */
function initSquadActions() {
  const squadButtons = document.querySelectorAll('.btn-invite-squad');
  squadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const playerName = btn.getAttribute('data-player') || 'Player';
      showToast('Party Invitation', `Squad invitation sent to ${playerName}! Waiting for response...`);
    });
  });
}

/* --------------------------------------------------------------------------
   7. QUICK ACTION HEADER BUTTONS
   -------------------------------------------------------------------------- */
function initHeaderButtons() {
  const btnParty = document.getElementById('btn-quick-party');
  const btnMatch = document.getElementById('btn-find-match');

  if (btnParty) {
    btnParty.addEventListener('click', () => {
      showToast('Party Created', 'Squad Lobby initialized! Code: #GZ-9482. Share with friends.');
    });
  }

  if (btnMatch) {
    btnMatch.addEventListener('click', () => {
      showToast('Matchmaking Active', 'Searching for competitive Diamond II server... Ping: 14ms');
    });
  }
}

/* --------------------------------------------------------------------------
   UTILITY: SHOW TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function showToast(title, message) {
  const toastElement = document.getElementById('gamingToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  if (!toastElement) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastMessage) toastMessage.textContent = message;

  const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
  bsToast.show();
}
