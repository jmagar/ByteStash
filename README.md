# ClaudeStash
<p align="center">
  <img src="https://raw.githubusercontent.com/jordan-dalby/ByteStash/refs/heads/main/client/public/logo192.png" />
</p>

ClaudeStash is a self-hosted web application designed to store, organize, and manage your Claude Code files efficiently. With support for creating, editing, and validating Claude Code files including CLAUDE.md, agents, skills, commands, hooks, output styles, settings, plugins, and marketplaces, ClaudeStash helps you keep track of your Claude Code configurations in one secure place.

![ByteStash App](https://raw.githubusercontent.com/jordan-dalby/ByteStash/refs/heads/main/media/app-image.png)

## Features
- **Store Claude Code Files**: Manage all your Claude Code configurations including:
  - **CLAUDE.md** - Project context files with YAML frontmatter
  - **Slash Commands** - Custom commands for Claude Code
  - **Agents** - Specialized AI workers with configuration
  - **Skills** - Modular capabilities (SKILL.md files)
  - **Hooks** - Event automation
  - **Output Styles** - Custom Claude behavior styles
  - **Settings** - settings.json and settings.local.json
  - **Plugins** - Plugin bundles with manifests
  - **Marketplaces** - Plugin marketplace catalogs
- **YAML Frontmatter Validation**: Automatically validates YAML frontmatter in Claude Code files
- **File Type Detection**: Intelligently detects Claude Code file types based on filename and content
- **Search and Filter**: Quickly find the right file by filtering based on file type or keywords
- **Secure Storage**: All files are securely stored in a sqlite database, ensuring your configurations remain safe and accessible only to you

## Installation

### Docker
ClaudeStash can be hosted via docker-compose:
```yaml
services:
  claudestash:
    image: "ghcr.io/jmagar/claudestash:latest"
    restart: always
    volumes:
      - /your/claude/files/path:/data/snippets
    ports:
      - "5000:5000"
    environment:
      BASE_PATH: ""
      JWT_SECRET: your-secret
      TOKEN_EXPIRY: 24h
      ALLOW_NEW_ACCOUNTS: "true"
      DEBUG: "true"
      DISABLE_ACCOUNTS: "false"
      DISABLE_INTERNAL_ACCOUNTS: "false"

      OIDC_ENABLED: "false"
      OIDC_DISPLAY_NAME: ""
      OIDC_ISSUER_URL: ""
      OIDC_CLIENT_ID: ""
      OIDC_CLIENT_SECRET: ""
      OIDC_SCOPES: ""
```

## Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Containerisation: Docker

## Claude Code File Format Reference

### File Locations
- **CLAUDE.md**: Root of project or `~/.claude/CLAUDE.md`
- **Commands**: `.claude/commands/` or `~/.claude/commands/`
- **Agents**: `.claude/agents/` or `~/.claude/agents/`
- **Skills**: `.claude/skills/` or `~/.claude/skills/`
- **Hooks**: Plugin-defined or `.claude/hooks/`
- **Output Styles**: `.claude/output-styles/` or `~/.claude/output-styles/`
- **Settings**: `.claude/settings.json` or `.claude/settings.local.json`
- **Plugins**: `.claude-plugin/plugin.json`
- **Marketplaces**: `.claude-plugin/marketplace.json`

### YAML Frontmatter Examples

**Agent Example:**
```yaml
---
name: code-reviewer
description: Reviews code for best practices
model: opus
tools: [Read, Write, Edit]
color: blue
---
# Agent Instructions
Review code and provide feedback...
```

**Skill Example:**
```yaml
---
name: refactoring-expert
description: Refactors code for better performance
---
# Skill Instructions
Analyze code and suggest improvements...
```

**Command Example:**
```yaml
---
allowed-tools: [Bash(git:*), Read(*.md)]
description: Git workflow helper
argument-hint: <branch-name>
---
Help with git workflows: $ARGUMENTS
```

## API Documentation
Once the server is running you can explore the API via Swagger UI. Open
`/api-docs` in your browser to view the documentation for all endpoints.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any improvements or bug fixes.

## Credits
Originally forked from [ByteStash](https://github.com/jordan-dalby/ByteStash) by Jordan Dalby.
