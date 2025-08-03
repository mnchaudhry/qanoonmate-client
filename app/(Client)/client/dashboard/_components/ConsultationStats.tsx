"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { getConsultationStats } from '@/store/reducers/consultationSlice'

const ConsultationStats = () => {
  ///////////////////////////////////////// VARIABLES /////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { consultationStats } = useSelector((state: RootState) => state.consultation);

  ///////////////////////////////////////// USE EFFECTS /////////////////////////////////////////
  useEffect(() => {
    dispatch(getConsultationStats({}));
  }, [dispatch]);

  const statItems = [
    {
      label: 'Total Consultations',
      value: consultationStats.total,
      icon: Calendar,
      color: 'text-primary'
    },
    {
      label: 'Completed',
      value: consultationStats.completed,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Pending',
      value: consultationStats.pending,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      label: 'Cancelled',
      value: consultationStats.cancelled,
      icon: XCircle,
      color: 'text-red-600'
    }
  ]

  ///////////////////////////////////////// RENDER /////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Consultation Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 bg-background rounded-lg">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConsultationStats
