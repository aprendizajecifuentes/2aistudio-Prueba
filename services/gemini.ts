import { GoogleGenAI, Type } from "@google/genai";
import { MotorData, AnalysisResult } from "../types";

// Inicializar cliente solo si existe la key, manejado en el componente principal
export const analyzeDataWithGemini = async (
  dataWindow: MotorData[]
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    return {
      status: 'Healthy',
      explanation: 'API Key no configurada. Modo demostración.',
      recommendation: 'Configure su API Key para recibir análisis real.'
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Convertimos los últimos 10 puntos de datos a texto para que la IA los lea
  const dataContext = JSON.stringify(dataWindow.slice(-10));

  const prompt = `
    Actúa como un Ingeniero experto en Mantenimiento Predictivo y Mecatrónica.
    Analiza los siguientes datos de telemetría de un motor industrial (últimos segundos).
    
    Datos: ${dataContext}
    
    Umbrales de referencia:
    - Temperatura > 65°C es alerta, > 80°C es crítico.
    - Vibración > 6 mm/s es alerta, > 10 mm/s es crítico (posible desbalanceo).
    
    Responde en formato JSON estrictamente.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['Healthy', 'At Risk', 'Critical Failure'] },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["status", "explanation", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing data:", error);
    return {
      status: 'At Risk',
      explanation: 'Error de conexión con el servicio de IA.',
      recommendation: 'Verifique su conexión y la API Key.'
    };
  }
};