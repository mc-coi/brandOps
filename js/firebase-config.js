// ============================================
// BRANDOPS SIMULATOR - Firebase Configuration
// ============================================
// Replace these values with your own Firebase project settings
// Get them from: https://console.firebase.google.com
// Project Settings > Your Apps > Firebase SDK snippet > Config

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfvh-S5f1DrjEJ5MpPPgsXsaWZab8uBI0",
  authDomain: "brands-1523f.firebaseapp.com",
  databaseURL: "https://brands-1523f-default-rtdb.firebaseio.com",
  projectId: "brands-1523f",
  storageBucket: "brands-1523f.firebasestorage.app",
  messagingSenderId: "1053444309734",
  appId: "1:1053444309734:web:00c5a17748d1d0c8613127",
  measurementId: "G-20V9HYR4SF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ============================================
// TEACHER PASSWORD
// Change this to whatever you want
// ============================================
const TEACHER_PASSWORD = "testMM";

// ============================================
// GAME CONSTANTS
// ============================================
const GAME_CONFIG = {
  maxWeeks: 18,
  phases: [
    { name: "Brand Launch",       weeks: [1, 3],  color: "#ef4444", emoji: "🔵" },
    { name: "Market Pressure",    weeks: [4, 7],  color: "#f97316", emoji: "🔴" },
    { name: "Super Bowl Campaign",weeks: [8, 10], color: "#eab308", emoji: "🟡" },
    { name: "Product Placement",  weeks: [11,13], color: "#22c55e", emoji: "🟢" },
    { name: "Market War",         weeks: [14,15], color: "#6b7280", emoji: "⚫" },
    { name: "Rebrand or Die",     weeks: [16,18], color: "#a855f7", emoji: "🟣" },
  ],
  statMax: 100,
  statMin: 0,
  baseStockPrice: 10.00,
  scoreEffects: {
    1: { label: "Below Basic",  points: 1, multiplier: 0.5  },
    3: { label: "Proficient",   points: 3, multiplier: 1.0  },
    5: { label: "Advanced",     points: 5, multiplier: 1.5  },
  }
};

// ============================================
// DELIVERABLE TYPES & WHICH STATS THEY AFFECT
// ============================================
const DELIVERABLE_TYPES = {
  brand_strategy:     { label: "Brand Strategy Doc",      affects: ["reputation", "demand"],           phase: 1 },
  logo_identity:      { label: "Logo & Visual Identity",  affects: ["reputation", "innovation"],       phase: 1 },
  launch_commercial:  { label: "Launch Commercial",        affects: ["demand", "reputation"],           phase: 1 },
  elevator_pitch:     { label: "Elevator Pitch",           affects: ["reputation", "budget"],           phase: 1 },
  crisis_commercial:  { label: "Crisis Response Ad",       affects: ["reputation", "risk"],             phase: 2 },
  social_pivot:       { label: "Social Media Pivot",       affects: ["demand", "reputation"],           phase: 2 },
  competitor_swot:    { label: "Competitor SWOT",          affects: ["innovation", "risk"],             phase: 2 },
  superbowl_ad:       { label: "Super Bowl Commercial",    affects: ["demand", "reputation", "budget"], phase: 3 },
  storyboard:         { label: "Storyboard",               affects: ["innovation", "demand"],           phase: 3 },
  product_placement:  { label: "Product Placement Film",   affects: ["demand", "reputation"],           phase: 4 },
  market_war:         { label: "Market War Campaign",      affects: ["demand", "risk", "reputation"],   phase: 5 },
  rebrand_logo:       { label: "Rebrand Logo",             affects: ["reputation", "innovation"],       phase: 6 },
  relaunch_pitch:     { label: "Investor Pitch Deck",      affects: ["budget", "reputation", "demand"], phase: 6 },
};

// ============================================
// INDUSTRIES & BRAND GENERATION DATA
// ============================================
const BRAND_DATA = {
  industries: [
    "Consumer Electronics", "Athletic Wear", "Fast Food", "Luxury Fashion",
    "Streaming Media", "Electric Vehicles", "Energy Drinks", "Cosmetics",
    "Gaming", "Sustainable Goods"
  ],
  countries: [
    "USA", "Japan", "South Korea", "Germany", "France",
    "China", "Brazil", "Sweden", "Canada", "Australia"
  ],
  demographics: [
    "Gen Z (16–24)", "Millennials (25–40)", "Gen X (41–56)",
    "Families", "Professionals", "Athletes", "Gamers", "Eco-Conscious Consumers"
  ],
  componentTiers: ["Budget", "Standard", "Premium"],
  shippingMethods: ["Air", "Sea", "Domestic"],
  pricePoints: ["Economy", "Mid-Range", "Premium", "Luxury"],
};
