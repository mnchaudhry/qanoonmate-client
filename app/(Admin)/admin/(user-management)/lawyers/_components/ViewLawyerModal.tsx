'use client'

import React from 'react'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, Mail, MapPin, Briefcase, DollarSign, Clock, Languages, Shield, CheckCircle, XCircle, Star } from 'lucide-react'
import { format } from 'date-fns'
import { Lawyer } from '@/store/types/lawyer.types'

interface ViewLawyerModalProps {
  open: boolean;
  onClose: () => void;
  lawyer: Lawyer | null;
  onVerify?: (id: string) => void;
  onDisable?: (id: string) => void;
  isVerifying?: boolean;
  isDisabling?: boolean;
}

const ViewLawyerModal: React.FC<ViewLawyerModalProps> = ({
  open,
  onClose,
  lawyer,
  onVerify,
  onDisable,
  isVerifying = false,
  isDisabling = false
}) => {
  if (!lawyer) return null;

  const handleVerify = () => {
    if (lawyer._id && onVerify) {
      onVerify(lawyer._id);
    }
  };

  const handleDisable = () => {
    if (lawyer._id && onDisable) {
      onDisable(lawyer._id);
    }
  };

  return (
    <Modal
      title="Lawyer Details"
      description="Complete information about the lawyer"
      open={open}
      onClose={onClose}
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {lawyer.firstname} {lawyer.lastname}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {lawyer.isVerified ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                {lawyer.isActive ? (
                  <Badge variant="default">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {!lawyer.isVerified && (
              <Button
                size="sm"
                onClick={handleVerify}
                disabled={isVerifying}
                className="bg-green-600 hover:bg-green-700"
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
            )}
            {lawyer.isActive && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDisable}
                disabled={isDisabling}
              >
                {isDisabling ? 'Disabling...' : 'Disable'}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{lawyer.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p className="font-medium">{lawyer.phone}</p>
            </div>
            {lawyer.cnic && (
              <div>
                <span className="text-gray-500">CNIC:</span>
                <p className="font-medium">{lawyer.cnic}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </h4>
          <div className="text-sm">
            <p className="font-medium">{lawyer.location?.city}, {lawyer.location?.province}</p>
          </div>
        </div>

        <Separator />

        {/* Professional Information */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            Professional Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Experience:
              </span>
              <p className="font-medium">{lawyer.experience} years</p>
            </div>
            <div>
              <span className="text-gray-500 flex items-center">
                <DollarSign className="w-3 h-3 mr-1" />
                Consultation Fee:
              </span>
              <p className="font-medium">PKR {lawyer.settings?.consultation.fees[0].amount}</p>
            </div>
            {lawyer.avgRating && (
              <div>
                <span className="text-gray-500 flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Rating:
                </span>
                <p className="font-medium flex items-center">
                  {lawyer.avgRating.toFixed(1)}
                  <Star className="w-3 h-3 ml-1 fill-yellow-400 text-yellow-400" />
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Specializations */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Specializations
          </h4>
          <div className="flex flex-wrap gap-2">
            {lawyer.specializations?.map((spec, index) => (
              <Badge key={index} variant="outline">
                {spec}
              </Badge>
            )) || <p className="text-gray-500 text-sm">No specializations listed</p>}
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Languages className="w-4 h-4 mr-2" />
            Languages
          </h4>
          <div className="text-sm">
            <div className="mb-2">
              <span className="text-gray-500">Primary:</span>
              <p className="font-medium inline ml-2">{lawyer.preferredLanguage}</p>
            </div>
            {lawyer.languages && lawyer.languages.length > 0 && (
              <div>
                <span className="text-gray-500">Additional:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lawyer.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Account Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Member Since:</span>
              <p className="font-medium">
                {lawyer.createdAt ? format(new Date(lawyer.createdAt), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <p className="font-medium">
                {lawyer.updatedAt ? format(new Date(lawyer.updatedAt), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        {lawyer.reviews && lawyer.reviews.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Recent Reviews</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {lawyer.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs">
                        {review.createdAt ? format(new Date(review.createdAt), 'MMM dd') : ''}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}

export default ViewLawyerModal
