import { Lawyer } from "@/store/types/lawyer.types";
import { ProfileCompletionData } from "@/lib/types/profile.types";
import { User, Shield, GraduationCap, Award, MessageSquare, Briefcase, Clock, Upload } from "lucide-react";

// Helper function to check if a field is completed
export function isFieldCompleted(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return false;
}

// Calculate profile completion based on Lawyer data
export function calculateProfileCompletion(lawyer: Lawyer): ProfileCompletionData {
  // Personal Info (15% weight)
  const personalInfoCompleted = isFieldCompleted(lawyer.firstname) && 
                               isFieldCompleted(lawyer.lastname) && 
                               isFieldCompleted(lawyer.profilePicture);
  const personalInfoPercentage = personalInfoCompleted ? 100 : 
    (isFieldCompleted(lawyer.firstname) ? 33 : 0) + 
    (isFieldCompleted(lawyer.lastname) ? 33 : 0) + 
    (isFieldCompleted(lawyer.profilePicture) ? 34 : 0);

  // Professional Overview (20% weight)
  const professionalOverviewCompleted = isFieldCompleted(lawyer.title) && 
                                       isFieldCompleted(lawyer.summary);
  const professionalOverviewPercentage = professionalOverviewCompleted ? 100 : 
    (isFieldCompleted(lawyer.title) ? 50 : 0) + 
    (isFieldCompleted(lawyer.summary) ? 50 : 0);

  // Legal Expertise (25% weight)
  const legalExpertiseCompleted = isFieldCompleted(lawyer.primarySpecialization) && 
                                 isFieldCompleted(lawyer.specializations);
  const legalExpertisePercentage = legalExpertiseCompleted ? 100 : 
    (isFieldCompleted(lawyer.primarySpecialization) ? 50 : 0) + 
    (isFieldCompleted(lawyer.specializations) ? 50 : 0);

  // Credentials (20% weight)
  const credentialsCompleted = isFieldCompleted(lawyer.barCouncil) && 
                              isFieldCompleted(lawyer.licenseNumber) && 
                              isFieldCompleted(lawyer.education);
  const credentialsPercentage = credentialsCompleted ? 100 : 
    (isFieldCompleted(lawyer.barCouncil) ? 33 : 0) + 
    (isFieldCompleted(lawyer.licenseNumber) ? 33 : 0) + 
    (isFieldCompleted(lawyer.education) ? 34 : 0);

  // Portfolio (10% weight) - Currently not available in Lawyer type
  const portfolioCompleted = false; // Portfolio data doesn't exist in Lawyer type yet
  const portfolioPercentage = 0;

  // Services (15% weight) - This would need to be checked against lawyer settings
  const servicesCompleted = false; // This would need to be checked against lawyer settings
  const servicesPercentage = 0;

  // Verification (5% weight)
  const verificationCompleted = lawyer.identityVerified || false;
  const verificationPercentage = verificationCompleted ? 100 : 0;

  // Calculate overall percentage
  const overallPercentage = Math.round(
    (personalInfoPercentage * 0.15) +
    (professionalOverviewPercentage * 0.20) +
    (legalExpertisePercentage * 0.25) +
    (credentialsPercentage * 0.20) +
    (portfolioPercentage * 0.10) +
    (servicesPercentage * 0.15) +
    (verificationPercentage * 0.05)
  );

  // Determine next recommended action
  let nextRecommendedAction = "Profile complete!";
  if (!personalInfoCompleted) {
    nextRecommendedAction = "Complete your personal information";
  } else if (!professionalOverviewCompleted) {
    nextRecommendedAction = "Add your professional title and summary";
  } else if (!legalExpertiseCompleted) {
    nextRecommendedAction = "Specify your legal expertise";
  } else if (!credentialsCompleted) {
    nextRecommendedAction = "Complete your credentials";
  } else if (!verificationCompleted) {
    nextRecommendedAction = "Verify your identity";
  } else if (!servicesCompleted) {
    nextRecommendedAction = "Set up your consultation services";
  } else if (!portfolioCompleted) {
    nextRecommendedAction = "Add your portfolio and achievements";
  }

  return {
    overallPercentage,
    sectionCompletion: {
      personalInfo: { completed: personalInfoCompleted, percentage: personalInfoPercentage },
      professionalOverview: { completed: professionalOverviewCompleted, percentage: professionalOverviewPercentage },
      legalExpertise: { completed: legalExpertiseCompleted, percentage: legalExpertisePercentage },
      credentials: { completed: credentialsCompleted, percentage: credentialsPercentage },
      portfolio: { completed: portfolioCompleted, percentage: portfolioPercentage },
      services: { completed: servicesCompleted, percentage: servicesPercentage },
      verification: { completed: verificationCompleted, percentage: verificationPercentage }
    },
    lastUpdated: new Date(),
    nextRecommendedAction
  };
}

// Get progress steps for ProfileProgress component
export function getProgressSteps(lawyer: Lawyer): Array<{
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'completed' | 'pending' | 'current';
  action?: {
    href?: string;
    isExternal?: boolean;
    modalId?: string;
  };
}> {
  const completion = calculateProfileCompletion(lawyer);
  
  return [
    {
      id: 'overview',
      title: 'Professional Overview',
      description: 'Add your title and professional summary',
      icon: User,
      status: completion.sectionCompletion.professionalOverview.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'overview' }
    },
    {
      id: 'expertise',
      title: 'Legal Expertise',
      description: 'Specify your specializations and areas of practice',
      icon: Shield,
      status: completion.sectionCompletion.legalExpertise.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'expertise' }
    },
    {
      id: 'credentials',
      title: 'Credentials & Education',
      description: 'Add your bar council details and education',
      icon: GraduationCap,
      status: completion.sectionCompletion.credentials.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'credentials' }
    },
    {
      id: 'portfolio',
      title: 'Portfolio & Achievements',
      description: 'Showcase your notable cases and achievements',
      icon: Award,
      status: completion.sectionCompletion.portfolio.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'portfolio' }
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Collect client reviews and testimonials',
      icon: MessageSquare,
      status: 'pending' as const, // Testimonials would be fetched separately
      action: { href: '/lawyers/me', isExternal: true }
    },
    {
      id: 'contact',
      title: 'Contact & Services',
      description: 'Set up consultation modes and fees',
      icon: Briefcase,
      status: completion.sectionCompletion.services.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'contact' }
    },
    {
      id: 'availability',
      title: 'Availability',
      description: 'Set your working hours and schedule',
      icon: Clock,
      status: completion.sectionCompletion.services.completed ? 'completed' as const : 'pending' as const,
      action: { modalId: 'availability' }
    },
    {
      id: 'verification',
      title: 'Identity Verification',
      description: 'Complete your identity verification',
      icon: Upload,
      status: completion.sectionCompletion.verification.completed ? 'completed' as const : 'pending' as const,
      action: !completion.sectionCompletion.verification.completed ? { href: '/lawyer/settings?section=verification' } : undefined
    }
  ].map((step, index, array) => {
    // Set the first pending step as 'current'
    if (step.status === 'pending' && !array.slice(0, index).some(s => s.status === 'pending')) {
      return { ...step, status: 'current' as const };
    }
    return step;
  });
}