import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'; // Importamos el provider
import "./globals.css";
import { Navbar } from "@/components/Navbar";

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
    <ClerkProvider> {/* Envolvemos todo el layout */}
      <html lang="es">
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}