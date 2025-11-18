import React, { useState, useEffect } from 'react';
import { X, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface Tip {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const CLAUDESTASH_TIPS: Tip[] = [
  {
    title: 'Welcome to ClaudeStash!',
    description: 'Store and manage your Claude Code configuration files with validation, templates, and auto-tagging.',
  },
  {
    title: 'File Templates',
    description: 'Click "New File" and choose from 9 pre-built templates: Agents, Commands, Skills, Hooks, Output Styles, and more!',
  },
  {
    title: 'Real-Time Validation',
    description: 'Your Claude Code files are validated as you type. Red for errors, yellow for warnings, green for success!',
  },
  {
    title: 'Auto-Tagging',
    description: 'Files are automatically tagged with their Claude Code type for easy filtering and organization.',
  },
  {
    title: 'YAML Frontmatter',
    description: 'All agent, skill, and output style files support YAML frontmatter with name, description, and configuration.',
  },
  {
    title: 'File Type Sidebar',
    description: 'Use the left sidebar to filter files by type: agents, commands, skills, hooks, and more.',
  },
  {
    title: 'Full-Screen Editor',
    description: 'The editor uses most of your screen space for an immersive editing experience.',
  },
  {
    title: 'Search & Filter',
    description: 'Quickly find files using the search bar. Filter by language, sort by date, and organize with categories.',
  },
];

export const TipsPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('claudestash-tips-dismissed');
    const lastShown = localStorage.getItem('claudestash-tips-last-shown');
    const now = Date.now();
    
    // Show tips if never dismissed, or if last shown was more than 7 days ago
    if (!dismissed) {
      if (!lastShown || now - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000) {
        setTimeout(() => setIsVisible(true), 2000); // Show after 2 seconds
      }
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('claudestash-tips-last-shown', Date.now().toString());
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('claudestash-tips-dismissed', 'true');
  };

  const handleNext = () => {
    setCurrentTipIndex((prev) => (prev + 1) % CLAUDESTASH_TIPS.length);
  };

  const handlePrevious = () => {
    setCurrentTipIndex((prev) => (prev - 1 + CLAUDESTASH_TIPS.length) % CLAUDESTASH_TIPS.length);
  };

  const handleShowTips = () => {
    setIsVisible(true);
    setCurrentTipIndex(0);
  };

  if (isDismissed && !isVisible) {
    return (
      <button
        onClick={handleShowTips}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-40"
        aria-label="Show tips"
      >
        <Lightbulb className="w-6 h-6" />
      </button>
    );
  }

  if (!isVisible) return null;

  const currentTip = CLAUDESTASH_TIPS[currentTipIndex];

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 border border-slate-700 dark:border-slate-800 rounded-xl shadow-2xl z-50 animate-slide-up">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              ClaudeStash Tips
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close tips"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-white font-medium mb-2">{currentTip.title}</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            {currentTip.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Previous tip"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-400 text-sm">
              {currentTipIndex + 1} / {CLAUDESTASH_TIPS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Next tip"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
};
