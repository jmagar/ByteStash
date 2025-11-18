// Claude Code file types and schemas

export interface YAMLFrontmatter {
  [key: string]: any;
}

// CLAUDE.md file type
export interface ClaudeMdFrontmatter extends YAMLFrontmatter {
  name?: string;
  description?: string;
  version?: string;
}

export interface ClaudeMdFile {
  frontmatter?: ClaudeMdFrontmatter;
  content: string;
}

// Claude Command (Slash Command) type
export interface ClaudeCommandFrontmatter extends YAMLFrontmatter {
  "allowed-tools"?: string[];
  description?: string;
  "argument-hint"?: string;
}

export interface ClaudeCommand {
  frontmatter?: ClaudeCommandFrontmatter;
  content: string;
  name: string; // Derived from filename
}

// Claude Agent type
export interface ClaudeAgentFrontmatter extends YAMLFrontmatter {
  name: string;
  description: string;
  model?: string;
  color?: string;
  tools?: string[];
}

export interface ClaudeAgent {
  frontmatter: ClaudeAgentFrontmatter;
  content: string;
}

// Claude Skill type
export interface ClaudeSkillFrontmatter extends YAMLFrontmatter {
  name: string;
  description: string;
  tools?: string[];
}

export interface ClaudeSkill {
  frontmatter: ClaudeSkillFrontmatter;
  content: string;
}

// Claude Hook type
export interface ClaudeHookFrontmatter extends YAMLFrontmatter {
  name?: string;
  description?: string;
  event?: string;
  matcher?: string;
}

export interface ClaudeHook {
  frontmatter?: ClaudeHookFrontmatter;
  content: string;
}

// Claude Output Style type
export interface ClaudeOutputStyleFrontmatter extends YAMLFrontmatter {
  name: string;
  description: string;
}

export interface ClaudeOutputStyle {
  frontmatter: ClaudeOutputStyleFrontmatter;
  content: string;
}

// Claude Settings type
export interface ClaudeSettings {
  $schema?: string;
  model?: string;
  permissions?: {
    allow?: string[];
    deny?: string[];
  };
  hooks?: {
    [key: string]: any;
  };
  env?: {
    [key: string]: string;
  };
  companyAnnouncements?: string[];
  statusLine?: {
    type?: string;
    command?: string;
  };
  [key: string]: any;
}

// Claude Plugin type
export interface ClaudePlugin {
  name: string;
  description: string;
  version: string;
  author?: {
    name: string;
    email?: string;
  };
  commands?: string[];
  agents?: string[];
  skills?: string[];
  hooks?: string[];
  strict?: boolean;
  [key: string]: any;
}

// Claude Marketplace type
export interface ClaudeMarketplacePlugin {
  name: string;
  source: string;
  description: string;
  version?: string;
  category?: string;
}

export interface ClaudeMarketplace {
  name: string;
  owner: {
    name: string;
    email?: string;
  };
  plugins: ClaudeMarketplacePlugin[];
  version?: string;
  description?: string;
}

// File type enum
export enum ClaudeCodeFileType {
  CLAUDE_MD = "claude-md",
  COMMAND = "claude-command",
  AGENT = "claude-agent",
  SKILL = "claude-skill",
  HOOK = "claude-hook",
  OUTPUT_STYLE = "claude-output-style",
  SETTINGS = "claude-settings",
  PLUGIN = "claude-plugin",
  MARKETPLACE = "claude-marketplace",
}

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// File metadata
export interface ClaudeCodeFileMetadata {
  fileType: ClaudeCodeFileType;
  fileName: string;
  hasFrontmatter: boolean;
  frontmatterValid: boolean;
}
