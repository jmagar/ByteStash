// New simplified types for Claude Code files (no fragments)

export interface ClaudeFile {
  id: string;
  file_name: string;
  content: string;
  language: string;
  description: string;
  updated_at: string;
  expiry_date?: string;
  file_type: string; // Auto-tagged: "claude-agent", "claude-command", etc.
  share_count?: number;
  is_public: number;
  is_pinned: number;
  is_favorite: number;
  username?: string;
}

export interface ShareSettings {
  requiresAuth: boolean;
  expiresIn?: number;
}

export interface Share {
  id: string;
  snippet_id: number; // Keep for backwards compatibility with API
  requires_auth: number;
  view_limit: number | null;
  view_count: number;
  expires_at: string;
  created_at: string;
  expired: number;
}

// Helper to convert old Snippet format to new ClaudeFile format
export interface Snippet {
  id: string;
  title: string;
  description: string;
  updated_at: string;
  expiry_date?: string;
  categories: string[];
  fragments: CodeFragment[];
  share_count?: number;
  is_public: number;
  is_pinned: number;
  is_favorite: number;
  username?: string;
}

export interface CodeFragment {
  id?: string;
  file_name: string;
  code: string;
  language: string;
  position: number;
}

// Converter functions
export const snippetToClaudeFile = (snippet: Snippet): ClaudeFile | null => {
  if (!snippet.fragments || snippet.fragments.length === 0) {
    return null;
  }
  
  const fragment = snippet.fragments[0]; // Use first fragment
  return {
    id: snippet.id,
    file_name: fragment.file_name || snippet.title,
    content: fragment.code,
    language: fragment.language,
    description: snippet.description,
    updated_at: snippet.updated_at,
    expiry_date: snippet.expiry_date,
    file_type: fragment.language, // Will be auto-tagged
    share_count: snippet.share_count,
    is_public: snippet.is_public,
    is_pinned: snippet.is_pinned,
    is_favorite: snippet.is_favorite,
    username: snippet.username,
  };
};

export const claudeFileToSnippet = (file: ClaudeFile): Snippet => {
  return {
    id: file.id,
    title: file.file_name,
    description: file.description,
    updated_at: file.updated_at,
    expiry_date: file.expiry_date,
    categories: [file.file_type], // Use file_type as category
    fragments: [
      {
        file_name: file.file_name,
        code: file.content,
        language: file.language,
        position: 0,
      },
    ],
    share_count: file.share_count,
    is_public: file.is_public,
    is_pinned: file.is_pinned,
    is_favorite: file.is_favorite,
    username: file.username,
  };
};
