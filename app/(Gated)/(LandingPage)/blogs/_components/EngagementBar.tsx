import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface EngagementBarProps {
  blog: {
    _id: string;
    likes?: number;
    likedByUser?: boolean;
    comments?: any[];
  };
}

export default function EngagementBar({ blog }: EngagementBarProps) {
  const [liked, setLiked] = useState(blog.likedByUser || false);
  const [likes, setLikes] = useState(blog.likes || 0);

  const handleLike = async () => {
    // TODO: Integrate with API
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-8 py-4 border-b border-muted/20 mb-8">
      <button
        className={`flex items-center gap-2 text-lg font-medium transition-colors ${liked ? "text-primary" : "text-gray-500 hover:text-primary"}`}
        onClick={handleLike}
        aria-label="Like this blog"
      >
        <Heart fill={liked ? "#22c55e" : "none"} className="w-5 h-5" />
        {likes}
      </button>
      <div className="flex items-center gap-2 text-gray-500">
        <MessageCircle className="w-5 h-5" />
        {blog.comments?.length || 0}
      </div>
      <button
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
        onClick={handleShare}
        aria-label="Share this blog"
      >
        <Share2 className="w-5 h-5" />
        Share
      </button>
    </div>
  );
} 