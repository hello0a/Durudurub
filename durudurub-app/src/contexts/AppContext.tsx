import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
  isPremium?: boolean;
}

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  profileImage: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setProfileImage: (image: string | null) => void;
  handleLogin: (userData: User, token: string) => void;
  handleLogout: () => void;
  handleProfileImageUpdate: (newImage: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 컴포넌트 마운트 시 sessionStorage에서 로그인 정보 확인
  useEffect(() => {
    const storedToken = sessionStorage.getItem('accessToken');
    const storedUser = sessionStorage.getItem('user');
    const storedProfileImage = sessionStorage.getItem('profileImage');

    if (storedToken && storedUser) {
      const tokenParts = storedToken.split('.');
      if (tokenParts.length === 3) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
      } else {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('profileImage');
      }
    }
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('profileImage');
    setUser(null);
    setAccessToken(null);
    setProfileImage(null);
  };

  const handleProfileImageUpdate = (newImage: string | null) => {
    setProfileImage(newImage);
    if (newImage) {
      sessionStorage.setItem('profileImage', newImage);
    } else {
      sessionStorage.removeItem('profileImage');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        profileImage,
        setUser,
        setAccessToken,
        setProfileImage,
        handleLogin,
        handleLogout,
        handleProfileImageUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
