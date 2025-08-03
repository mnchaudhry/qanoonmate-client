import { Search, PenTool } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BlogCard from './BlogCard'
import BlogFilters from './BlogFilters'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchBlogs } from '@/store/reducers/blogSlice';
import { Blog } from '@/store/types/api'

const Blogs = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const dispatch = useDispatch();
    const { blogs, loading: isLoading } = useSelector((state: RootState) => state.blog);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])

    useEffect(() => {
        dispatch(fetchBlogs() as any)
    }, [dispatch])

    const filterBlogs = useCallback(() => {
        let filtered = blogs

        // Filter by search
        if (search.trim()) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.content.toLowerCase().includes(search.toLowerCase()) ||
                blog.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            )
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(blog => blog.tags?.includes(selectedCategory))
        }

        setFilteredBlogs(filtered)
    }, [blogs, search, selectedCategory])

    useEffect(() => {
        filterBlogs()
    }, [blogs, search, selectedCategory, filterBlogs])

    const handleWriteBlog = () => {
        if (user) {
            router.push('/blogs/write')
        } else {
            router.push('/auth/sign-in?redirect=/blogs/write')
        }
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
    }

    if (isLoading) {
        return (
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-10 bg-muted animate-pulse rounded-lg w-64"></div>
                    <div className="h-10 bg-muted animate-pulse rounded-lg w-32"></div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-96 bg-muted animate-pulse rounded-2xl"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="md:col-span-2 space-y-6">
            {/* Header with Search and Write Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search Blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 pr-10 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none transition"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        <Search size={20} />
                    </span>
                </div>
                <Button
                    onClick={handleWriteBlog}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                    <PenTool size={18} />
                    Write Blog
                </Button>
            </div>

            {/* Category Filters */}
            <BlogFilters
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
                {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''} found
            </div>

            {/* Blog Cards */}
            <div className="space-y-6">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <BlogCard
                            key={blog._id}
                            id={blog._id}
                            date={blog.createdAt}
                            imageUrl={blog.featuredImage || '/default-blog-image.jpg'}
                            slug={blog.slug}
                            summary={blog.content.slice(0, 150) + '...'}
                            tag={blog.tags?.[0] || ''}
                            title={blog.title}
                            author={`${blog.author.firstname} ${blog.author.lastname}`}
                            likes={blog.likes}
                            comments={blog.comments.length}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            <Search size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No blogs found</h3>
                            <p className="text-sm">
                                {search || selectedCategory !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'No blogs available at the moment'
                                }
                            </p>
                        </div>
                        {(search || selectedCategory !== 'all') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearch('')
                                    setSelectedCategory('all')
                                }}
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Blogs