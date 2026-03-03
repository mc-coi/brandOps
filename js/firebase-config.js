const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAfvh-S5f1DrjEJ5MpPPgsXsaWZab8uBI0",
  authDomain: "brands-1523f.firebaseapp.com",
  databaseURL: "https://brands-1523f-default-rtdb.firebaseio.com",
  projectId: "brands-1523f",
  storageBucket: "brands-1523f.firebasestorage.app",
  messagingSenderId: "1053444309734",
  appId: "1:1053444309734:web:00c5a17748d1d0c8613127"
};

// Password is stored in Firebase at /config/teacherPassword

const GAME_CONFIG = {
  maxWeeks: 18,
  phases: [
    { name: "Brand Launch",        weeks: [1, 3],  color: "#3b82f6", emoji: "🔵" },
    { name: "Market Pressure",     weeks: [4, 7],  color: "#ef4444", emoji: "🔴" },
    { name: "Super Bowl Campaign", weeks: [8, 10], color: "#eab308", emoji: "🟡" },
    { name: "Product Placement",   weeks: [11,13], color: "#22c55e", emoji: "🟢" },
    { name: "Market War",          weeks: [14,15], color: "#6b7280", emoji: "⚫" },
    { name: "Rebrand or Die",      weeks: [16,18], color: "#a855f7", emoji: "🟣" },
  ],
  statMax: 100,
  statMin: 0,
  baseStockPrice: 10.00,
  scoreEffects: {
    1: { label: "Below Basic", points: 1, multiplier: 0.5 },
    3: { label: "Proficient",  points: 3, multiplier: 1.0 },
    5: { label: "Advanced",    points: 5, multiplier: 1.5 },
  }
};

const DELIVERABLE_TYPES = {
  brand_strategy:     { label: "Brand Strategy Doc",      affects: ["reputation", "demand"],                  phase: 1 },
  logo_identity:      { label: "Logo & Visual Identity",  affects: ["reputation", "innovation"],              phase: 1 },
  launch_commercial:  { label: "Launch Commercial",       affects: ["demand", "reputation"],                  phase: 1 },
  elevator_pitch:     { label: "Elevator Pitch",          affects: ["reputation", "budget"],                  phase: 1 },
  crisis_commercial:  { label: "Crisis Response Ad",      affects: ["reputation", "risk", "sentiment"],       phase: 2 },
  social_pivot:       { label: "Social Media Pivot",      affects: ["demand", "reputation", "sentiment"],     phase: 2 },
  competitor_swot:    { label: "Competitor SWOT",         affects: ["innovation", "risk"],                    phase: 2 },
  superbowl_ad:       { label: "Super Bowl Commercial",   affects: ["demand", "reputation", "budget"],        phase: 3 },
  cutdown_15sec:      { label: "15-Second Cutdown",       affects: ["demand", "innovation"],                  phase: 3 },
  storyboard:         { label: "Storyboard",              affects: ["innovation", "demand"],                  phase: 3 },
  product_placement:  { label: "Product Placement Film",  affects: ["demand", "reputation", "sentiment"],     phase: 4 },
  market_war:         { label: "Market War Campaign",     affects: ["demand", "risk", "reputation"],          phase: 5 },
  rebrand_logo:       { label: "Rebrand Logo",            affects: ["reputation", "innovation", "sentiment"], phase: 6 },
  relaunch_pitch:     { label: "Investor Pitch Deck",     affects: ["budget", "reputation", "demand"],        phase: 6 },
  shareholder_letter: { label: "Shareholder Letter",      affects: ["reputation", "budget"],                  phase: 0 },
};

const BRAND_DATA = {
  industries: ["Consumer Electronics","Athletic Wear","Fast Food","Luxury Fashion","Streaming Media","Electric Vehicles","Energy Drinks","Cosmetics","Gaming","Sustainable Goods"],
  countries:  ["USA","Japan","South Korea","Germany","France","China","Brazil","Sweden","Canada","Australia"],
  demographics: ["Gen Z (16-24)","Millennials (25-40)","Gen X (41-56)","Families","Professionals","Athletes","Gamers","Eco-Conscious Consumers"],
  componentTiers: ["Budget","Standard","Premium"],
  shippingMethods: ["Air","Sea","Domestic"],
  pricePoints: ["Economy","Mid-Range","Premium","Luxury"],
};

const JOURNAL_PROMPTS = {
  1:  "What are the core values of your brand? Why would someone choose you over every competitor in your industry?",
  2:  "How does your visual identity reflect your target demographic? What would your customer think if they saw your logo for the first time?",
  3:  "What was the strongest creative choice you made this phase, and what was the weakest? What would you change if you had one more week?",
  4:  "An event card just hit your brand. What was your first instinct — and looking back, was that the right call?",
  5:  "What did analyzing your competitor reveal that you didn't expect? How does it change your strategy?",
  6:  "Your brand has survived its first crisis. What did it teach you about how your brand handles pressure?",
  7:  "If a journalist wrote a story about your brand today, what would the headline be — and is that a headline you'd be proud of?",
  8:  "Super Bowl week. What emotion do you want the audience to feel 10 seconds after your commercial ends? Why that emotion?",
  9:  "How did storyboarding change what you actually produced? Where did your plan and your execution diverge?",
  10: "Your 15-second cutdown had to carry the whole campaign in a fraction of the time. What did you keep, and what did you cut? Why?",
  11: "Product placement is about being invisible. Did you succeed? What was the moment in your scene where it felt most natural?",
  12: "Compare your launch commercial to your product placement scene. Are they the same brand? How has your identity evolved?",
  13: "If your product placement scene were in a real movie, which movie would it be and why? What does that reveal about your brand?",
  14: "Market War. Who did you target, and why them? What was the strategic logic behind your choice?",
  15: "Is comparative advertising effective, ethical, both, or neither? Use your own campaign as evidence.",
  16: "Your brand just received a terminal event. What was your first emotional reaction? What was your first strategic reaction?",
  17: "What does your rebrand keep from the original? What does it leave behind? Why is that the right balance?",
  18: "Final week. If you could go back to Week 1 knowing everything you know now — what would you do differently, and what would you keep exactly the same?",
};

const SHAREHOLDER_LETTER_PROMPTS = [
  { phase: 1, prompt: "Phase 1 is complete. Who is your brand, and why does it deserve to exist in this market? Reflect on your launch decisions and project your strategy for Phase 2." },
  { phase: 2, prompt: "The market tested you. Shareholders want transparency about the crises you faced, the choices you made, and what you learned. How has the brand changed — and is it stronger for it?" },
  { phase: 3, prompt: "You just made your Super Bowl play. Was it worth the investment? Reflect on the campaign's creative choices, execution, and what you expect it to do for the brand in Phase 4." },
  { phase: 4, prompt: "Your brand has been embedded in culture through product placement. Is the brand identity still intact? How has Phase 4 set up the aggression of Phase 5?" },
  { phase: 5, prompt: "You've been to war. What was your strategy, did it work, what did the competition do in response, and how does the brand stand heading into the final phase?" },
  { phase: 6, prompt: "Final letter. Tell the full story: what this brand was, what it became, and why it is worth believing in as it enters its next chapter." },
];
