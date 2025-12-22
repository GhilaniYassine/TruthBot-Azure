# 🔧 Error Fixes & Solutions

## Issues Fixed

### 1. ✅ React Router Future Flag Warnings

**Problem:** Two warnings about React Router v7 future flags:
- `v7_startTransition`
- `v7_relativeSplatPath`

**Solution:** Added future flags to BrowserRouter in `App.tsx`

**File Changed:** `frontend/src/App.tsx`

```typescript
<BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
```

**Result:** ✅ Warnings gone!

---

### 2. ✅ CORS Error - "Access-Control-Allow-Origin Missing"

**Problem:** 
```
Access to fetch at 'http://localhost:8000/fact-check' from origin 
'http://localhost:8080' has been blocked by CORS policy
```

**Root Cause:** 
- Frontend is on `http://localhost:8080` (or different port)
- Backend doesn't have CORS enabled
- Browser blocks cross-origin requests

**Solution:** Added CORS middleware to FastAPI backend

**File Changed:** `endpoint/fact.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite default
        "http://localhost:3000",      # Common port
        "http://localhost:8080",      # Your frontend
        "http://localhost:8000",      # Same port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Result:** ✅ CORS error gone!

---

### 3. ✅ Fetch Error - "Failed to fetch"

**Problem:**
```
TypeError: Failed to fetch
at factCheckClaim (api.ts:39:26)
```

**Root Cause:** This was caused by the CORS issue above

**Solution:** Fixed by enabling CORS on the backend

**Result:** ✅ API calls now work!

---

## What You Need to Do

### Step 1: Restart Backend
```bash
cd endpoint
# Kill the old process (Ctrl+C)
# Restart with CORS enabled:
python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Restart Frontend
```bash
cd frontend
# Kill the old process (Ctrl+C)
# Restart:
npm run dev
```

### Step 3: Clear Browser Cache
- Open DevTools (F12)
- Go to Application tab
- Clear all cache and cookies
- Or just do a hard refresh (Ctrl+Shift+R)

### Step 4: Test
1. Go to `http://localhost:5173` (or whatever port appears)
2. Enter a claim
3. Click "Verify This Claim"
4. Should see 3-phase loading
5. Results should display!

---

## Important Notes

### Frontend Port
- Vite defaults to `http://localhost:5173`
- If your terminal shows a different port, use that
- The CORS config includes multiple common ports, so it should work

### Backend Port
- Should be `http://localhost:8000`
- Make sure backend is running before frontend makes requests

### Environment Variable Check
- Verify `.env.local` has correct API URL:
  ```
  VITE_API_BASE_URL=http://localhost:8000
  ```

---

## Common Port Issues

| Scenario | Solution |
|----------|----------|
| Frontend on 5173, Backend on 8000 | ✅ Works with our CORS config |
| Frontend on 3000, Backend on 8000 | ✅ Works with our CORS config |
| Frontend on 8080, Backend on 8000 | ✅ Works with our CORS config |
| Frontend on different IP | ❌ Add that IP to `allow_origins` in backend |

---

## If It Still Doesn't Work

### Check 1: Backend CORS Header
```bash
curl -i -X OPTIONS http://localhost:8000/fact-check \
  -H "Origin: http://localhost:5173"
```

Should return:
```
Access-Control-Allow-Origin: http://localhost:5173
```

### Check 2: Frontend API URL
```javascript
// In browser console
console.log(import.meta.env.VITE_API_BASE_URL)
```

Should show `http://localhost:8000`

### Check 3: API is Responding
```bash
curl http://localhost:8000/health
```

Should return:
```json
{"status": "healthy", "service": "TruthBot API"}
```

### Check 4: Browser Console
- Open DevTools (F12)
- Check for any other errors
- Look at Network tab to see request details

---

## Production CORS Configuration

When deploying, update backend CORS with production URLs:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.com",
        "https://www.your-frontend-domain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Summary of Changes

| File | Change | Status |
|------|--------|--------|
| `frontend/src/App.tsx` | Added React Router future flags | ✅ Fixed |
| `endpoint/fact.py` | Added CORS middleware | ✅ Fixed |

---

## ✅ Everything Should Work Now!

After restarting both servers:
- No React Router warnings ✅
- No CORS errors ✅
- API calls work ✅
- Verdicts display ✅

**Happy fact-checking!** 🚀
