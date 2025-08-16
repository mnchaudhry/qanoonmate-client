'use client'

import React from 'react'
import LandingPageHeader from '../_components/LandingPageHeader'
import Blogs from './_components/Blogs'
import News from './_components/News'

const BlogsAndNews = () => {

    return (
        <section className="relative bg-background antialiased min-h-screen !pt-0">

            <LandingPageHeader
                title="Blogs"
                description="Explore our collection of insightful blogs covering various topics, including legal updates, case studies, and expert opinions."
            />

            <div className="container mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                <Blogs />
                <News />
            </div>

        </section>
    )
}

export default BlogsAndNews
