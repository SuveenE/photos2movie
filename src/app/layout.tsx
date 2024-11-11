import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photos to Video.",
  description: "Photos to Video in seconds.",
  icons: {
    icon: "/camera.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
