import React from "react";
import { Clock } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  date: string;
  url: string;
  source?: string;
  image?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title, summary, date, url, source, image
}) => (
  <a
    href={url} target="_blank" rel="noopener noreferrer"
    className="
      block bg-white rounded-lg shadow-md hover:shadow-lg transition
      border border-gray-200 overflow-hidden
    "
    style={{ display: "flex", flexDirection: "column" }}
  >
    {image && (
      <div style={{ width: "100%", paddingTop: "56.25%", position: "relative" }}>
        <img
          src={image}
          alt={title}
          style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover"
          }}
        />
      </div>
    )}
    <div style={{ padding: "16px", flex: "1 0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", color: "#6b7280", fontSize: "12px", marginBottom: "8px" }}>
        <Clock className="w-3 h-3" />
        <span style={{ marginLeft: "4px" }}>{date}</span>
        {source && (
          <>
            <span style={{ margin: "0 4px" }}>•</span>
            <span style={{ fontWeight: 500 }}>{source}</span>
          </>
        )}
      </div>
      <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 8px 0", lineHeight: 1.2 }}>
        {title}
      </h3>
      <p style={{ fontSize: "16px", color: "#4b5563", margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {summary}
      </p>
    </div>
  </a>
);

export default NewsCard;
