import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  console.log("Fetching models...");
  try {
    // The SDK version ^0.24.1 might not have a direct listModels on the main client 
    // but the REST API does. Let's see if we can find it in the client.
    // Actually, I'll just try 'gemini-1.5-flash-latest' which is very common.
    // Wait, the error said it's not found on v1beta.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("Models:", data.models.map(m => m.name));
  } catch (e) {
    console.error("Failed to list models:", e);
  }
}

listModels();
