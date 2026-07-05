# Gen-AI: Advanced Prompting & AI Agent Framework

A comprehensive Node.js toolkit demonstrating modern AI prompting techniques using OpenAI's API, from basic zero-shot prompting to advanced multi-step reasoning with tool integration.

## Features

- **Zero-Shot Prompting**: Direct instruction-based queries
- **Few-Shot Prompting**: Learning from examples before solving tasks
- **Chain of Thought (CoT)**: Step-by-step problem decomposition and reasoning
- **CoT with Tool Integration**: Multi-step reasoning with real-world tool execution (CLI commands, API calls)
- **Applications Built**: Includes a fully functional TODO web application as a demo

## Quick Start

### Prerequisites

- Node.js v18+
- OpenAI API key

### Installation

```bash
# Clone or navigate to the project
cd Gen-AI

# Install dependencies
npm install

# Create .env file with your API key
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

### Running Examples

Each file demonstrates a different prompting technique:

```bash
# Zero-Shot Prompting
node prompting/01_zeroprompt.js

# Few-Shot Prompting
node prompting/02_fewshot.js

# Chain of Thought
node prompting/03_cot.js

# CoT with Tool Integration (Most Advanced)
node prompting/04_cotTool.js
```

## Core Examples

### 1. Zero-Shot Prompting (`01_zeroprompt.js`)

Direct instruction without examples. Best for straightforward tasks.

```javascript
// Simple direct query to GPT
"You are an expert. What is 2+2?";
```

### 2. Few-Shot Prompting (`02_fewshot.js`)

Provide examples before asking the actual question. Improves accuracy on specific patterns.

```javascript
// Teaches model the pattern, then applies it
Examples: [question → answer patterns]
Actual Query: Similar question
```

### 3. Chain of Thought (`03_cot.js`)

Model breaks down problems into logical steps before providing answers.

```
INITIAL: Understanding the task
THINK: Analyzing approach
ANALYSE: Verifying solution
OUTPUT: Final answer
```

### 4. Advanced: CoT + Tool Integration (`04_cotTool.js`)

Multi-step reasoning combined with actual tool execution (CLI commands, API calls).

**Use Cases:**

- Build applications (HTML/CSS/JS files)
- Execute system commands
- Fetch real-time data (weather, etc.)
- Create project structures

**Example:**

```bash
# AI agent will reason, create, and execute commands
node prompting/04_cotTool.js
```

## Usage Patterns

### For Simple Tasks

Use `01_zeroprompt.js` - Fast and cost-effective.

### For Complex Tasks

Use `04_cotTool.js` - Agent will:

1. Analyze the request
2. Break it into steps
3. Execute tools as needed
4. Verify results
5. Return final output

## Generated Outputs

The framework can generate complete applications. Example output in `todo/`:

- `index.html` - Functional UI
- `styles.css` - Styling
- `app.js` - JavaScript functionality

Open `todo/index.html` in a browser to test the generated TODO application.

## Environment Setup

Create `.env` file:

```
OPENAI_API_KEY=sk-your-key-here
```

## How It Works

```
User Input
    ↓
AI Agent (GPT-4o/4o-mini)
    ↓
Step-by-Step Reasoning Pipeline
    ├─ INITIAL: Parse request
    ├─ THINK: Plan solution
    ├─ ANALYSE: Verify approach
    ├─ TOOL_REQUEST: Execute if needed
    └─ OUTPUT: Return result
    ↓
Generated Output/Result
```

## API Models

- `gpt-4o` - Advanced reasoning (used in 04_cotTool.js)
- `gpt-4o-mini` - Faster, cost-effective for simpler tasks

## Extending the Framework

### Add New Tools

Edit `04_cotTool.js` system prompt:

```javascript
// Add to Available Tools section
-"yourTool": yourTool(input): Description here

// Add execution logic
case "yourTool": {
  const toolResult = await yourTool(input);
  // Handle result
}
```

### Customize Agent Behavior

Modify the `SYSTEM_PROMPT` in any file to change:

- Agent persona
- Reasoning pipeline
- Output format
- Tool availability

## Performance Tips

1. **Use gpt-4o-mini** for simple tasks (faster, cheaper)
2. **Use gpt-4o** for complex reasoning and tool coordination
3. **Batch requests** when possible
4. **Cache prompts** for repeated patterns

## Troubleshooting

| Issue                    | Solution                                         |
| ------------------------ | ------------------------------------------------ |
| API Key Error            | Verify `.env` file exists and has correct key    |
| Tool not executing       | Check tool name matches exactly in system prompt |
| JSON parsing errors      | Ensure model response is valid JSON format       |
| Timeout on complex tasks | Increase model to gpt-4o or simplify request     |

## File Structure

```
Gen-AI/
├── prompting/
│   ├── 01_zeroprompt.js      # Basic prompting
│   ├── 02_fewshot.js         # Learning from examples
│   ├── 03_cot.js             # Chain of thought reasoning
│   └── 04_cotTool.js         # Advanced reasoning + tools
├── todo/                      # Generated application
├── prompts.md                # Prompting concepts
├── package.json              # Dependencies
├── .env                       # API keys (create this)
└── README.md                 # This file
```

## Support

For issues or questions, refer to:

- OpenAI API Documentation: https://platform.openai.com/docs
- Model Capabilities: https://platform.openai.com/docs/models
