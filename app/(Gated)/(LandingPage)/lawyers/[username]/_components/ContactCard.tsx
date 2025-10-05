"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Calendar, DollarSign, Clock, CheckCircle, Edit } from "lucide-react";
import { LawyerProfile } from "@/lib/types/profile.types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditModal } from "./edit/EditModalContext";
import { EditContactModal } from "./edit/EditContactModal";
import { enumToLabel } from "@/lib/utils";

interface ContactCardProps {
  lawyer: LawyerProfile;
}

export function ContactCard({ lawyer }: ContactCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const isOwnProfile = user?.email === lawyer.personalInfo.email;
  const { isContactModalOpen, openContactModal, closeAllModals } = useEditModal();

  //////////////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////
  const getLowestPrice = () => {
    if (lawyer.services.consultationFees.length === 0) return null;
    return Math.min(...lawyer.services.consultationFees.map(fee => fee.price));
  };

  //////////////////////////////////////////////// VARIABLES ///////////////////////////////////////////
  const lowestPrice = getLowestPrice();

  //////////////////////////////////////////////// RENDER ///////////////////////////////////////////
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            Get in Touch
          </div>
          {isOwnProfile && (
            <Edit 
              className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary" 
              onClick={openContactModal}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Quick Actions */}
        <div className="space-y-3">
          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
            <MessageCircle className="w-3.5 h-3.5 mr-2" />
            Send Message
          </Button>

          <Button size="sm" variant="outline" className="w-full">
            <Calendar className="w-3.5 h-3.5 mr-2" />
            Book Consultation
          </Button>
        </div>

        {/* Consultation Fees */}
        {lawyer.services.consultationFees.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3 text-sm">Consultation Fees</h4>
            <div className="space-y-2">
              {lawyer.services.consultationFees.slice(0, 3).map((fee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {fee.mode === 'video' ? 'Video Call' :
                        fee.mode === 'phone' ? 'Phone Call' :
                          fee.mode === 'in-person' ? 'In-Person' : 'Chat'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {fee.price} {fee.currency}
                  </span>
                </div>
              ))}

              {lowestPrice && (
                <div className="text-center pt-2">
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    Starting from {lowestPrice} {lawyer.services.consultationFees[0].currency}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Time */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Response Time</p>
              <p className="text-xs text-gray-500">{lawyer.services.responseTime}</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900">Verification</p>
              <p className="text-xs text-gray-500">
                {lawyer.verification.identityVerified ? 'Identity Verified' : 'Pending Verification'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3 text-sm">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Phone className="w-3.5 h-3.5" />
              <span>{lawyer.personalInfo.phone}</span>
            </div>
            <div className="text-xs text-gray-500">
              📍 {enumToLabel(lawyer.personalInfo.location.city)}, {enumToLabel(lawyer.personalInfo.location.province)}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Availability</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday: 10:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </CardContent>
      
      {/* Edit Modal */}
      <EditContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeAllModals} 
      />
    </Card>
  );
}
