import { ArrowLeft, Heart, MapPin, Calendar, Users, X, Lock, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { BottomNavigation } from '@/components/footer/BottomNavigation';
import { useState } from 'react';

interface CategoryPageProps {
  category: string;
  onBack: () => void;
  user: any;
  onSignupClick: () => void;
  onMeetingClick: (meeting: Meeting) => void;
  onLoginClick?: () => void;
  onCreateClick?: () => void;
  onLogoClick?: () => void;
  onMyPageClick?: () => void;
}

interface Meeting {
  id: number;
  title: string;
  image: string;
  host: string;
  location: string;
  date: string;
  participants: number;
  maxParticipants: number;
  liked: boolean;
  subcategory?: string;
}

// 소분류 카테고리 정의
const subcategories: { [key: string]: string[] } = {
  '자기계발': ['전체', '독서', '스피치', '면접', '회화', '기타'],
  '스포츠': ['전체', '러닝', '테니스', '풋살', '축구', '기타'],
  '푸드': ['전체', '맛집', '빵투어', '베이킹', '한식', '기타'],
  '게임': ['전체', '보드게임', '인터넷게임', '카드게임', '기타'],
  '동네친구': ['전체', '술 친구', '액티브 놀이', '기타'],
  '여행': ['전체', '국내여행', '해외여행', '당일치기', '패키지여행', '기타'],
  '예술': ['전체', '미술', '음악', '연극', '뮤지컬', '기타'],
  '반려동물': ['전체', '간 나눔', '산책', '애견카페', '기타'],
};

const categoryMeetings: { [key: string]: Meeting[] } = {
  '자기계발': [
    {
      id: 1,
      title: '독서 모임 - 매주 한 권 완독하기',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
      host: '책벌레',
      location: '강남구',
      date: '매주 일요일 14:00',
      participants: 12,
      maxParticipants: 15,
      liked: false,
      subcategory: '독서',
    },
    {
      id: 2,
      title: '아침 영어 스터디 - 토익 900점 목표',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
      host: '영어마스터',
      location: '서초구',
      date: '평일 오전 7:00',
      participants: 8,
      maxParticipants: 10,
      liked: false,
      subcategory: '회화',
    },
    {
      id: 3,
      title: '재테크 스터디 - 주식 투자 기초',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
      host: '재테크왕',
      location: '송파구',
      date: '매주 화요일 19:00',
      participants: 18,
      maxParticipants: 20,
      liked: true,
      subcategory: '기타',
    },
  ],
  '스포츠': [
    {
      id: 4,
      title: '주말 축구 모임 - 즐겁게 뛰어요',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
      host: '축구왕',
      location: '마포구',
      date: '매주 토요일 10:00',
      participants: 20,
      maxParticipants: 22,
      liked: false,
      subcategory: '축구',
    },
    {
      id: 5,
      title: '테니스 동호회 - 초보 환영',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6',
      host: '테니스조코비치',
      location: '강남구',
      date: '매주 수요일 18:00',
      participants: 14,
      maxParticipants: 16,
      liked: true,
      subcategory: '테니스',
    },
    {
      id: 6,
      title: '러닝 크루 - 한강 야간 런닝',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
      host: '달리기왕',
      location: '여의도',
      date: '매주 목요일 20:00',
      participants: 25,
      maxParticipants: 30,
      liked: false,
      subcategory: '러닝',
    },
  ],
  '푸드': [
    {
      id: 7,
      title: '홈베이킹 클래스 - 케이크 만들기',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
      host: '베이킹마스터',
      location: '용산구',
      date: '매주 토요일 15:00',
      participants: 10,
      maxParticipants: 12,
      liked: false,
      subcategory: '베이킹',
    },
    {
      id: 8,
      title: '맛집 투어 - 이태원 세계요리',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      host: '맛집헌터',
      location: '이태원',
      date: '매주 일요일 18:00',
      participants: 16,
      maxParticipants: 20,
      liked: true,
      subcategory: '맛집',
    },
    {
      id: 9,
      title: '와인 시음 모임 - 와인의 모든 것',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      host: '소믈리에',
      location: '강남구',
      date: '격주 금요일 19:00',
      participants: 8,
      maxParticipants: 10,
      liked: false,
      subcategory: '기타',
    },
  ],
  '게임': [
    {
      id: 10,
      title: '보드게임 카페 정모 - 다양한 게임',
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
      host: '보드게임매니아',
      location: '홍대',
      date: '매주 토요일 14:00',
      participants: 15,
      maxParticipants: 20,
      liked: false,
      subcategory: '보드게임',
    },
    {
      id: 11,
      title: 'PC방 리그오브레전드 게임단',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
      host: '게이머프로',
      location: '강남구',
      date: '평일 저녁 21:00',
      participants: 10,
      maxParticipants: 10,
      liked: true,
      subcategory: '인터넷게임',
    },
    {
      id: 12,
      title: '포켓몬 카드 수집 & 배틀',
      image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176',
      host: '포켓몬마스터',
      location: '신촌',
      date: '매주 일요일 13:00',
      participants: 12,
      maxParticipants: 15,
      liked: false,
      subcategory: '카드게임',
    },
  ],
  '동네친구': [
    {
      id: 13,
      title: '성수동 동네 친구 - 주말 산책',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      host: '성수동주민',
      location: '성수동',
      date: '매주 일요일 11:00',
      participants: 22,
      maxParticipants: 25,
      liked: false,
      subcategory: '액티브 놀이',
    },
    {
      id: 14,
      title: '합정 카페 투어 - 숨은 카페 찾기',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
      host: '카페탐험가',
      location: '합정',
      date: '매주 토요일 15:00',
      participants: 8,
      maxParticipants: 12,
      liked: true,
      subcategory: '기타',
    },
    {
      id: 15,
      title: '이태원 친목 모임 - 30대 직장인',
      image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599',
      host: '친목도우미',
      location: '이태원',
      date: '격주 금요일 19:00',
      participants: 18,
      maxParticipants: 20,
      liked: false,
      subcategory: '술 친구',
    },
  ],
  '여행': [
    {
      id: 16,
      title: '제주도 한달살기 - 3월 함께해요',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
      host: '여행가',
      location: '제주도',
      date: '3월 1일 - 3월 31일',
      participants: 6,
      maxParticipants: 8,
      liked: false,
      subcategory: '국내여행',
    },
    {
      id: 17,
      title: '유럽 배낭여행 - 2주 일정',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
      host: '세계여행러',
      location: '유럽',
      date: '5월 10일 - 5월 24일',
      participants: 4,
      maxParticipants: 6,
      liked: true,
      subcategory: '해외여행',
    },
    {
      id: 18,
      title: '전국 맛집 투어 - 주말 여행',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
      host: '맛집탐험',
      location: '전국',
      date: '매주 토-일',
      participants: 12,
      maxParticipants: 15,
      liked: false,
      subcategory: '당일치기',
    },
  ],
  '예술': [
    {
      id: 19,
      title: '수채화 클래스 - 풍경화 그리기',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
      host: '화가',
      location: '종로구',
      date: '매주 수요일 19:00',
      participants: 10,
      maxParticipants: 12,
      liked: false,
      subcategory: '미술',
    },
    {
      id: 20,
      title: '사진 촬영 모임 - 출사 가요',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
      host: '사진작가',
      location: '서울 근교',
      date: '매주 일요일 09:00',
      participants: 15,
      maxParticipants: 20,
      liked: true,
      subcategory: '사진',
    },
    {
      id: 21,
      title: '도예 공방 - 나만의 그릇 만들기',
      image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9',
      host: '도예가',
      location: '이태원',
      date: '매주 토요일 14:00',
      participants: 6,
      maxParticipants: 8,
      liked: false,
      subcategory: '기타',
    },
  ],
  '반려동물': [
    {
      id: 22,
      title: '강아지 산책 모임 - 한강공원',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b',
      host: '멍멍이집사',
      location: '여의도 한강공원',
      date: '매주 토요일 10:00',
      participants: 20,
      maxParticipants: 25,
      liked: false,
      subcategory: '산책',
    },
    {
      id: 23,
      title: '고양이 집사 모임 - 정보 공유',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
      host: '냥집사',
      location: '온라인/오프라인',
      date: '매주 일요일 15:00',
      participants: 18,
      maxParticipants: 20,
      liked: true,
      subcategory: '기타',
    },
    {
      id: 24,
      title: '반려동물 사진 촬영 - 추억 남기기',
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
      host: '펫사진가',
      location: '서울숲',
      date: '격주 토요일 11:00',
      participants: 10,
      maxParticipants: 12,
      liked: false,
      subcategory: '사진',
    },
  ],
};

export function CategoryPage({ category, onBack, user, onSignupClick, onMeetingClick, onLoginClick, onCreateClick, onLogoClick, onMyPageClick }: CategoryPageProps) {
  const meetings = categoryMeetings[category] || [];
  const [likedMeetings, setLikedMeetings] = useState<Set<number>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('전체');

  const isAdmin = user?.isAdmin === true;
  const currentSubcategories = subcategories[category] || ['전체'];

  // 선택된 소분류에 따라 모임 필터링
  const filteredMeetings = selectedSubcategory === '전체' 
    ? meetings 
    : meetings.filter(meeting => meeting.subcategory === selectedSubcategory);

  const handleLikeClick = (e: React.MouseEvent, meetingId: number) => {
    e.stopPropagation();
    
    // 비로그인 상태면 로그인 모달 표시
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // 로그인 상태면 좋아요 토글
    setLikedMeetings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(meetingId)) {
        newSet.delete(meetingId);
      } else {
        newSet.add(meetingId);
      }
      return newSet;
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, meetingId: number) => {
    e.stopPropagation();
    setMeetingToDelete(meetingId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (meetingToDelete !== null) {
      // TODO: 백엔드 API 연결하여 실제 삭제 처리
      console.log(`삭제할 모임 ID: ${meetingToDelete}`);
      alert('모임이 삭제되었습니다.');
      setShowDeleteModal(false);
      setMeetingToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-[#FBF7F0] py-12 relative">
        {/* 모바일 뒤로가기 버튼 */}
        <button
          onClick={onBack}
          className="md:hidden absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="pl-12 md:pl-0">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{category}</h1>
              <p className="text-gray-600">
                {category}와 관련된 다양한 모임을 만나보세요
              </p>
            </div>
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginModal(true);
                } else {
                  onCreateClick?.();
                }
              }}
              className="flex items-center gap-2 bg-[#00A651] text-white font-bold px-6 py-3 rounded-full hover:bg-[#008E41] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">모임 만들기</span>
            </button>
          </div>
        </div>
      </div>

      {/* 모임 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* 소분류 카테고리 필터 */}
        <div className="mb-8">
          {/* 모바일: 드롭다운 */}
          <div className="sm:hidden">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:border-[#00A651] transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23666' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '40px'
              }}
            >
              {currentSubcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>

          {/* 데스크톱: 가로 스크롤 버튼 */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {currentSubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => setSelectedSubcategory(subcategory)}
                  className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedSubcategory === subcategory
                      ? 'bg-[#00A651] text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMeetings.map((meeting) => {
            const isLiked = likedMeetings.has(meeting.id);
            
            return (
              <div
                key={meeting.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => onMeetingClick(meeting)}
              >
                {/* 데스크톱 버전 - 가로형 레이아웃 */}
                <div className="hidden sm:block">
                  <div className="flex">
                    {/* 썸네일 이미지 */}
                    <div className="relative w-64 h-40 flex-shrink-0 overflow-hidden">
                      <ImageWithFallback
                        src={meeting.image}
                        alt={meeting.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {/* 하트 아이콘 */}
                      <button 
                        onClick={(e) => handleLikeClick(e, meeting.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all duration-300 ${
                            isLiked
                              ? 'fill-red-500 text-red-500 scale-110'
                              : 'text-gray-600 hover:text-red-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 p-6 flex items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-[#00A651] transition-colors mb-3">
                          {meeting.title}
                        </h3>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                            <span>{meeting.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                            <span>{meeting.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* 인원수 - 세로 중앙 */}
                      <div className="flex items-center text-sm font-medium text-[#00A651] flex-shrink-0">
                        <Users className="w-4 h-4 mr-1" />
                        {meeting.participants}/{meeting.maxParticipants}명
                      </div>

                      {/* 삭제 버튼 - 카드 우측 */}
                      {isAdmin && (
                        <button
                          onClick={(e) => handleDeleteClick(e, meeting.id)}
                          className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 hover:scale-110 transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2
                            className="w-5 h-5 text-red-500 hover:text-red-600 transition-colors"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 모바일 버전 - 작은 가로형 레이아웃 */}
                <div className="sm:hidden flex gap-3 p-3">
                  {/* 왼쪽: 썸네일 */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={meeting.image}
                      alt={meeting.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={(e) => handleLikeClick(e, meeting.id)}
                      className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {/* 관리자 삭제 버튼 */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteClick(e, meeting.id)}
                        className="absolute bottom-1 right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* 제목 */}
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                      {meeting.title}
                    </h3>

                    {/* 장소 */}
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{meeting.location}</span>
                    </div>

                    {/* 일정 */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{meeting.date}</span>
                    </div>

                    {/* 리더 정보와 인원 수 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="w-5 h-5 bg-[#00A651] rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                          {meeting.host.charAt(0)}
                        </div>
                        <span className="ml-1.5 text-xs text-gray-700 font-medium truncate">
                          {meeting.host}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-[#00A651] font-medium ml-2 flex-shrink-0">
                        <Users className="w-3 h-3 mr-1" />
                        {meeting.participants}/{meeting.maxParticipants}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              아직 등록된 모임이 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-[#00A651]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#00A651]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h3>
            <p className="text-gray-600 mb-6">모임을 즐겨찾기에 추가하시려면 로그인해주세요.</p>
            <button
              onClick={() => {
                setShowLoginModal(false);
                onLoginClick?.();
              }}
              className="w-full bg-[#00A651] text-white font-bold py-3 px-6 rounded-full hover:bg-[#008E41] transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      )}

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-[#FF4D4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-[#FF4D4F]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">모임 삭제 확인</h3>
            <p className="text-gray-600 mb-6">정말로 이 모임을 삭제하시겠습니까?</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-full hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="w-full bg-[#FF4D4F] text-white font-bold py-3 px-6 rounded-full hover:bg-[#FF3B30] transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNavigation
        onHomeClick={() => onLogoClick?.()}
        onMyPageClick={() => onMyPageClick?.()}
        onCategoryClick={() => onLogoClick?.()}
        onSearchClick={() => onLogoClick?.()}
        isLoggedIn={!!user}
      />
    </div>
  );
}