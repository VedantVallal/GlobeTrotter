import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--gt-font-loaded",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "GlobeTrotter — Build your journey, node by node.",
  description:
    "GlobeTrotter is a premium visual travel-planning app. Discover destinations, plan multi-city trips, manage your itinerary and budget — all in one beautiful workspace.",
  keywords: "travel planning, trip planner, itinerary, travel app",
  openGraph: {
    title: "GlobeTrotter",
    description: "Build your journey, node by node.",
    type: "website",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
