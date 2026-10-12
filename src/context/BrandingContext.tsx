import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingConfig } from '../types';
import { DEFAULT_BRANDING, CORPORATE_LOGO_IMAGE } from '../data/initialData';

interface BrandingContextType {
  branding: BrandingConfig;
  updateBranding: (newConfig: Partial<BrandingConfig>) => void;
  uploadLogo: (file: File) => Promise<string>;
  resetLogo: () => void;
  activeLogoSrc: string;
}

const STORAGE_KEY = 'pcg_branding_config_v1';

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_BRANDING;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(branding));
    } catch (e) {
      console.error('Failed to save branding to localStorage', e);
    }
    // Update document title
    document.title = branding.title || `${branding.companyName} — Xodimlarni boshqarish tizimi`;
  }, [branding]);

  const updateBranding = (newConfig: Partial<BrandingConfig>) => {
    setBranding((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const uploadLogo = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          updateBranding({ logoUrl: result, usePresetLogoImage: false });
          resolve(result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsDataURL(file);
    });
  };

  const resetLogo = () => {
    updateBranding({ logoUrl: null, usePresetLogoImage: true });
  };

  const activeLogoSrc = branding.logoUrl || (branding.usePresetLogoImage ? CORPORATE_LOGO_IMAGE : '');

  return (
    <BrandingContext.Provider
      value={{
        branding,
        updateBranding,
        uploadLogo,
        resetLogo,
        activeLogoSrc,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
