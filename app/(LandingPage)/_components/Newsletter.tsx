import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NewsLetter = () => {
  return (
    <Card className="rounded-2xl section-padding bg-muted/50 border-none shadow-none">
      <CardContent className="p-0">
        <div className="text-center mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
            Stay Informed with QanoonMate
          </h3>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Get the latest legal updates, case law summaries, and platform news delivered to your inbox. Join our newsletter for valuable insights into Pakistan&apos;s legal landscape.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" className="font-semibold text-base md:text-lg">
              Subscribe
            </Button>
          </form>
          <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
            No spam, unsubscribe at any time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsLetter;