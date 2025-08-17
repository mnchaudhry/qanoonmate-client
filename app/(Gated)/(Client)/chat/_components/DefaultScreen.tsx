import Logo from "@/components/Logo";
import React from "react";

const DefaultScreen = () => {
  return (
    <div className="flex-1 flex justify-center items-center px-4 py-6 space-y-4 max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-center gap-4 opacity-50">
        <h2 className="text-3xl text-muted-foreground flex flex-col justify-center align-middle text-center">
          Welcome to
          <Logo size="lg" type="green" className="w-32" />
        </h2>
      </div>
    </div>
  );
};

export default DefaultScreen;
