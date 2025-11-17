import React from "react";
import {
  FileText,
  Terminal,
  Bot,
  Zap,
  Palette,
  FileCode,
  Settings,
  Package,
  Store,
  Filter,
} from "lucide-react";

export interface FileTypeFilter {
  type: string;
  label: string;
  icon: React.ReactNode;
  count: number;
}

interface FileTypeSidebarProps {
  filters: FileTypeFilter[];
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

const FileTypeSidebar: React.FC<FileTypeSidebarProps> = ({
  filters,
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-light-primary dark:text-dark-primary" />
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
            File Types
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* All Files */}
          <button
            onClick={() => onSelectType(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              selectedType === null
                ? "bg-light-primary dark:bg-dark-primary text-white"
                : "hover:bg-light-hover dark:hover:bg-dark-hover text-light-text dark:text-dark-text"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} />
              <span className="text-sm font-medium">All Files</span>
            </div>
            <span className="text-xs opacity-75">
              {filters.reduce((sum, f) => sum + f.count, 0)}
            </span>
          </button>

          {/* Separator */}
          <div className="my-2 border-t border-light-border dark:border-dark-border" />

          {/* File Type Filters */}
          {filters.map((filter) => (
            <button
              key={filter.type}
              onClick={() => onSelectType(filter.type)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors mb-1 ${
                selectedType === filter.type
                  ? "bg-light-primary dark:bg-dark-primary text-white"
                  : "hover:bg-light-hover dark:hover:bg-dark-hover text-light-text dark:text-dark-text"
              }`}
            >
              <div className="flex items-center gap-3">
                {filter.icon}
                <span className="text-sm font-medium">{filter.label}</span>
              </div>
              <span className="text-xs opacity-75">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get icon for file type
export const getFileTypeIcon = (type: string, size: number = 18) => {
  switch (type) {
    case "claude-md":
      return <FileText size={size} />;
    case "claude-command":
      return <Terminal size={size} />;
    case "claude-agent":
      return <Bot size={size} />;
    case "claude-skill":
      return <Zap size={size} />;
    case "claude-hook":
      return <FileCode size={size} />;
    case "claude-output-style":
      return <Palette size={size} />;
    case "claude-settings":
      return <Settings size={size} />;
    case "claude-plugin":
      return <Package size={size} />;
    case "claude-marketplace":
      return <Store size={size} />;
    default:
      return <FileText size={size} />;
  }
};

// Helper function to get label for file type
export const getFileTypeLabel = (type: string): string => {
  switch (type) {
    case "claude-md":
      return "CLAUDE.md";
    case "claude-command":
      return "Commands";
    case "claude-agent":
      return "Agents";
    case "claude-skill":
      return "Skills";
    case "claude-hook":
      return "Hooks";
    case "claude-output-style":
      return "Output Styles";
    case "claude-settings":
      return "Settings";
    case "claude-plugin":
      return "Plugins";
    case "claude-marketplace":
      return "Marketplaces";
    default:
      return type;
  }
};

export default FileTypeSidebar;
