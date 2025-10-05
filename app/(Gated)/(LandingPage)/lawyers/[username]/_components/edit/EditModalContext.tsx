"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Lawyer } from "@/store/types/lawyer.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateMeLawyer } from "@/store/reducers/lawyerSlice";
import { updateLawyerSettings, updateConsultationSettings, updateAvailability } from "@/store/reducers/lawyerSettingsSlice";
import { useEffect } from "react";

interface EditModalContextType {
  isOverviewModalOpen: boolean;
  isExpertiseModalOpen: boolean;
  isCredentialsModalOpen: boolean;
  isPortfolioModalOpen: boolean;
  isTestimonialsModalOpen: boolean;
  isContactModalOpen: boolean;
  isAvailabilityModalOpen: boolean;
  
  openOverviewModal: () => void;
  openExpertiseModal: () => void;
  openCredentialsModal: () => void;
  openPortfolioModal: () => void;
  openTestimonialsModal: () => void;
  openContactModal: () => void;
  openAvailabilityModal: () => void;
  
  closeAllModals: () => void;
  
  lawyer: Lawyer | null;
  setLawyer: (lawyer: Lawyer | null) => void;
  
  // API functions
  updateProfile: (updates: any) => Promise<void>;
  updateSection: (section: string, data: any) => Promise<void>;
}

const EditModalContext = createContext<EditModalContextType | undefined>(undefined);

export function EditModalProvider({ children, lawyer }: { children: ReactNode; lawyer: Lawyer | null }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentLawyer, setCurrentLawyer] = useState<Lawyer | null>(lawyer);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [isExpertiseModalOpen, setIsExpertiseModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isTestimonialsModalOpen, setIsTestimonialsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  const openOverviewModal = () => setIsOverviewModalOpen(true);
  const openExpertiseModal = () => setIsExpertiseModalOpen(true);
  const openCredentialsModal = () => setIsCredentialsModalOpen(true);
  const openPortfolioModal = () => setIsPortfolioModalOpen(true);
  const openTestimonialsModal = () => setIsTestimonialsModalOpen(true);
  const openContactModal = () => setIsContactModalOpen(true);
  const openAvailabilityModal = () => setIsAvailabilityModalOpen(true);
  
  const closeAllModals = () => {
    setIsOverviewModalOpen(false);
    setIsExpertiseModalOpen(false);
    setIsCredentialsModalOpen(false);
    setIsPortfolioModalOpen(false);
    setIsTestimonialsModalOpen(false);
    setIsContactModalOpen(false);
    setIsAvailabilityModalOpen(false);
  };

  const setLawyer = (newLawyer: Lawyer | null) => {
    setCurrentLawyer(newLawyer);
  };

  // Update local state when lawyer prop changes
  useEffect(() => {
    setCurrentLawyer(lawyer);
  }, [lawyer]);

  // API functions using existing Redux actions
  const updateProfile = async (updates: any) => {
    if (!currentLawyer || !user) throw new Error("No lawyer profile or user available");
    
    try {
      // Use the existing updateMeLawyer action
      await dispatch(updateMeLawyer(updates)).unwrap();
      
      // Update local state with the changes
      setCurrentLawyer(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const updateSection = async (section: string, data: any) => {
    if (!currentLawyer || !user) throw new Error("No lawyer profile or user available");
    
    try {
      // Route to appropriate Redux action based on section
      switch (section) {
        case 'consultation':
          await dispatch(updateConsultationSettings(data)).unwrap();
          break;
        case 'availability':
          await dispatch(updateAvailability(data)).unwrap();
          break;
        default:
          // For other sections, use the general updateMeLawyer
          await dispatch(updateMeLawyer({ [section]: data })).unwrap();
      }
      
      // Update local state with the changes
      setCurrentLawyer(prev => prev ? { ...prev, [section]: data } : null);
    } catch (error) {
      console.error(`Failed to update ${section}:`, error);
      throw error;
    }
  };

  return (
    <EditModalContext.Provider
      value={{
        isOverviewModalOpen,
        isExpertiseModalOpen,
        isCredentialsModalOpen,
        isPortfolioModalOpen,
        isTestimonialsModalOpen,
        isContactModalOpen,
        isAvailabilityModalOpen,
        
        openOverviewModal,
        openExpertiseModal,
        openCredentialsModal,
        openPortfolioModal,
        openTestimonialsModal,
        openContactModal,
        openAvailabilityModal,
        
        closeAllModals,
        
        lawyer: currentLawyer,
        setLawyer,
        
        // API functions
        updateProfile,
        updateSection,
      }}
    >
      {children}
    </EditModalContext.Provider>
  );
}

export function useEditModal() {
  const context = useContext(EditModalContext);
  if (context === undefined) {
    throw new Error("useEditModal must be used within an EditModalProvider");
  }
  return context;
}
