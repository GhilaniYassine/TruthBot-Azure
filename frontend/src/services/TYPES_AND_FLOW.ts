/**
 * Complete API Integration TypeScript Types & Flow
 */

// ============================================================================
// API TYPES (src/services/api.ts)
// ============================================================================

/**
 * What the frontend SENDS to the backend
 */
export interface FactCheckRequest {
  claim: string;
}

/**
 * What the backend RETURNS
 * The verdict field contains markdown-formatted text that gets parsed
 */
export interface FactCheckResponse {
  claim: string;                    // Original claim
  search_results_count: number;    // Number of sources found (0-10)
  verdict: string;                 // Markdown-formatted verdict (TO BE PARSED)
  success: boolean;                // Success flag
  error?: string;                  // Error message if failed
}

/**
 * What we PARSE the verdict into
 * This is what VerdictDisplay component receives
 */
export interface ParsedVerdict {
  verdictType: "TRUE" | "FALSE" | "PARTIALLY_TRUE" | "UNVERIFIABLE" | "MISLEADING";
  confidence: "High" | "Medium" | "Low";
  claim: string;                   // Original claim
  reasoning: string;               // Extracted from "WHY" section in markdown
  sources: Array<{
    title: string;
    url: string;
    credibility: "HIGH" | "MEDIUM" | "LOW";
    relationship: "Supports" | "Contradicts" | "Context";
    reason: string;
  }>;
  limitations: string[];           // Extracted from "NOTES" section
  searchResultsCount: number;      // From API response
}

// ============================================================================
// DATA FLOW EXAMPLE
// ============================================================================

// STEP 1: User enters claim in ClaimInput
// User types: "The moon is made of cheese"

// STEP 2: Frontend calls API
const exampleRequest: FactCheckRequest = {
  claim: "The moon is made of cheese"
};

// STEP 3: Backend processes and returns
const exampleApiResponse: FactCheckResponse = {
  claim: "The moon is made of cheese",
  search_results_count: 8,
  verdict: `**FACT-CHECK VERDICT**

**CLAIM:** The moon is made of cheese

**VERDICT:** FALSE
**CONFIDENCE:** High

**WHY (1–3 sentences):**
This is a playful myth popularized by nursery rhymes and folklore. Modern space exploration, starting with the Apollo 11 mission, has definitively proven the moon is a rocky celestial body composed primarily of silicate minerals, iron oxides, and trace elements. Multiple spacecraft have collected samples and images confirming its solid rock composition.

**TOP SOURCES (max 6):**
- NASA: Moon Composition — https://www.nasa.gov/moon-composition — Contradicts — Official space agency data with samples
- Scientific American: Moon Formation — https://www.scientificamerican.com/moon — Contradicts — Scientific peer-reviewed analysis
- USGS: Lunar Geology — https://www.usgs.gov/lunar-samples — Context — Official geological samples documentation

**NOTES / LIMITATIONS:**
- This is well-established fact with overwhelming evidence
- Lunar samples are available for public inspection
- No credible scientific sources support cheese composition`,
  success: true
};

// STEP 4: Frontend parses the markdown verdict
const parsedExample: ParsedVerdict = {
  verdictType: "FALSE",
  confidence: "High",
  claim: "The moon is made of cheese",
  reasoning: "This is a playful myth popularized by nursery rhymes and folklore. Modern space exploration, starting with the Apollo 11 mission, has definitively proven the moon is a rocky celestial body composed primarily of silicate minerals, iron oxides, and trace elements. Multiple spacecraft have collected samples and images confirming its solid rock composition.",
  sources: [
    {
      title: "NASA: Moon Composition",
      url: "https://www.nasa.gov/moon-composition",
      credibility: "HIGH",
      relationship: "Contradicts",
      reason: "Official space agency data with samples"
    },
    {
      title: "Scientific American: Moon Formation",
      url: "https://www.scientificamerican.com/moon",
      credibility: "HIGH",
      relationship: "Contradicts",
      reason: "Scientific peer-reviewed analysis"
    },
    {
      title: "USGS: Lunar Geology",
      url: "https://www.usgs.gov/lunar-samples",
      credibility: "MEDIUM",
      relationship: "Context",
      reason: "Official geological samples documentation"
    }
  ],
  limitations: [
    "This is well-established fact with overwhelming evidence",
    "Lunar samples are available for public inspection",
    "No credible scientific sources support cheese composition"
  ],
  searchResultsCount: 8
};

// STEP 5: VerdictDisplay component receives ParsedVerdict and renders it

// ============================================================================
// COMPONENT INTEGRATION POINTS
// ============================================================================

/**
 * Index.tsx (Main Page)
 * - Manages: isLoading, currentStep, statusMessage, result, error
 * - Calls: factCheckClaim(claim) from api.ts
 * - Calls: parseVerdict(markdown, claim, count) from api.ts
 * - Passes: result (ParsedVerdict) to VerdictDisplay
 */

/**
 * ClaimInput.tsx (User Input)
 * - User types claim
 * - Validates non-empty
 * - Calls: onSubmit(claim) from Index.tsx
 */

/**
 * ProcessingStatus.tsx (Loading Progress)
 * - Receives: currentStep (0-2), statusMessage
 * - Displays: 3-phase timeline with current progress
 */

/**
 * VerdictDisplay.tsx (Results)
 * - Receives: result (ParsedVerdict)
 * - Displays: 
 *   - Verdict type with icon
 *   - Confidence badge
 *   - Reasoning text
 *   - Sources table/cards
 *   - Limitations list
 * - Actions: Share, Save, Check Another Claim
 */

// ============================================================================
// API SERVICE FUNCTIONS
// ============================================================================

/**
 * factCheckClaim(claim: string): Promise<FactCheckResponse>
 * 
 * Sends a claim to the backend /fact-check endpoint
 * Returns the raw API response (includes markdown verdict string)
 * 
 * Usage:
 *   const response = await factCheckClaim("The moon is made of cheese");
 *   // response.verdict is a markdown string that needs parsing
 */

/**
 * parseVerdict(verdictMarkdown: string, claim: string, count: number): ParsedVerdict
 * 
 * Parses the markdown verdict string from API into structured data
 * Extracts verdict type, confidence, reasoning, sources, limitations
 * Uses regex patterns to find specific markdown sections
 * 
 * Usage:
 *   const parsed = parseVerdict(response.verdict, response.claim, response.search_results_count);
 *   // Now you have typed data to display
 */

/**
 * checkApiHealth(): Promise<boolean>
 * 
 * Checks if the backend API is healthy (calls /health endpoint)
 * Returns true if backend is accessible, false otherwise
 * 
 * Usage:
 *   const isHealthy = await checkApiHealth();
 */

// ============================================================================
// ERROR HANDLING FLOW
// ============================================================================

/**
 * Error Scenario 1: Empty Claim
 * - ClaimInput validates and shows error (no API call)
 */

/**
 * Error Scenario 2: API Request Fails
 * - factCheckClaim() throws error
 * - Index.tsx catches it
 * - Shows error message and offers "Try Another Claim" button
 */

/**
 * Error Scenario 3: Parsing Fails
 * - parseVerdict() might return incomplete data
 * - VerdictDisplay still renders with available data
 * - Limitations section will show missing information
 */

/**
 * Error Scenario 4: API Returns error=true
 * - response.success is false
 * - Index.tsx throws error
 * - Shows user-friendly error message
 */

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

/**
 * .env.local (Development)
 * VITE_API_BASE_URL=http://localhost:8000
 * 
 * .env.production (Production - if needed)
 * VITE_API_BASE_URL=https://your-api-domain.com
 * 
 * Access in code:
 * const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
 */

// ============================================================================
// TIMELINE OF EVENTS
// ============================================================================

/**
 * 1. User types claim → "Check This Claim" button
 * 2. ClaimInput calls onSubmit(claim)
 * 3. Index.tsx: setIsLoading(true), setCurrentStep(0), setStatusMessage(msgs[0])
 * 4. Wait 800ms → setCurrentStep(1), setStatusMessage(msgs[1])
 * 5. Call: factCheckClaim(claim) - This is the API request
 * 6. Wait 800ms → setCurrentStep(2), setStatusMessage(msgs[2])
 * 7. Call: parseVerdict(response.verdict, ...) - Parse markdown
 * 8. Wait 500ms
 * 9. setResult(parsedVerdict), setIsLoading(false)
 * 10. VerdictDisplay renders with result
 */

// ============================================================================
// MARKDOWN VERDICT FORMAT (From Backend)
// ============================================================================

/**
 * The backend returns verdict as markdown string with this structure:
 * 
 * **FACT-CHECK VERDICT**
 * 
 * **CLAIM:** [claim text]
 * 
 * **VERDICT:** [TRUE/FALSE/PARTIALLY TRUE/UNVERIFIABLE/MISLEADING]
 * **CONFIDENCE:** [High/Medium/Low]
 * 
 * **WHY (1–3 sentences):**
 * [Reasoning paragraph explaining the verdict]
 * 
 * **TOP SOURCES (max 6):**
 * - [Title] — [URL] — [Supports/Contradicts/Context] — [reason]
 * - [Title] — [URL] — [Supports/Contradicts/Context] — [reason]
 * 
 * **NOTES / LIMITATIONS:**
 * - [Limitation 1]
 * - [Limitation 2]
 * 
 * The parseVerdict() function uses regex to extract these sections
 */

export {};
