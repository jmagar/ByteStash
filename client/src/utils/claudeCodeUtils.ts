// Utility functions for Claude Code file parsing and validation

import * as yaml from 'js-yaml';
import {
  ClaudeCodeFileType,
  ValidationResult,
  ClaudeCodeFileMetadata,
  YAMLFrontmatter,
  ClaudeMdFrontmatter,
  ClaudeCommandFrontmatter,
  ClaudeAgentFrontmatter,
  ClaudeSkillFrontmatter,
  ClaudeOutputStyleFrontmatter,
  ClaudeSettings,
  ClaudePlugin,
  ClaudeMarketplace,
} from "../types/claudeCode";

// Parse YAML frontmatter from markdown content
export const parseFrontmatter = (
  content: string
): { frontmatter: YAMLFrontmatter | null; body: string } => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: content };
  }

  const [, yamlContent, body] = match;
  
  try {
    // Use js-yaml for robust YAML parsing (supports multi-line values, nested objects, etc.)
    const frontmatter = yaml.load(yamlContent) as YAMLFrontmatter;
    if (frontmatter && typeof frontmatter === 'object') {
      return { frontmatter, body: body.trim() };
    }
    return { frontmatter: null, body: content };
  } catch (error) {
    console.warn('Failed to parse YAML frontmatter:', error);
    return { frontmatter: null, body: content };
  }
};

// Helper function to get full filename with proper extension
export const getFullFileName = (fileName: string, language: string): string => {
  // Determine the required extension based on language
  const requiredExtension =
    language === "claude-settings" ||
    language === "claude-plugin" ||
    language === "claude-marketplace"
      ? ".json"
      : ".md";
  
  // Check if file_name already has an extension
  const hasExtension = /\.[^./\\]+$/.test(fileName);
  
  return hasExtension ? fileName : fileName + requiredExtension;
};

// Helper function to format JSON parsing errors
const formatJsonError = (error: unknown): string => {
  return `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`;
};



// Detect Claude Code file type from filename
export const detectClaudeCodeFileType = (
  fileName: string
): ClaudeCodeFileType | null => {
  const lowerFileName = fileName.toLowerCase();

  // CLAUDE.md
  if (lowerFileName === "claude.md") {
    return ClaudeCodeFileType.CLAUDE_MD;
  }

  // Settings files
  if (
    lowerFileName === "settings.json" ||
    lowerFileName === "settings.local.json"
  ) {
    return ClaudeCodeFileType.SETTINGS;
  }

  // Plugin manifest
  if (lowerFileName === "plugin.json") {
    return ClaudeCodeFileType.PLUGIN;
  }

  // Marketplace manifest
  if (lowerFileName === "marketplace.json") {
    return ClaudeCodeFileType.MARKETPLACE;
  }

  // Check for specific filename patterns
  if (lowerFileName.endsWith(".md")) {
    // Agent files (typically in .claude/agents/ directory)
    if (lowerFileName.includes("agent")) {
      return ClaudeCodeFileType.AGENT;
    }
    
    // Skill files (typically SKILL.md or in .claude/skills/ directory)
    if (lowerFileName === "skill.md" || lowerFileName.includes("skill")) {
      return ClaudeCodeFileType.SKILL;
    }
    
    // Hook files
    if (lowerFileName === "hook.md" || lowerFileName.includes("hook")) {
      return ClaudeCodeFileType.HOOK;
    }
    
    // Output style files (in .claude/output-styles/ directory)
    if (lowerFileName.includes("style") || lowerFileName.includes("output")) {
      return ClaudeCodeFileType.OUTPUT_STYLE;
    }
    
    // Return null for other .md files that don't match specific patterns
    return null;
  }

  return null;
};

// Validate CLAUDE.md file
export const validateClaudeMd = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { frontmatter, body } = parseFrontmatter(content);

  // CLAUDE.md doesn't strictly require frontmatter
  if (!frontmatter) {
    warnings.push("No YAML frontmatter found (optional for CLAUDE.md)");
  } else {
    const fm = frontmatter as ClaudeMdFrontmatter;
    if (fm.name && fm.name.length > 100) {
      warnings.push("Name should be less than 100 characters");
    }
    if (fm.description && fm.description.length > 1024) {
      warnings.push("Description should be less than 1024 characters");
    }
  }

  if (!body || body.trim().length === 0) {
    errors.push("Content body is required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Command
export const validateClaudeCommand = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { frontmatter, body } = parseFrontmatter(content);

  if (frontmatter) {
    const fm = frontmatter as ClaudeCommandFrontmatter;
    if (fm.description && fm.description.length > 1024) {
      warnings.push("Description should be less than 1024 characters");
    }
  }

  if (!body || body.trim().length === 0) {
    errors.push("Command content is required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Agent
export const validateClaudeAgent = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter) {
    errors.push("YAML frontmatter is required for agents");
  } else {
    const fm = frontmatter as ClaudeAgentFrontmatter;
    
    if (!fm.name) {
      errors.push("Agent name is required in frontmatter");
    } else if (!/^[a-z0-9_-]+$/.test(fm.name)) {
      errors.push("Agent name must be lowercase, and may include hyphens or underscores (no spaces)");
    }
    
    if (!fm.description) {
      errors.push("Agent description is required in frontmatter");
    } else if (fm.description.length > 1024) {
      warnings.push("Description should be less than 1024 characters");
    }
    
    if (
      fm.model &&
      !(
        ["opus", "sonnet", "haiku"].includes(fm.model) ||
        /^claude-(opus|sonnet|haiku)-\d{8}$/.test(fm.model)
      )
    ) {
      warnings.push(
        "Model should be one of: opus, sonnet, haiku, or a valid Claude model identifier (e.g., claude-sonnet-4-20250514)"
      );
    }
  }

  if (!body || body.trim().length === 0) {
    errors.push("Agent instructions are required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Skill
export const validateClaudeSkill = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter) {
    errors.push("YAML frontmatter is required for skills");
  } else {
    const fm = frontmatter as ClaudeSkillFrontmatter;
    
    if (!fm.name) {
      errors.push("Skill name is required in frontmatter");
    } else if (!/^[a-z0-9-]+$/.test(fm.name)) {
      errors.push("Skill name must be lowercase with hyphens only (no spaces)");
    }
    
    if (!fm.description) {
      errors.push("Skill description is required in frontmatter");
    } else if (fm.description.length > 1024) {
      warnings.push("Description should be less than 1024 characters");
    }
  }

  if (!body || body.trim().length === 0) {
    errors.push("Skill instructions are required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Hook
export const validateClaudeHook = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { body } = parseFrontmatter(content);

  // Hooks may not always need frontmatter depending on implementation
  if (!body || body.trim().length === 0) {
    errors.push("Hook content is required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Output Style
export const validateClaudeOutputStyle = (
  content: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter) {
    errors.push("YAML frontmatter is required for output styles");
  } else {
    const fm = frontmatter as ClaudeOutputStyleFrontmatter;
    
    if (!fm.name) {
      errors.push("Output style name is required in frontmatter");
    } else if (!/^[a-z0-9-]+$/.test(fm.name)) {
      errors.push("Output style name must be lowercase with hyphens only");
    }
    
    if (!fm.description) {
      errors.push("Output style description is required in frontmatter");
    } else if (fm.description.length > 1024) {
      warnings.push("Description should be less than 1024 characters");
    }
  }

  if (!body || body.trim().length === 0) {
    errors.push("Output style instructions are required");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Settings JSON
export const validateClaudeSettings = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const settings = JSON.parse(content) as ClaudeSettings;
    
    // Basic validation
    if (settings.model && typeof settings.model !== "string") {
      errors.push("Model must be a string");
    }
    
    if (settings.permissions) {
      if (settings.permissions.allow && !Array.isArray(settings.permissions.allow)) {
        errors.push("permissions.allow must be an array");
      }
      if (settings.permissions.deny && !Array.isArray(settings.permissions.deny)) {
        errors.push("permissions.deny must be an array");
      }
    }
    
    if (settings.env && typeof settings.env !== "object") {
      errors.push("env must be an object");
    }
  } catch (error) {
    errors.push("Invalid JSON format");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Plugin JSON
export const validateClaudePlugin = (content: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const plugin = JSON.parse(content) as ClaudePlugin;
    
    if (!plugin.name) {
      errors.push("Plugin name is required");
    }
    
    if (!plugin.version) {
      errors.push("Plugin version is required");
    }
    
    if (!plugin.description) {
      errors.push("Plugin description is required");
    }
    
    // Validate arrays
    if (plugin.commands && !Array.isArray(plugin.commands)) {
      errors.push("commands must be an array");
    }
    if (plugin.agents && !Array.isArray(plugin.agents)) {
      errors.push("agents must be an array");
    }
    if (plugin.skills && !Array.isArray(plugin.skills)) {
      errors.push("skills must be an array");
    }
  } catch (error) {
    errors.push("Invalid JSON format");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate Claude Marketplace JSON
export const validateClaudeMarketplace = (
  content: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const marketplace = JSON.parse(content) as ClaudeMarketplace;
    
    if (!marketplace.name) {
      errors.push("Marketplace name is required");
    }
    
    if (!marketplace.owner || !marketplace.owner.name) {
      errors.push("Marketplace owner name is required");
    }
    
    if (!marketplace.plugins || !Array.isArray(marketplace.plugins)) {
      errors.push("Marketplace plugins array is required");
    } else {
      marketplace.plugins.forEach((plugin, index) => {
        if (!plugin.name) {
          errors.push(`Plugin at index ${index} is missing name`);
        }
        if (!plugin.source) {
          errors.push(`Plugin at index ${index} is missing source`);
        }
        if (!plugin.description) {
          warnings.push(`Plugin at index ${index} is missing description`);
        }
      });
    }
  } catch (error) {
    errors.push("Invalid JSON format");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Main validation function
export const validateClaudeCodeFile = (
  fileName: string,
  content: string
): ValidationResult => {
  const fileType = detectClaudeCodeFileType(fileName);

  if (!fileType) {
    return {
      valid: false,
      errors: ["Not a recognized Claude Code file type"],
      warnings: [],
    };
  }

  switch (fileType) {
    case ClaudeCodeFileType.CLAUDE_MD:
      return validateClaudeMd(content);
    case ClaudeCodeFileType.COMMAND:
      return validateClaudeCommand(content);
    case ClaudeCodeFileType.AGENT:
      return validateClaudeAgent(content);
    case ClaudeCodeFileType.SKILL:
      return validateClaudeSkill(content);
    case ClaudeCodeFileType.HOOK:
      return validateClaudeHook(content);
    case ClaudeCodeFileType.OUTPUT_STYLE:
      return validateClaudeOutputStyle(content);
    case ClaudeCodeFileType.SETTINGS:
      return validateClaudeSettings(content);
    case ClaudeCodeFileType.PLUGIN:
      return validateClaudePlugin(content);
    case ClaudeCodeFileType.MARKETPLACE:
      return validateClaudeMarketplace(content);
    default:
      return {
        valid: false,
        errors: ["Unknown file type"],
        warnings: [],
      };
  }
};

// Get file metadata
export const getClaudeCodeFileMetadata = (
  fileName: string,
  content: string
): ClaudeCodeFileMetadata | null => {
  const fileType = detectClaudeCodeFileType(fileName);

  if (!fileType) {
    return null;
  }

  const { frontmatter } = parseFrontmatter(content);
  const validation = validateClaudeCodeFile(fileName, content);

  return {
    fileType,
    fileName,
    hasFrontmatter: frontmatter !== null,
    frontmatterValid: validation.valid,
  };
};

// Check if a file is a Claude Code file
export const isClaudeCodeFile = (fileName: string): boolean => {
  return detectClaudeCodeFileType(fileName) !== null;
};
