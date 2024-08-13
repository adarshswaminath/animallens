import type { Metadata } from "next";
import { Inter, Source_Code_Pro, Whisper } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});

const whisper = Whisper({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-whisper',
});

export const metadata: Metadata = {
  title: "Your pet care App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${sourceCodePro.variable} ${whisper.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-[#FEFAF8] to-[#FFE7CF] overflow-x-hidden`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}