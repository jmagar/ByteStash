import React, { useState, useEffect } from "react";
import { X, Save, FileText, Sparkles } from "lucide-react";
import { Snippet } from "../../../types/snippets";
import { IconButton } from "../../common/buttons/IconButton";
import { ClaudeCodeValidation } from "../../common/ClaudeCodeValidation";
import { CodeEditor } from "../../editor/CodeEditor";
import BaseDropdown from "../../common/dropdowns/BaseDropdown";
import { getLanguageDropdownSections } from "../../../utils/language/languageUtils";
import {
  isClaudeCodeFile,
  validateClaudeCodeFile,
  detectClaudeCodeFileType,
  getFullFileName,
} from "../../../utils/claudeCodeUtils";
import {
  getTemplateByType,
  getTemplateTypes,
} from "../../../utils/claudeCodeTemplates";
import { getFileTypeIcon } from "../sidebar/FileTypeSidebar";

export interface ClaudeFileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippetData: Omit<Snippet, "id" | "updated_at">) => void;
  fileToEdit: Snippet | null;
  showLineNumbers: boolean;
}

const ClaudeFileEditor: React.FC<ClaudeFileEditorProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fileToEdit,
  showLineNumbers,
}) => {
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const resetForm = () => {
    setFileName("");
    setContent("");
    setLanguage("");
    setDescription("");
    setError("");
    setHasUnsavedChanges(false);
    setShowTemplateSelector(false);
  };

  useEffect(() => {
    if (isOpen) {
      if (fileToEdit && fileToEdit.fragments && fileToEdit.fragments.length > 0) {
        // Load the first fragment as the file (editing mode)
        const fragment = fileToEdit.fragments[0];
        setFileName(fragment.file_name || "");
        setContent(fragment.code || "");
        setLanguage(fragment.language || "");
        setDescription(fileToEdit.description || "");
        setShowTemplateSelector(false);
      } else {
        // New file - show template selector
        resetForm();
        setShowTemplateSelector(true);
      }
    }
  }, [isOpen, fileToEdit]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const getMostUsedLanguage = () => {
    const sections = getLanguageDropdownSections();
    return sections.used[0] || "markdown";
  };

  useEffect(() => {
    if (!language && isOpen && !fileToEdit) {
      setLanguage(getMostUsedLanguage());
    }
  }, [isOpen, fileToEdit, language]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (newContent: string | undefined) => {
    setContent(newContent || "");
    setHasUnsavedChanges(true);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleTemplateSelect = (templateType: string) => {
    const template = getTemplateByType(templateType);
    if (template) {
      setFileName(template.defaultFileName);
      setContent(template.template);
      setLanguage(template.language);
      setShowTemplateSelector(false);
      setHasUnsavedChanges(true);
    }
  };

  const handleSkipTemplate = () => {
    setShowTemplateSelector(false);
    setLanguage(getMostUsedLanguage());
  };

  // Check if this is a Claude Code file and validate it
  const claudeCodeValidation = React.useMemo(() => {
    const fullFileName = getFullFileName(fileName, language);

    if (isClaudeCodeFile(fullFileName)) {
      return validateClaudeCodeFile(fullFileName, content);
    }
    return null;
  }, [fileName, language, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fileName.trim()) {
      setError("File name is required");
      return;
    }

    if (!content.trim()) {
      setError("File content is required");
      return;
    }

    // Check Claude Code validation
    if (claudeCodeValidation && !claudeCodeValidation.valid) {
      setError("Please fix validation errors before saving");
      return;
    }

    setIsSubmitting(true);
    
    // Auto-detect file type and use as category
    const fullFileName =
      getFullFileName(fileName, language);
    
    const detectedType = detectClaudeCodeFileType(fullFileName);
    const fileTypeCategory = detectedType || language || "other";
    
    const snippetData = {
      title: fileName, // Use filename as title
      description: description,
      fragments: [
        {
          file_name: fileName,
          code: content,
          language: language,
          position: 0,
        },
      ],
      categories: [fileTypeCategory], // Auto-tag with file type
      is_public: 0,
      is_pinned: fileToEdit?.is_pinned || 0,
      is_favorite: fileToEdit?.is_favorite || 0,
    };

    try {
      await onSubmit(snippetData);
      setHasUnsavedChanges(false);
      onClose();
    } catch (error) {
      setError("An error occurred while saving the file. Please try again.");
      console.error("Error saving file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmCloseModal(true);
      return;
    }
    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirmCloseModal(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmCloseModal(false);
  };

  if (!isOpen) return null;

  // Confirmation modal for unsaved changes
  if (showConfirmCloseModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <div className="mb-4 text-lg font-semibold">
            You have unsaved changes. Are you sure you want to close?
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={handleCancelClose}
            >
              No
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleConfirmClose}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
  // Template selector modal
  if (showTemplateSelector) {
    const templates = getTemplateTypes();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-light-surface dark:bg-dark-surface rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3">
              <Sparkles size={24} className="text-light-primary dark:text-dark-primary" />
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text">
                Choose File Type
              </h2>
            </div>
            <IconButton
              icon={<X size={20} />}
              onClick={handleClose}
              variant="custom"
              size="md"
              className="hover:bg-light-hover dark:hover:bg-dark-hover"
              label="Close"
            />
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-sm text-light-text dark:text-dark-text mb-6 opacity-75">
              Select a Claude Code file type to start with a template, or skip to create a blank file.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.value}
                  onClick={() => handleTemplateSelect(template.value)}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary hover:bg-light-hover dark:hover:bg-dark-hover transition-all text-left"
                >
                  <div className="text-light-primary dark:text-dark-primary">
                    {getFileTypeIcon(template.value, 24)}
                  </div>
                  <span className="text-sm font-medium text-light-text dark:text-dark-text">
                    {template.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-light-border dark:border-dark-border flex justify-end">
            <button
              onClick={handleSkipTemplate}
              className="px-4 py-2 text-sm text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-colors"
            >
              Skip Template (Blank File)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface">
        <div className="flex items-center gap-4 flex-1">
          <FileText size={24} className="text-light-primary dark:text-dark-primary" />
          <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {fileToEdit ? "Edit Claude Code File" : "New Claude Code File"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <Save size={18} />
            <span>{isSubmitting ? "Saving..." : "Save"}</span>
          </button>
          <IconButton
            icon={<X size={20} />}
            onClick={handleClose}
            variant="custom"
            size="md"
            className="hover:bg-light-hover dark:hover:bg-dark-hover"
            label="Close"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* File Info */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* File Name */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={handleFileNameChange}
                  className="w-full px-3 py-2 text-sm transition-colors border rounded bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border-light-border dark:border-dark-border focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary"
                  placeholder="e.g., code-reviewer, CLAUDE, settings"
                  required
                />
              </div>

              {/* Language / File Type */}
              <div>
                <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  File Type
                </label>
                <BaseDropdown
                  value={language}
                  onChange={handleLanguageChange}
                  onSelect={handleLanguageChange}
                  getSections={(searchTerm) => {
                    const { used, other } = getLanguageDropdownSections();

                    const filterBySearch = (items: string[]) =>
                      items.filter((lang) =>
                        lang.toLowerCase().includes(searchTerm.toLowerCase())
                      );

                    return [
                      {
                        title: "Used",
                        items: filterBySearch(used),
                      },
                      {
                        title: "Other",
                        items: filterBySearch(other),
                      },
                    ];
                  }}
                  maxLength={50}
                  placeholder="Select file type"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="w-full px-3 py-2 text-sm transition-colors border rounded bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border-light-border dark:border-dark-border focus:border-light-primary dark:focus:border-dark-primary focus:ring-1 focus:ring-light-primary dark:focus:ring-dark-primary resize-none"
                rows={2}
                placeholder="Brief description of this file"
              />
            </div>
          </div>

          {/* Validation */}
          {claudeCodeValidation && (
            <ClaudeCodeValidation
              validation={claudeCodeValidation}
              fileName={fileName}
            />
          )}

          {/* Code Editor */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-lg border border-light-border dark:border-dark-border overflow-hidden">
            <div className="px-4 py-3 border-b border-light-border dark:border-dark-border">
              <h3 className="text-sm font-medium text-light-text dark:text-dark-text">
                File Content
              </h3>
            </div>
            <div className="p-4">
              <CodeEditor
                code={content}
                language={language}
                onValueChange={handleContentChange}
                showLineNumbers={showLineNumbers}
                minHeight="400px"
                maxHeight="calc(100vh - 500px)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaudeFileEditor;
