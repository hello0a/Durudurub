import { ArrowLeft, Users, Crown, Clock, Trash2, UserCheck, UserX, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { BottomNavigation } from '@/components/footer/BottomNavigation';
import { toast, Toaster } from 'sonner';

interface MyGroupsManagementProps {
  onBack: () => void;
  user: any;
  profileImage?: string | null;
  onSignupClick?: () => void;
  onLoginClick?: () => void;
  onLogoClick?: () => void;
  onNoticeClick?: () => void;
  onMyPageClick?: () => void;
  onMiniGameClick?: () => void;
  onMyMeetingsClick?: () => void;
  onLogout?: () => void;
  onCommunityClick?: (communityId: string) => void;
}

interface Member {
  id: string;
  userId: string;
  nickname: string;
  joinedAt: string;
  status: 'pending' | 'approved';
}

interface Group {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  maxMembers: number;
  imageUrl?: string;
  role: 'leader' | 'member';
  status: 'approved' | 'pending';
  members?: Member[];
}

interface ConfirmModal {
  isOpen: boolean;
  type: 'approve' | 'reject' | 'remove' | 'deleteGroup' | 'cancelRequest' | null;
  groupId: string | null;
  memberId: string | null;
  memberName: string | null;
}

export function MyGroupsManagement({ onBack, user, profileImage, onSignupClick, onLoginClick, onLogoClick, onNoticeClick, onMyPageClick, onMiniGameClick, onMyMeetingsClick, onLogout, onCommunityClick }: MyGroupsManagementProps) {
  const [activeTab, setActiveTab] = useState<'joined' | 'leader' | 'pending'>('joined');
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal>({
    isOpen: false,
    type: null,
    groupId: null,
    memberId: null,
    memberName: null,
  });

  // 상태로 관리되는 데이터
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([
    {
      id: '1',
      name: '주말 등산 모임',
      category: '동',
      memberCount: 12,
      maxMembers: 20,
      role: 'member',
      status: 'approved',
    },
    {
      id: '2',
      name: '독서 토론 클럽',
      category: '문화',
      memberCount: 8,
      maxMembers: 15,
      role: 'member',
      status: 'approved',
    },
  ]);

  const [leaderGroups, setLeaderGroups] = useState<Group[]>([
    {
      id: '3',
      name: '사진 촬영 동호회',
      category: '취미',
      memberCount: 15,
      maxMembers: 25,
      role: 'leader',
      status: 'approved',
      members: [
        {
          id: 'm1',
          userId: 'user001',
          nickname: '김철수',
          joinedAt: '2025-01-15',
          status: 'approved',
        },
        {
          id: 'm2',
          userId: 'user002',
          nickname: '이영희',
          joinedAt: '2025-01-20',
          status: 'approved',
        },
        {
          id: 'm3',
          userId: 'user003',
          nickname: '박민수',
          joinedAt: '2025-01-27',
          status: 'pending',
        },
        {
          id: 'm4',
          userId: 'user004',
          nickname: '최지혜',
          joinedAt: '2025-01-27',
          status: 'pending',
        },
      ],
    },
  ]);

  const [pendingGroups, setPendingGroups] = useState<Group[]>([
    {
      id: '4',
      name: '요리 레시피 공유',
      category: '요리',
      memberCount: 10,
      maxMembers: 20,
      role: 'member',
      status: 'pending',
    },
  ]);

  const handleLeaveGroup = (groupId: string, groupName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'remove',
      groupId: groupId,
      memberId: null,
      memberName: groupName,
    });
  };

  const handleApproveMember = (groupId: string, memberId: string, memberName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'approve',
      groupId: groupId,
      memberId: memberId,
      memberName: memberName,
    });
  };

  const handleRejectMember = (groupId: string, memberId: string, memberName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'reject',
      groupId: groupId,
      memberId: memberId,
      memberName: memberName,
    });
  };

  const handleRemoveMember = (groupId: string, memberId: string, memberName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'remove',
      groupId: groupId,
      memberId: memberId,
      memberName: memberName,
    });
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'deleteGroup',
      groupId: groupId,
      memberId: null,
      memberName: groupName,
    });
  };

  const handleCancelRequest = (groupId: string, groupName: string) => {
    setConfirmModal({
      isOpen: true,
      type: 'cancelRequest',
      groupId: groupId,
      memberId: null,
      memberName: groupName,
    });
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const renderGroupCard = (group: Group, showLeaveButton: boolean, showManagement: boolean) => {
    const isExpanded = expandedGroup === group.id;
    const pendingMembers = group.members?.filter(m => m.status === 'pending') || [];
    const approvedMembers = group.members?.filter(m => m.status === 'approved') || [];

    const handleCardClick = () => {
      console.log('카드 클릭됨:', group.id, group.name);
      if (onCommunityClick) {
        console.log('onCommunityClick 호출');
        onCommunityClick(group.id);
      } else {
        console.log('onCommunityClick이 정의되지 않음');
      }
    };

    return (
      <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div 
          className="flex items-start justify-between cursor-pointer hover:bg-gray-50 -m-6 p-6 rounded-xl transition-colors"
          onClick={handleCardClick}
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00A651] to-[#008f46] rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                {group.role === 'leader' && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{group.category}</p>
              <p className="text-sm text-gray-500">
                멤버 {group.memberCount}/{group.maxMembers}명
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            {showLeaveButton && (
              <button
                onClick={() => handleLeaveGroup(group.id, group.name)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                탈퇴
              </button>
            )}
            {showManagement && (
              <>
                <button
                  onClick={() => toggleGroupExpansion(group.id)}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-[#00A651] hover:bg-[#00A651]/10 rounded-lg transition-colors"
                >
                  멤버 관리
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id, group.name)}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  모임 삭제
                </button>
              </>
            )}
          </div>
        </div>

        {/* 리더 전용: 멤버 관리 섹션 */}
        {showManagement && isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            {/* 가입 요청 대기 중인 멤버 */}
            {pendingMembers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  가입 요청 ({pendingMembers.length})
                </h4>
                <div className="space-y-2">
                  {pendingMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-orange-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{member.nickname}</p>
                        <p className="text-xs text-gray-500">신청일: {member.joinedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveMember(group.id, member.id, member.nickname)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#00A651] text-white text-sm rounded-lg hover:bg-[#008f46] transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                          승인
                        </button>
                        <button
                          onClick={() => handleRejectMember(group.id, member.id, member.nickname)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                          거부
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 승인된 멤버 목록 */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3">
                승인된 멤버 ({approvedMembers.length})
              </h4>
              <div className="space-y-2">
                {approvedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{member.nickname}</p>
                      <p className="text-xs text-gray-500">가입일: {member.joinedAt}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(group.id, member.id, member.nickname)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      추방하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Toaster position="top-center" richColors />
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

      {/* 모바일 뒤로가기 버튼 */}
      <div className="md:hidden sticky top-16 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <button
          onClick={onBack}
          className="flex items-center justify-center text-gray-700 hover:text-[#00A651] transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 px-3 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'joined'
                ? 'bg-[#00A651] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">참여 중인 모임</span>
              <span className="inline sm:hidden text-xs">참여중</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'joined' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {joinedGroups.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leader')}
            className={`flex-1 px-3 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'leader'
                ? 'bg-[#00A651] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">리더인 모임</span>
              <span className="inline sm:hidden text-xs">리더</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'leader' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {leaderGroups.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-3 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-[#00A651] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">승인 대기 중</span>
              <span className="inline sm:hidden text-xs">대기중</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'pending' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {pendingGroups.length}
              </span>
            </div>
          </button>
        </div>

        {/* 모임 목록 */}
        <div className="space-y-4">
          {activeTab === 'joined' && (
            <>
              {joinedGroups.length > 0 ? (
                joinedGroups.map((group) => renderGroupCard(group, true, false))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">참여 중인 모임이 없습니다</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'leader' && (
            <>
              {leaderGroups.length > 0 ? (
                leaderGroups.map((group) => renderGroupCard(group, false, true))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">리더로 활동 중인 모임이 없습니다</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'pending' && (
            <>
              {pendingGroups.length > 0 ? (
                pendingGroups.map((group) => (
                  <div key={group.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                              승인 대기 중
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{group.category}</p>
                          <p className="text-sm text-gray-500">
                            멤버 {group.memberCount}/{group.maxMembers}명
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelRequest(group.id, group.name)}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        신청 취소
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">가입 신청 중인 모임이 없습니다</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 확인 모달 */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {confirmModal.type === 'approve' && '멤버 승인'}
                {confirmModal.type === 'reject' && '가입 거부'}
                {confirmModal.type === 'remove' && (confirmModal.memberId === null ? '모임 탈퇴' : '멤버 내보내기')}
                {confirmModal.type === 'deleteGroup' && '모임 삭제'}
                {confirmModal.type === 'cancelRequest' && '가입 신청 취소'}
              </h3>
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: null, groupId: null, memberId: null, memberName: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              {confirmModal.type === 'approve' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">{confirmModal.memberName}</span>님의 가입을 승인하시겠습니까?
                  </p>
                  <p className="text-sm text-gray-600">
                    승인하면 멤버가 모임에 참여하여 게시글 작성 및 활동이 가능합니다.
                  </p>
                </div>
              )}
              
              {confirmModal.type === 'reject' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">{confirmModal.memberName}</span>님의 가입을 거부하시겠습니까?
                  </p>
                  <p className="text-sm text-gray-600">
                    거부하면 해당 사용자는 모임에 참여할 수 없습니다.
                  </p>
                </div>
              )}
              
              {confirmModal.type === 'remove' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  {confirmModal.memberId === null ? (
                    // 모임 탈퇴인 경우
                    <>
                      <p className="text-gray-700 mb-2">
                        모임에서 탈퇴 하시겠습니까?
                      </p>
                      <p className="text-sm text-gray-600">
                        탈퇴하면 더 이상 모임 활동을 할 수 없습니다.
                      </p>
                    </>
                  ) : (
                    // 멤버 내보내기인 경우
                    <>
                      <p className="text-gray-700 mb-2">
                        <span className="font-semibold text-gray-900">{confirmModal.memberName}</span>님을 모임에서 내보내시겠습니까?
                      </p>
                      <p className="text-sm text-gray-600">
                        내보내면 해당 멤버�� 더 이상 모임 활동을 할 수 없습니다.
                      </p>
                    </>
                  )}
                </div>
              )}
              
              {confirmModal.type === 'deleteGroup' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">{confirmModal.memberName}</span> 모임을 삭제하시겠습니까?
                  </p>
                  <p className="text-sm text-gray-600">
                    삭제하면 해당 모임은 영구적으로 삭제됩니다.
                  </p>
                </div>
              )}
              
              {confirmModal.type === 'cancelRequest' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">{confirmModal.memberName}</span> 모임의 가입 신청을 취소하시겠습니까?
                  </p>
                  <p className="text-sm text-gray-600">
                    취소하면 해당 모임의 가입 신청이 삭제됩니다.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: null, groupId: null, memberId: null, memberName: null })}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (confirmModal.type === 'approve') {
                    // 멤버 승인
                    setLeaderGroups(prevGroups =>
                      prevGroups.map(group => {
                        if (group.id === confirmModal.groupId) {
                          return {
                            ...group,
                            members: group.members?.map(member => 
                              member.id === confirmModal.memberId 
                                ? { ...member, status: 'approved' as const } 
                                : member
                            )
                          };
                        }
                        return group;
                      })
                    );
                    toast.success('멤버 승인이 완료되었습니다.');
                  } else if (confirmModal.type === 'reject') {
                    // 멤버 거부 - 리스트에서 제거
                    setLeaderGroups(prevGroups =>
                      prevGroups.map(group => {
                        if (group.id === confirmModal.groupId) {
                          return {
                            ...group,
                            members: group.members?.filter(member => member.id !== confirmModal.memberId)
                          };
                        }
                        return group;
                      })
                    );
                    toast.error('가입 신청이 거부되었습니다.');
                  } else if (confirmModal.type === 'remove') {
                    if (confirmModal.memberId === null) {
                      // 모임 탈퇴 - 리스트에서 해당 모임 제거
                      setJoinedGroups(prevGroups => 
                        prevGroups.filter(group => group.id !== confirmModal.groupId)
                      );
                      toast.success('모임에서 탈퇴했습니다.');
                    } else {
                      // 멤버 내보내기 - 해당 멤버 제거
                      setLeaderGroups(prevGroups =>
                        prevGroups.map(group => {
                          if (group.id === confirmModal.groupId) {
                            return {
                              ...group,
                              members: group.members?.filter(member => member.id !== confirmModal.memberId),
                              memberCount: group.memberCount - 1
                            };
                          }
                          return group;
                        })
                      );
                      toast.success('멤버를 내보냈습니다.');
                    }
                  } else if (confirmModal.type === 'deleteGroup') {
                    // 모임 삭제 - 리스트에서 해당 모임 제거
                    setLeaderGroups(prevGroups => 
                      prevGroups.filter(group => group.id !== confirmModal.groupId)
                    );
                    toast.success('모임이 삭제되었습니다.');
                  } else if (confirmModal.type === 'cancelRequest') {
                    // 가입 신청 취소 - 리스트에서 해당 모임 제거
                    setPendingGroups(prevGroups => 
                      prevGroups.filter(group => group.id !== confirmModal.groupId)
                    );
                    toast.success('가입 신청이 취소되었습니다.');
                  }
                  setConfirmModal({ isOpen: false, type: null, groupId: null, memberId: null, memberName: null });
                }}
                className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors ${
                  confirmModal.type === 'approve'
                    ? 'bg-[#00A651] hover:bg-[#008f46]'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmModal.type === 'approve' 
                  ? '승인하기' 
                  : confirmModal.type === 'reject' 
                  ? '거부하기'
                  : confirmModal.type === 'deleteGroup'
                  ? '삭제하기'
                  : confirmModal.type === 'cancelRequest'
                  ? '취소하기'
                  : confirmModal.memberId === null 
                  ? '탈퇴하기' 
                  : '내보내기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모바일 하단 네비게이션 */}
      <BottomNavigation
        onHomeClick={() => onLogoClick?.()}
        onMyPageClick={() => onMyPageClick?.()}
        onCategoryClick={() => onLogoClick?.()}
        onSearchClick={() => {
          // 검색 페이지로 이동 (일단 홈으로)
          onLogoClick?.();
        }}
        isLoggedIn={!!user}
      />
    </div>
  );
}