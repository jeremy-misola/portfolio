import { useState, useEffect } from 'react';
import { usePathname } from '@/i18n/routing';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname.split('/')[1]; // Extract current locale from path

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session server-side (httpOnly cookies are not readable in JS)
        const response = await fetch('/api/admin/auth/verify', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Session is missing/invalid
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  return { isAuthenticated, isLoading, locale };
}
