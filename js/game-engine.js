// ============================================
// BRANDOPS SIMULATOR - Game Logic Engine
// ============================================

const GameEngine = {

  // ── Market Score ─────────────────────────────────────────────
  // Sentiment is a bonus modifier (+/- up to 10 points)
  calcMarketScore(stats) {
    const s = stats || {};
    const sentimentBonus = Math.round(((s.sentiment || 50) - 50) / 5);
    return Math.round(
      (s.demand      || 0) +
      (s.reputation  || 0) +
      (s.innovation  || 0) +
      ((s.budget     || 0) / 10) -
      (s.risk        || 0) +
      sentimentBonus
    );
  },

  // ── Stock Price ───────────────────────────────────────────────
  calcStockPrice(marketScore, volatility = 50) {
    const base  = GAME_CONFIG.baseStockPrice;
    const drift = ((Math.random() * 4) - 2) * (volatility / 50);
    return Math.max(0.01, parseFloat((base + (marketScore / 10) + drift).toFixed(2)));
  },

  // ── Get Phase ─────────────────────────────────────────────────
  getPhase(week) {
    return GAME_CONFIG.phases.find(p => week >= p.weeks[0] && week <= p.weeks[1])
      || GAME_CONFIG.phases[0];
  },

  // ── Apply Event Card Effects ──────────────────────────────────
  applyCardEffects(stats, effects, volatility = 50) {
    const vol      = volatility / 50;
    const newStats = { ...stats };
    for (const [stat, delta] of Object.entries(effects)) {
      if (stat in newStats) {
        const scaled = Math.round(delta * vol);
        newStats[stat] = Math.min(GAME_CONFIG.statMax, Math.max(GAME_CONFIG.statMin, newStats[stat] + scaled));
      }
    }
    return newStats;
  },

  // ── Apply Deliverable Score ───────────────────────────────────
  applyDeliverableScore(stats, deliverableKey, scoreValue) {
    const deliverable = DELIVERABLE_TYPES[deliverableKey];
    const effect      = GAME_CONFIG.scoreEffects[scoreValue];
    if (!deliverable || !effect) return stats;

    const newStats    = { ...stats };
    const boostAmount = Math.round(8 * effect.multiplier);

    for (const statName of deliverable.affects) {
      if (statName === 'risk') {
        newStats[statName] = Math.max(0,   newStats[statName] - boostAmount);
      } else if (statName in newStats) {
        newStats[statName] = Math.min(100, newStats[statName] + boostAmount);
      }
    }
    return newStats;
  },

  // ── Default Stats (now includes sentiment) ───────────────────
  defaultStats() {
    return { budget: 60, demand: 45, reputation: 45, innovation: 45, risk: 15, sentiment: 50 };
  },

  // ── Crisis Check ──────────────────────────────────────────────
  checkCrisis(stats) {
    if (stats.risk      >= 100) return { type: 'risk',     message: 'MAXIMUM RISK — Crisis Event Triggered!' };
    if (stats.budget    <= 0)   return { type: 'bankrupt', message: 'BUDGET DEPLETED — Emergency Mode!' };
    if (stats.sentiment <= 10)  return { type: 'sentiment',message: 'PUBLIC SENTIMENT COLLAPSED — Boycott Risk!' };
    return null;
  },

  // ── Generate Brand Dossier ────────────────────────────────────
  generateBrandDossier(name) {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    return {
      brandName:      name || "Brand " + Math.floor(Math.random() * 999),
      industry:       pick(BRAND_DATA.industries),
      country:        pick(BRAND_DATA.countries),
      targetDemo:     pick(BRAND_DATA.demographics),
      componentTier:  pick(BRAND_DATA.componentTiers),
      shippingMethod: pick(BRAND_DATA.shippingMethods),
      pricePoint:     pick(BRAND_DATA.pricePoints),
      stats: {
        budget:     Math.floor(Math.random() * 30) + 50,
        demand:     Math.floor(Math.random() * 30) + 30,
        reputation: Math.floor(Math.random() * 30) + 30,
        innovation: Math.floor(Math.random() * 30) + 30,
        risk:       Math.floor(Math.random() * 20) + 5,
        sentiment:  Math.floor(Math.random() * 20) + 40, // 40-60 to start neutral
      },
      stockHistory:       [],
      eventLog:           {},
      scoreLog:           {},
      shareholderLetters: {},
      journalEntries:     {},
      rivalId:            null,
      totalPoints:        0,
    };
  },

  // ── New Season ────────────────────────────────────────────────
  generateNewSeason() {
    return { currentWeek: 1, volatility: 40, activeCards: {}, lastUpdated: Date.now() };
  },

  // ── Stat Color ────────────────────────────────────────────────
  statColor(statName, value) {
    if (statName === 'risk') {
      if (value < 30) return '#22c55e';
      if (value < 60) return '#eab308';
      return '#ef4444';
    }
    if (statName === 'sentiment') {
      if (value > 65) return '#22c55e';
      if (value > 35) return '#eab308';
      return '#ef4444';
    }
    if (value > 70) return '#22c55e';
    if (value > 40) return '#eab308';
    return '#ef4444';
  },

  // ── Stock Trend ───────────────────────────────────────────────
  stockTrend(history) {
    if (!history || history.length < 2) return { arrow: '—', color: '#9ca3af', diff: '' };
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const diff = last - prev;
    if (diff > 0) return { arrow: '▲', color: '#22c55e', diff: '+$' + diff.toFixed(2) };
    if (diff < 0) return { arrow: '▼', color: '#ef4444', diff: '-$' + Math.abs(diff).toFixed(2) };
    return { arrow: '—', color: '#9ca3af', diff: '' };
  },

  // ── Sparkline SVG ─────────────────────────────────────────────
  // Returns an inline SVG string for a stock price sparkline
  sparklineSVG(history, width = 200, height = 48, color = '#f5a623') {
    if (!history || history.length < 2) return '<span style="color:#555;font-size:11px">No data yet</span>';
    const vals  = history.slice(-20);
    const min   = Math.min(...vals);
    const max   = Math.max(...vals);
    const range = max - min || 1;
    const step  = width / (vals.length - 1);
    const pts   = vals.map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const trend = vals[vals.length - 1] >= vals[0] ? '#22c55e' : '#ef4444';
    return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${pts}" fill="none" stroke="${trend}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${((vals.length-1)*step).toFixed(1)}" cy="${(height - ((vals[vals.length-1]-min)/range)*(height-6)-3).toFixed(1)}" r="3" fill="${trend}"/>
    </svg>`;
  },

  // ── Format Dollar ─────────────────────────────────────────────
  formatDollar(val) {
    return '$' + parseFloat(val || 0).toFixed(2);
  },
};
