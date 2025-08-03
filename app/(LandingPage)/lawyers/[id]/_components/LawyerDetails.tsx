"use client";

import { Lawyer } from "@/store/types/lawyer.types";

export default function LawyerDetails({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
      {/* About Me Section */}
      <section className="mb-6 py-0 ">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
          About Me
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          {lawyer.bio || "No bio information available."}
        </p>
      </section>

      {/* License & Identity Section */}
      <section className="mb-6 py-0 ">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
          License & Identity
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>CNIC: {lawyer.cnic || "••••••••••••"}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>License Number: {lawyer.licenseNumber || "Not provided"}</span>
          </li>
          {lawyer.isVerified && (
            <li className="flex items-center gap-2 text-green-600">
              <span className="text-gray-500">•</span>
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified by VerdictAI
              </span>
            </li>
          )}
        </ul>
      </section>

      {/* Experience & Practice Section */}
      <section className="mb-6 py-0 ">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
          Experience & Practice
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>Experience: {lawyer.experience || 0} years</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>
              Areas of Practice: {lawyer.specializations?.join(", ") || "Not specified"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>Jurisdictions: {lawyer.jurisdictions?.join(", ") || lawyer.location?.province || "Not specified"}</span>
          </li>
          {lawyer.primarySpecialization && (
            <li className="flex items-center gap-2">
              <span className="text-gray-500">•</span>
              <span>Primary Specialization: {lawyer.primarySpecialization}</span>
            </li>
          )}
        </ul>
      </section>

      {/* Languages Section */}
      <section className="py-0" >
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
          Languages
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <span>{lawyer.languages?.join(", ") || "English"}</span>
          </li>
        </ul>
      </section>

      {/* Education Section */}
      {lawyer.education && lawyer.education.length > 0 && (
        <section className="py-0" >
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
            Education
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {lawyer.education.map((edu, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-gray-500">•</span>
                <span>{edu}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications Section */}
      {lawyer.certifications && lawyer.certifications.length > 0 && (
        <section className="py-0" >
          <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">
            Certifications & Training
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {lawyer.certifications.map((cert, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-gray-500">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
