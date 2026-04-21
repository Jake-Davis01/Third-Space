// services/llmService.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/**
 * Safe JSON parser (handles ```json blocks too)
 */
function safeParseJSON(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {}

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * messages = [{ role: "system" | "user" | "assistant" | "tool", content }]
 * tools = tool schema
 */
export async function callLLM(messages, tools) {
  const systemMessage = messages.find((m) => m.role === "system");

  const toolContext = {
    role: "user",
    parts: [
      {
        text: `
SYSTEM INSTRUCTIONS:
${systemMessage?.content || ""}

You are an AI agent with access to tools.

TOOLS:
${JSON.stringify(tools, null, 2)}

RULES:
- If you need data, respond ONLY in JSON:
{
  "tool_call": {
    "name": "toolName",
    "arguments": {}
  }
}

- Otherwise respond normally.
        `,
      },
    ],
  };

  const formattedMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "tool" ? "user" : m.role,
      parts: [{ text: m.content }],
    }));

  const result = await model.generateContent({
    contents: [toolContext, ...formattedMessages],
  });

  const text = result.response.text();

  const parsed = safeParseJSON(text);

  if (parsed?.tool_call) {
    return parsed;
  }

  return {
    content: text || "Empty response from model",
  };
}