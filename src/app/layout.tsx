import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photos2Movie.",
  description: "Photos to Movie in seconds.",
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
