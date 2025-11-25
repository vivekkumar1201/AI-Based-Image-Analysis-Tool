
import { GoogleGenAI } from "@google/genai";
import { ANALYST_SYSTEM_INSTRUCTION } from "../constants";
import { FileData } from "../types";

export const generateImageReport = async (
  apiKey: string,
  imageA: FileData,
  imageB: FileData,
  title: string,
  reportId: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          parts: [
            {
              text: `Generate the Enterprise QA Report.
              
              Metadata:
              - Report Title: "${title}"
              - Report ID: "${reportId}"
              - Reference Image (Image A): "${imageA.file.name}"
              - Comparison Image (Image B): "${imageB.file.name}"
              
              Strictly follow the CSS template and structure defined in the system instruction.
              Use {{IMAGE_A_PLACEHOLDER}} and {{IMAGE_B_PLACEHOLDER}} for source injection.`
            },
            {
              inlineData: {
                mimeType: imageA.mimeType,
                data: imageA.base64
              }
            },
            {
              inlineData: {
                mimeType: imageB.mimeType,
                data: imageB.base64
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: ANALYST_SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for high consistency and strict adherence to template
        maxOutputTokens: 8192,
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ] as any,
      }
    });

    const text = response.text;
    
    if (!text) {
      const candidate = response.candidates?.[0];
      if (candidate?.finishReason) {
        throw new Error(`Gemini blocked the response. Reason: ${candidate.finishReason}`);
      }
      throw new Error("Empty response from Gemini (no text generated)");
    }

    let cleanHtml = text.replace(/^```html\s*/i, "").replace(/\s*```$/, "");
    
    const srcA = `data:${imageA.mimeType};base64,${imageA.base64}`;
    const srcB = `data:${imageB.mimeType};base64,${imageB.base64}`;

    cleanHtml = cleanHtml.replace(/{{IMAGE_A_PLACEHOLDER}}/g, srcA);
    cleanHtml = cleanHtml.replace(/{{IMAGE_B_PLACEHOLDER}}/g, srcB);

    return cleanHtml;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate report");
  }
};
