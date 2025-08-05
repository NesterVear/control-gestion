import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const roboto = Roboto({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Control de Gestión",
  description: "Sistema de Gestion de Documentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
