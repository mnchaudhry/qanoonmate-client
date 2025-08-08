import type React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import StateProvider from "@/wrappers/StateProvider";
import { Toaster } from "react-hot-toast";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "QanoonMate",
  description: "Legal access simplified. QanoonMate is a legal tech platform that connects users with lawyers and provides AI-driven legal solutions.",
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-neutral text-foreground`}>
        <StateProvider>
          <Toaster />
          {children}
        </StateProvider>
      </body>
    </html>
  );
}
