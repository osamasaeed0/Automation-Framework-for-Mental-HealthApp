import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

// Create MCP Server instance
const server = new Server(
  {
    name: "playwright-ai-qa-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define smart tools for the AI agent
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_e2e_test_with_analysis",
        description: "Run Playwright tests and automatically analyze failure reasons if any test fails.",
        inputSchema: {
          type: "object",
          properties: {
            specFile: {
              type: "string",
              description: "Optional specific test file name to run (e.g. e2eTest.spec.js)",
            },
          },
        },
      },
      {
        name: "check_mock_fixtures",
        description: "Validate the structure of test mock fixtures (e.g., aiResult.json) to prevent UI data-binding issues.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle requests from the AI agent
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "run_e2e_test_with_analysis") {
    try {
      const command = args?.specFile ? `npx playwright test ${args.specFile}` : "npx playwright test";
      const { stdout } = await execAsync(command);
      
      return {
        content: [
          {
            type: "text",
            text: `Tests executed successfully!\n\nOutput:\n${stdout}`,
          },
        ],
      };
    } catch (error) {
      const errorOutput = (error.stdout || "") + "\n" + (error.stderr || "");
      return {
        content: [
          {
            type: "text",
            text: `Tests FAILED. AI Failure Analysis:\n\n${errorOutput}\n\n[Actionable Insight]: Check if element locator was changed or if RouteManager mock payload is missing expected keys.`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === "check_mock_fixtures") {
    try {
      // Safe absolute path resolution
      const fixturePath = path.resolve(process.cwd(), "tests/e2e/fixtures/mockData/aiResult.json");
      const fixtureData = await fs.readFile(fixturePath, "utf8");
      const parsed = JSON.parse(fixtureData);
      
      const requiredFields = ["riskScore", "emotions", "mainCauses", "consistencyInsights"];
      const missing = requiredFields.filter(field => !(field in parsed));

      if (missing.length > 0) {
        return {
          content: [
            { 
              type: "text", 
              text: `Mock Validation Warning: Missing required keys in aiResult.json: ${missing.join(", ")}` 
            }
          ],
        };
      }

      return {
        content: [
          { 
            type: "text", 
            text: "Mock Validation Success: All required UI data binding keys are present in aiResult.json!" 
          }
        ],
      };
    } catch (err) {
      return {
        content: [
          { 
            type: "text", 
            text: `Error reading mock fixture: ${err.message}` 
          }
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Playwright AI QA MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});