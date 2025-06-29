import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/animation.css";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

// NEW: Separate viewport export (fixes the warnings)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

// UPDATED: Main metadata export (removed viewport and themeColor)
export const metadata: Metadata = {
  title: "FoodOrder - Delicious Food Delivered",
  description:
    "Order your favorite food online with our modern microservices-based ordering system. Fast delivery, fresh ingredients, and exceptional service.",
  keywords:
    "food delivery, online ordering, restaurant, takeaway, delivery service",
  authors: [{ name: "FoodOrder Team" }],
  openGraph: {
    title: "FoodOrder - Delicious Food Delivered",
    description:
      "Order your favorite food online with fast delivery and exceptional service.",
    type: "website",
    locale: "en_US",
    url: "https://foodorder.com",
    siteName: "FoodOrder",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodOrder - Delicious Food Delivered",
    description:
      "Order your favorite food online with fast delivery and exceptional service.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
