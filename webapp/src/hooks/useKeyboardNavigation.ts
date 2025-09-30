import { useState, useCallback, type KeyboardEvent } from "react";

interface UseKeyboardNavigationProps<T> {
  items: T[];
  onSelect: (item: T) => void;
  onClose?: () => void;
  isEnabled?: boolean;
}

export function useKeyboardNavigation<T>({ items, onSelect, onClose, isEnabled = true }: UseKeyboardNavigationProps<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const resetHighlight = useCallback(() => {
    setHighlightedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!isEnabled || items.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          break;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          break;

        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && items[highlightedIndex]) {
            onSelect(items[highlightedIndex]);
            resetHighlight();
          }
          break;

        case "Escape":
          e.preventDefault();
          resetHighlight();
          onClose?.();
          break;

        case "Tab":
          resetHighlight();
          break;

        default:
          break;
      }
    },
    [items, highlightedIndex, onSelect, onClose, isEnabled, resetHighlight]
  );

  return {
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    resetHighlight,
  };
}
