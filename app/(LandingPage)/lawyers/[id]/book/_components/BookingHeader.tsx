"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function BookingHeader() {

  ///////////////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////////////////////////
  const { selectedLawyer: lawyer } = useSelector((state: RootState) => state.lawyer);
  const fullName = `${lawyer?.firstname} ${lawyer?.lastname}`;

  ///////////////////////////////////////////////////////// RENDER ///////////////////////////////////////////////////////////////
  return (
    <div className="mb-8">
      <Link
        href={`/lawyers/${lawyer?.username}`}
        className="flex items-center text-primary hover:underline mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to lawyer profile
      </Link>

      <div className="flex items-center">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
          <Image
            src={lawyer?.profilePicture || "/placeholder-lawyer.png"}
            alt={'fullName'}
            fill
            className="object-cover"
          />
        </div>

        <div className="ml-4">
          <h1 className="text-2xl font-bold">
            Book Consultation with {fullName}
          </h1>
          <p className="text-gray-600">
            {lawyer?.specializations?.join(", ") || "Legal Professional"}
          </p>
        </div>
      </div>
    </div>
  );
}
