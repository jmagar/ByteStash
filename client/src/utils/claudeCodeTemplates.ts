// Templates for Claude Code file types

export interface ClaudeCodeTemplate {
  type: string;
  label: string;
  defaultFileName: string;
  language: string;
  template: string;
}

export const claudeCodeTemplates: ClaudeCodeTemplate[] = [
  {
    type: "claude-md",
    label: "CLAUDE.md (Project Context)",
    defaultFileName: "CLAUDE",
    language: "claude-md",
    template: `---
name: project-expert
description: Expert agent for this project with context on architecture and workflows
---

# Project Context

## Overview
Describe your project, its purpose, and main features here.

## Architecture
Explain the architectural decisions and structure.

## Development Workflow
Document your development process and conventions.

## Key Decisions
Record important architectural and design decisions.
`,
  },
  {
    type: "claude-agent",
    label: "Agent",
    defaultFileName: "my-agent",
    language: "claude-agent",
    template: `---
name: my-agent
description: Brief description of what this agent does
model: opus
tools: [Read, Write, Edit, Bash]
color: blue
---

# Agent Instructions

## Purpose
Describe what this agent specializes in.

## Capabilities
- List the agent's main capabilities
- Explain what tasks it can perform
- Define its scope of work

## Guidelines
Provide specific instructions on how the agent should:
- Approach problems
- Format responses
- Handle edge cases
`,
  },
  {
    type: "claude-command",
    label: "Slash Command",
    defaultFileName: "my-command",
    language: "claude-command",
    template: `---
allowed-tools: [Read, Write, Bash]
description: Brief description of this command
argument-hint: <required-arg> [optional-arg]
---

# Command: /my-command

Execute this command with: \`/my-command <arguments>\`

## What it does
Describe the purpose and functionality of this command.

## Usage
Provide examples of how to use this command:
- \`/my-command file.txt\` - Description of what this does
- \`/my-command --option value\` - Description with options

## Arguments
$ARGUMENTS will be replaced with the arguments you provide.

Process the arguments: $ARGUMENTS
`,
  },
  {
    type: "claude-skill",
    label: "Skill",
    defaultFileName: "my-skill",
    language: "claude-skill",
    template: `---
name: my-skill
description: Brief description of this skill
tools: [Read, Write, Edit]
---

# Skill: My Skill

## Purpose
Describe what capability this skill provides.

## Activation
Explain when and how this skill should be used.

## Instructions
Provide detailed steps for executing this skill:
1. First step
2. Second step
3. Third step

## Best Practices
- Guideline 1
- Guideline 2
- Guideline 3
`,
  },
  {
    type: "claude-hook",
    label: "Hook",
    defaultFileName: "my-hook",
    language: "claude-hook",
    template: `---
name: my-hook
description: Brief description of this hook
event: PostToolUse
matcher: Write(*.md)
---

# Hook: My Hook

## Trigger
This hook triggers when: [describe the event]

## Action
Describe what this hook should do when triggered.

## Configuration
Explain any configuration options or parameters.
`,
  },
  {
    type: "claude-output-style",
    label: "Output Style",
    defaultFileName: "my-style",
    language: "claude-output-style",
    template: `---
name: my-style
description: Brief description of this output style
---

# Output Style: My Style

## Personality
Describe the personality and tone Claude should adopt with this style.

## Response Format
Explain how responses should be structured:
- Use specific formatting
- Follow particular patterns
- Include certain sections

## Guidelines
- Be [characteristic]
- Always [behavior]
- Never [anti-pattern]

## Example Behavior
Show an example of how Claude should respond with this style.
`,
  },
  {
    type: "claude-settings",
    label: "Settings (JSON)",
    defaultFileName: "settings",
    language: "claude-settings",
    template: `{
  "$schema": "./claude-code-settings.schema.json",
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": [
      "Bash(npm:*)",
      "Bash(git:*)",
      "Read(*)"
    ],
    "deny": [
      "Bash(rm -rf)",
      "Read(.env)"
    ]
  },
  "hooks": {
    "PostToolUse": []
  },
  "env": {
    "NODE_ENV": "development"
  },
  "companyAnnouncements": [
    "Welcome! Check our docs at docs.example.com"
  ]
}`,
  },
  {
    type: "claude-plugin",
    label: "Plugin Manifest",
    defaultFileName: "plugin",
    language: "claude-plugin",
    template: `{
  "name": "my-plugin",
  "description": "Brief description of this plugin",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "commands": [
    "./commands/my-command.md"
  ],
  "agents": [
    "./agents/my-agent.md"
  ],
  "skills": [
    "./skills/my-skill.md"
  ],
  "hooks": [],
  "strict": false
}`,
  },
  {
    type: "claude-marketplace",
    label: "Marketplace Catalog",
    defaultFileName: "marketplace",
    language: "claude-marketplace",
    template: `{
  "name": "my-marketplace",
  "description": "Description of this plugin marketplace",
  "version": "1.0.0",
  "owner": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "plugins": [
    {
      "name": "example-plugin",
      "source": "./example-plugin",
      "description": "An example plugin",
      "version": "1.0.0",
      "category": "productivity"
    }
  ]
}`,
  },
];

// Get template by type
export const getTemplateByType = (type: string): ClaudeCodeTemplate | null => {
  return claudeCodeTemplates.find((t) => t.type === type) || null;
};

// Get all template types for selection
export const getTemplateTypes = (): Array<{ value: string; label: string }> => {
  return claudeCodeTemplates.map((t) => ({
    value: t.type,
    label: t.label,
  }));
};
