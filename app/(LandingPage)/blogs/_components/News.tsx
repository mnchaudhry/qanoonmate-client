import React, { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";

interface NewsItem {
  title: string;
  summary: string;
  date: string;
  url: string;
  source?: string;
  image?: string;
}

const News = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=Pakistan%20law&country=pk&lang=en&max=20&nullable=image&apikey=f469f54797e777cd2433cda4827aa52c`
      );
      const data = await res.json();
      const items = (data.articles || []).map((a: any) => ({
        title: a.title,
        summary: a.description || "",
        date: new Date(a.publishedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        url: a.url,
        source: a.source?.name,
        image: a.image,
      }));
      setNewsItems(items.length ? items : fallback());
    } catch {
      setNewsItems(fallback());
    }
  };

  const fallback = (): NewsItem[] => [
    {
      title: "Supreme Court of Pakistan Issues Landmark Ruling",
      summary: "The Supreme Court ruled on a major constitutional case affecting governance.",
      date: "Aug 17, 2025",
      url: "https://example.com/news/supreme-court",
      source: "Example News",
      image: "https://via.placeholder.com/600x337",
    },
    {
      title: "High Court Addresses New Legal Challenge",
      summary: "A new petition has been filed challenging the recent legal reforms.",
      date: "Aug 16, 2025",
      url: "https://example.com/news/high-court",
      source: "Legal Times",
      image: "https://via.placeholder.com/600x337",
    },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      setVisibleCount((prev) => Math.min(prev + 5, newsItems.length));
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#f9fafb",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        maxHeight: "600px",
        overflowY: "auto",
      }}
      onScroll={handleScroll}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <Newspaper className="text-green-600 w-5 h-5" />
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 600,
            margin: "0 0 0 8px",
            color: "#111827",
          }}
        >
          Legal News
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {newsItems.slice(0, visibleCount).map((item, idx) => (
          <NewsCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
};

export default News;
