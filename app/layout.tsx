import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StateProvider from "@/wrappers/StateProvider";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Verdict AI",
  description: "Legal access simplified. Verdict AI is a legal tech platform that connects users with lawyers and provides AI-driven legal solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral text-foreground`}>
          <StateProvider>
            <Toaster />
            {children}
          </StateProvider>
      </body>
    </html>
  );
}
