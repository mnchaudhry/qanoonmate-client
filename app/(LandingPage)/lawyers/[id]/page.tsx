"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import LawyerBanner from "./_components/LawyerBanner";
import LawyerDetails from "./_components/LawyerDetails";
import ConsultationModule from "./_components/ConsultationModule";
import ReviewsSection from "./_components/ReviewsSection";
import RelatedInformation from "./_components/RelatedInformation";
import { getLawyerById } from "@/store/reducers/lawyerSlice";
import { RootState, AppDispatch } from "@/store/store";
import LawyerSkeleton from "./_components/LawyerSkeleton";
import LawyerNotFound from "./_components/LawyerNotFound";

export default function LawyerProfilePage() {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const { id }: { id: string } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedLawyer } = useSelector((state: RootState) => state.lawyer);

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const [loading, setLoading] = useState(false);
  const [lawyer, setLawyer] = useState(selectedLawyer || null);

  /////////////////////////////////////////////////////// USE EFFECTS /////////////////////////////////////////
  useEffect(() => {
    const fetchLawyerData = async () => {
      if (!id) return;

      console.log("Fetching lawyer details for ID:", id);
      setLoading(true);

      try {
        const resultAction = await dispatch(getLawyerById(id));

        // Check if we got the data
        if (getLawyerById.fulfilled.match(resultAction)) {
          console.log("Lawyer data fetched successfully:", resultAction.payload);

          // If payload is empty or undefined
          if (!resultAction.payload) {
            console.error("API returned empty lawyer data");
          }
        } else {
          console.error("Failed to fetch lawyer:", resultAction.error);
        }
      } catch (error) {
        console.error("Exception when fetching lawyer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerData();
  }, [dispatch, id]);
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
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <LawyerBanner lawyer={lawyer} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-2">
                  <LawyerDetails lawyer={lawyer} />
                  <div className="mt-8">
                    <ReviewsSection lawyer={lawyer} />
                  </div>
                  <div className="mt-8">
                    <RelatedInformation faqs={[]} guides={[]} laws={[]} />
                  </div>
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
