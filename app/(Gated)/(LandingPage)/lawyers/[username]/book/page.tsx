"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { getLawyerByUsername } from "@/store/reducers/lawyerSlice";
import BookingHeader from "./_components/BookingHeader";
import BookingForm from "./_components/BookingForm";
import BookingSummary from "./_components/BookingSummary";

export default function BookConsultationPage() {

  //////////////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const { username } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);
  console.log('lawyer', lawyer);

  //////////////////////////////////////////////// STATES ///////////////////////////////////////////
  const [loading, setLoading] = useState(false);

  //////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////
  useEffect(() => {
    if (!lawyer?._id && username) {
      setLoading(true);
      dispatch(getLawyerByUsername({ username: username as string }))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, username, lawyer?._id]);

  //////////////////////////////////////////////// RENDER ///////////////////////////////////////
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl text-center pt-28">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl text-center pt-28">
        <p className="text-red-500">Lawyer information not available. Please go back and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28 max-w-6xl">
      <BookingHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <BookingForm />
        </div>
        <div className="lg:col-span-1">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
