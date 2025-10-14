"use client";

import { useState, useEffect } from "react";
import { EditModal } from "./EditModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditModal } from "./EditModalContext";
import { X, Plus } from "lucide-react";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConsultationFee {
  type: string;
  price: number;
  duration: string;
}

export function EditContactModal({ isOpen, onClose }: EditContactModalProps) {
  const { lawyer } = useEditModal();
  const [formData, setFormData] = useState({
    responseTime: "",
    consultationFees: [] as ConsultationFee[],
    consultationModes: [] as string[],
  });

  const [newFee, setNewFee] = useState({
    type: "",
    price: "",
    duration: "",
  });

  const consultationTypes = [
    "Initial Consultation",
    "Follow-up Consultation",
    "Document Review",
    "Legal Opinion",
    "Court Appearance",
    "Negotiation Session"
  ];

  const consultationModes = [
    "In-Person",
    "Video Call",
    "Phone Call",
    "Email",
    "Chat"
  ];

  const durations = [
    "30 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "Half day",
    "Full day"
  ];

  useEffect(() => {
    if (lawyer) {
      setFormData({
        responseTime: "", // This field doesn't exist in Lawyer type yet
        consultationModes: [], // This field doesn't exist in Lawyer type yet
        consultationFees: [], // This field doesn't exist in Lawyer type yet
      });
    }
  }, [lawyer]);

  const handleResponseTimeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      responseTime: value
    }));
  };

  const handleConsultationModeChange = (mode: string) => {
    if (!formData.consultationModes.includes(mode)) {
      setFormData(prev => ({
        ...prev,
        consultationModes: [...prev.consultationModes, mode]
      }));
    }
  };

  const removeConsultationMode = (mode: string) => {
    setFormData(prev => ({
      ...prev,
      consultationModes: prev.consultationModes.filter(m => m !== mode)
    }));
  };

  const addConsultationFee = () => {
    if (newFee.type && newFee.price && newFee.duration) {
      const fee: ConsultationFee = {
        type: newFee.type,
        price: parseInt(newFee.price),
        duration: newFee.duration,
      };

      setFormData(prev => ({
        ...prev,
        consultationFees: [...prev.consultationFees, fee]
      }));

      setNewFee({ type: "", price: "", duration: "" });
    }
  };

  const removeConsultationFee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      consultationFees: prev.consultationFees.filter((_, i) => i !== index)
    }));
  };

  const { updateSection } = useEditModal();

  const handleSave = async () => {
    if (!lawyer) return;

    try {
      // Use the consultation settings update
      await updateSection('consultation', {
        modes: formData.consultationModes,
        fees: formData.consultationFees.map(fee => ({
          mode: fee.type,
          amount: fee.price,
        })),
        // Note: responseTime might need to be stored in a different field
      });

      console.log("Successfully saved contact data:", formData);
    } catch (error) {
      console.error("Failed to save contact data:", error);
      throw error;
    }
  };

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

        {/* Consultation Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Available Consultation Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select consultation methods you offer</Label>
              <Select onValueChange={handleConsultationModeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Add consultation method" />
                </SelectTrigger>
                <SelectContent>
                  {consultationModes
                    .filter(mode => !formData.consultationModes.includes(mode))
                    .map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {formData.consultationModes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.consultationModes.map((mode) => (
                  <Badge key={mode} variant="secondary" className="flex items-center gap-1">
                    {mode}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeConsultationMode(mode)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
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

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={addConsultationFee} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fee
                </Button>
              </div>
            </div>

            {formData.consultationFees.length > 0 && (
              <div className="space-y-2">
                <Label>Current Fees</Label>
                <div className="space-y-2">
                  {formData.consultationFees.map((fee, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{fee.type}</div>
                        <div className="text-xs text-muted-foreground">{fee.duration}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-primary">{fee.price.toLocaleString()} PKR</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeConsultationFee(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EditModal>
  );
}
