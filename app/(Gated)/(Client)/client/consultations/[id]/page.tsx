"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getConsultationById } from '@/store/reducers/consultationSlice';

// Import components
import Header from './_components/Header';
import LawyerInformation from './_components/LawyerInformation';
import ConsultationDetails from './_components/ConsultationDetails';
import ConsultationPurpose from './_components/ConsultationPurpose';
import AttachmentsSection from './_components/AttachmentsSection';
import StatusAndActions from './_components/StatusAndActions';
import FeedbackSection from './_components/FeedbackSection';
import RemindersSection from './_components/RemindersSection';
import { IConsultation } from '@/store/types/consultation.types';

export default function ConsultationDetailPage() {

    /////////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////////////////////////////
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedConsultation, loading: isLoading, error } = useSelector(
        (state: RootState) => state.consultation
    );

    /////////////////////////////////////////////////// STATES ////////////////////////////////////////////////////////////////////
    const [consultation, setConsultation] = useState<IConsultation | null>(null);

    /////////////////////////////////////////////////// USE EFFECTS ////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (id) {
            dispatch(getConsultationById({ id: id as string }));
        }
    }, [dispatch, id]);

    // Update local state when API data arrives or use sample data
    useEffect(() => {
        if (selectedConsultation) {
            setConsultation(selectedConsultation);
        }
    }, [selectedConsultation, isLoading, id]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading consultation details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!consultation) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-amber-50 border border-amber-300 text-amber-700 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Consultation Not Found</h2>
                    <p>The consultation you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
            </div>
        );
    }

    /////////////////////////////////////////////////// RENDER ////////////////////////////////////////////////////////////////////
    return (
        <div className="container mx-auto px-4 py-8">
            <Header consultation={consultation} />

            <div className="grid grid-cols-1 gap-6">
                <LawyerInformation consultation={consultation} />
                <ConsultationDetails consultation={consultation} />
                <ConsultationPurpose consultation={consultation} />
                <AttachmentsSection attachments={[]} />
                <StatusAndActions consultation={consultation} />
                <FeedbackSection consultation={consultation} />
                <RemindersSection notifications={[]} />
            </div>
        </div>
    );
}