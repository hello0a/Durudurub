import { CommunityCard } from './CommunityCard';
import { ArrowLeft } from 'lucide-react';

interface CategoryListPageProps {
  category: string;
  onBack: () => void;
  user?: any;
  onLoginClick?: () => void;
}

const musicCommunities = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1567663711269-0351025d18a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGJhbmQlMjBwcmFjdGljZXxlbnwxfHx8fDE3Njk0MzYyMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '밴드 합주 모임',
    description: '함께 음악을 만들고 연주하는 즐거움을 나누는 밴드 모임입니다.',
    location: '홍대 합주실',
    hostName: '음악러버',
    participants: { current: 8, max: 10 },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
    title: '기타 초보 클래스',
    description: '기타를 처음 배우는 분들을 위한 친절한 클래스입니다.',
    location: '강남구 논현동',
    hostName: '기타쌤',
    participants: { current: 15, max: 20 },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    title: '피아노 소모임',
    description: '클래식부터 재즈까지, 다양한 피아노 음악을 함께 연주합니다.',
    location: '서초구 서초동',
    hostName: '피아니스트김',
    participants: { current: 6, max: 8 },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    title: '재즈 감상 모임',
    description: '매주 수요일, 함께 재즈를 듣고 이야기 나누는 모임입니다.',
    location: '마포구 상수동',
    hostName: '재즈마니아',
    participants: { current: 12, max: 15 },
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&h=300&fit=crop',
    title: '보컬 트레이닝',
    description: '노래 실력을 향상시키고 싶은 분들을 위한 보컬 레슨입니다.',
    location: '용산구 이태원동',
    hostName: '보컬코치박',
    participants: { current: 10, max: 12 },
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&fit=crop',
    title: '작곡 스터디',
    description: '자신만의 음악을 만들고 싶은 분들의 작곡 스터디 모임입니다.',
    location: '온라인',
    hostName: '작곡가이',
    participants: { current: 7, max: 10 },
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&fit=crop',
    title: '드럼 클래스',
    description: '기초부터 차근차근 배우는 드럼 레슨입니다.',
    location: '성동구 성수동',
    hostName: '드러머최',
    participants: { current: 5, max: 8 },
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    title: '인디음악 팬클럽',
    description: '인디 음악을 사랑하는 사람들의 모임, 공연도 함께 갑니다.',
    location: '서울 전역',
    hostName: '인디러버',
    participants: { current: 28, max: 30 },
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1519139270028-14ea830d8d31?w=400&h=300&fit=crop',
    title: '오케스트라 동호회',
    description: '클래식 오케스트라 연주를 함께하는 아마추어 동호회입니다.',
    location: '강남구 대치동',
    hostName: '지휘자정',
    participants: { current: 42, max: 50 },
  },
];

export function CategoryListPage({ category, onBack, user, onLoginClick }: CategoryListPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{category} 모임</h1>
          <p className="text-gray-600 mt-2">총 {musicCommunities.length}개의 모임</p>
        </div>
      </div>

      {/* 모임 리스트 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              image={community.image}
              title={community.title}
              description={community.description}
              location={community.location}
              hostName={community.hostName}
              participants={community.participants}
              user={user}
              onLoginClick={onLoginClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}