import { createContext, useContext, useEffect, useState } from 'react';
import { useGetMe } from '@workspace/api-client-react';
import type { User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: isUserLoading, isError } = useGetMe({
    query: {
      queryKey: ['me'],
      retry: false,
    } as any
  });

  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (user && !isError) {
        setLocalUser(user as unknown as User);
      } else {
        setLocalUser(null);
      }
      setIsReady(true);
    }
  }, [user, isUserLoading, isError]);

  return (
    <AuthContext.Provider value={{ user: localUser, isLoading: !isReady, setUser: setLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
