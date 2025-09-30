// components/DeviceSearch.tsx
import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useBitrixApi } from "../hooks/useBitrix";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { Product } from "../types";

interface DeviceSearchProps {
  onDeviceSelect: (device: Product | null) => void;
  selectedDevice: Product | null;
}

export const DeviceSearch: React.FC<DeviceSearchProps> = ({ onDeviceSelect, selectedDevice }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { searchProducts, loading } = useBitrixApi();

  const { highlightedIndex, setHighlightedIndex, handleKeyDown, resetHighlight } = useKeyboardNavigation({
    items: suggestions,
    onSelect: handleSelect,
    onClose: () => setIsOpen(false),
    isEnabled: isOpen && suggestions.length > 0 && !selectedDevice,
  });

  useEffect(() => {
    if (debouncedQuery && !selectedDevice) {
      searchProducts("devices", debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, selectedDevice, searchProducts]);

  function handleSelect(device: Product) {
    onDeviceSelect(device);
    setQuery(device.name);
    setIsOpen(false);
    setSuggestions([]);
    resetHighlight();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (selectedDevice) {
      onDeviceSelect(null);
    }
    setIsOpen(true);
  }

  function handleClearDevice() {
    onDeviceSelect(null);
    setQuery("");
    setIsOpen(false);
    resetHighlight();
  }

  return (
    <div className="relative mb-6">
      <label htmlFor="device-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Search Devices
      </label>

      <div className="relative">
        <input
          id="device-search"
          type="text"
          value={selectedDevice ? selectedDevice.name : query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Используем хук здесь
          onFocus={() => !selectedDevice && setIsOpen(true)}
          placeholder="Type to search devices..."
          disabled={!!selectedDevice}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                   transition-colors duration-200"
          aria-autocomplete="list"
          aria-controls="device-options"
          aria-activedescendant={highlightedIndex >= 0 ? `device-option-${highlightedIndex}` : undefined}
        />

        {selectedDevice && (
          <button
            onClick={handleClearDevice}
            aria-label="Clear selected device"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute right-3 top-11 transform -translate-y-1/2">
          <div role="status" aria-live="polite" className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && !selectedDevice && (
        <ul
          id="device-options"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 
                     dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((device, index) => (
            <li
              key={device.id}
              id={`device-option-${index}`}
              role="option"
              aria-selected={highlightedIndex === index}
              className={`px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 dark:text-white
                ${highlightedIndex === index ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-600"}
              `}
              onMouseDown={() => handleSelect(device)}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
            >
              <div className="font-medium">{device.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">ID: {device.id}</div>
            </li>
          ))}
        </ul>
      )}

      {!loading && isOpen && suggestions.length === 0 && query && !selectedDevice && (
        <div
          role="status"
          aria-live="polite"
          className="absolute z-10 w-full mt-1 p-3 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 
                     border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        >
          No devices found
        </div>
      )}

      {selectedDevice && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Device</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">ID:</span> {selectedDevice.id}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {selectedDevice.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
