import React, { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useBitrixApi } from "../hooks/useBitrix";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import type { Product, SelectedProduct } from "../types";

interface ProductSearchProps {
  type: "parts" | "services";
  selectedProducts: SelectedProduct[];
  onAddProduct: (product: SelectedProduct) => void;
  onRemoveProduct: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ type, selectedProducts, onAddProduct, onRemoveProduct, onUpdateQuantity }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { searchProducts, loading } = useBitrixApi();

  const title = type === "parts" ? "Parts" : "Services";

  // Объявляем handleSelect ДО использования в хуке
  const handleSelect = (product: Product) => {
    if (product.price === null) {
      alert("This product has no price and cannot be added");
      return;
    }
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (!existingProduct) {
      onAddProduct({ ...product, quantity: 1 });
    }
    setQuery("");
    setIsOpen(false);
    resetHighlight();
  };

  // Теперь используем хук после объявления handleSelect
  const { highlightedIndex, setHighlightedIndex, handleKeyDown, resetHighlight } = useKeyboardNavigation({
    items: suggestions,
    onSelect: handleSelect,
    onClose: () => setIsOpen(false),
    isEnabled: isOpen && suggestions.length > 0,
  });

  useEffect(() => {
    if (debouncedQuery) {
      searchProducts(type, debouncedQuery).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, type, searchProducts]);

  const isProductSelected = (productId: number) => selectedProducts.some((p) => p.id === productId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    resetHighlight(); // Сбрасываем выделение при изменении запроса
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>

      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-colors duration-200"
          aria-autocomplete="list"
          aria-controls={`${type}-options`}
          aria-activedescendant={highlightedIndex >= 0 ? `${type}-option-${highlightedIndex}` : undefined}
        />

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div role="status" aria-live="polite" className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
          </div>
        )}

        {isOpen && suggestions.length > 0 && (
          <ul
            id={`${type}-options`}
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 
                       dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((product, index) => (
              <li
                key={product.id}
                id={`${type}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`px-4 py-3 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 dark:text-white
                  ${
                    highlightedIndex === index
                      ? "bg-blue-500 text-white"
                      : isProductSelected(product.id)
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                onMouseDown={() => handleSelect(product)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {product.id}</div>
                  </div>
                  {product.price !== null && (
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      {product.price} {product.currency}
                    </div>
                  )}
                </div>
                {isProductSelected(product.id) && <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Already added</div>}
              </li>
            ))}
          </ul>
        )}

        {!loading && isOpen && suggestions.length === 0 && query && (
          <div
            role="status"
            aria-live="polite"
            className="absolute z-10 w-full mt-1 p-3 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 
                     border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
          >
            No {title.toLowerCase()} found
          </div>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          {selectedProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {product.price} {product.currency} each
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(product.id, Math.max(1, product.quantity - 1))}
                    aria-label={`Decrease quantity of ${product.name}`}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 
                             rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-gray-900 dark:text-white">{product.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-gray-600 
                             rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="w-20 text-right font-medium text-gray-900 dark:text-white">
                  {product.price * product.quantity} {product.currency}
                </div>

                <button
                  onClick={() => onRemoveProduct(product.id)}
                  aria-label={`Remove ${product.name}`}
                  className="w-8 h-8 flex items-center justify-center text-red-600 dark:text-red-400 
                           hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div
          className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed 
                     border-gray-300 dark:border-gray-600 rounded-lg"
        >
          No {title.toLowerCase()} selected
        </div>
      )}
    </div>
  );
};
