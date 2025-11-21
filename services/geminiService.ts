import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to process file based on type
const fileToGenerativePart = async (file: File): Promise<{ inlineData?: { data: string, mimeType: string }, text?: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    if (file.type === 'application/pdf') {
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve({
                    inlineData: {
                        data: reader.result.split(',')[1],
                        mimeType: 'application/pdf'
                    }
                });
            } else {
                reject(new Error('Failed to read PDF file'));
            }
        };
        reader.readAsDataURL(file);
    } else {
        // Assume text/plain for sample resume
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve({ text: reader.result });
            } else {
                reject(new Error('Failed to read text file'));
            }
        };
        reader.readAsText(file);
    }
    reader.onerror = reject;
  });
};

export const analyzeResume = async (file: File, targetRole: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const fileData = await fileToGenerativePart(file);

  const prompt = `
    You are a Senior Technical Recruiter and Career Strategist at a FAANG company. 
    Analyze the provided resume against the target role: "${targetRole}".
    
    1. **Deep Semantic Match**: Look beyond keywords. If the role asks for "Kubernetes" and the resume shows "Container Orchestration at scale", that is a match.
    2. **Gap Analysis**: Identify where the candidate falls short specifically for *this* level of role.
    3. **Interview Prep**: Based *only* on the identified gaps, generate tough interview questions they are likely to face.
    4. **Action Plan**: Provide concrete steps and a search query for learning resources.

    Provide a strict JSON response adhering to the schema.
  `;

  // Construct contents dynamically based on file type
  const contentParts = [];
  
  if (fileData.inlineData) {
      contentParts.push({ inlineData: fileData.inlineData });
      contentParts.push({ text: prompt });
  } else if (fileData.text) {
      contentParts.push({ text: `RESUME CONTENT:\n${fileData.text}\n\n${prompt}` });
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: contentParts,
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: { type: Type.NUMBER, description: "Overall match percentage (0-100). Be critical." },
          summary: { type: Type.STRING, description: "A 2-sentence executive summary of the fit, highlighting the biggest strength and biggest weakness." },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skillName: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Technical", "Soft", "Domain"] },
                currentProficiency: { type: Type.NUMBER, description: "Estimated level 0-100 based on resume evidence" },
                requiredProficiency: { type: Type.NUMBER, description: "Expected level 0-100 for the target role" },
                gapReason: { type: Type.STRING, description: "Specific reason for the gap (e.g., 'Lack of production experience' vs 'No evidence found')" },
              },
              required: ["skillName", "category", "currentProficiency", "requiredProficiency", "gapReason"],
            },
          },
          actionPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                projectPrompt: { type: Type.STRING, description: "A highly specific, 1-sentence prompt for an AI to generate a project starter kit for this skill." },
                estimatedTime: { type: Type.STRING, description: "e.g., '2 weeks'" },
                learningResourceQuery: { type: Type.STRING, description: "A specific Google/YouTube search query to find the best tutorials for this gap (e.g. 'Advanced React Performance Optimization course')." },
              },
              required: ["title", "description", "projectPrompt", "estimatedTime", "learningResourceQuery"],
            },
          },
          interviewPrep: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                  question: { type: Type.STRING, description: "A difficult behavioral or technical question targeting their weakest area." },
                  expectedKeyPoints: { type: Type.STRING, description: "What a recruiter wants to hear in the answer." }
               },
               required: ["question", "expectedKeyPoints"]
            }
          }
        },
        required: ["matchScore", "summary", "skills", "actionPlan", "interviewPrep"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response received from Gemini");
  }

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to process analysis results");
  }
};