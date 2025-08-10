"use client";

import React from 'react';
import ComingSoonWrapper from '@/components/wrappers/ComingSoonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example page content that will be blurred
const ExamplePageContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Advanced Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Case Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your legal case performance and outcomes with detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Understand your legal research patterns and most searched topics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor your legal workflow efficiency and time-saving metrics.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg">
            View Detailed Reports
          </Button>
        </div>

        {/* More dummy content */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Real-time Data</h2>
            <p className="text-muted-foreground">
              Get instant updates on your legal cases, consultation status, 
              and document processing. Our real-time dashboard keeps you 
              informed of every important development.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Custom Reports</h2>
            <p className="text-muted-foreground">
              Generate customized reports for your legal practice, client cases, 
              or research activities. Export in multiple formats and share with 
              your team or clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with ComingSoon wrapper
const ComingSoonExamplePage = () => {
  return (
    <ComingSoonWrapper
      title="Advanced Analytics"
      description="We're building a comprehensive analytics dashboard to help you track your legal workflow, case performance, and research insights. This powerful feature will provide real-time data and customizable reports."
      estimatedDate="Q2 2024"
      features={[
        "Real-time case tracking",
        "Custom report generation", 
        "Performance metrics",
        "Data visualization",
        "Export functionality",
        "Team collaboration tools"
      ]}
      showNotifyButton={true}
    >
      <ExamplePageContent />
    </ComingSoonWrapper>
  );
};

export default ComingSoonExamplePage;
