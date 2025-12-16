/**
 * Project Tabs - Bedrock/Springfield Tab Persistence
 *
 * This script synchronizes Bedrock/Springfield tabs across the page and
 * persists the user's preference in localStorage.
 */
(function () {
  const STORAGE_KEY = "project-tab-preference";
  const PROJECT_LABELS = ["bedrock", "springfield"];

  /**
   * Get the stored project preference from localStorage
   */
  function getStoredPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  /**
   * Store the project preference in localStorage
   */
  function storePreference(project) {
    try {
      localStorage.setItem(STORAGE_KEY, project);
    } catch (e) {
      // localStorage not available
    }
  }

  /**
   * Check if a tab label is a project tab (Bedrock or Springfield)
   */
  function getProjectFromLabel(label) {
    if (!label) return null;
    const lower = label.toLowerCase().trim();
    for (const project of PROJECT_LABELS) {
      if (lower === project || lower.startsWith(project)) {
        return project;
      }
    }
    return null;
  }

  /**
   * Find all project tab inputs on the page and mark them with data attributes
   * Material theme tabs use input[type="radio"] with labels
   */
  function findProjectTabs() {
    const tabs = [];
    // Material theme uses .tabbed-labels for tab containers
    const tabLabels = document.querySelectorAll(".tabbed-labels label");

    tabLabels.forEach((label) => {
      const project = getProjectFromLabel(label.textContent);
      if (project) {
        // Add data-project attribute for CSS styling
        label.setAttribute("data-project", project);

        const inputId = label.getAttribute("for");
        const input = inputId ? document.getElementById(inputId) : null;
        if (input) {
          tabs.push({ label, input, project });
        }
      }
    });

    return tabs;
  }

  /**
   * Activate all tabs for a given project
   */
  function activateProject(project) {
    const tabs = findProjectTabs();
    tabs.forEach((tab) => {
      if (tab.project === project && !tab.input.checked) {
        tab.input.checked = true;
        // Dispatch change event for any listeners
        tab.input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  /**
   * Set up click handlers on project tabs
   */
  function setupTabListeners() {
    const tabs = findProjectTabs();

    tabs.forEach((tab) => {
      tab.label.addEventListener("click", () => {
        storePreference(tab.project);
        // Sync all tabs of the same project type
        activateProject(tab.project);
      });
    });
  }

  /**
   * Initialize tabs based on stored preference
   */
  function initializeTabs() {
    const stored = getStoredPreference();
    if (stored && PROJECT_LABELS.includes(stored)) {
      activateProject(stored);
    }
    setupTabListeners();
  }

  /**
   * Handle page content changes (for instant navigation)
   */
  function setupContentObserver() {
    // Re-initialize when content changes (instant navigation)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // Check if any added nodes contain tabs
          const hasNewTabs = Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              (node.classList?.contains("tabbed-set") ||
                node.querySelector?.(".tabbed-set"))
          );
          if (hasNewTabs) {
            initializeTabs();
            break;
          }
        }
      }
    });

    const content = document.querySelector(".md-content");
    if (content) {
      observer.observe(content, { childList: true, subtree: true });
    }
  }

  /**
   * Handle navigation changes (history API, hash changes, etc.)
   */
  function setupNavigationListeners() {
    // Listen for browser back/forward button
    window.addEventListener("popstate", () => {
      // Small delay to ensure content is updated
      setTimeout(initializeTabs, 50);
    });

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      setTimeout(initializeTabs, 50);
    });

    // Listen for programmatic navigation (pushState/replaceState)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setTimeout(initializeTabs, 50);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      setTimeout(initializeTabs, 50);
    };

    // Listen for page visibility changes (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        // Page became visible again, re-initialize in case content changed
        setTimeout(initializeTabs, 50);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeTabs();
      setupContentObserver();
      setupNavigationListeners();
    });
  } else {
    initializeTabs();
    setupContentObserver();
    setupNavigationListeners();
  }
})();
