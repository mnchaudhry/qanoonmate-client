import React, { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, Clock, BookOpen } from 'lucide-react'
import { blogs as defaultBlogs } from '@/constants'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface NewsItem {
    title: string
    summary: string
    date: string
    category?: string
}

interface RecommendedBlog {
    _id: string
    title: string
    summary: string
    date: string
    tag?: string
    slug: string
    author: {
        firstname: string
        lastname: string
    }
    likes: number
}

const News = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<'news' | 'recommended'>('news')
    const [recommendedBlogs, setRecommendedBlogs] = useState<RecommendedBlog[]>([])
    const [newsItems, setNewsItems] = useState<NewsItem[]>([])

    useEffect(() => {
        fetchNews()
        fetchRecommendedBlogs()
    }, [])

    useEffect(() => {
        if (user) {
            fetchRecommendedBlogs()
        }
    }, [user])

    const fetchNews = async () => {
        try {
            const keywords = [
                "Supreme Court",
                "High Court",
                "FIR",
                "military law",
                "constitution",
                "NAB",
                "lawyers",
                "bar council",
                "judiciary",
                "legal news",
                "legal updates",
                "legal reforms",
                "legal rights",
                "legal system",
                "Pakistan law",
                "legal issues",
                "legal challenges",
            ]
            const query = keywords.join(" OR ")
            const res = await fetch(
                `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&country=pk&lang=en&token=f469f54797e777cd2433cda4827aa52c`
            )
            const data = await res.json()

            if (data.articles) {
                setNewsItems(
                    data.articles.map((a: any) => ({
                        title: a.title,
                        summary: a.description,
                        date: a.publishedAt,
                        category: "Legal"
                    }))
                )
            }
        } catch (error) {
            console.log("error fetching news:", error)
            setNewsItems(
                defaultBlogs.slice(0, 5).map((blog: any) => ({
                    title: blog.title,
                    summary: blog.summary,
                    date: blog.date,
                    category: blog.tag || blog.category
                }))
            )
        }
    }

    const fetchRecommendedBlogs = () => {
        const shuffled = defaultBlogs.sort(() => 0.5 - Math.random())
        setRecommendedBlogs(shuffled.slice(0, 5).map((blog, index) => ({
            _id: `recommended-${index}`,
            ...blog,
            author: { firstname: 'Professor', lastname: 'Mani' },
            likes: Math.floor(Math.random() * 50) + 10
        })))
    }

    const getRecommendedNews = () => {
        if (!user) return newsItems
        return newsItems
    }

    return (
        <aside className="w-full bg-white rounded-2xl p-6 shadow-md border border-muted/20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {activeTab === 'news' ? (
                        <Newspaper className="text-green-600 w-5 h-5" />
                    ) : (
                        <TrendingUp className="text-green-600 w-5 h-5" />
                    )}
                    <h3 className="text-2xl font-semibold text-foreground">
                        {activeTab === 'news' ? 'Latest Legal Updates' : 'Recommended for You'}
                    </h3>
                </div>

                <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`px-3 py-1 rounded-md text-sm transition ${activeTab === 'news'
                            ? 'bg-white text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        News
                    </button>
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`px-3 py-1 rounded-md text-sm transition ${activeTab === 'recommended'
                            ? 'bg-white text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Recommended
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                {activeTab === 'news' ? (
                    getRecommendedNews().map((item, index) => (
                        <div
                            key={index}
                            className="border-l-4 bg-card border-green-600 pl-4 py-3 hover:bg-muted/50 transition rounded-md cursor-pointer"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                                {item.category && (
                                    <>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-xs text-green-600 font-medium">{item.category}</span>
                                    </>
                                )}
                            </div>
                            <h5 className="text-md font-semibold text-foreground mb-1 leading-tight">{item.title}</h5>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                        </div>
                    ))
                ) : (
                    recommendedBlogs.length > 0 ? (
                        recommendedBlogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="border-l-4 bg-card border-blue-600 pl-4 py-3 hover:bg-muted/50 transition rounded-md cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <BookOpen className="w-3 h-3 text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">{blog.date}</p>
                                    {blog.tag && (
                                        <>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-xs text-blue-600 font-medium">{blog.tag}</span>
                                        </>
                                    )}
                                </div>
                                <h5 className="text-md font-semibold text-foreground mb-1 leading-tight">{blog.title}</h5>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{blog.summary}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>By {blog.author.firstname} {blog.author.lastname}</span>
                                    <span>{blog.likes} likes</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No recommendations available</p>
                            <p className="text-xs mt-1">Try reading more blogs to get personalized recommendations</p>
                        </div>
                    )
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-muted/30">
                <button className="w-full text-sm text-green-600 hover:text-green-700 font-medium transition">
                    {activeTab === 'news' ? 'View All Legal News' : 'View All Recommendations'}
                </button>
            </div>
        </aside>
    )
}

export default News 
