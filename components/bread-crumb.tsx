"use client"

import React from 'react'
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { breadcrumbLabels } from '@/constants'

export default function Breadcrumbs() {

    //////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    //////////////////////////////////////////////////// FUNCTIONS ////////////////////////////////////////////////////
    const getBreadcrumbLabel = (segment: string) => {
        return breadcrumbLabels[segment as keyof typeof breadcrumbLabels] || segment.replace(/-/g, " ").toUpperCase()
    }

    //////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////
    if (segments.length === 0) return null
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Home Link */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1
                    const href = "/" + segments.slice(0, index + 1).join("/")
                    const label = getBreadcrumbLabel(segment)

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
