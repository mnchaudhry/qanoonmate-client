"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditModal } from "./EditModalContext";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export function EditContactModal({ isOpen, onClose }: EditContactModalProps) {

  /////////////////////////////////////////////////////// VARIABLES /////////////////////////////////////////////////////////
  const { lawyer } = useEditModal();
  const { updateSection } = useEditModal();
  const consultationTypes = [
    "Initial Consultation",
    "Follow-up Consultation",
    "Document Review",
    "Legal Opinion",
    "Court Appearance",
    "Negotiation Session"
  ];


  const durations = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "Half day",
    "Full day"
  ];

  /////////////////////////////////////////////////////// STATES /////////////////////////////////////////////////////////
  const [formData, setFormData] = useState({ responseTime: "", hourlyRate: 0 });
  const [newFee, setNewFee] = useState({ type: "", price: "", duration: "", });


  /////////////////////////////////////////////////////// EFFECTS /////////////////////////////////////////////////////////
  useEffect(() => {
    if (lawyer) {
      setFormData({
        responseTime: "", // This field doesn't exist in Lawyer type yet
        hourlyRate: lawyer.hourlyRate || 0,
      });
    }
  }, [lawyer]);

  /////////////////////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////////////////
  const handleResponseTimeChange = (value: string) => {
    setFormData(prev => ({ ...prev, responseTime: value }));
  };


  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Use the consultation settings update
      await updateSection('consultation', { hourlyRate: formData.hourlyRate, responseTime: formData.responseTime });

      console.log("Successfully saved contact data:", formData);
    } catch (error) {
      console.error("Failed to save contact data:", error);
      throw error;
    }
  };

  /////////////////////////////////////////////////////// RENDER /////////////////////////////////////////////////////////
  return (
    <EditModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Contact & Consultation Settings"
      onSave={handleSave}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Response Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="response-time">How quickly do you typically respond to inquiries?</Label>
              <Select value={formData.responseTime} onValueChange={handleResponseTimeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                  <SelectItem value="Within 4 hours">Within 4 hours</SelectItem>
                  <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                  <SelectItem value="Within 2-3 days">Within 2-3 days</SelectItem>
                  <SelectItem value="Within a week">Within a week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Consultation Fees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label htmlFor="fee-type">Service Type</Label>
                <Select value={newFee.type} onValueChange={(value) => setNewFee(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-price">Price (PKR)</Label>
                <Input
                  id="fee-price"
                  type="number"
                  value={newFee.price}
                  onChange={(e) => setNewFee(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee-duration">Duration</Label>
                <Select value={newFee.duration} onValueChange={(value) => setNewFee(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration} value={duration}>
                        {duration}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="space-y-2">
              <Label>Current Fees</Label>
              <Input
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                type="number"
                placeholder="Hourly Rate in PKR"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
