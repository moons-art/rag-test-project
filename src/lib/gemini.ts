import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type ModelType = "gemini-3-flash" | "gemini-3.1-flash-lite";

// Mapping the conceptual "Gemini 3" names requested to actual supported API models
const API_MODEL_MAP: Record<ModelType, string> = {
  "gemini-3-flash": "gemini-3-flash-preview", 
  "gemini-3.1-flash-lite": "gemini-3.1-flash-lite-preview" 
};

/**
 * Routes the task to the appropriate Gemini model based on complexity.
 * @param prompt The user prompt or task description.
 * @param manualModel Optional manual override for the model.
 * @returns The selected model instance.
 */
export function getModel(prompt: string, manualModel?: ModelType) {
  let selectedConceptualModel: ModelType;

  if (manualModel) {
    selectedConceptualModel = manualModel;
  } else {
    // Automatic Routing Heuristic
    const complexityScore = analyzeComplexity(prompt);
    selectedConceptualModel = complexityScore > 5 ? "gemini-3-flash" : "gemini-3.1-flash-lite";
    console.log(`[ModelRouting] Selected ${selectedConceptualModel} for prompt complexity ${complexityScore}`);
  }

  const actualApiModel = API_MODEL_MAP[selectedConceptualModel];
  return genAI.getGenerativeModel({ model: actualApiModel });
}

function analyzeComplexity(prompt: string): number {
  let score = 0;
  
  // Length heuristic
  if (prompt.length > 300) score += 3;
  if (prompt.length > 1000) score += 5;

  // Keyword heuristic (reasoning, coding, complex analysis)
  const complexKeywords = ["explain", "analyze", "code", "debug", "summarize multiple", "reason", "logic"];
  complexKeywords.forEach(word => {
    if (prompt.toLowerCase().includes(word)) score += 2;
  });

  return score;
}
