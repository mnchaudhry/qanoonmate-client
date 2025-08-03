import { BlogComment } from "@/store/types/api";
import Image from "next/image";
import React, { useState } from "react";

interface CommentsSectionProps {
  blogId: string;
  comments: BlogComment[];
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState(comments || []);
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    // TODO: Integrate with API
    setTimeout(() => {
      setCommentList([
        ...commentList,
        {
          user: { name: "You" },
          content: comment,
          createdAt: new Date().toISOString(),
        },
      ]);
      setComment("");
      setSubmitting(false);
    }, 500);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
          disabled={submitting || !comment.trim()}
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>
      <div className="space-y-6">
        {commentList.length === 0 && <div className="text-gray-500">No comments yet.</div>}
        {commentList.map((c) => (
          <div key={c.content} className="flex items-start gap-3">
            <Image
              src={c.user.avatar || "/public/general/bot-green.png"}
              alt={c.user.name}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border object-cover mt-1"
            />
            <div>
              <div className="font-semibold text-gray-900">{c.user.name}</div>
              <div className="text-gray-700 mb-1">{c.content}</div>
              <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 