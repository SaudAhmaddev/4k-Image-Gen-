import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GeneratedImage } from "../types";

// Initialize Gemini API Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhances the user's raw prompt into a structured, high-fidelity prompt
 * suitable for generating 4MP+ quality images.
 */
export const enhancePrompt = async (rawPrompt: string): Promise<string> => {
  try {
    const systemInstruction = `
      You are an expert AI Image Prompt Engineer. Your goal is to take a simple user description and rewrite it into a highly detailed, structured prompt optimized for a high-end diffusion model (Imagen 4.0).
      
      Guidelines:
      1. MANDATORY: Ensure the description requests EXTREMELY HIGH RESOLUTION (at least 4 megapixels). Always include keywords like: "UHD", "8k resolution", "4 megapixel", "highly detailed", "sharp focus", "masterpiece".
      2. Focus on extreme detail, lighting, texture, composition, and style.
      3. Output ONLY the enhanced prompt text. Do not add explanations.
      4. Structure the prompt as: [Subject Description], [Environment/Background], [Lighting], [Style/Medium], [Technical Params].
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: rawPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || rawPrompt;
  } catch (error) {
    console.error("Prompt enhancement failed:", error);
    // Fallback to original prompt if enhancement fails
    return rawPrompt;
  }
};

/**
 * Generates images using Imagen 4.0.
 * Requests 4 images at once.
 */
export const generateImages = async (prompt: string, aspectRatio: AspectRatio): Promise<GeneratedImage[]> => {
  try {
    // Using Imagen 4.0 for high quality
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 4, // Requesting 4 images
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
        // Note: Pixel resolution is determined by the model and aspect ratio.
        // We rely on the 'imagen-4.0' model to provide the highest available resolution.
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("No images were returned by the model.");
    }

    return response.generatedImages.map((img, index) => ({
      id: `gen-${Date.now()}-${index}`,
      base64: img.image.imageBytes,
      mimeType: 'image/png', // Defaulting to PNG as requested in config
    }));

  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};