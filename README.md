# 🤖 Playwright AI-QA Agentic E2E Automation Framework

An autonomous, AI-driven End-to-End (E2E) testing framework built for a **Mental Health Application**. This project integrates **Playwright**, **Continue.dev**, **Google Gemini 3.8 Flash**, and a custom **Model Context Protocol (MCP) Server** to deliver self-healing test environment setup, mock data validation, and automated failure analysis.

---

## 🌟 Key Features

- **Autonomous Agentic Testing**: Leverages Continue.dev with Gemini 3.8 Flash LLM to execute tests and perform intelligent log parsing.
- **Custom MCP Server (`playwright-ai-qa-mcp`)**: Connects the LLM directly to OS-level execution tools, allowing the AI agent to run tests and validate file systems.
- **Self-Healing Fixture Management**: Automatically audits and syncs missing mock data directories (`tests/e2e/fixtures/mockData/`) and JSON payloads (`aiResult.json`, `questions.json`).
- **UI Data Binding Validation**: Validates JSON mock fixture schema and required keys (`riskScore`, `emotions`, `mainCauses`, `consistencyInsights`) prior to test execution.
- **Automated Root-Cause Analysis**: Intercepts `stdout` and `stderr` execution streams upon test failure to provide actionable AI-generated fix suggestions.

---

## 🏗️ Architecture Overview

+-------------------------+
                      |   VS Code / Continue   |
                      | (Gemini 3.8 Flash LLM)  |
                      +------------+------------+
                                   |
                           (MCP Protocol)
                                   v
                      +-------------------------+
                      |  Custom Playwright MCP  |
                      |  Server (mcp-server.js) |
                      +------------+------------+
                                   |
           +-----------------------+-----------------------+
           |                                               |
           v                                               v
+-----------------------------+                 +-----------------------------+
|    check_mock_fixtures      |                 | run_e2e_test_with_analysis  |
|  - File System Auditing     |                 |  - Playwright Test Runner   |
|  - Schema Key Validation    |                 |  - Failure Log Interception |
+-----------------------------+                 +-----------------------------+


---

## 🛠️ Tech Stack & Prerequisites

- **Language**: JavaScript / Node.js (v18+)
- **Testing Framework**: [Playwright](https://playwright.dev/)
- **Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **AI Agent & LLM**: Continue.dev Extension + Google Gemini 3.8 Flash API
- **OS Environment**: Windows (PowerShell / Command Prompt)

---

## 🚀 Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone [https://github.com/your-username/mental-health-app-automation.git](https://github.com/your-username/mental-health-app-automation.git)
   cd mental-health-app-automation

  -------
  Install Dependencies:
   npm install
   npx playwright install --with-deps

   -------
   Configure MCP Server in Continue.dev:
   models:
  - name: Gemini 3.8 Flash
    provider: gemini
    model: gemini-3.8-flash
    apiKey: YOUR_GEMINI_API_KEY
    roles:
      - chat
      - edit
      - apply
    capabilities:
      - tool_use
      - image_input

mcpServers:
  - name: playwright-ai-qa
    command: node
    args:
      - "YOUR PATH"

-------
🧪 Usage & Testing Tools
You can interact with the framework via Continue Chat using natural language prompts:
: Check mock fixtures using check_mock_fixtures tool.
:Run the Playwright e2e test using playwright-ai-qa run_e2e_test_with_analysis tool.
-----
📈 Test Results & Verification
Target Suite: tests/e2e/e2eTest.spec.js

Test Case: Complete Assessment Flow with Validation

Execution Time: ~22.4 seconds

Status: PASSED (Interceptions, mock routes, and assertions verified successfully).


📄 License
Distributed under the MIT License.
