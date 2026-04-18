import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar"; 

export const metadata: Metadata = {
  title: "VENDER - Tú tienes el talento, nosotros la plataforma",
  description: "Adiós a los 100 estados de WhatsApp. Tu ecommerce profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}