// services/agentService.js

import {
  getEmployeeInterests,
  getEventSignups,
  getEngagementMetrics,
} from "../models/employeeModel.js";

import { callLLM } from "./llmService.js";

const tools = {
  getEmployeeInterests,
  getEventSignups,
  getEngagementMetrics,
};

function systemPrompt() {
  return `
You are an employee engagement strategist AI.

Your job:
- analyze employee interests
- analyze event attendance
- find engagement gaps
- recommend future events

Use tools when you need real data.
Be concise and business-focused.
`;
}

function toolSchema() {
  return [
    {
      name: "getEmployeeInterests",
      parameters: { type: "object", properties: {} },
    },
    {
      name: "getEventSignups",
      parameters: { type: "object", properties: {} },
    },
    {
      name: "getEngagementMetrics",
      parameters: { type: "object", properties: {} },
    },
  ];
}

export async function runAgent(userQuery) {
  let messages = [
    { role: "system", content: systemPrompt() },
    { role: "user", content: userQuery },
  ];

  for (let i = 0; i < 8; i++) {
    const response = await callLLM(messages, toolSchema());

    // TOOL CALL PATH
    if (response.tool_call) {
      const { name } = response.tool_call;

      let args = response.tool_call.arguments || {};

      // safety: parse string args if needed
      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {
          args = {};
        }
      }

      const toolFn = tools[name];

      if (!toolFn) {
        messages.push({
          role: "assistant",
          content: `Tool not found: ${name}`,
        });
        continue;
      }

      const result = await toolFn(args);

      messages.push({
        role: "tool",
        name,
        content: JSON.stringify({
          tool: name,
          data: result,
        }),
      });

      // optional reasoning trace (improves stability)
      messages.push({
        role: "assistant",
        content: `Observation: ${name} returned data.`,
      });

      continue;
    }

    // FINAL ANSWER
    if (response.content) {
      return response.content;
    }
  }

  return "No conclusion reached after max iterations.";
}