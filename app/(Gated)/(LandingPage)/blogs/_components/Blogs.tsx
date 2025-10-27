"use client";

import { Search, PenTool } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import BlogCard from "./BlogCard";
import BlogFilters from "./BlogFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Blogs = () => {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [blogs, setBlogs] = useState<any[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
        setIsLoading(false);
    }, []);

    const filterBlogs = useCallback(() => {
        let filtered = blogs;
        if (search.trim()) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(search.toLowerCase()) ||
                    blog.content.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedCategory !== "all") {
            filtered = filtered.filter((blog) =>
                blog.tags?.includes(selectedCategory)
            );
        }
        setFilteredBlogs(filtered);
    }, [blogs, search, selectedCategory]);

    useEffect(() => {
        filterBlogs();
    }, [blogs, search, selectedCategory, filterBlogs]);

    const handleWriteBlog = () => {
        router.push("/blogs/write");
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    if (isLoading) {
        return (
            <div className="md:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="h-10 bg-muted animate-pulse rounded-lg w-64"></div>
                    <div className="h-10 bg-muted animate-pulse rounded-lg w-32"></div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-96 bg-muted animate-pulse rounded-2xl"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="md:col-span-2 space-y-6">
            {/* Header */}
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

            {/* Filters */}
            <BlogFilters
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            <div className="text-sm text-muted-foreground">
                {filteredBlogs.length} blog
                {filteredBlogs.length !== 1 ? "s" : ""} found
            </div>

            {/* Blog Cards */}
            <div className="space-y-6">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog) => (
                        <Link
                            key={blog._id}
                            href={blog.slug}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BlogCard blog={blog} />
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No blogs found</h3>
                        <p className="text-sm">
                            {search || selectedCategory !== "all"
                                ? "Try adjusting your search or filters"
                                : "No LinkedIn articles found"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;

// -----------------------------------------------------------------------------
// Embedded LinkedIn Blogs Data (22 Articles)
// -----------------------------------------------------------------------------

const blogsData = [
    {
        "_id": "1",
        "title": "Legal Implications of Digital Signatures in Pakistan",
        "slug": "https://www.linkedin.com/pulse/legal-implications-digital-signatures-pakistan-qanoonmate-j3xje/?trackingId=Hbkjf6XMwn5VbIbGmiWdYg%3D%3D",
        "content": "This article outlines how Pakistan’s Electronic Transactions Ordinance 2002 gives digital signatures legal validity. Secure e-signatures, regulated by PTA and Certification Service Providers, now carry the same weight as paper contracts.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGCflFqr85Zrw/article-cover_image-shrink_720_1280/B4EZlmGb2PKoAI-/0/1758354588229?e=1762992000&v=beta&t=dfqp-YRSeAdBJio7qjsQ6ZUBq_3f-f5o-r5cbHTS3i4",
        "createdAt": "2025-09-20",
        "tags": ["Legal Tech"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "2",
        "title": "Public Interest Litigation and Constitutional Petitions in Pakistan: Safeguarding Rights Through Judicial Intervention",
        "slug": "https://www.linkedin.com/pulse/public-interest-litigation-constitutional-petitions-pakistan-mdexe/?trackingId=CNlRfvps6wqW7Enz9a8GGg%3D%3D",
        "content": "Public interest litigation and constitutional petitions have become powerful tools to enforce fundamental rights. This article explains how PIL has shaped environmental law, education, healthcare, and social justice.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQF2r3WIZFwusw/article-cover_image-shrink_720_1280/B4EZlmF2wAKcAI-/0/1758354435784?e=1762992000&v=beta&t=IUfOFoZ49Qxpdd5PhraM-tKcwXJ2sEV-ROUQo83QvMM",
        "createdAt": "2025-09-19",
        "tags": ["Constitutional Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "3",
        "title": "Enforceability of Foreign Judgments in Pakistan: A Practical Overview",
        "slug": "https://www.linkedin.com/pulse/enforceability-foreign-judgments-pakistan-practical-overview-35she/?trackingId=YOAekcSfWHBF4cbBLjk3VQ%3D%3D",
        "content": "Foreign judgments under Section 13 CPC are recognized but rarely enforced without domestic scrutiny. This article analyzes the enforcement process, challenges, and recommendations for reform.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFPUfHiaYEn9A/article-cover_image-shrink_600_2000/B4EZlmE5KcHEAQ-/0/1758354183899?e=1762992000&v=beta&t=XVXjYivxYTHobitYPJmq6aG1l7rhQn0ppTONKOemTNI",
        "createdAt": "2025-09-18",
        "tags": ["International Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    },
    {
        "_id": "4",
        "title": "Banking and Finance Regulatory Framework in Pakistan: Strengthening Stability and Trust",
        "slug": "https://www.linkedin.com/pulse/banking-finance-regulatory-framework-pakistan-strengthening-zhgte/?trackingId=Wxr1nI9ATt3mecjDPaW8tQ%3D%3D",
        "content": "Explores SBP’s oversight, Basel III reforms, FATF compliance, and digital finance evolution — emphasizing stability and governance in Pakistan’s financial sector.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQHU8FgblkihZg/article-cover_image-shrink_600_2000/B4EZlmEVG9GYAQ-/0/1758354036049?e=1762992000&v=beta&t=NV1PA_Y7wS6BmF_nNKDal3lwTDXQfzOp9d2Q-sCc0xs",
        "createdAt": "2025-09-17",
        "tags": ["Banking Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    },
    {
        "_id": "5",
        "title": "Money Laundering Laws and Financial Compliance in Pakistan: An Evolving Framework",
        "slug": "https://www.linkedin.com/pulse/money-laundering-laws-financial-compliance-pakistan-evolving-hofue/?trackingId=nhWZYCSZaP5m29E%2BVHNvXA%3D%3D",
        "content": "Pakistan’s AML framework post-FATF includes stricter KYC/CDD norms, AML Act 2010, and FMU oversight — ensuring greater compliance and transparency.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQH7tsRwjm6E3Q/article-cover_image-shrink_720_1280/B4EZlmDIgsGoAI-/0/1758353723508?e=1762992000&v=beta&t=XfBGQYerTj7uHJm1VzE1RrGFs-tniUJo7BzI5rEIi18",
        "createdAt": "2025-09-16",
        "tags": ["Financial Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 6,
        "comments": []
    },
    {
        "_id": "6",
        "title": "Succession and Inheritance Law in Islam and Pakistan",
        "slug": "https://www.linkedin.com/pulse/succession-inheritance-law-islam-pakistan-qanoonmate-httle/?trackingId=Hx7yGdG8RJaCibg7yV1J%2FQ%3D%3D",
        "content": "Discusses inheritance disputes under Islamic law and Pakistani statutes, highlighting NADRA’s digitized succession certificates and Family Law reforms.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQESNSbzAZhCkw/article-cover_image-shrink_423_752/B4EZlJrGgyIQAY-/0/1757877660270?e=1762992000&v=beta&t=K7k30aHlIm7Zr7zGuRF8NXaiEGJxhdKq9oHL5Wq6Nns",
        "createdAt": "2025-09-15",
        "tags": ["Family Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 3,
        "comments": []
    },
    {
        "_id": "7",
        "title": "Child Custody and Guardianship Regulations in Pakistan: A Comprehensive Overview",
        "slug": "https://www.linkedin.com/pulse/child-custody-guardianship-regulations-pakistan-comprehensive-gus3e/?trackingId=k%2B%2BwLW0qsUkGhDBiyb2wAg%3D%3D",
        "content": "Explains child custody laws, guardianship principles of hizanat and wilayat, and how courts prioritize the child’s welfare above all.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQEAxYdgu_iPPQ/article-cover_image-shrink_720_1280/B4EZlJqOP5KsAI-/0/1757877430795?e=1762992000&v=beta&t=m-DPfsDtd3TmSPI5grBP3AzFGsmboKipmho1QZA-3UY",
        "createdAt": "2025-09-14",
        "tags": ["Family Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "8",
        "title": "Family Law and Divorce Proceedings in Pakistan: A Comprehensive Overview",
        "slug": "https://www.linkedin.com/pulse/family-law-divorce-proceedings-pakistan-comprehensive-overview-xompe/?trackingId=ZP4%2F%2FgogEHkpmXdUJ%2FbG4g%3D%3D",
        "content": "Covers divorce, khula, and reconciliation procedures under Muslim Family Laws Ordinance — emphasizing gender rights and legal remedies.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFUmo8uJ4mMKg/article-cover_image-shrink_720_1280/B4EZlJpX2dGwAI-/0/1757877207303?e=1762992000&v=beta&t=I06RVDFFofqZphjdAPxBhPPxdraJQXBZMf2xnL-rBtg",
        "createdAt": "2025-09-13",
        "tags": ["Family Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    },
    {
        "_id": "9",
        "title": "Drafting Legally Enforceable Agreements: Why Precision Matters",
        "slug": "https://www.linkedin.com/pulse/drafting-legally-enforceable-agreements-why-precision-matters-n4yne/?trackingId=c6Qbr00kAfbBa9ZxGsUOdg%3D%3D",
        "content": "Outlines how clear, precise contracts minimize disputes and improve enforceability under Pakistan’s Contract Act and related precedents.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQHX0s289juIeA/article-cover_image-shrink_180_320/B4EZlJn7mqIMAY-/0/1757876829096?e=1762992000&v=beta&t=0D7PYKy0ZtRLAddJp0LAExXA6GLTJFeHgxZvq2i7URU",
        "createdAt": "2025-09-12",
        "tags": ["Contract Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    },
    {
        "_id": "10",
        "title": "The Role of Precedent in Pakistani Jurisprudence",
        "slug": "https://www.linkedin.com/pulse/role-precedent-pakistani-jurisprudence-qanoonmate-ov82e/?trackingId=hHrn7XnipDGjkwGZ3Kjj0w%3D%3D",
        "content": "Analyzes how Supreme Court and High Court rulings establish binding authority, ensuring stability and predictability in the justice system.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGNBGeYC1liSg/article-cover_image-shrink_720_1280/B4EZlJnHxDKYAI-/0/1757876618944?e=1762992000&v=beta&t=VuD0isSosOpg0OGNwyVi1INEm_a8g69ntoQPlIBBvkI",
        "createdAt": "2025-09-11",
        "tags": ["Judicial Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 2,
        "comments": []
    },
    {
        "_id": "11",
        "title": "Alternative Dispute Resolution Mechanisms: A Growing Necessity in Pakistan’s Legal Landscape",
        "slug": "https://www.linkedin.com/pulse/alternative-dispute-resolution-mechanisms-growing-necessity-sbqie/?trackingId=B0MKKchZ3j5n74vv3%2F%2FImQ%3D%3D",
        "content": "Highlights the role of arbitration, mediation, and conciliation in reducing backlog and offering faster, cost-effective justice.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGR8OwzjMQXyw/article-cover_image-shrink_600_2000/B4EZlJmW1oGUAQ-/0/1757876416399?e=1762992000&v=beta&t=L1YiksXJH_0LbMelyIEQPS23ZYpQRd8IT7K9EuBWCnw",
        "createdAt": "2025-09-10",
        "tags": ["ADR"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 7,
        "comments": []
    },
    {
        "_id": "12",
        "title": "Employment Contracts and Workplace Regulations in Pakistan: Navigating Compliance and Protecting Rights",
        "slug": "https://www.linkedin.com/pulse/employment-contracts-workplace-regulations-pakistan-navigating-gvdee/?trackingId=nflSGh%2BYwp8bdDd%2FCsPhHw%3D%3D",
        "content": "Explains legal requirements for employment contracts, wages, and employee protection under the Standing Orders Ordinance 1968.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFFjvdKK4Ja2A/article-cover_image-shrink_720_1280/B4EZlJj5VaKwAI-/0/1757875771544?e=1762992000&v=beta&t=Onsk53mkJG_dEmShWdQMK-r_deBDmQrdzaSVzzgUGlM",
        "createdAt": "2025-09-09",
        "tags": ["Labor Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "13",
        "title": "Taxation Law Compliance for Businesses in Pakistan: A Strategic Imperative",
        "slug": "https://www.linkedin.com/pulse/taxation-law-compliance-businesses-pakistan-strategic-imperative-fqeke/?trackingId=XmZO6Uk5HN0PJ1XsoWvh%2Fw%3D%3D",
        "content": "Covers income, sales, and withholding tax obligations — with insights into FBR enforcement and Finance Act reforms.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFexaODkIOZog/article-cover_image-shrink_423_752/B4EZlJipkAGUAU-/0/1757875444556?e=1762992000&v=beta&t=qDRSnj-WEmDlQUzrEjmcT-84GpwhMu25x_pTSLA9AVk",
        "createdAt": "2025-09-08",
        "tags": ["Tax Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    },
    {
        "_id": "14",
        "title": "Electronic Evidence and Admissibility in Court",
        "slug": "https://www.linkedin.com/pulse/electronic-evidence-admissibility-court-qanoonmate-aqkne/?trackingId=BQgaJ4jvCPKELzvagJ9FlQ%3D%3D",
        "content": "Explores admissibility of WhatsApp messages, emails, and CCTV footage under QSO 1984 and PECA 2016, redefining modern litigation.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGmb7hnFstPlQ/article-cover_image-shrink_423_752/B4EZkzIyWVGwAU-/0/1757499566900?e=1762992000&v=beta&t=UFhHFHkaGQMHS-WKaHDO_XNguOBt3-aZevE-pVGz9HM",
        "createdAt": "2025-09-07",
        "tags": ["Cyber Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 3,
        "comments": []
    },
    {
        "_id": "15",
        "title": "Legal Aspects of Real Estate Transactions: What Professionals Must Know",
        "slug": "https://www.linkedin.com/pulse/legal-aspects-real-estate-transactions-what-professionals-must-zjave/?trackingId=9soY6c35%2FdYl76KlX8ycvQ%3D%3D",
        "content": "Outlines title verification, registration, dispute resolution, and compliance essentials for real estate professionals.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGo7bIXaf_IRw/article-cover_image-shrink_720_1280/B4EZkzH7DDGUAM-/0/1757499357371?e=1762992000&v=beta&t=HE9fSmQAI5UceKOkJOFqEbIhUl7moGkVEDWAtPKe3kE",
        "createdAt": "2025-09-06",
        "tags": ["Property Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 6,
        "comments": []
    },
    {
        "_id": "16",
        "title": "Consumer Protection Rights and Remedies in Pakistan",
        "slug": "https://www.linkedin.com/pulse/consumer-protection-rights-remedies-pakistan-qanoonmate-m4yme/?trackingId=%2B4ggw2w5LyHKwYNaNkuo7Q%3D%3D",
        "content": "Explains remedies under consumer laws, emphasizing redress mechanisms against deceptive practices and defective products.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQHqUE_F89GW1g/article-cover_image-shrink_720_1280/B4EZkzHGAAIMAI-/0/1757499122350?e=1762992000&v=beta&t=Lb_POqAdhKl8Uzcc-EaBrYoWhuAM6vyllwoQXMq_Mds",
        "createdAt": "2025-09-05",
        "tags": ["Consumer Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "17",
        "title": "Corporate Governance under Pakistani Company Law",
        "slug": "https://www.linkedin.com/pulse/corporate-governance-under-pakistani-company-law-qanoonmate-u5v4e/?trackingId=0J35uXXvnEXR11wc0wo04w%3D%3D",
        "content": "Discusses SECP oversight, fiduciary duties, transparency, and shareholder protection under the Companies Act 2017.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQHzGn9lehGKmQ/article-cover_image-shrink_720_1280/B4EZkzGNuOIoAI-/0/1757498894527?e=1762992000&v=beta&t=sCQ9dNCRHrFNGELZoLAu7Czu_tvFb5j2rTyrdICpuNA",
        "createdAt": "2025-09-04",
        "tags": ["Corporate Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 3,
        "comments": []
    },
    {
        "_id": "18",
        "title": "Intellectual Property Protection for Startups",
        "slug": "https://www.linkedin.com/pulse/intellectual-property-protection-startups-qanoonmate-uvche/?trackingId=RL4e1BWjb5TS9JoFt3Tb7g%3D%3D",
        "content": "Outlines IP protection strategies for founders covering copyrights, trademarks, and patents essential for innovation.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFp5jUHxVj6-w/article-cover_image-shrink_720_1280/B4EZkzEu54KoAQ-/0/1757498533738?e=1762992000&v=beta&t=3Acwhb_YQyWPW-HnIhDnJT5tHaZOx8mcmrvEErPEwCY",
        "createdAt": "2025-09-03",
        "tags": ["IP Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 7,
        "comments": []
    },
    {
        "_id": "19",
        "title": "Cybercrime Laws and Enforcement in Pakistan",
        "slug": "https://www.linkedin.com/pulse/cybercrime-laws-enforcement-pakistan-qanoonmate-fxyue/?trackingId=U8a2UDQyXZ7gmAd1C8Gmkw%3D%3D",
        "content": "Explains PECA 2016, FIA enforcement, and modern digital crime challenges including online harassment and data breaches.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGk0ydY0-g3Mg/article-cover_image-shrink_600_2000/B4EZkzCfOzGYAQ-/0/1757497914973?e=1762992000&v=beta&t=ieSTUuYcqTZsUiQBwoenC0-wS4HHsA3gktz7zuX-Qcs",
        "createdAt": "2025-09-02",
        "tags": ["Cyber Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "20",
        "title": "Arbitration vs. Litigation in Commercial Disputes: Choosing the Right Path for Businesses",
        "slug": "https://www.linkedin.com/pulse/arbitration-vs-litigation-commercial-disputes-choosing-right-f2jke/?trackingId=4VTYjGrEtYvDRxAjW1TPDA%3D%3D",
        "content": "Compares arbitration and litigation for business disputes — analyzing speed, confidentiality, and enforceability factors.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQH1I6Kp96mzAw/article-cover_image-shrink_720_1280/B4EZkoYwQ_KcAI-/0/1757319202644?e=1762992000&v=beta&t=auN7RUNJIAu6VeE3DJOr74hO2QfL1WVMLgK7RKMTG5Q",
        "createdAt": "2025-09-01",
        "tags": ["ADR"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 6,
        "comments": []
    },
    {
        "_id": "21",
        "title": "Fundamental Rights in Pakistan",
        "slug": "https://www.linkedin.com/pulse/fundamental-rights-pakistan-qanoonmate-yqzpe/?trackingId=yRH%2BbO508wsvZBKg3%2F5vNQ%3D%3D",
        "content": "Explains constitutional guarantees like equality, freedom, dignity, and justice under Articles 8–28, ensuring citizens’ fundamental rights are judicially protected.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQFLHdBqlu6Yrg/article-cover_image-shrink_423_752/B4EZkaUwGlIoAU-/0/1757083276410?e=1762992000&v=beta&t=lij5qJt2prNW-yrQyKq_Nekf9ejk3RjgB8C0-k1oarY",
        "createdAt": "2025-08-31",
        "tags": ["Constitutional Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 5,
        "comments": []
    },
    {
        "_id": "22",
        "title": "Evolution of Contract Law in Pakistan",
        "slug": "https://www.linkedin.com/pulse/evolution-contract-law-pakistan-qanoonmate-rpage/?trackingId=l33enoG%2Ft9S4WOIQxcMLjw%3D%3D",
        "content": "Analyzes Pakistan’s contract law based on the Indian Contract Act 1872 — its modern interpretation, key doctrines, and evolving enforcement landscape.",
        "featuredImage": "https://media.licdn.com/dms/image/v2/D4E12AQGheWcVjJpi7g/article-cover_image-shrink_720_1280/B4EZkZbSklGYAI-/0/1757068209449?e=1762992000&v=beta&t=hVisikKFK_9yMxLr9rQnp1dwCDy1WQNYZjBwSPd7wkI",
        "createdAt": "2025-08-30",
        "tags": ["Contract Law"],
        "author": { "firstname": "QanoonMate", "lastname": "" },
        "likes": 4,
        "comments": []
    }
];