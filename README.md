# BrandOps Simulator — Setup Guide

## What You Have
- `index.html`      → **Student/Public View** (leaderboard, stock ticker, event feed)
- `teacher.html`    → **Teacher Console** (password protected)
- `newspaper.html`  → **Brand Report** (printable per-team newspaper)
- `js/firebase-config.js` → Firebase settings + game constants
- `js/game-engine.js`     → All stat calculations and game logic
- `js/event-cards.js`     → All 60 event cards (4 decks × 15 cards)

---

## Step 1: Create a Firebase Project (Free)

1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it "brandops" → Create
3. In the project, go to **Build → Realtime Database**
4. Click **"Create Database"** → choose "Start in test mode" → Enable
5. Go to **Project Settings** (gear icon) → **"Your apps"** → click **</>** (Web)
6. Register the app → copy the config object

---

## Step 2: Paste Your Firebase Config

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_ACTUAL_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  // ... etc
};
```

Also change the teacher password on line ~12:
```javascript
const TEACHER_PASSWORD = "your_password_here";
```

---

## Step 3: Host the Files

**Option A — Free with GitHub Pages (recommended)**
1. Create a free account at https://github.com
2. Create a new repository named "brandops"
3. Upload all the files (keeping the `js/` folder structure)
4. Go to Settings → Pages → Source: main branch → Save
5. Your app will be at: `https://yourusername.github.io/brandops/`

**Option B — Google Drive (quick)**
Upload to Drive and use Google's file sharing — works for local classroom use.

**Option C — Run locally**
Use VS Code + Live Server extension. Works perfectly for single-classroom use.

---

## Step 4: Start a Season

1. Open `teacher.html` (or `/teacher`)
2. Enter your password
3. Go to **Teams** → add each team with their brand name and student names
4. Go to **Season Settings** → set your starting volatility (recommend 40 for Week 1)
5. Share the public `index.html` URL with students

---

## How the Daily Workflow Works

### Each Class Period:
1. Open **Teacher Console**
2. Click **"Update Stock Prices"** (takes 1 second — updates all teams)
3. Draw an event card for any team having a crisis or milestone
4. Project the **Student View** on the board

### After Scoring Deliverables:
1. Go to **Score Work** panel
2. Select the team → select the deliverable type → select 1/3/5
3. Click Apply — stats update instantly on the student view

### End of Week:
1. Click **"Advance Week"** — automatically runs stock update + clears weekly events

---

## The Newspaper

To print a team's brand report:
1. In **Teacher Console → Teams**, click **🗞️ Print** next to any team
2. The newspaper opens in a new tab
3. Use **Print / Save PDF** to print or save

Students can also access their own newspaper if you share the direct URL:
`yoursite.com/newspaper.html?team=TEAM_ID&week=CURRENT_WEEK`

---

## Firebase Database Rules (for Security)

When you're ready to lock down (before sharing with students), go to 
Firebase Console → Realtime Database → Rules and paste:

```json
{
  "rules": {
    ".read": true,
    ".write": false,
    "teams": {
      ".read": true,
      ".write": false
    },
    "season": {
      ".read": true,
      ".write": false
    }
  }
}
```

This makes the database **read-only for everyone** (students can see data)
but **only writable through the Firebase Console or your teacher panel**.

For the teacher panel to write, you'll need to either:
- Keep test mode rules during class (easier)
- Or add Firebase Authentication (more complex — ask me if needed)

---

## Adding/Editing Event Cards

Open `js/event-cards.js` — each card looks like this:

```javascript
{
  id: "ec_01",
  deck: "economic",       // economic, social, innovation, wildcard
  title: "Card Title",
  storyText: "What happened in plain English.",
  effects: { budget: -15, demand: -5 },   // stat changes
  hasChoice: true,
  choiceA: { text: "Option A description", effects: { budget: -10, reputation: +5 } },
  choiceB: { text: "Option B description", effects: { budget: +5, demand: -10 } },
  tags: ["supply_chain", "regulation"],
}
```

Just copy an existing card, change the id and content, and it'll appear in the console automatically.

---

## Troubleshooting

**"Loading..." stuck on student view** → Check that Firebase config values are correct and the database is created.

**Teacher can't save data** → Make sure Firebase is in "test mode" or rules allow writes.

**Stock prices not showing** → Click "Update Stock Prices" in the teacher console at least once.

**Newspaper is blank** → The team URL parameter must match a real team ID in Firebase.
