import { GoogleGenAI } from "@google/genai";
import { Finding } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const explainFindingInPlainEnglish = async (finding: Finding): Promise<string> => {
  if (!apiKey) {
    return "AI explanation unavailable (Missing API Key). However, the general rule is to update your software and close unused ports.";
  }

  try {
    const prompt = `
      You are PatrolNet. Explain this security finding to a non-technical business owner in exactly two short, simple sentences.
      
      Finding: ${finding.title}
      Description: ${finding.description}
      
      Rules:
      1. No jargon.
      2. maximum 2 sentences.
      3. Focus on "What is it?" and "Why it matters?".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "We couldn't reach our AI advisor right now. Please check the standard remediation steps.";
  }
};

export const generateRemediationPlan = async (findings: Finding[]): Promise<string> => {
    if (!apiKey) return "API Key missing.";
    
    try {
        const titles = findings.map(f => f.title).join(", ");
        const prompt = `
            I have a list of security issues: ${titles}.
            Give me a prioritized checklist of 3 steps to fix the most critical items first.
            Keep it brief and actionable.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "No plan generated.";
    } catch (e) {
        return "Error generating plan.";
    }
}