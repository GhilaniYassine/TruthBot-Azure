# 🚀 Quick Start - Frontend Backend Integration

## TL;DR - 5 Minute Setup

### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Start Backend (in separate terminal)
```bash
cd endpoint
python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
```

### 3️⃣ Start Frontend (in another terminal)
```bash
cd frontend
npm run dev
```

### 4️⃣ Open & Test
- Go to `http://localhost:5173`
- Type a claim like "The moon is made of cheese"
- Hit "Verify This Claim"
- Watch it process and display results!

---

## 📁 What Changed

### New Files
```
frontend/
├── src/services/api.ts              ← API client & parsing
├── src/services/TYPES_AND_FLOW.ts   ← Documentation (types only)
├── .env.local                        ← Config (created for you)
├── .env.example                      ← Config template
├── INTEGRATION_GUIDE.md              ← Full documentation
```

### Updated Files
```
frontend/
├── src/pages/Index.tsx              ← Now uses real API
└── src/components/VerdictDisplay.tsx ← Updated for API data
```

---

## 🔗 How It Works

```
User Input
    ↓
API Call: POST /fact-check
    ↓
Backend Processes (3 phases)
    ↓
Returns Markdown Verdict
    ↓
Parser Converts to Data
    ↓
Display Results
```

---

## ⚙️ Configuration

**File:** `frontend/.env.local`
```
VITE_API_BASE_URL=http://localhost:8000
```

**For Production:**
```
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 🧪 Test It

### Option A: Using UI
1. Go to frontend
2. Enter claim
3. See results

### Option B: Using curl
```bash
curl -X POST http://localhost:8000/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "The moon landing was faked"}'
```

---

## 📊 What Each Component Does

| Component | Job |
|-----------|-----|
| `ClaimInput` | Get user's claim |
| `Index` | Run the whole show, call API |
| `ProcessingStatus` | Show loading progress |
| `VerdictDisplay` | Show the results |
| `api.ts` | Talk to backend, parse response |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| CORS error | Backend needs CORS enabled |
| "API unreachable" | Backend not running or wrong URL |
| Verdict not showing | Check browser console for parse errors |
| Nothing happens | Check `.env.local` has correct API URL |

---

## 📈 Data Flow Example

**User enters:** "Is the Earth flat?"

**Frontend sends to backend:**
```json
{ "claim": "Is the Earth flat?" }
```

**Backend returns:**
```json
{
  "claim": "Is the Earth flat?",
  "search_results_count": 10,
  "verdict": "**VERDICT:** FALSE\n**CONFIDENCE:** High\n...",
  "success": true
}
```

**Frontend parses and displays:**
- Verdict: FALSE ❌
- Confidence: High
- Reasoning: [extracted from markdown]
- Sources: [extracted as list]
- Limitations: [extracted as list]

---

## 🎯 Key Files to Know

| File | What It Does |
|------|--------------|
| `src/services/api.ts` | API calls + parsing logic |
| `src/pages/Index.tsx` | Main app logic & state |
| `src/components/VerdictDisplay.tsx` | Shows results |
| `.env.local` | API URL config |

---

## ✅ Checklist

- [ ] Backend running on port 8000?
- [ ] Frontend `.env.local` has correct API URL?
- [ ] Both npm install and dependencies installed?
- [ ] Frontend running on port 5173?
- [ ] Can access http://localhost:5173?
- [ ] Can type a claim?
- [ ] See 3-step loading progress?
- [ ] Verdict displays?

---

## 🚀 Deploy

### Build Frontend
```bash
npm run build  # Creates dist/ folder
```

### Deploy dist/ folder to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS Amplify**
- Any static host

### Remember
Set `VITE_API_BASE_URL` in deployment environment to your production API URL!

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend logs
3. Test API directly: `curl http://localhost:8000/health`
4. Read `INTEGRATION_GUIDE.md` for details

---

## 🎉 That's It!

Your frontend is now connected to your backend. Everything else is working magic! ✨
