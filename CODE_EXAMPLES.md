# Complete Code Examples & Reference

## API Service Usage Example

### In Index.tsx (Main App Logic)

```typescript
import { factCheckClaim, parseVerdict } from "@/services/api";

const handleSubmit = async (claim: string) => {
  setIsLoading(true);
  
  try {
    // Call the API
    const apiResponse = await factCheckClaim(claim);
    
    // Check if successful
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || "Fact-checking failed");
    }
    
    // Parse the markdown verdict into structured data
    const parsedVerdict = parseVerdict(
      apiResponse.verdict,
      apiResponse.claim,
      apiResponse.search_results_count
    );
    
    // Display the result
    setResult(parsedVerdict);
    
  } catch (err) {
    // Handle errors
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};
```

---

## API Response Parsing Example

### Raw Response from Backend
```json
{
  "claim": "The moon is made of cheese",
  "search_results_count": 8,
  "verdict": "**FACT-CHECK VERDICT**\n\n**VERDICT:** FALSE\n**CONFIDENCE:** High\n\n**WHY:**\nThis is a myth...",
  "success": true
}
```

### After parseVerdict()
```typescript
{
  verdictType: "FALSE",
  confidence: "High",
  claim: "The moon is made of cheese",
  reasoning: "This is a myth...",
  sources: [
    {
      title: "NASA: Moon Composition",
      url: "https://nasa.gov/moon",
      credibility: "HIGH",
      relationship: "Contradicts",
      reason: "Official data"
    }
  ],
  limitations: ["All evidence supports this fact"],
  searchResultsCount: 8
}
```

---

## Component Props & Types

### ClaimInput Component
```typescript
interface ClaimInputProps {
  onSubmit: (claim: string) => void;  // Called when user submits
  isLoading: boolean;                  // Disables input during loading
}

// Usage in Index.tsx:
<ClaimInput 
  onSubmit={handleSubmit} 
  isLoading={isLoading} 
/>
```

### ProcessingStatus Component
```typescript
interface ProcessingStatusProps {
  currentStep: number;      // 0-2 (which phase is active)
  statusMessage: string;    // What to display
}

// Usage in Index.tsx:
<ProcessingStatus 
  currentStep={currentStep} 
  statusMessage={statusMessage} 
/>
```

### VerdictDisplay Component
```typescript
interface VerdictResult {
  verdictType: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIABLE" | "MISLEADING";
  confidence: "High" | "Medium" | "Low";
  claim: string;
  reasoning: string;
  sources: Array<{
    title: string;
    url: string;
    credibility: "HIGH" | "MEDIUM" | "LOW";
    relationship: "Supports" | "Contradicts" | "Context";
    reason: string;
  }>;
  limitations: string[];
  searchResultsCount: number;
}

interface VerdictDisplayProps {
  result: VerdictResult;
  onReset: () => void;
}

// Usage in Index.tsx:
<VerdictDisplay 
  result={result} 
  onReset={() => setResult(null)} 
/>
```

---

## State Management in Index.tsx

```typescript
// Types of state
const [isLoading, setIsLoading] = useState(false);              // Is API call in progress?
const [currentStep, setCurrentStep] = useState(0);              // Which phase (0-2)?
const [statusMessage, setStatusMessage] = useState("");         // What to display?
const [result, setResult] = useState<ParsedVerdict | null>(null); // The verdict result
const [error, setError] = useState<string | null>(null);        // Error message if any

// Flow:
// 1. User submits → setIsLoading(true), setError(null)
// 2. Phase 1 → setCurrentStep(0), setStatusMessage("...")
// 3. Phase 2 → setCurrentStep(1), setStatusMessage("...")
// 4. API call → factCheckClaim()
// 5. Parse result → parseVerdict()
// 6. Display → setResult(parsed), setIsLoading(false)
// 7. Error → setError(msg), show error card
```

---

## API Calls Breakdown

### Function: factCheckClaim
```typescript
export const factCheckClaim = async (claim: string): Promise<FactCheckResponse> => {
  // Build URL from environment or default
  const url = `${API_BASE_URL}/fact-check`;
  
  // Make POST request
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ claim })
  });
  
  // Handle HTTP errors
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  // Return parsed JSON
  return response.json();
};

// Usage:
try {
  const response = await factCheckClaim("The moon is made of cheese");
  console.log(response.verdict); // Markdown string
} catch (error) {
  console.error("Failed:", error);
}
```

### Function: parseVerdict
```typescript
export const parseVerdict = (
  verdictMarkdown: string,
  claim: string,
  searchResultsCount: number
): ParsedVerdict => {
  // Initialize defaults
  let verdictType: "TRUE" | "FALSE" | ... = "UNVERIFIABLE";
  let confidence: "High" | "Medium" | "Low" = "Low";
  let reasoning = "";
  const sources = [];
  const limitations = [];
  
  // Parse markdown by looking for specific patterns
  const lines = verdictMarkdown.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase();
    
    // Extract verdict type
    if (line.includes("VERDICT:")) {
      if (line.includes("FALSE")) verdictType = "FALSE";
      if (line.includes("TRUE")) verdictType = "TRUE";
      // etc...
    }
    
    // Extract confidence
    if (line.includes("CONFIDENCE:")) {
      if (line.includes("HIGH")) confidence = "High";
      // etc...
    }
    
    // Extract reasoning from WHY section
    if (line.includes("WHY")) {
      // Collect lines until next section
      // reasoning = ...
    }
    
    // Extract sources from TOP SOURCES section
    if (line.includes("TOP SOURCES")) {
      // Parse each source line
      // sources.push(...)
    }
    
    // Extract limitations from NOTES section
    if (line.includes("NOTES") || line.includes("IMPORTANT")) {
      // Parse each limitation line
      // limitations.push(...)
    }
  }
  
  return {
    verdictType,
    confidence,
    claim,
    reasoning,
    sources,
    limitations,
    searchResultsCount
  };
};

// Usage:
const parsed = parseVerdict(
  response.verdict,
  response.claim,
  response.search_results_count
);
console.log(parsed.verdictType); // "FALSE", "TRUE", etc
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch with Toast
```typescript
const handleSubmit = async (claim: string) => {
  try {
    const response = await factCheckClaim(claim);
    if (!response.success) throw new Error(response.error);
    
    const parsed = parseVerdict(...);
    setResult(parsed);
    
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    setError(msg);
    toast({ title: "Error", description: msg, variant: "destructive" });
  }
};
```

### Pattern 2: Error Display in UI
```typescript
{error && (
  <div className="bg-red-50 p-6 rounded-lg">
    <h3>Fact-Checking Error</h3>
    <p>{error}</p>
    <button onClick={() => setError(null)}>
      Try Another Claim
    </button>
  </div>
)}
```

---

## Environment Configuration

### .env.local (Development)
```
VITE_API_BASE_URL=http://localhost:8000
```

### .env.production (Optional)
```
VITE_API_BASE_URL=https://api.truthbot.com
```

### Access in Code
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```

---

## Type Definitions Used

```typescript
// From FastAPI backend
type VerdictType = "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIABLE" | "MISLEADING";
type ConfidenceLevel = "High" | "Medium" | "Low";
type CredibilityTier = "HIGH" | "MEDIUM" | "LOW";
type SourceRelationship = "Supports" | "Contradicts" | "Context";

// Source object
interface Source {
  title: string;           // "NASA: Moon Composition"
  url: string;             // "https://nasa.gov/..."
  credibility: CredibilityTier; // "HIGH" | "MEDIUM" | "LOW"
  relationship: SourceRelationship; // How it relates to claim
  reason: string;          // Why this source matters
}

// Complete verdict
interface ParsedVerdict {
  verdictType: VerdictType;
  confidence: ConfidenceLevel;
  claim: string;
  reasoning: string;
  sources: Source[];
  limitations: string[];
  searchResultsCount: number;
}
```

---

## Common Patterns

### Wait and Progress
```typescript
// Show message, wait 800ms, then progress
setStatusMessage("Searching...");
await new Promise(resolve => setTimeout(resolve, 800));
setCurrentStep(1);
setStatusMessage("Analyzing...");
```

### Reset the UI
```typescript
const handleReset = () => {
  setResult(null);
  setError(null);
  setCurrentStep(0);
  setStatusMessage("");
};
```

### Validate Input
```typescript
const handleSubmit = (claim: string) => {
  if (!claim.trim()) {
    setError("Claim cannot be empty");
    return;
  }
  // Continue...
};
```

---

## Testing Examples

### Test API Call
```bash
curl -X POST http://localhost:8000/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "The moon is made of cheese"}'
```

### Test in Browser Console
```javascript
const response = await fetch('http://localhost:8000/fact-check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ claim: 'The moon is made of cheese' })
});
const data = await response.json();
console.log(data);
```

---

## Integration Checklist

- [ ] `src/services/api.ts` created ✓
- [ ] `src/pages/Index.tsx` updated ✓
- [ ] `src/components/VerdictDisplay.tsx` updated ✓
- [ ] `.env.local` created ✓
- [ ] Backend API running ✓
- [ ] API URL correct in `.env.local` ✓
- [ ] Can call `/fact-check` endpoint ✓
- [ ] Verdict parses correctly ✓
- [ ] Display shows results ✓

---

**Everything is ready to go!** 🚀
