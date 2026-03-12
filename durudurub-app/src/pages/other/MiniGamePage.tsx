import { ArrowLeft, Trophy, RotateCcw, Gamepad2, Grid3x3, Grid, Disc, Users, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LadderGame } from '@/components/games/LadderGame';
import { WheelSpinnerGame } from '@/components/games/WheelSpinnerGame';
import { WinnerDrawGame } from '@/components/games/WinnerDrawGame';
import { Navbar } from '@/components/header/Navbar';
import { BottomNavigation } from '@/components/footer/BottomNavigation';
import { GameAdModal } from '@/components/modal/GameAdModal';

interface MiniGamePageProps {
  onBack: () => void;
  user?: any;
  accessToken?: string | null;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onLogoClick?: () => void;
  onNoticeClick?: () => void;
  onMyPageClick?: () => void;
  onMiniGameClick?: () => void;
  onMyMeetingsClick?: () => void;
  profileImage?: string | null;
  onLogout?: () => void;
}

type GameType = 'menu' | 'ladder' | 'wheel' | 'lottery';

export function MiniGamePage({ onBack, user, accessToken, onSignupClick, onLoginClick, onLogoClick, onNoticeClick, onMyPageClick, onMiniGameClick, onMyMeetingsClick, profileImage, onLogout }: MiniGamePageProps) {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showAdModal, setShowAdModal] = useState(false);
  const [adShown, setAdShown] = useState(false);

  const gameCards = [
    {
      id: 'ladder',
      title: '사다리 게임',
      description: '사다리를 타고 내려가 결과를 확인하세요',
      icon: Grid,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'wheel',
      title: '원판 돌리기',
      description: '행운의 룰렛을 돌려 당첨을 확인하세요',
      icon: Disc,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'lottery',
      title: '당첨자 추첨',
      description: '참가자 중 당첨자를 무작위로 추첨합니다',
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
  ];

  // 게임 진입 시 광고 표시 (프리미엄 및 관리자 제외)
  useEffect(() => {
    // 게임 메뉴 화면이 아니고, 아직 광고를 보여주지 않았을 때
    if (currentGame !== 'menu' && !adShown) {
      // 관리자이거나 프리미엄 구독자는 광고를 보지 않음
      const isAdmin = user?.isAdmin || user?.userId === 'admin';
      const isPremium = user?.isPremium || false;
      
      if (!isAdmin && !isPremium) {
        setShowAdModal(true);
        setAdShown(true);
      }
    }
    
    // 게임 메뉴로 돌아가면 광고 표시 상태 리셋
    if (currentGame === 'menu') {
      setAdShown(false);
    }
  }, [currentGame, adShown, user]);

  if (currentGame === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/5 pb-20 md:pb-0">
        {/* 네비게이션 바 */}
        <Navbar 
          onSignupClick={onSignupClick}
          onLoginClick={onLoginClick}
          onLogoClick={onLogoClick}
          onNoticeClick={onNoticeClick}
          onMyPageClick={onMyPageClick}
          onMiniGameClick={onMiniGameClick}
          onMyMeetingsClick={onMyMeetingsClick}
          user={user}
          profileImage={profileImage}
          onLogout={onLogout}
        />
        
        {/* 메인 컨텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 타이틀 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">재미있는 미니 게임</h2>
            <p className="text-lg text-gray-600">원하는 게임을 선택해서 즐겨보세요!</p>
          </div>

          {/* 게임 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gameCards.map((game) => (
              <button
                key={game.id}
                onClick={() => setCurrentGame(game.id as GameType)}
                className="bg-white rounded-2xl transition-all p-8 text-left group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#00A651] transition-colors">
                  {game.title}
                </h3>
                <p className="text-gray-600">{game.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 모바일 하단 네비게이션 */}
        <BottomNavigation
          onHomeClick={() => onLogoClick?.()}
          onMyPageClick={() => onMyPageClick?.()}
          onCategoryClick={() => onLogoClick?.()}
          onSearchClick={() => onLogoClick?.()}
          currentPage="home"
          isLoggedIn={!!user}
        />
      </div>
    );
  }

  // 각 게임 화면은 다음 단계에서 구현
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A651]/10 to-[#00A651]/5 pb-20 md:pb-0">
      {/* 네비게이션 바 */}
      <Navbar 
        onSignupClick={onSignupClick}
        onLoginClick={onLoginClick}
        onLogoClick={onLogoClick}
        onNoticeClick={onNoticeClick}
        onMyPageClick={onMyPageClick}
        onMiniGameClick={onMiniGameClick}
        onMyMeetingsClick={onMyMeetingsClick}
        user={user}
        profileImage={profileImage}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex justify-start mb-6">
            <button
              onClick={() => setCurrentGame('menu')}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 hover:bg-[#00A651] hover:text-white transition-all rounded-full shadow-sm hover:shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {currentGame === 'ladder' && <LadderGame />}
          {currentGame === 'wheel' && <WheelSpinnerGame />}
          {currentGame === 'lottery' && <WinnerDrawGame />}
        </div>
      </div>

      {/* 광고 모달 */}
      {showAdModal && <GameAdModal onClose={() => setShowAdModal(false)} />}

      {/* 모바일 하단 네비게이션 */}
      <BottomNavigation
        onHomeClick={() => onLogoClick?.()}
        onMyPageClick={() => onMyPageClick?.()}
        onCategoryClick={() => onLogoClick?.()}
        onSearchClick={() => onLogoClick?.()}
        currentPage="home"
        isLoggedIn={!!user}
      />
    </div>
  );
}