import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Heart, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface MyMeetingsPageProps {
  onBack: () => void;
  user: any;
  accessToken: string;
  onMeetingClick: (meeting: any) => void;
}

interface Meeting {
  id: number;
  title: string;
  image_url: string;
  category: string;
  subcategory?: string;
  location: string;
  schedule: string;
  current_participants: number;
  max_participants: number;
  host_id: string;
  host_name: string;
  membershipStatus?: 'pending' | 'approved';
}

export function MyMeetingsPage({ onBack, user, accessToken, onMeetingClick }: MyMeetingsPageProps) {
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
  const [approvedMeetings, setApprovedMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyMeetings();
  }, []);

  const fetchMyMeetings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/my-meetings`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('내 모임 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      // 승인된 모임과 대기 중인 모임 분리
      const approved = data.filter((m: Meeting) => m.membershipStatus === 'approved');
      const pending = data.filter((m: Meeting) => m.membershipStatus === 'pending');
      
      setApprovedMeetings(approved);
      setPendingMeetings(pending);
    } catch (error) {
      console.error('Error fetching my meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMeetings = activeTab === 'approved' ? approvedMeetings : pendingMeetings;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">내 모임</h1>
          <p className="text-gray-600 mt-2">가입한 모임을 확인하고 관리하세요</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('approved')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'approved'
                  ? 'border-[#00A651] text-[#00A651]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              승인된 모임 ({approvedMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-[#00A651] text-[#00A651]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              승인 대기중 ({pendingMeetings.length})
            </button>
          </div>
        </div>
      </div>

      {/* 모임 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A651]"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : currentMeetings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {activeTab === 'approved' 
                ? '아직 승인된 모임이 없습니다.' 
                : '승인 대기 중인 모임이 없습니다.'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              관심있는 모임에 가입 신청해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMeetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick(meeting)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
              >
                {/* 데스크톱 버전 - 세로형 레이아웃 */}
                <div className="hidden md:block">
                  {/* 모임 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={meeting.image_url}
                      alt={meeting.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {activeTab === 'pending' && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        승인 대기중
                      </div>
                    )}
                    {meeting.subcategory && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {meeting.category} · {meeting.subcategory}
                      </div>
                    )}
                  </div>

                  {/* 모임 정보 */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#00A651] transition-colors">
                      {meeting.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{meeting.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{meeting.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {meeting.current_participants}/{meeting.max_participants}명
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          호스트: {meeting.host_name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 모바일 버전 - 가로형 레이아웃 */}
                <div className="md:hidden flex gap-3 p-3">
                  {/* 왼쪽: 썸네일 */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={meeting.image_url}
                      alt={meeting.title}
                      className="w-full h-full object-cover"
                    />
                    {activeTab === 'pending' && (
                      <div className="absolute top-1 left-1 bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        대기
                      </div>
                    )}
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* 제목 */}
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">
                        {meeting.title}
                      </h3>
                      {meeting.subcategory && (
                        <p className="text-[10px] text-gray-500 mb-1">
                          {meeting.category} · {meeting.subcategory}
                        </p>
                      )}
                    </div>

                    {/* 장소 */}
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{meeting.location}</span>
                    </div>

                    {/* 일정 */}
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{meeting.schedule}</span>
                    </div>

                    {/* 리더 정보와 인원 수 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="w-5 h-5 bg-[#00A651] rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                          {meeting.host_name.charAt(0)}
                        </div>
                        <span className="ml-1.5 text-xs text-gray-700 font-medium truncate">
                          {meeting.host_name}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
                        <Users className="w-3 h-3 mr-1" />
                        {meeting.current_participants}/{meeting.max_participants}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}