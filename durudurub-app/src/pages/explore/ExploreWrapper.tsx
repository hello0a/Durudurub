import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExplorePage } from './ExplorePage';

export default function ExploreWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <ExplorePage
      onBack={() => navigate(-1)}
      onCommunityClick={(id: string) => navigate(`/club/${id}`)}
      onLoginClick={() => navigate('/login')}
      onSignupClick={() => navigate('/signup')}
      onLogoClick={() => navigate('/')}
      onNoticeClick={() => navigate('/notice')}
      onMyPageClick={() => navigate('/mypage')}
      onMiniGameClick={() => navigate('/minigame')}
      onMyMeetingsClick={() => navigate('/mypage')}
      onPaymentClick={() => navigate('/payment')}
      onLogout={() => { /* TODO: 로그아웃 처리 */ }}
      user={null}
      accessToken={null}
      profileImage={null}
      initialSearchQuery={searchParams.get('q') || ''}
    />
  );
}