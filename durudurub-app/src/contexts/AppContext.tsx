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

  // 컴포넌트 마운트 시 로컬 스토리지에서 로그인 정보 확인
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedProfileImage = localStorage.getItem('profileImage');

    if (storedToken && storedUser) {
      // 토큰 유효성 간단 체크 - JWT 형식인지 확인
      const tokenParts = storedToken.split('.');
      if (tokenParts.length === 3) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
        console.log('저장된 로그인 정보 복원 성공');
      } else {
        // 잘못된 토큰 형식 - 클리어
        console.log('잘못된 토큰 형식 감지 - localStorage 클리어');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('profileImage');
      }
    }
  }, []);

  const handleLogin = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', token);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('profileImage');
    setUser(null);
    setAccessToken(null);
    setProfileImage(null);
  };

  const handleProfileImageUpdate = (newImage: string | null) => {
    setProfileImage(newImage);
    if (newImage) {
      localStorage.setItem('profileImage', newImage);
    } else {
      localStorage.removeItem('profileImage');
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
