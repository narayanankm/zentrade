'use client';

import { useState, useRef, useEffect } from 'react';
import { searchSymbols, type SymbolData } from '@/lib/data/symbols';

interface SymbolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (symbol: SymbolData) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function SymbolAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'e.g., TCS, RELIANCE, ITC',
  className = '',
  required = false,
}: SymbolAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SymbolData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update suggestions when input changes
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchSymbols(value, 10);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.toUpperCase());
  };

  const handleSelectSymbol = (symbol: SymbolData) => {
    onChange(symbol.symbol);
    setIsOpen(false);
    onSelect?.(symbol);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSymbol(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (value.trim().length > 0 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((symbol, index) => (
            <button
              key={symbol.symbol}
              type="button"
              onClick={() => handleSelectSymbol(symbol)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                index === selectedIndex
                  ? 'bg-zinc-100 dark:bg-zinc-800'
                  : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {symbol.displayName}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {symbol.companyName}
                  </div>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 ml-2">
                  {symbol.exchange}:{symbol.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
