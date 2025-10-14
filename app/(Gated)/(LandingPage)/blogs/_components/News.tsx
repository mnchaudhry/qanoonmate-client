import React, { useState, useEffect, useCallback } from "react";
import { Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";
import { NEWS_API_URL } from "@/constants";

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

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(NEWS_API_URL);
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
  }, []);
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);


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
      className="bg-popover py-2! px-4! rounded-lg border border-border max-h-screen overflow-y-auto "
      onScroll={handleScroll}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <Newspaper className="text-green-600 w-5 h-5" />
        <h2
          className="text-2xl font-semibold ml-2 text-foreground/90">
          Legal News
        </h2>
      </div>
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", }}
      >
        {newsItems.slice(0, visibleCount).map((item, idx) => (
          <NewsCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
};

export default News;
