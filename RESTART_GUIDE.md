# 🚀 Quick Fix & Restart Guide

## Three Simple Steps

### Step 1: Restart Backend (with CORS fix)
```bash
cd /home/yassine/workspace/Ai/TruthBot-Azure/endpoint

# If running, press Ctrl+C to stop

# Start with CORS enabled:
python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

### Step 2: Restart Frontend (with React Router fix)
```bash
cd /home/yassine/workspace/Ai/TruthBot-Azure/frontend

# If running, press Ctrl+C to stop

# Start frontend:
npm run dev
```

**You should see:**
```
Local: http://localhost:5173
```

---

### Step 3: Test It
1. Open browser to the URL shown (usually `http://localhost:5173`)
2. Enter a claim like "The moon is made of cheese"
3. Click "Verify This Claim"
4. Watch the loading progress
5. See the verdict appear!

---

## What Was Fixed

| Error | Fix | File |
|-------|-----|------|
| React Router warnings | Added future flags | `frontend/src/App.tsx` |
| CORS error | Added middleware | `endpoint/fact.py` |

---

## Verify Everything Works

### Check Backend
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","service":"TruthBot API"}`

### Check CORS Header
```bash
curl -i -X OPTIONS http://localhost:8000/fact-check \
  -H "Origin: http://localhost:5173"
```
Expected: Should include `Access-Control-Allow-Origin` header

### Check Frontend
- Open `http://localhost:5173`
- Try a claim
- Check browser DevTools (F12) → Console
- Should see no errors

---

## If You See Errors

### Error: "Connection refused"
→ Backend not running. Start it first (Step 1)

### Error: "Cannot find module"
→ Run `npm install` in frontend folder

### Error: Still seeing CORS error
→ Make sure you restarted the backend
→ Clear browser cache (Ctrl+Shift+R)

### Error: Port already in use
→ Kill existing process: `lsof -i :8000` or `lsof -i :5173`
→ Then restart

---

## Files Changed

```
TruthBot-Azure/
├── endpoint/fact.py              ← CORS middleware added
├── frontend/src/App.tsx          ← React Router flags added
└── ERROR_FIXES.md                ← This guide
```

---

**That's it! Everything should work now.** ✨
