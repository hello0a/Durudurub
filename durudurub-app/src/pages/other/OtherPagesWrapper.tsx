import { useNavigate } from 'react-router';
import { useApp } from '@/contexts/AppContext';
import { ForgotPasswordPage } from '@/pages/other/ForgotPasswordPage';
import { MiniGamePage } from '@/pages/other/MiniGamePage';
import { FavoritesPage } from '@/pages/favorites/FavoritesPage';
import { AdminPage } from '@/pages/admin/AdminPage';
import { PaymentPage } from '@/pages/other/PaymentPage';

export function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();
  
  return (
    <ForgotPasswordPage
      onClose={() => navigate(-1)}
      onSignupClick={() => navigate('/signup')}
      onLoginClick={() => navigate('/login')}
    />
  );
}

export function MiniGamePageWrapper() {
  const navigate = useNavigate();
  const { user, accessToken, profileImage, handleLogout } = useApp();

  return (
    <MiniGamePage
      onBack={() => navigate('/')}
      user={user}
      accessToken={accessToken}
      onSignupClick={() => navigate('/signup')}
      onLoginClick={() => navigate('/login')}
      onLogoClick={() => navigate('/')}
      onNoticeClick={() => navigate('/notice')}
      onMyPageClick={() => navigate('/mypage')}
      onMiniGameClick={() => navigate('/minigame')}
      onMyMeetingsClick={() => navigate('/meetings')}
      profileImage={profileImage}
      onLogout={handleLogout}
    />
  );
}

export function FavoritesPageWrapper() {
  const navigate = useNavigate();
  const { user, accessToken, profileImage, handleLogout } = useApp();

  return (
    <FavoritesPage
      onBack={() => navigate('/')}
      user={user}
      accessToken={accessToken || ''}
      profileImage={profileImage}
      onSignupClick={() => navigate('/signup')}
      onLoginClick={() => navigate('/login')}
      onLogoClick={() => navigate('/')}
      onNoticeClick={() => navigate('/notice')}
      onMyPageClick={() => navigate('/mypage')}
      onMiniGameClick={() => navigate('/minigame')}
      onMyMeetingsClick={() => navigate('/meetings')}
      onLogout={handleLogout}
      onCommunityClick={(communityId) => navigate(`/community/${communityId}`)}
      onExploreClick={(searchQuery) => {
        if (searchQuery) {
          navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
        } else {
          navigate('/explore');
        }
      }}
    />
  );
}

export function AdminPageWrapper() {
  const navigate = useNavigate();
  const { user, accessToken, profileImage, handleLogout } = useApp();

  return (
    <AdminPage
      onBack={() => navigate('/')}
      user={user}
      accessToken={accessToken}
      profileImage={profileImage}
      onSignupClick={() => navigate('/signup')}
      onLoginClick={() => navigate('/login')}
      onLogoClick={() => navigate('/')}
      onNoticeClick={() => navigate('/notice')}
      onMyPageClick={() => navigate('/mypage')}
      onMiniGameClick={() => navigate('/minigame')}
      onMyMeetingsClick={() => navigate('/meetings')}
      onLogout={handleLogout}
      onNavigateToCommunity={(communityId) => navigate(`/community/${communityId}`)}
    />
  );
}

export function PaymentPageWrapper() {
  const navigate = useNavigate();

  return (
    <PaymentPage
      onClose={() => navigate('/')}
      onPaymentSuccess={() => {
        console.log('결제 성공 - 프리미엄 회원 전환');
        navigate('/');
      }}
      onBack={() => navigate('/')}
    />
  );
}
