# ✅ Chat Interface - Getting Started Checklist

## 🎯 Phase 1: Setup (5 minutes)

- [ ] **Read** `IMPLEMENTATION_COMPLETE.md` (overview)
- [ ] **Read** `QUICK_REFERENCE.md` (quick reference)
- [ ] **Verify** backend running: `curl http://localhost:8000/health`
- [ ] **Verify** frontend dependencies: `cd frontend && npm install`
- [ ] **Ready** to start!

## 🚀 Phase 2: Run It (2 minutes)

### Terminal 1: Start Backend
```bash
cd /home/yassine/workspace/Ai/TruthBot-Azure
source env/bin/activate
python endpoint/fact.py
```
- [ ] Backend started ✅
- [ ] See: \"Uvicorn running on http://127.0.0.1:8000\"

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
- [ ] Frontend started ✅
- [ ] See: \"Local: http://localhost:5173\"

### Terminal 3: Open Browser
```
http://localhost:5173
```
- [ ] Chat interface loaded ✅
- [ ] See welcome message ✅
- [ ] Can type in input field ✅

## 🧪 Phase 3: Test It (5 minutes)

### Test Basic Functionality
- [ ] Type claim: \"The Earth is round\"
- [ ] Press Enter or click Send
- [ ] See loading animation
- [ ] See verdict displayed
- [ ] Read verdict details
- [ ] See sources listed
- [ ] Verdict card is colored correctly

### Test Different Claim Types
- [ ] Try TRUE claim (e.g., \"Python is a language\")
- [ ] Try FALSE claim (e.g., \"Moon is cheese\")
- [ ] Try long claim (multiple sentences)
- [ ] Try claim with special characters
- [ ] See all render correctly

### Test UI Features
- [ ] Click \"New Chat\" button
- [ ] Chat resets ✅
- [ ] Try typing another claim
- [ ] Messages auto-scroll to bottom
- [ ] Hover effects work on buttons
- [ ] Messages display timestamps

### Test Mobile
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Chat layout responsive ✅
- [ ] Messages visible ✅
- [ ] Input field usable ✅
- [ ] Back to desktop view

### Test Error Handling
- [ ] Stop backend (Ctrl+C in Terminal 1)
- [ ] Try to submit a claim
- [ ] See error message
- [ ] Message displays in chat
- [ ] Can still type
- [ ] Restart backend
- [ ] Verify it works again

## 📚 Phase 4: Explore Documentation (10 minutes)

- [ ] Read **START_HERE.md** (visual guide)
- [ ] Read **QUICK_REFERENCE.md** (quick facts)
- [ ] Read **CHAT_INTERFACE_QUICKSTART.md** (quick start)
- [ ] Skim **CHAT_INTERFACE_GUIDE.md** (technical)
- [ ] Check **STYLING_GUIDE.md** (if you want to customize)
- [ ] Review **FILE_MANIFEST.md** (what changed)

## 🎨 Phase 5: Customize (Optional, 15 minutes)

### Try These Easy Changes

#### 1. Change Welcome Message
- [ ] Open `frontend/src/components/ChatInterface.tsx`
- [ ] Find: `content: \"Hello! 👋 I'm TruthBot..."`
- [ ] Change to: Your custom message
- [ ] Save file
- [ ] See change in browser (auto-refresh)

#### 2. Change Primary Color
- [ ] Open `frontend/src/components/ChatInterface.tsx`
- [ ] Find: `from-purple-600 to-blue-600`
- [ ] Change to: `from-pink-600 to-rose-600`
- [ ] Save file
- [ ] See color change in browser

#### 3. Adjust Animation Speed
- [ ] Open `frontend/src/components/VerdictMessage.tsx`
- [ ] Find: `duration: 0.5`
- [ ] Change to: `duration: 0.25` (faster) or `0.75` (slower)
- [ ] Save file
- [ ] Test verdict animation

#### 4. Update Input Placeholder
- [ ] Open `frontend/src/components/ChatInterface.tsx`
- [ ] Find: `placeholder=\"Enter a claim to fact-check...\"`
- [ ] Change to: Your text
- [ ] Save and test

## 🚀 Phase 6: Go Live (When Ready)

### Before Deployment
- [ ] All tests passing ✅
- [ ] No console errors ✅
- [ ] Mobile responsive verified ✅
- [ ] Documentation read ✅
- [ ] Customizations complete ✅

### Build & Deploy
```bash
# Build for production
cd frontend
npm run build

# Deploy dist/ folder to your server
# (Copy contents of frontend/dist/ to hosting)
```

- [ ] Build successful ✅
- [ ] No build errors ✅
- [ ] dist/ folder created ✅
- [ ] Ready to deploy ✅

## 📞 Troubleshooting Checklist

### If Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Check Python version
python --version  # Should be 3.10+

# Check virtual environment
source env/bin/activate
which python
```
- [ ] Port 8000 available ✅
- [ ] Python 3.10+ installed ✅
- [ ] Virtual env activated ✅

### If Frontend Won't Start
```bash
# Check Node version
node --version  # Should be 18+

# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```
- [ ] Node 18+ installed ✅
- [ ] npm install successful ✅
- [ ] npm run dev works ✅

### If Chat Not Loading
- [ ] Backend running? (check Terminal 1)
- [ ] Frontend running? (check Terminal 2)
- [ ] Correct URL? (http://localhost:5173)
- [ ] Refresh browser (Ctrl+R)
- [ ] Clear cache (DevTools → Storage → Clear All)

### If API Calls Failing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Check CORS config in endpoint/fact.py
# Should have localhost:5173 in allow_origins
```
- [ ] Health endpoint responds ✅
- [ ] CORS configured correctly ✅
- [ ] Check browser console (F12) ✅

### If Animations Stuttering
- [ ] Close other applications
- [ ] Check DevTools → Performance
- [ ] Verify GPU acceleration enabled
- [ ] Try different browser
- [ ] Reduce system load

## 📊 Quick Status Check

Run this checklist whenever you're unsure:

```
Startup:
  [ ] Backend running (curl localhost:8000/health)
  [ ] Frontend running (http://localhost:5173 loads)
  [ ] No console errors (F12)

Functionality:
  [ ] Can type in input
  [ ] Can submit claim
  [ ] See loading animation
  [ ] See verdict displayed
  [ ] Messages organized correctly

Visual:
  [ ] Colors look good
  [ ] Animations smooth
  [ ] Mobile layout responsive
  [ ] Text readable
  [ ] Icons showing

Performance:
  [ ] Fast load time (<3s)
  [ ] Smooth scrolling
  [ ] No lag on input
  [ ] Animations 60 FPS
```

## 🎓 Learning Path

### If You're New to the Code
1. **Read** START_HERE.md
2. **Read** CHAT_INTERFACE_QUICKSTART.md
3. **Read** CHAT_INTERFACE_GUIDE.md
4. **Explore** ChatInterface.tsx
5. **Explore** ChatMessage.tsx
6. **Explore** VerdictMessage.tsx
7. **Try** customizations
8. **Extend** with features

### If You Want to Customize
1. **Read** STYLING_GUIDE.md
2. **Read** VISUAL_DESIGN_REFERENCE.md
3. **Identify** what to change
4. **Find** the code
5. **Make** the change
6. **Test** in browser
7. **Iterate** until happy

### If You Want to Extend
1. **Understand** current flow
2. **Plan** new feature
3. **Create** new component
4. **Integrate** with ChatInterface
5. **Test** thoroughly
6. **Document** changes
7. **Deploy** when ready

## ✨ Success Indicators

You'll know everything is working when:

✅ **Chat Interface Loads**
- See TruthBot logo and welcome message
- Input field is active
- \"New Chat\" button visible

✅ **Can Submit Claims**
- Type claim and press Enter
- Loading animation shows
- Verdict appears after processing

✅ **Verdicts Display Correctly**
- Color matches verdict type
- All sections visible (claim, analysis, sources)
- Sources are clickable links

✅ **Mobile Works**
- Layout adapts to small screens
- Touch targets are big enough
- Scrolling works smoothly

✅ **No Errors**
- Browser console clean (F12)
- No red error messages
- No warnings in console

## 🎉 Completion Checklist

When you've completed everything:

- [ ] Phase 1: Setup complete
- [ ] Phase 2: Running locally
- [ ] Phase 3: Tested thoroughly
- [ ] Phase 4: Read documentation
- [ ] Phase 5: Customized (optional)
- [ ] Phase 6: Ready to deploy (when needed)
- [ ] Troubleshooting verified
- [ ] Learning path started
- [ ] Success indicators confirmed

## 🚀 You're Ready!

When all checkboxes are ✅, you're ready to:
- Share with team
- Deploy to production
- Get user feedback
- Plan future features
- Build on top of it

---

## 📚 Key Documentation Files

1. **START_HERE.md** - Visual overview
2. **QUICK_REFERENCE.md** - Quick facts
3. **CHAT_INTERFACE_QUICKSTART.md** - Quick start guide
4. **CHAT_INTERFACE_GUIDE.md** - Complete guide
5. **STYLING_GUIDE.md** - Design reference
6. **VISUAL_DESIGN_REFERENCE.md** - Visual guide

---

## 🎯 Next Actions

### Right Now
1. Run the 3 commands to start
2. Open http://localhost:5173
3. Test with a claim

### This Hour
4. Read START_HERE.md
5. Read QUICK_REFERENCE.md
6. Test mobile layout

### This Week
7. Read full documentation
8. Customize styling (if desired)
9. Get team feedback

### When Ready
10. Run `npm run build`
11. Deploy to server
12. Monitor production
13. Plan future features

---

**Good luck! 🚀 You've got this!**

Questions? Check the documentation files listed above.

Status: ✅ Ready to Go! 🎉
