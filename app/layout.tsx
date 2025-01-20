import { Toaster } from "@/src/components/ui/toaster";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import ClientApplication from "@/src/components/auth/ClientApplication";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Katsumeme V2",
  description: "Share and enjoy cat memes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans bg-background text-text`}
      >
        <ClientApplication>{children}</ClientApplication>
      </body>
      <Toaster />
    </html>
  );
}
