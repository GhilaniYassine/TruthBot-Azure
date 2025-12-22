/**
 * API Service for TruthBot fact-checking endpoint
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export interface FactCheckRequest {
  claim: string;
}

export interface FactCheckResponse {
  claim: string;
  search_results_count: number;
  verdict: string; // Markdown-formatted string
  success: boolean;
  error?: string;
}

export interface ParsedVerdict {
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

/**
 * Fact-check a claim using the TruthBot API
 */
export const factCheckClaim = async (claim: string): Promise<FactCheckResponse> => {
  const response = await fetch(`${API_BASE_URL}/fact-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ claim }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Parse the markdown verdict string into structured data
 * Extracts verdict type, confidence, reasoning, sources, and limitations
 */
export const parseVerdict = (
  verdictMarkdown: string,
  claim: string,
  searchResultsCount: number
): ParsedVerdict => {
  // Initialize with defaults
  let verdictType: ParsedVerdict["verdictType"] = "UNVERIFIABLE";
  let confidence: ParsedVerdict["confidence"] = "Low";
  let reasoning = "";
  const sources: ParsedVerdict["sources"] = [];
  const limitations: string[] = [];

  const lines = verdictMarkdown.split("\n");

  // Extract verdict type and confidence
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toUpperCase();

    if (line.includes("**VERDICT:**") || line.includes("VERDICT:")) {
      const verdictLine = lines[i];
      if (verdictLine.includes("TRUE") && !verdictLine.includes("PARTIALLY")) {
        verdictType = "TRUE";
      } else if (verdictLine.includes("FALSE")) {
        verdictType = "FALSE";
      } else if (verdictLine.includes("PARTIALLY")) {
        verdictType = "PARTIALLY_TRUE";
      } else if (verdictLine.includes("MISLEADING")) {
        verdictType = "MISLEADING";
      } else if (verdictLine.includes("UNVERIFIABLE")) {
        verdictType = "UNVERIFIABLE";
      }
    }

    if (line.includes("**CONFIDENCE:**") || line.includes("CONFIDENCE:")) {
      const confidenceLine = lines[i];
      if (confidenceLine.toUpperCase().includes("HIGH")) {
        confidence = "High";
      } else if (confidenceLine.toUpperCase().includes("MEDIUM")) {
        confidence = "Medium";
      } else if (confidenceLine.toUpperCase().includes("LOW")) {
        confidence = "Low";
      }
    }

    // Extract reasoning (WHY section)
    if (line.includes("**WHY") || line.includes("WHY:")) {
      let j = i + 1;
      const reasoningLines: string[] = [];
      while (
        j < lines.length &&
        !lines[j].toUpperCase().includes("**TOP SOURCES") &&
        !lines[j].toUpperCase().includes("**NOTES") &&
        !lines[j].toUpperCase().includes("**IMPORTANT")
      ) {
        if (lines[j].trim()) {
          reasoningLines.push(lines[j].trim());
        }
        j++;
      }
      reasoning = reasoningLines.join(" ").trim();
    }

    // Extract sources (TOP SOURCES section)
    if (
      line.includes("**TOP SOURCES") ||
      (line.includes("TOP SOURCES") && !line.includes("**"))
    ) {
      let j = i + 1;
      while (
        j < lines.length &&
        !lines[j].toUpperCase().includes("**NOTES") &&
        !lines[j].toUpperCase().includes("**IMPORTANT")
      ) {
        const sourceLine = lines[j];
        // Match pattern: "- Title — URL — Relationship — Reason"
        if (sourceLine.startsWith("-")) {
          const parts = sourceLine
            .substring(1)
            .split("—")
            .map((p) => p.trim());
          if (parts.length >= 3) {
            // Determine credibility based on context or URL pattern
            let credibility: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
            const source = parts[0];
            if (
              source.toLowerCase().includes("nasa") ||
              source.toLowerCase().includes("scientific") ||
              source.toLowerCase().includes("government")
            ) {
              credibility = "HIGH";
            } else if (
              source.toLowerCase().includes("blog") ||
              source.toLowerCase().includes("forum")
            ) {
              credibility = "LOW";
            }

            let relationship: "Supports" | "Contradicts" | "Context" = "Context";
            const relationshipStr = parts[2].toLowerCase();
            if (relationshipStr.includes("support")) {
              relationship = "Supports";
            } else if (relationshipStr.includes("contradict")) {
              relationship = "Contradicts";
            }

            sources.push({
              title: parts[0],
              url: parts[1].startsWith("http") ? parts[1] : `https://${parts[1]}`,
              credibility,
              relationship,
              reason: parts[3] || "Source relevant to claim",
            });
          }
        }
        j++;
      }
    }

    // Extract limitations (NOTES/IMPORTANT section)
    if (
      line.includes("**NOTES") ||
      line.includes("**IMPORTANT") ||
      (line.includes("LIMITATIONS") && !line.includes("**"))
    ) {
      let j = i + 1;
      while (j < lines.length) {
        const limitLine = lines[j];
        if (limitLine.startsWith("-") || limitLine.startsWith("•")) {
          limitations.push(limitLine.substring(1).trim());
        }
        j++;
      }
    }
  }

  return {
    verdictType,
    confidence,
    claim,
    reasoning: reasoning || verdictMarkdown.substring(0, 300),
    sources,
    limitations,
    searchResultsCount,
  };
};

/**
 * Check API health
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
