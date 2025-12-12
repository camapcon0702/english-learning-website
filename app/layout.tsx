import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học tiếng Anh",
  description: "Khám phá phương pháp học tiếng Anh hiệu quả",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
