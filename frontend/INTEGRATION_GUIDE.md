# Frontend-Backend Integration Guide

## Overview

The TruthBot frontend (React/Vite) is now fully integrated with the FastAPI backend. Here's what was changed and how to set it up.

## Changes Made

### 1. **New API Service** (`src/services/api.ts`)
- `factCheckClaim()` - Calls the `/fact-check` endpoint with a claim
- `parseVerdict()` - Parses the markdown verdict response from the API into structured data
- `checkApiHealth()` - Health check endpoint

### 2. **Updated Index Page** (`src/pages/Index.tsx`)
- Removed mock data
- Integrated real API calls via `factCheckClaim()`
- Added error handling and toast notifications
- Proper loading state management with step progression
- Parses API response using `parseVerdict()`

### 3. **Updated VerdictDisplay** (`src/components/VerdictDisplay.tsx`)
- Changed interface from `verdict` to `verdictType`
- Added `searchResultsCount` field
- Now displays actual parsed verdict data from API

### 4. **Environment Configuration**
- `.env.local` - Local development config (use `http://localhost:8000` for local backend)
- `.env.example` - Template for environment variables

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn/bun
- Backend API running (FastAPI server at `http://localhost:8000`)

### Local Development Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
# or: yarn install
# or: bun install
```

2. **Configure Environment**
```bash
# Copy example to local config
cp .env.example .env.local

# Edit .env.local (optional if you're using localhost:8000)
# VITE_API_BASE_URL=http://localhost:8000
```

3. **Start Backend API**
```bash
# In a separate terminal, start your FastAPI server
cd endpoint
python -m uvicorn fact:app --host 0.0.0.0 --port 8000 --reload
```

4. **Start Frontend Development Server**
```bash
# In the frontend directory
npm run dev
# Open http://localhost:5173 in your browser
```

## How It Works

### User Flow
1. User enters a claim in the input field
2. Frontend sends POST request to `/fact-check` with `{claim: string}`
3. Backend processes the claim:
   - Phase 1: Web search via Tavily
   - Phase 2: Multi-agent AI analysis
   - Phase 3: Verdict generation
4. Backend returns markdown-formatted verdict
5. Frontend parses markdown into structured data
6. Verdict is displayed with formatted reasoning, sources, and confidence level

### API Request/Response

**Request:**
```json
POST /fact-check
{
  "claim": "The Earth is flat"
}
```

**Response:**
```json
{
  "claim": "The Earth is flat",
  "search_results_count": 10,
  "verdict": "**FACT-CHECK VERDICT**\n\n**VERDICT:** FALSE\n**CONFIDENCE:** High\n\n...",
  "success": true,
  "error": null
}
```

### Data Flow
```
User Input
    ↓
ClaimInput Component
    ↓
Index.tsx (handleSubmit)
    ↓
api.factCheckClaim()
    ↓
Backend /fact-check endpoint
    ↓
api.parseVerdict()
    ↓
VerdictDisplay Component
    ↓
Display Results
```

## Key Components & Files

### Frontend Files Changed/Created

| File | Purpose |
|------|---------|
| `src/services/api.ts` | NEW - API client & verdict parser |
| `src/pages/Index.tsx` | UPDATED - Main page with API integration |
| `src/components/VerdictDisplay.tsx` | UPDATED - Display parsed verdict |
| `.env.local` | NEW - Environment configuration |
| `.env.example` | NEW - Environment template |

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## Error Handling

The frontend handles several error scenarios:

1. **Empty Claim** - Validation on input (shows error message)
2. **API Errors** - Displays error message and shows "Try Another Claim" button
3. **Network Errors** - Toast notification with error details
4. **Timeout** - Gracefully handled with user feedback

## CORS Configuration

**Important:** If your backend is on a different origin, ensure CORS is enabled in FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Deployment

### Build Frontend
```bash
npm run build
# Output goes to dist/ directory
```

### Set Production API URL
```bash
# In production environment (.env or deployment config)
VITE_API_BASE_URL=https://your-production-api.com
```

### Deploy Options
- **Vercel** (Recommended for Next.js/Vite): `vercel deploy`
- **Netlify**: Connect GitHub repo, set build command to `npm run build`
- **AWS Amplify**: Similar to Netlify
- **Docker**: Create Dockerfile for containerized deployment

## Testing the Integration

### Manual Testing
1. Start backend: `python -m uvicorn fact:app --reload`
2. Start frontend: `npm run dev`
3. Enter a test claim: "The moon landing was faked"
4. Verify:
   - Processing status shows (3 steps)
   - API request completes
   - Verdict displays with reasoning and sources

### API Testing with curl
```bash
curl -X POST http://localhost:8000/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "The moon landing was faked"}'
```

## Troubleshooting

### Issue: "Failed to fetch" or CORS error
**Solution:** Ensure backend is running and CORS is configured. Check `VITE_API_BASE_URL` in `.env.local`.

### Issue: Verdict not displaying properly
**Solution:** Check browser console for parsing errors. The markdown format from the backend may need adjustment in `parseVerdict()`.

### Issue: Loading state stuck
**Solution:** Check network tab in dev tools. Backend may be timing out or erroring. Review backend logs.

### Issue: "Cannot find module" errors
**Solution:** Run `npm install` to ensure all dependencies are installed.

## Verdict Parsing Details

The `parseVerdict()` function extracts:
- **Verdict Type**: TRUE, FALSE, PARTIALLY_TRUE, UNVERIFIABLE, MISLEADING
- **Confidence**: High, Medium, Low
- **Reasoning**: Main explanation text
- **Sources**: Array with title, URL, credibility tier, relationship, reason
- **Limitations**: Array of caveats and missing information

The parser looks for specific markdown patterns in the verdict string. If the backend changes the format, update the parsing logic accordingly.

## Next Steps

- Add user authentication (optional)
- Implement claim history/saved claims
- Add analytics tracking
- Optimize bundle size
- Add offline support (PWA)
- Implement caching for repeated claims

## Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs
3. Verify environment configuration
4. Test API directly with curl/Postman
