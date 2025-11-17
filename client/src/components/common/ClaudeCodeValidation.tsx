import React from "react";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { ValidationResult } from "../../types/claudeCode";

interface ClaudeCodeValidationProps {
  validation: ValidationResult;
  fileName: string;
}

export const ClaudeCodeValidation: React.FC<ClaudeCodeValidationProps> = ({
  validation,
  fileName,
}) => {
  if (validation.valid && validation.warnings.length === 0) {
    return (
      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Valid Claude Code File
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            {fileName} passed all validation checks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {validation.errors.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
              Validation Errors
            </p>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li
                  key={index}
                  className="text-xs text-red-700 dark:text-red-300 list-disc list-inside"
                >
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Validation Warnings
            </p>
            <ul className="space-y-1">
              {validation.warnings.map((warning, index) => (
                <li
                  key={index}
                  className="text-xs text-yellow-700 dark:text-yellow-300 list-disc list-inside"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
