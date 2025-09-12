import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamSync - Next-Gen Video Synchronization Platform',
  description: 'Watch together in perfect sync with millions of users worldwide',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Global error toast */}
            <div id="global-error-toast" className="fixed top-4 right-4 z-50"></div>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
