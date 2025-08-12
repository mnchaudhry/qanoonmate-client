"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Bell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ComingSoonProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  estimatedDate?: string;
  features?: string[];
  showNotifyButton?: boolean;
  className?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  children,
  title = "Coming Soon",
  description = "We're working hard to bring you this amazing feature. Stay tuned for updates!",
  estimatedDate,
  features = [],
  showNotifyButton = true,
  className = ""
}) => {
  const handleNotifyMe = () => {
    // You can implement newsletter signup or notification logic here
    console.log('Notify me clicked');
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Blurred Background Content */}
      <div className="absolute inset-0 blur-sm scale-105 overflow-hidden pointer-events-none">
        <div className="filter blur-md">
          {children}
        </div>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="border-border/50 shadow-2xl bg-background/95 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <Clock className="w-10 h-10 text-primary" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              >
                {title}
              </motion.h1>

              {/* Estimated Date Badge */}
              {estimatedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                    <Star className="w-4 h-4 mr-2 text-primary" />
                    Expected: {estimatedDate}
                  </Badge>
                </motion.div>
              )}

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg leading-relaxed mb-8"
              >
                {description}
              </motion.p>

              {/* Features List */}
              {features.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    What to expect:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {showNotifyButton && (
                  <Button
                    onClick={handleNotifyMe}
                    size="lg"
                    className="group"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Notify Me When Ready
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                  className="border-border/50"
                >
                  Go Back
                </Button>
              </motion.div>

              {/* Status Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-6 border-t border-border/30"
              >
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>Development in progress</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default ComingSoon;
