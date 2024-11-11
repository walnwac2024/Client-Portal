'use client';
import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies'; // Importing the nookies package for parsing cookies
import LoginPage from './login/page';
import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';

export default function AuthProvider({ Component, pageProps }: AppProps): React.ReactNode {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get the cookies using nookies' parseCookies function
    const cookies = parseCookies();
    console.log('Cookies parsed:', cookies);

    // Extract the token from the cookies
    const authToken = cookies.token;

    if (authToken) {
      console.log('Token found:', authToken); // Debug log
      setToken(authToken); // Set the token in state
    } else {
      console.log('No token found in cookies'); // Debug log
    }
  }, []);

  console.log('Current token state:', token); // Debug log to monitor token state

  // Render LoginPage if no token is found
  if (!token) {
    return <LoginPage />;
  }

  // Render the component if the token exists
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}
