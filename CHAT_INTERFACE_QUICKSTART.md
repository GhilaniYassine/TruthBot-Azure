# 🚀 Chat Interface - Quick Start Guide

## Prerequisites
Before running the chat interface, ensure you have:
- Node.js 18+ installed
- Backend running on port 8000 (`python endpoint/fact.py`)
- Virtual environment activated

## Starting the Chat Interface

### Step 1: Start the Backend
```bash
cd /home/yassine/workspace/Ai/TruthBot-Azure
source env/bin/activate
python endpoint/fact.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Step 2: Start the Frontend
**In a new terminal:**
```bash
cd /home/yassine/workspace/Ai/TruthBot-Azure/frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Open in Browser
Navigate to: `http://localhost:5173`

## 🎯 Using the Chat Interface

### 1. Welcome Screen
You'll see:
- TruthBot logo and title
- AI assistant welcome message
- Chat input field at bottom

### 2. Entering a Claim
```
Type: "The moon is made of cheese"
Press: Enter or click Send button
```

### 3. Processing
You'll see:
- ✅ Your message appears in purple bubble (right)
- ⏳ Loading indicator with animated dots
- Backend processing claim (5-15 seconds)

### 4. Verdict Display
Beautiful verdict card appears with:
- ✅ Verdict type (TRUE/FALSE/PARTIALLY_TRUE/etc.)
- 📊 Confidence percentage
- 📝 Analysis and reasoning
- 🔗 Source links
- ⚠️ Limitations
- 📈 Search results count

### 5. Follow-up Message
Bot responds with brief interpretation:
```
"That's incorrect! ❌ The evidence contradicts this claim."
```

### 6. Continue or Reset
- **Continue:** Type another claim and submit
- **Reset:** Click "New Chat" button to start fresh

## 🎨 UI Elements Guide

### Message Bubbles
```
Your Claims:
┌─────────────────────────┐
│ Purple gradient bubble  │ ← Right-aligned
│ Timestamp shown below   │
└─────────────────────────┘

Bot Messages:
┌─────────────────────────┐
│ Gray/slate background   │ ← Left-aligned  
│ Purple border accent    │
│ Timestamp shown below   │
└─────────────────────────┘
```

### Verdict Card
```
╔═══════════════════════════════════════════╗
║ ✅ CORRECT  🎉        Confidence: 95%   ║
╠═══════════════════════════════════════════╣
║ Claim: "Your statement here"              ║
║                                            ║
║ Analysis: [Detailed reasoning...]         ║
║                                            ║
║ Sources: 🔗 [Clickable source links]     ║
║                                            ║
║ Limitations: 📌 [Context considerations]  ║
╚═══════════════════════════════════════════╝
```

### Input Area
```
┌──────────────────────────────────────┬───┐
│ Type claim to fact-check...         │ ✈️ │
└──────────────────────────────────────┴───┘
Send button (circle with paper plane icon)
```

## 🎬 Animation Showcase

### Entering Messages
- Messages slide up with fade-in effect
- Duration: 0.5 seconds
- Smooth easing

### Loading Indicator
```
Loading animation: ⏸ ⏸ ⏸
                    (bouncing dots in different colors)
```

### Verdict Appearance
- Verdict card slides in from left
- Header and sections stagger in sequence
- Confidence percentage animates on hover

## 💡 Tips & Tricks

### Performance Tips
1. **Clear browser cache** if changes don't appear
   - DevTools → Network → Disable cache

2. **Check console** for error messages
   - DevTools → Console (F12)

3. **Verify API connection**
   - Open DevTools → Network tab
   - Submit a claim and watch the request to `/fact-check`

### Testing Different Claims

**Good Test Claims:**
- "The Earth is round" (TRUE)
- "The moon is made of cheese" (FALSE)
- "Python is a programming language" (TRUE)
- "Vaccines cause autism" (FALSE)
- "Climate change is real but human caused" (PARTIALLY_TRUE)

**Edge Cases:**
- Very long claims (test text wrapping)
- Special characters (test encoding)
- Multiple sentences (test parsing)
- Claims about recent events (test real-time search)

## 🔧 Troubleshooting

### Issue: "Connection refused" error
**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/health

# If not, start it:
python endpoint/fact.py
```

### Issue: "CORS error" in browser
**Verify in endpoint/fact.py:**
```python
allow_origins=[
    "http://localhost:5173",    # Vite default
    "http://localhost:3000",    # Alt port
    "http://localhost:8080",    # Alt port
]
```

### Issue: Messages not scrolling to bottom
**Solution:**
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear browser cache
3. Check DevTools → Console for errors

### Issue: Animations stuttering
**Solution:**
1. Close other intensive applications
2. Check DevTools → Performance tab
3. Verify GPU acceleration is enabled (DevTools → Settings)

### Issue: API timeout (>30 seconds)
**Possible causes:**
1. Backend is processing slowly
2. Network connection is slow
3. Backend crashed

**Solution:**
```bash
# Check backend logs for errors
# Restart both backend and frontend
```

## 📊 Expected Latency

| Operation | Expected Time |
|-----------|---------------|
| Page Load | 2-3 seconds |
| Type claim | Instant |
| Submit claim | Immediate visual feedback |
| API processing | 5-15 seconds |
| Total verdict display | 5-20 seconds |
| Message animation | 0.5 seconds |

## 🎯 Next Steps

### Once Everything Works:
1. ✅ Test with different claims
2. ✅ Check verdict accuracy
3. ✅ Verify sources are relevant
4. ✅ Test on mobile browser
5. ✅ Try dark/light mode toggle (if available)
6. ✅ Reset and start new conversation

### Customization:
- Edit welcome message in `ChatInterface.tsx`
- Modify colors in `index.css`
- Add new animation effects with Framer Motion
- Extend VerdictMessage styling

## 📚 File Locations

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx       ← Main component
│   │   ├── ChatMessage.tsx         ← Message display
│   │   ├── VerdictMessage.tsx      ← Verdict styling
│   │   └── [other components]
│   ├── pages/
│   │   └── Index.tsx               ← Uses ChatInterface
│   ├── services/
│   │   └── api.ts                  ← API calls
│   └── index.css                   ← Styles & animations
```

## 🆘 Getting Help

1. **Check the chat history:** Review previous messages for solutions
2. **Read the CHAT_INTERFACE_GUIDE.md:** Complete technical documentation
3. **Check backend logs:** Look for API errors
4. **Browser DevTools:**
   - Console: JavaScript errors
   - Network: API request/response
   - Performance: Animation latency
   - Elements: DOM structure

## 🎓 Learning Path

1. Read CHAT_INTERFACE_GUIDE.md (full documentation)
2. Try basic claims (TRUE/FALSE type)
3. Experiment with edge cases
4. Explore the code (start with Index.tsx)
5. Customize styling (in index.css)
6. Add new features (extend ChatInterface.tsx)

---

**Happy fact-checking with TruthBot! 🚀**
