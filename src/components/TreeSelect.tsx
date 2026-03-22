import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../context/CategoryContext';

interface TreeSelectProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  placeholder?: string;
  className?: string;
}

interface FlatItem {
  id: string;
  name: string;
  level: number;
  isLast: boolean;
  parentTrail: boolean[]; // tracks which ancestor levels should show a continuing vertical line
}

export default function TreeSelect({ value, onChange, categories, placeholder = 'Chọn chuyên mục', className = '' }: TreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Flatten categories into a list with metadata for drawing connector lines
  const flatten = (cats: Category[], level = 0, parentTrail: boolean[] = []): FlatItem[] => {
    let result: FlatItem[] = [];
    cats.forEach((cat, index) => {
      const isLast = index === cats.length - 1;
      result.push({ id: cat.id, name: cat.name, level, isLast, parentTrail: [...parentTrail] });
      if (cat.children && cat.children.length > 0) {
        // If this category is NOT the last sibling, the vertical line at this level should continue
        result = result.concat(flatten(cat.children, level + 1, [...parentTrail, !isLast]));
      }
    });
    return result;
  };

  const flatCategories = flatten(categories);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        className="w-full bg-surface-container dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:ring-2 focus:ring-primary/20 outline-none flex justify-between items-center cursor-pointer text-sm shadow-sm hover:shadow-md transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-on-surface font-medium' : 'text-slate-400 dark:text-slate-500'}>{value || placeholder}</span>
        <span 
          className="material-symbols-outlined text-slate-400 dark:text-slate-500 transition-transform duration-200" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '20px' }}
        >expand_more</span>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-80 overflow-y-auto py-2 outline-none">
          {/* Placeholder / Clear Option */}
          <div 
            className="flex items-center px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-sm transition-colors text-slate-400 dark:text-slate-500"
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            <span>{placeholder}</span>
          </div>

          {flatCategories.map((cat) => {
            const isSelected = value === cat.name;

            return (
              <div 
                key={cat.id} 
                className={`relative flex items-center px-5 py-2.5 cursor-pointer text-sm transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                onClick={() => {
                  onChange(cat.name);
                  setIsOpen(false);
                }}
              >
                {/* Checkmark area */}
                <div className="w-7 flex items-center justify-center flex-shrink-0">
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>check</span>
                  )}
                </div>

                {/* Tree lines + Label */}
                <div className="flex items-center relative" style={{ paddingLeft: `${cat.level * 28}px` }}>
                  {/* Draw vertical connector lines for each ancestor level */}
                  {Array.from({ length: cat.level }).map((_, lvl) => {
                    // Should this level's vertical line be shown?
                    // At lvl index, check parentTrail[lvl]: true means the ancestor at that level has more siblings below
                    const showLine = cat.parentTrail[lvl];
                    if (!showLine && lvl < cat.level - 1) return null; // no line for this ancestor level
                    
                    const left = lvl * 28 + 8; // position of the vertical line

                    if (lvl === cat.level - 1) {
                      // This is the immediate parent level — draw the vertical + horizontal connector
                      return (
                        <React.Fragment key={lvl}>
                          {/* Vertical line segment */}
                          <div 
                            className="absolute border-l-2 border-slate-200 dark:border-slate-600"
                            style={{ 
                              left: `${left}px`, 
                              top: 0, 
                              height: cat.isLast ? '50%' : '100%'
                            }} 
                          />
                          {/* Horizontal connector tick */}
                          <div 
                            className="absolute border-b-2 border-slate-200 dark:border-slate-600"
                            style={{ 
                              left: `${left}px`, 
                              top: '50%', 
                              width: '12px' 
                            }} 
                          />
                        </React.Fragment>
                      );
                    } else if (showLine) {
                      // Ancestor level pass-through vertical line
                      return (
                        <div 
                          key={lvl}
                          className="absolute border-l-2 border-slate-200 dark:border-slate-600"
                          style={{ left: `${left}px`, top: 0, height: '100%' }} 
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Label */}
                  <span className={`truncate ${isSelected ? 'font-bold text-primary' : cat.level === 0 ? 'font-medium text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
                    {cat.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
