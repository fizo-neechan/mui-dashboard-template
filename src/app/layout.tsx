'use client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import './globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SnackbarProvider } from '@/contexts/SnackbarContext';
import theme from '@/theme/theme';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
