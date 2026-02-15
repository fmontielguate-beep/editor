
import { GoogleGenAI, Type } from "@google/genai";
import { EditorAnalysis } from "../types";

const SYSTEM_INSTRUCTION = `
Actúa como un Editor Senior de Revistas Médicas Pediátricas de alto impacto (Q1/Q2). 

TUS TAREAS:
1. EVALUACIÓN CRÍTICA: Analiza coherencia clínica y cumplimiento de guías CARE.
2. REDACCIÓN Y DICCIÓN: Genera sugerencias de cambio EXACTAS. Identifica fragmentos del original y propón la versión científica.
3. TABLAS REALES: Extrae datos del texto para tablas de resultados.
4. IDEAS DE TABLAS: Propón tablas adicionales que NO están en el texto pero que son NECESARIAS para una revista Q1 (ej. Hitos del desarrollo, Esquema de dosis, Comparativa con guías).

CRITERIOS PEDIÁTRICOS:
- Usa terminología como "Lactante menor", "Preescolar", "Edad corregida".
- Dosis siempre en mg/kg/día o similar.
- Estilo NEJM/Lancet Child & Adolescent Health.

RESPUESTA JSON:
{
  "score": number,
  "scoreExplanation": "string",
  "styleSuggestions": [
    { "category": "Dicción/Estructura", "original": "frase corta", "replacement": "frase mejorada", "explanation": "por qué" }
  ],
  "improvedText": "string",
  "tables": [{ "title": "string", "headers": ["string"], "rows": [["string"]] }],
  "tableIdeas": [{ "title": "string", "rational": "string", "suggestedColumns": ["string"] }],
  "discussionPoints": ["string"]
}
`;

export const analyzeCaseReport = async (text: string): Promise<EditorAnalysis> => {
  // En Vite, process.env.API_KEY se define en vite.config.ts
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY no detectada. Por favor, configúrala en el panel de Netlify (Environment Variables).");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: text,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          scoreExplanation: { type: Type.STRING },
          styleSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                original: { type: Type.STRING },
                replacement: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["category", "original", "replacement", "explanation"]
            }
          },
          improvedText: { type: Type.STRING },
          tables: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                rows: { type: Type.ARRAY, items: { type: Type.ARRAY, items: { type: Type.STRING } } }
              },
              required: ["title", "headers", "rows"]
            }
          },
          tableIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                rational: { type: Type.STRING },
                suggestedColumns: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "rational", "suggestedColumns"]
            }
          },
          discussionPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "scoreExplanation", "styleSuggestions", "improvedText", "tables", "tableIdeas", "discussionPoints"]
      }
    }
  });

  const resultStr = response.text;
  if (!resultStr) throw new Error("No response from AI");
  
  return JSON.parse(resultStr) as EditorAnalysis;
};
