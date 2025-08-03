import Image from "next/image";
import React from "react";

interface AuthorInfoProps {
  author?: {
    name?: string;
    avatar?: string;
    bio?: string;
    firstname?: string;
    lastname?: string;
    profilePicture?: string;
  };
  createdAt?: string;
}

export default function AuthorInfo({ author, createdAt }: AuthorInfoProps) {
  // Fallbacks for seed blogs with no author
  const displayName = author?.name || (author?.firstname && author?.lastname ? `${author.firstname} ${author.lastname}` : "VerdictAI Team");
  const avatar = author?.avatar || author?.profilePicture || "/public/general/bot-green.png";
  const bio = author?.bio || "Legal content by VerdictAI";

  return (
    <div className="flex items-center gap-4 mb-8 mt-2">
      <Image
        src={avatar}
        alt={displayName}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full border object-cover"
      />
      <div>
        <div className="font-semibold text-lg text-gray-900">{displayName}</div>
        {bio && <div className="text-sm text-gray-500">{bio}</div>}
        {createdAt && (
          <div className="text-xs text-gray-400 mt-1">
            Published on {new Date(createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
} 