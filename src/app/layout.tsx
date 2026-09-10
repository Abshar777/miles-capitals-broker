import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import IndexProvider from "@/components/providers";
import { getServerSession } from "next-auth";
import { authConfig } from "@/config/auth.config";
import Script from "next/script";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MILES CAPITAL",
  description: "Miles Capital - client portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="en">
     <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${rubik.variable} ${rubik.className} antialiased`}
      >
        <IndexProvider session={session}>{children}</IndexProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XVZRYT95ZR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XVZRYT95ZR');
          `}
        </Script>
      </body>
    </html>
  );
}
