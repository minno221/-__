import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import "./globals.css";

const font = IBM_Plex_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "분실물 보관함",
  description: "잃어버린 물건을 찾아가세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={font.variable}>
      <body>{children}</body>
    </html>
  );
}
