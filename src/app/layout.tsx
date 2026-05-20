import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import Header dan Footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Website Kota Harapan - Mockup Silverthorne",
  description: "Cetak biru frontend pemerintah kota modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Render Header */}
        <Header />

        {/* Konten Halaman akan dirender di sini */}
        {children}

        {/* Render Footer */}
        <Footer />
      </body>
    </html>
  );
}