"use client"

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, FileText } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { getDrafts } from '@/store/reducers/draftSlice'
import { getGuides } from '@/store/reducers/guideSlice'
import { RootState } from '@/store/store'

const LegalGuides = () => {

  /////////////////////////////////////////////// VARIABLES ////////////////////////////////////////////
  const dispatch = useDispatch<AppDispatch>();
  const { guides, loading: guideLoading } = useSelector((state: RootState) => state.guide)
  const { drafts, isLoading: draftsLoading } = useSelector((state: RootState) => state.draft)

  /////////////////////////////////////////////// USE EFFECTS ///////////////////////////////////////////////
  useEffect(() => {
    Promise.all([
      dispatch(getGuides({ limit: 3 })),
      dispatch(getDrafts({ limit: 3 }))
    ])
  }, [dispatch])

  /////////////////////////////////////////////// RETURN ///////////////////////////////////////////////
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Legal Guides & Tools – Suggested for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Legal Guides */}
            <div className="space-y-4">
              {
                guideLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : guides.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No guides found.</div>
                ) : guides.map((guide) => (
                  <div
                    key={guide._id}
                    className="flex items-center justify-between p-4 border !border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className='space-y-1' >
                        <h4 className="font-medium text-foreground text-base">
                          {guide.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {guide.overview}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Read Guide
                    </Button>
                  </div>
                ))
              }
            </div>

            {/* Legal Document Templates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-foreground">Legal Document Templates</h3>
              </div>
              {
                draftsLoading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : drafts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No templates found.</div>
                ) : drafts.map((template) => (
                  <div
                    key={template._id}
                    className="flex items-center justify-between p-4 border !border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className='space-y-1' >
                      <h4 className="font-medium text-foreground text-base">
                        • {template.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Download
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default LegalGuides
