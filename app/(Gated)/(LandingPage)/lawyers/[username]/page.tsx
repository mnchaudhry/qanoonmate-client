"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LawyerProfile } from "@/lib/types/profile.types";
import { LawyerProfileHeader } from "./_components/LawyerProfileHeader";
import { LawyerOverview } from "./_components/LawyerOverview";
import { LegalExpertise } from "./_components/LegalExpertise";
import { Credentials } from "./_components/Credentials";
import { Portfolio } from "./_components/Portfolio";
import { Testimonials } from "./_components/Testimonials";
import { ContactCard } from "./_components/ContactCard";
import { AvailabilityCard } from "./_components/AvailabilityCard";
import { SimilarLawyers } from "./_components/SimilarLawyers";
import { EditModalProvider } from "./_components/edit/EditModalContext";
import { getLawyerByUsername } from "@/store/reducers/lawyerSlice";
import { RootState, AppDispatch } from "@/store/store";
import { Lawyer } from "@/store/types/lawyer.types";
import { LawyerCity, Province, LawCategory } from "@/lib/enums";

export default function LawyerProfilePage() {

  //////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////
  const params = useParams();
  const username = params.username as string;
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLawyer } = useSelector((state: RootState) => state.lawyer);

  //////////////////////////////////////////////// STATES ///////////////////////////////////////////
  const [lawyerProfile, setLawyerProfile] = useState<LawyerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////
  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        setLoading(true);

        if (!selectedLawyer && username) {
          dispatch(getLawyerByUsername(username))
            .then(({ payload, meta }: any) => {
              if (meta.requestStatus === 'fulfilled' && payload?.data) {
                const profile = convertLawyerToProfile(payload.data);
                setLawyerProfile(profile);
              } else {
                setError("Failed to load lawyer profile");
              }
            })
            .catch((err) => {
              setError("Failed to load lawyer profile");
              console.error("Error fetching lawyer profile:", err);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (selectedLawyer) {
          const profile = convertLawyerToProfile(selectedLawyer);
          setLawyerProfile(profile);
        }
      } catch (err) {
        setError("Failed to load lawyer profile");
        console.error("Error fetching lawyer profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchLawyerProfile();
    }
  }, [username, selectedLawyer, dispatch]);

  //////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////
  // Convert Lawyer to LawyerProfile
  const convertLawyerToProfile = (lawyer: Lawyer): LawyerProfile => {
    return {
      personalInfo: {
        firstname: lawyer.firstname,
        lastname: lawyer.lastname,
        fullName: lawyer.fullName,
        email: lawyer.email,
        phone: lawyer.phone,
        profilePicture: lawyer.profilePicture,
        location: {
          city: (lawyer.location?.city as LawyerCity) || LawyerCity.LAHORE,
          province: (lawyer.location?.province as Province) || Province.PUNJAB,
          country: "Pakistan"
        }
      },
      professionalOverview: {
        title: lawyer.title || "Legal Professional",
        bio: lawyer.bio || lawyer.summary || "Experienced legal professional committed to providing quality legal services.",
        tagline: lawyer.title || "Your trusted legal advisor",
        yearsOfExperience: lawyer.preLicensedYearsOfExperience || 0,
        profileVisibility: lawyer.profileVisibility?.public ? "public" : "private"
      },
      legalExpertise: {
        primarySpecialization: (lawyer.primarySpecialization as LawCategory) || LawCategory.GENERAL_LAWS,
        secondarySpecializations: (lawyer.specializations as LawCategory[]) || [],
        jurisdictions: lawyer.jurisdictions?.map(j => ({
          geography: {
            province: j?.geography?.province as Province,
            district: j?.geography?.district || undefined,
            tehsil: j?.geography?.tehsil || undefined
          },
          courts: j.courts
        })) || [{
          geography: {
            province: (lawyer.location?.province as Province) || Province.PUNJAB,
            district: "Lahore",
            tehsil: "Lahore"
          },
          courts: ["High Court", "District Court"]
        }],
        languages: lawyer.languages || ["English", "Urdu"],
        certifications: lawyer.certifications || []
      },
      credentials: {
        education: lawyer.education?.map(edu => ({
          degree: "LLB",
          institution: edu,
          year: 2010,
          field: "Law"
        })) || [],
        barCouncil: lawyer.barCouncil,
        licenseNumber: lawyer.licenseNumber,
        licenseValidity: lawyer.licenseValidity || undefined,
        barAssociation: lawyer.barAssociation || "",
        barCouncilEnrollmentDate: lawyer.barCouncilEnrollmentDate,
        preLicensedExperience: lawyer.preLicensedYearsOfExperience || 0,
        workHistory: []
      },
      portfolio: {
        notableCases: [],
        publications: [],
        awards: [],
        testimonials: lawyer.reviews?.map(review => ({
          clientName: (typeof review.reviewer === 'string' ? review.reviewer : (review.reviewer as any).firstname + " " + (review.reviewer as any).lastname),
          clientType: "individual" as const,
          rating: review.rating,
          comment: review.comment || "Great service!",
          date: new Date(review.createdAt),
          verified: true
        })) || [],
        caseStudies: []
      },
      services: {
        consultationFees: lawyer.settings?.consultation?.fees?.map(fee => ({
          mode: fee.mode as any,
          duration: 60,
          price: fee.amount,
          currency: "PKR",
          description: "Legal consultation"
        })) || [{
          mode: "video" as const,
          duration: 60,
          price: 5000,
          currency: "PKR",
          description: "Video consultation"
        }],
        availability: {
          timezone: "Asia/Karachi",
          workingDays: {
            monday: [{ start: "09:00", end: "17:00", available: true }],
            tuesday: [{ start: "09:00", end: "17:00", available: true }],
            wednesday: [{ start: "09:00", end: "17:00", available: true }],
            thursday: [{ start: "09:00", end: "17:00", available: true }],
            friday: [{ start: "09:00", end: "17:00", available: true }],
            saturday: [{ start: "10:00", end: "14:00", available: true }],
            sunday: []
          },
          exceptions: []
        },
        responseTime: "24 hours",
        serviceAreas: [lawyer.location?.city || "Lahore"],
        consultationModes: lawyer.settings?.consultation?.modes || ["video", "in-person"]
      },
      verification: {
        identityVerified: lawyer.identityVerified || false,
        barCardVerified: false, // This field doesn't exist in Lawyer type
        documents: {},
        verificationStatus: lawyer.identityVerified ? "verified" : "pending"
      },
      profileCompletion: {
        overallPercentage: 85,
        sectionCompletion: {
          personalInfo: { completed: true, percentage: 100 },
          professionalOverview: { completed: true, percentage: 100 },
          legalExpertise: { completed: true, percentage: 100 },
          credentials: { completed: true, percentage: 100 },
          portfolio: { completed: false, percentage: 50 },
          services: { completed: true, percentage: 100 },
          verification: { completed: !!lawyer.identityVerified, percentage: lawyer.identityVerified ? 100 : 50 }
        },
        lastUpdated: new Date(),
        nextRecommendedAction: ""
      }
    };
  };

  //////////////////////////////////////////////// RENDER ///////////////////////////////////////////
  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                <div className="h-32 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                <div className="h-40 bg-white rounded-lg shadow-sm border border-gray-100"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-white rounded-lg shadow-sm border border-gray-100"></div>
                <div className="h-32 bg-white rounded-lg shadow-sm border border-gray-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lawyerProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lawyer Not Found</h1>
          <p className="text-gray-600">The lawyer profile you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <EditModalProvider lawyer={selectedLawyer}>
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LawyerProfileHeader lawyer={lawyerProfile} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <LawyerOverview lawyer={lawyerProfile} />
              <LegalExpertise lawyer={lawyerProfile} />
              <Credentials lawyer={lawyerProfile} />
              <Portfolio lawyer={lawyerProfile} />
              <Testimonials lawyer={lawyerProfile} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <ContactCard lawyer={lawyerProfile} />
              <AvailabilityCard lawyer={lawyerProfile} />
            </div>
          </div>

          {/* Suggested Profiles Section */}
          <div className="mt-8">
            <SimilarLawyers lawyerId={selectedLawyer?._id || username} />
          </div>
        </div>
      </div>
    </EditModalProvider>
  );
}
