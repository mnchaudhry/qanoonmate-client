"use client"

import React, { useState } from 'react';
import { Calendar, Phone, Search, Video, } from 'lucide-react';
import Link from 'next/link';
import { Lawyer1 } from '@/constants/images';
import SectionHeading from './SectionHeading';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Consultations: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <section className="bg-surface">

            <div className="container px-4 mx-auto max-w-7xl md:px-6">

                <SectionHeading
                    title='Our Legal Experts'
                    topTitle='Book a Consultation with Legal Experts'
                    description='Find the best lawyers for your case. Search by expertise, location, and available time slots. Book in-person, phone, or video consultations easily.'
                />

                {/* Search Bar */}
                <div className="flex justify-center mb-10 relative ">
                    <div className="relative max-w-md w-full ">
                        <input
                            type="text"
                            placeholder="Search for lawyers, specialties, or locations"
                            className="px-6 py-2 w-full rounded-lg border-2 border-primaru text-foreground focus:ring-primary "
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className='absolute top-1/2 right-4 text-primary transform -translate-y-1/2 ' />
                    </div>
                </div>

                {/* Filter Options */}
                <div className="flex justify-center items-center w-full gap-6 mb-12">
                    {[
                        { label: "Phone Consultation", icon: Phone },
                        { label: "Video Call", icon: Video },
                        { label: "In-person Consultation", icon: Calendar },
                    ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:shadow-sm transition-all"
                            >
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-muted-foreground text-sm">{item.label}</span>
                            </div>
                        );
                    })}
                </div>


                {/* Lawyers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <LawyerCard
                        name="Sarah Khan"
                        expertise="Corporate Law"
                        location="Karachi"
                        rating={4.7}
                        available={true}
                        image={Lawyer1}
                        link="/consultation/sarah-khan"
                    />
                    <LawyerCard
                        name="Ali Raza"
                        expertise="Family Law"
                        location="Lahore"
                        rating={4.9}
                        available={false}
                        image={Lawyer1}
                        link="/consultation/ali-raza"
                    />
                    <LawyerCard
                        name="Fatima Noor"
                        expertise="Criminal Law"
                        location="Islamabad"
                        rating={4.8}
                        available={true}
                        image={Lawyer1}
                        link="/consultation/fatima-noor"
                    />
                </div>
            </div>
        </section>
    );
};

const LawyerCard = ({
    name,
    expertise,
    location,
    rating,
    available,
    image,
    link,
}: {
    name: string;
    expertise: string;
    location: string;
    rating: number;
    available: boolean;
    image: string;
    link: string;
}) => {
    return (
        <div className="bg-neutral shadow-lg rounded-lg p-6 flex flex-col justify-between">
            <div className="relative mb-4">
                <Image src={image} alt={name} fill className="w-full h-40 object-cover rounded-lg" />
                {available ? (
                    <div className="absolute top-4 right-4 bg-primary text-neutral text-xs px-2 py-1 rounded-full">Available</div>
                ) : (
                    <div className="absolute top-4 right-4 bg-destructive text-neutral text-xs px-2 py-1 rounded-full">Unavailable</div>
                )}
            </div>

            <h3 className="text-2xl font-semibold text-foreground mb-2">{name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{expertise}</p>
            <p className="text-muted-foreground text-xs">{location}</p>

            <div className="flex items-center gap-2 mt-4">
                <span className="text-yellow-500">{Array.from({ length: Math.round(rating) }).map((_, i) => <span key={i}>★</span>)}</span>
                <span className="text-muted-foreground text-sm">({rating} / 5)</span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <Link href={link}>
                    <span className="text-primary hover:underline text-sm">View Profile</span>
                </Link>
                <Button
                    disabled={!available}
                    variant={available ? 'default' : 'outline'}
                    className={`py-2`}
                >
                    {available ? 'Book Now' : 'Unavailable'}
                </Button>
            </div>
        </div>
    );
};

export default Consultations;
