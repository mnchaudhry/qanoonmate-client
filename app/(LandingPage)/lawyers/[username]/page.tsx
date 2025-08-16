"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import LawyerBanner from "./_components/LawyerBanner";
import LawyerDetails from "./_components/LawyerDetails";
import ConsultationModule from "./_components/ConsultationModule";
import ReviewsSection from "./_components/ReviewsSection";
import RelatedInformation from "./_components/RelatedInformation";
import { getLawyerByUsername } from "@/store/reducers/lawyerSlice";
import { RootState, AppDispatch } from "@/store/store";
import LawyerNotFound from "./_components/LawyerNotFound";
import LawyerSkeleton from "@/components/skeletons/LawyerSkeleton";
import NavigationTabs, { TabId } from "./_components/NavigationTabs";
import ArticlesSection from "./_components/ArticlesSection";
import DocumentsSection from "./_components/DocumentsSection";
import ContactSection from "./_components/ContactSection";
import { getLawyerAvailability, getLawyerReviews } from "@/store/reducers/lawyerSlice";

export default function LawyerProfilePage() {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const { username }: { username: string } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedLawyer } = useSelector((state: RootState) => state.lawyer);

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const [loading, setLoading] = useState(false);
  const [lawyer, setLawyer] = useState(selectedLawyer || null);
  const [activeTab, setActiveTab] = useState<TabId>('about')

  /////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////
  useEffect(() => {
    const fetchLawyerData = async () => {
      if (!username) return;

      setLoading(true);

      try {
        const resultAction = await dispatch(getLawyerByUsername(username));

        // Check if we got the data
        if (getLawyerByUsername.fulfilled.match(resultAction)) {
          console.log("Lawyer data fetched successfully:", resultAction.payload);

          // If payload is empty or undefined
          if (!resultAction.payload) {
            console.error("API returned empty lawyer data");
          }
        } else {
          console.error("Failed to fetch lawyer:", resultAction.payload);
        }
        // Fetch additional data for tabs
        dispatch(getLawyerAvailability(username))
        dispatch(getLawyerReviews(username))

      } catch (error) {
        console.error("Exception when fetching lawyer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerData();
  }, [dispatch, username]);
  useEffect(() => {
    setLawyer(selectedLawyer)
  }, [selectedLawyer])


  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////
  return (
    <>
      {
        loading ? <LawyerSkeleton />
          : !lawyer ? <LawyerNotFound />
            :
            <div className="container mx-auto px-4 pt-24 py-8 max-w-6xl">
              <LawyerBanner lawyer={lawyer} />
              <div className="mt-6">
                <NavigationTabs activeTab={activeTab} onTabChange={(t: TabId) => setActiveTab(t)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <div className="md:col-span-2 space-y-6">
                  {activeTab === 'about' && (
                    <>
                      <LawyerDetails lawyer={lawyer} />
                      <RelatedInformation faqs={[]} guides={[]} laws={[]} />
                    </>
                  )}
                  {activeTab === 'reviews' && (
                    <ReviewsSection lawyer={lawyer} />
                  )}
                  {activeTab === 'blog' && (
                    <ArticlesSection articles={[]} />
                  )}
                  {activeTab === 'documents' && (
                    <DocumentsSection documents={[]} />
                  )}
                  {activeTab === 'contact' && (
                    <ContactSection email={lawyer.email} phone={lawyer.phone} />
                  )}
                </div>
                <div className="md:col-span-1">
                  <ConsultationModule lawyer={lawyer} />
                </div>
              </div>
            </div>
      }
    </>
  );
}
