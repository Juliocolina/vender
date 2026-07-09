import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VENDER - Tú tienes el talento, nosotros la plataforma",
  description: "Adiós a los 100 estados de WhatsApp. Tu ecommerce profesional.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}