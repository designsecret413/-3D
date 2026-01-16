
import { GoogleGenAI } from "@google/genai";
import { AgeGroup } from "../types";

export const generate3DCharacter = async (
  base64Image: string,
  ageGroup: AgeGroup
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 content if it includes the data URI prefix
  const base64Data = base64Image.split(',')[1] || base64Image;
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

  const prompt = `Convert the person in this image into a cute, high-quality 3D stylized full-body character (Disney/Pixar style). 
  IMPORTANT: Show the entire character from head to toe, including their legs and feet. 
  The character should look like they are in the ${ageGroup} age group. 
  Maintain the hair color, eye color, and general features of the person but make them incredibly cute with big expressive eyes, 
  soft 3D lighting, and a clay-like or smooth vinyl texture. 
  The character should be standing on a simple ground plane with a soft pastel background. 
  Output only the resulting image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated.");
    }

    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
