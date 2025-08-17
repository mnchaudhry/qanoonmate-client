"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NewsLetter = () => {
  return (
    <Card className="rounded-3xl section-padding bg-gradient-to-b from-muted/40 to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="text-center mx-auto max-w-2xl py-24 ">
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 md:mb-6">
            Stay Informed with <span className="text-primary">QanoonMate</span>
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
            Get the latest legal updates, case law summaries, and platform news delivered straight to your inbox. 
            Join our newsletter and gain valuable insights into Pakistan&apos;s legal landscape.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 md:h-14 rounded-xl px-4 md:px-6 text-base bg-background focus:ring-2 focus:ring-primary/40"
              required
            />
            <Button
              type="submit"
              className="max-h-max font-semibold text-base md:text-lg h-12 md:h-14 rounded-xl px-6 transition-all duration-200 hover:scale-[1.02]"
            >
              Subscribe
            </Button>
          </form>
          <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsLetter;
