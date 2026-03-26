import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type ModelType = "gemini-3-flash" | "gemini-3.1-flash-lite";

/**
 * Routes the task to the appropriate Gemini model based on complexity.
 * @param prompt The user prompt or task description.
 * @param manualModel Optional manual override for the model.
 * @returns The selected model instance.
 */
export function getModel(prompt: string, manualModel?: ModelType) {
  if (manualModel) {
    return genAI.getGenerativeModel({ model: manualModel });
  }

  // Automatic Routing Heuristic
  // Use Flash-Lite for simple tasks (short prompts, common keywords)
  // Use Flash for complex tasks (long prompts, reasoning keywords)
  const complexityScore = analyzeComplexity(prompt);
  const selectedModel = complexityScore > 5 ? "gemini-3-flash" : "gemini-3.1-flash-lite";

  console.log(`[ModelRouting] Selected ${selectedModel} for prompt complexity ${complexityScore}`);
  return genAI.getGenerativeModel({ model: selectedModel });
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
