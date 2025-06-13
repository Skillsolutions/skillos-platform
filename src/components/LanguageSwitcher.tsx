"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  onChangeLanguage?: (language: string) => void;
  currentLanguage?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  onChangeLanguage,
  currentLanguage = 'en'
}) => {
  const [language, setLanguage] = useState<string>(currentLanguage);

  useEffect(() => {
    // Get language from localStorage if available and no currentLanguage prop
    if (!currentLanguage) {
      const savedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(savedLanguage);
    } else {
      setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Call the onChangeLanguage callback if provided
    if (onChangeLanguage) {
      onChangeLanguage(newLanguage);
    } else {
      // Force a page refresh to apply language changes if no callback provided
      window.location.reload();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-gray-700 border-gray-600 hover:bg-gray-600">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`${language === 'en' ? 'bg-gray-700' : 'hover:bg-gray-700'} text-gray-200`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')}
          className={`${language === 'ar' ? 'bg-gray-700' : 'hover:bg-gray-700'} text-gray-200`}
        >
          العربية (Arabic)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
