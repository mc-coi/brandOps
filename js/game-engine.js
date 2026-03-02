// ============================================
// BRANDOPS SIMULATOR - Game Logic Engine
// ============================================

const GameEngine = {

  // ── Market Score ────────────────────────────────────────────
  calcMarketScore(stats) {
    return Math.round(
      stats.demand +
      stats.reputation +
      stats.innovation +
      (stats.budget / 10) -
      stats.risk
    );
  },

  // ── Stock Price ─────────────────────────────────────────────
  calcStockPrice(marketScore, volatility = 50) {
    const base = GAME_CONFIG.baseStockPrice;
    const drift = ((Math.random() * 4) - 2) * (volatility / 50);
    return Math.max(0.01, parseFloat((base + (marketScore / 10) + drift).toFixed(2)));
  },

  // ── Get Current Phase ───────────────────────────────────────
  getPhase(week) {
    return GAME_CONFIG.phases.find(p => week >= p.weeks[0] && week <= p.weeks[1])
      || GAME_CONFIG.phases[0];
  },

  // ── Apply Event Card Effects ────────────────────────────────
  applyCardEffects(stats, effects, volatility = 50) {
    const vol = volatility / 50; // 1.0 at neutral, up to 2.0 at max chaos
    const newStats = { ...stats };
    for (const [stat, delta] of Object.entries(effects)) {
      if (stat in newStats) {
        const scaled = Math.round(delta * vol);
        newStats[stat] = Math.min(
          GAME_CONFIG.statMax,
          Math.max(GAME_CONFIG.statMin, newStats[stat] + scaled)
        );
      }
    }
    return newStats;
  },

  // ── Apply Deliverable Score ─────────────────────────────────
  applyDeliverableScore(stats, deliverableKey, scoreValue) {
    const deliverable = DELIVERABLE_TYPES[deliverableKey];
    const effect = GAME_CONFIG.scoreEffects[scoreValue];
    if (!deliverable || !effect) return stats;

    const newStats = { ...stats };
    const boostAmount = Math.round(8 * effect.multiplier);

    for (const statName of deliverable.affects) {
      if (statName in newStats) {
        if (statName === 'risk') {
          // Higher score = LOWER risk (good performance reduces risk)
          newStats[statName] = Math.max(0, newStats[statName] - boostAmount);
        } else {
          newStats[statName] = Math.min(100, newStats[statName] + boostAmount);
        }
      }
    }
    return newStats;
  },

  // ── Clamp Stats ─────────────────────────────────────────────
  clampStats(stats) {
    const clamped = {};
    for (const [k, v] of Object.entries(stats)) {
      clamped[k] = Math.min(GAME_CONFIG.statMax, Math.max(GAME_CONFIG.statMin, v));
    }
    return clamped;
  },

  // ── Crisis Check ────────────────────────────────────────────
  checkCrisis(stats) {
    if (stats.risk >= 100) return { type: 'risk', message: 'MAXIMUM RISK — Crisis Event Triggered!' };
    if (stats.budget <= 0)  return { type: 'bankrupt', message: 'BUDGET DEPLETED — Emergency Mode!' };
    return null;
  },

  // ── Generate Random Brand Dossier ───────────────────────────
  generateBrandDossier(name) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const industry = pick(BRAND_DATA.industries);

    return {
      brandName: name || "Brand " + Math.floor(Math.random() * 999),
      industry,
      country: pick(BRAND_DATA.countries),
      targetDemo: pick(BRAND_DATA.demographics),
      componentTier: pick(BRAND_DATA.componentTiers),
      shippingMethod: pick(BRAND_DATA.shippingMethods),
      pricePoint: pick(BRAND_DATA.pricePoints),
      stats: {
        budget:     Math.floor(Math.random() * 30) + 50, // 50-80
        demand:     Math.floor(Math.random() * 30) + 30, // 30-60
        reputation: Math.floor(Math.random() * 30) + 30, // 30-60
        innovation: Math.floor(Math.random() * 30) + 30, // 30-60
        risk:       Math.floor(Math.random() * 20) + 5,  // 5-25
      },
      stockHistory: [],
      eventLog: [],
      scoreLog: [],
      totalPoints: 0,
    };
  },

  // ── Generate Starting Season ────────────────────────────────
  generateNewSeason() {
    return {
      currentWeek: 1,
      volatility: 40,
      teams: {},
      activeCards: {},
      lastUpdated: Date.now(),
      started: true,
    };
  },

  // ── Format Currency ─────────────────────────────────────────
  formatDollar(val) {
    return "$" + parseFloat(val).toFixed(2);
  },

  // ── Stat Bar Color ──────────────────────────────────────────
  statColor(statName, value) {
    if (statName === 'risk') {
      if (value < 30) return '#22c55e';
      if (value < 60) return '#eab308';
      return '#ef4444';
    }
    if (value > 70) return '#22c55e';
    if (value > 40) return '#eab308';
    return '#ef4444';
  },

  // ── Stock trend arrow ───────────────────────────────────────
  stockTrend(history) {
    if (!history || history.length < 2) return { arrow: '—', color: '#9ca3af' };
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const diff = last - prev;
    if (diff > 0) return { arrow: '▲', color: '#22c55e', diff: '+' + diff.toFixed(2) };
    if (diff < 0) return { arrow: '▼', color: '#ef4444', diff: diff.toFixed(2) };
    return { arrow: '—', color: '#9ca3af', diff: '0.00' };
  }
};
