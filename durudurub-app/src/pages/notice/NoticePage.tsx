import { ArrowLeft, Bell, Calendar, Eye, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Navbar } from '@/components/header/Navbar';
import { toast } from 'sonner';

interface NoticePageProps {
  onBack: () => void;
  user: any;
  accessToken: string | null;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onLogoClick?: () => void;
  onMyPageClick?: () => void;
  onMiniGameClick?: () => void;
  onMyMeetingsClick?: () => void;
  profileImage?: string | null;
  onLogout?: () => void;
  onNoticeWriteClick?: (notice?: Notice | null) => void;
}

interface Notice {
  id: number;
  title: string;
  date: string;
  views: number;
  category: '공지' | '이벤트' | '업데이트' | '점검';
  content: string;
  isImportant: boolean;
}

export function NoticePage({ onBack, user, accessToken, onSignupClick, onLoginClick, onLogoClick, onMyPageClick, onMiniGameClick, onMyMeetingsClick, profileImage, onLogout, onNoticeWriteClick }: NoticePageProps) {
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 1,
      title: '두루두룹 서비스 정식 오픈 안내',
      date: '2026-01-20',
      views: 1245,
      category: '공지',
      content: '안녕하세요, 두루두룹입니다!\n\n드디어 소모임 커뮤니티 서비스 \'두루두룹\'이 정식으로 오픈되었습니다. 🎉\n\n두루두룹은 같은 관심사를 가진 사람들이 모여 다양한 활동을 함께 즐길 수 있는 플랫폼입니다. 운동, 문화/예술, 게임, 푸드 등 다양한 카테고리의 모임을 만들고 참여할 수 있습니다.\n\n주요 기능:\n• 다양한 카테고리의 모임 생성 및 참여\n• 모임별 게시글 작성 및 댓글 소통\n• 관심있는 모임 즐겨찾기\n• 리더의 승인을 통한 안전한 모임 운영\n\n많은 관심과 이용 부탁드립니다.\n감사합니다!',
      isImportant: true,
    },
    {
      id: 2,
      title: '신규 회원 환영 이벤트 - 첫 모임 참여 시 포인트 지급!',
      date: '2026-01-22',
      views: 856,
      category: '이벤트',
      content: '🎁 신규 회원 환영 이벤트 안내\n\n두루두룹에 가입하신 모든 신규 회원분들께 특별한 혜택을 드립니다!\n\n이벤트 기간: 2026년 1월 22일 ~ 2월 28일\n\n혜택 내용:\n1️⃣ 회원가입 완료 시 500 포인트 지급\n2️⃣ 첫 모임 참여 승인 시 1,000 포인트 추가 지급\n3️⃣ 첫 게시글 작성 시 300 포인트 추가 지급\n\n※ 포인트는 향후 프리미엄 기능 이용 시 사용 가능합니다.\n\n여러분의 활발한 참여를 기다립니다! 💚',
      isImportant: true,
    },
    {
      id: 3,
      title: '모임 게시글 사진 업로드 기능 추가 업데이트',
      date: '2026-01-25',
      views: 432,
      category: '업데이트',
      content: '📢 새로운 기능이 추가되었습니다!\n\n이번 업데이트에서 모임 게시글에 사진을 업로드할 수 있는 기능이 추가되었습니다.\n\n주요 업데이트 내용:\n✅ 게시글 작성 시 최대 10장의 사진 업로드 가능\n✅ 사진 미리보 및 삭제 기능\n✅ 게시글에 댓글 기능 추가\n✅ 댓글 실시간 알림 기능\n\n모임 활동 사진을 공유하고, 멤버들과 더욱 활발하게 소통해보세요!\n\n더 나은 서비스를 위해 항상 노력하겠습니다.\n감사합니다.',
      isImportant: false,
    },
    {
      id: 4,
      title: '서버 정기 점검 안내 (1월 27일 새벽 2시~4시)',
      date: '2026-01-26',
      views: 678,
      category: '점검',
      content: '🔧 서버 정기 점검 안내\n\n안정적인 서비스 제공을 위해 정기 점검을 실시합니다.\n\n점검 일시: 2026년 1월 27일 (월) 02:00 ~ 04:00 (약 2시간)\n\n점검 내용:\n• 서버 안정화 작업\n• 데이터베이스 최적화\n• 보안 업데이트 적용\n\n점검 시간 동안 서비스 이용이 일시적으로 중단됩니다.\n양해 부탁드리며, 점검이 조기 완료될 경우 별도 공지 없이 서비스가 재개됩니다.\n\n이용에 불편을 드려 죄송합니다.\n감사합니다.',
      isImportant: false,
    },
    {
      id: 5,
      title: '부적절한 게시글 및 모임 신고 기능 안내',
      date: '2026-01-24',
      views: 523,
      category: '공지',
      content: '📌 건전한 커뮤니티 문화를 위한 신고 기능 안내\n\n두루두룹은 모든 회원이 안전하고 즐겁게 이용할 수 있는 커뮤니티를 만들기 위해 노력하고 있습니다.\n\n신고 대상:\n• 욕설, 비방, 차별적 표현이 포함된 게시글\n• 허위 정보나 사기성 모임\n• 불법적이거나 부적절한 내용\n• 개인정보 무단 노출\n\n신고 방법:\n각 게시글 및 모임 상세 페이지의 우측 상단 [신고하기] 버튼을 클릭해주세요.\n\n신고 처리:\n접수된 신고는 24시간 내 검토되며, 운영 정책에 따라 조치됩니다.\n\n여러분의 적극적인 참여로 더 나은 커뮤니티를 만들어갑시다.\n감사합니다.',
      isImportant: false,
    },
  ]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(false);

  // 공지사항 삭제 모달 state
  const [showDeleteNoticeModal, setShowDeleteNoticeModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '공지' as Notice['category'],
    isImportant: false,
  });

  const isAdmin = user?.isAdmin === true;

  // 공지사항 목록 가져오기 - 샘플 데이터를 사용하므로 주석 처리
  // useEffect(() => {
  //   fetchNotices();
  // }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/notices`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (data.success && data.notices && data.notices.length > 0) {
        setNotices(data.notices);
      }
      // 데이터가 없으면 샘플 데이터를 그대로 유지
    } catch (error) {
      console.error('공지사항 목록 가져오기 실패:', error);
      // 에러 발생 시에도 샘플 데이터 유지
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: Notice['category']) => {
    switch (category) {
      case '공지':
        return 'bg-blue-100 text-blue-700';
      case '이벤트':
        return 'bg-pink-100 text-pink-700';
      case '업데이트':
        return 'bg-green-100 text-green-700';
      case '점검':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleNoticeClick = async (notice: Notice) => {
    setSelectedNotice(notice);
    
    // 조회수 증가
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/notices/${notice.id}/view`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  const handleCreateClick = () => {
    onNoticeWriteClick?.(null);
  };

  const handleEditClick = (notice: Notice) => {
    onNoticeWriteClick?.(notice);
  };

  const handleDelete = (noticeId: number) => {
    setNoticeToDelete(noticeId);
    setShowDeleteNoticeModal(true);
  };

  const confirmDeleteNotice = async () => {
    if (!noticeToDelete) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/notices/${noticeToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('공지사항이 삭제되었습니다.');
        fetchNotices();
        if (selectedNotice?.id === noticeToDelete) {
          setSelectedNotice(null);
        }
      } else {
        toast.error(`삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
      toast.error('공지사항 삭제 중 오류가 발생했습니다.');
    } finally {
      setShowDeleteNoticeModal(false);
      setNoticeToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const url = editingNotice
        ? `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/notices/${editingNotice.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/notices`;

      console.log('공지사항 작성/수정 요청:', {
        url,
        method: editingNotice ? 'PUT' : 'POST',
        accessToken: accessToken ? '있음' : '없음',
        formData
      });

      const response = await fetch(url, {
        method: editingNotice ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      console.log('공지사항 작성/수정 응답:', {
        status: response.status,
        data
      });

      if (data.success) {
        toast.success(editingNotice ? '공지사항이 수정되었습니다.' : '공지사항이 작성되었습니다.');
        setShowModal(false);
        fetchNotices();
        if (editingNotice && selectedNotice?.id === editingNotice.id) {
          setSelectedNotice(null);
        }
      } else {
        console.error('공지사항 작성/수정 실패:', data);
        
        // JWT 에러인 경우 특별 처리
        if (response.status === 401 || data.message === 'Invalid JWT') {
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
          // 로컬 스토리지 클리어
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          // 페이지 새로고침하여 로그인 상태 초기화
          window.location.reload();
        } else {
          toast.error(`실패: ${data.error || '알 수 없는 오류가 발생했습니다.'}`);
        }
      }
    } catch (error) {
      console.error('공지사항 저장 실패:', error);
      toast.error('공지사항 저장 중 오류가 발생했습니다.');
    }
  };

  // 작성/수정 모달
  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingNotice ? '공지사항 수정' : '공지사항 작성'}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Notice['category'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="공지">공지</option>
                <option value="이벤트">이벤트</option>
                <option value="업데이트">업데이트</option>
                <option value="점검">점검</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="w-4 h-4 text-[#00A651] rounded focus:ring-[#00A651]"
                />
                <span className="text-sm font-medium text-gray-700">중요 공지사항으로 표시</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#00A651] text-white rounded-lg font-medium hover:bg-[#008f47] transition-colors"
              >
                {editingNotice ? '수정' : '작성'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 공지사항 상세 보기
  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 네비게이션 바 */}
        <Navbar
          onSignupClick={onSignupClick}
          onLoginClick={onLoginClick}
          onLogoClick={onLogoClick}
          onNoticeClick={() => {}} // 이미 공지사항 페이지에 있으므로 빈 함수
          onMyPageClick={onMyPageClick}
          onMiniGameClick={onMiniGameClick}
          onMyMeetingsClick={onMyMeetingsClick}
          user={user}
          profileImage={profileImage}
          onLogout={onLogout}
        />
        
        {/* 헤더 */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedNotice(null)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f47] transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>목록으로</span>
            </button>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(selectedNotice)}
                  className="px-4 py-2 text-sm border border-[#00A651] text-[#00A651] rounded-lg hover:bg-[#00A651] hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4 inline mr-1" />
                  수정
                </button>
                <button
                  onClick={() => handleDelete(selectedNotice.id)}
                  className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 공지사항 상세 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* 카테고리 배지 */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedNotice.category)}`}>
                {selectedNotice.category}
              </span>
              {selectedNotice.isImportant && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                  중요
                </span>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedNotice.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 mb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{selectedNotice.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>조회 {selectedNotice.views?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* 본문 */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedNotice.content}
              </p>
            </div>
          </div>
        </div>

        {renderModal()}

        {/* 공지사항 삭제 확인 모달 */}
        {showDeleteNoticeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative">
              <button
                onClick={() => {
                  setShowDeleteNoticeModal(false);
                  setNoticeToDelete(null);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                공지사항을 삭제하시겠습니까?
              </h3>
              <p className="text-gray-600 mb-6">삭제된 공지사항은 복구할 수 없습니다.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteNoticeModal(false);
                    setNoticeToDelete(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={confirmDeleteNotice}
                  className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 네비게이션 바 */}
      <Navbar
        onSignupClick={onSignupClick}
        onLoginClick={onLoginClick}
        onLogoClick={onLogoClick}
        onNoticeClick={() => {}} // 이미 공지사항 페이지에 있으므로 빈 함수
        onMyPageClick={onMyPageClick}
        onMiniGameClick={onMiniGameClick}
        onMyMeetingsClick={onMyMeetingsClick}
        user={user}
        profileImage={profileImage}
        onLogout={onLogout}
      />
      
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>

          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f47] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">공지사항 작성</span>
            </button>
          )}
        </div>
      </div>

      {/* 공지사항 목록 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* 중요 공지사항 */}
            <div className="border-b bg-red-50">
              {notices.filter(notice => notice.isImportant).map((notice, index) => (
                <div
                  key={notice.id}
                  className={`p-6 cursor-pointer hover:bg-red-100 transition-colors ${
                    index !== 0 ? 'border-t border-red-100' : ''
                  }`}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Bell className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                          중요
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-[#00A651]">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{notice.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {notice.views?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 일반 공지사항 */}
            <div>
              {notices.filter(notice => !notice.isImportant).map((notice, index) => (
                <div
                  key={notice.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                    index !== 0 ? 'border-t' : ''
                  }`}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-[#00A651]">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{notice.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {notice.views?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {renderModal()}

      {/* 공지사항 삭제 확인 모달 */}
      {showDeleteNoticeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative">
            <button
              onClick={() => {
                setShowDeleteNoticeModal(false);
                setNoticeToDelete(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              공지사항을 삭제하시겠습니까?
            </h3>
            <p className="text-gray-600 mb-6">삭제된 공지사항은 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteNoticeModal(false);
                  setNoticeToDelete(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteNotice}
                className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}