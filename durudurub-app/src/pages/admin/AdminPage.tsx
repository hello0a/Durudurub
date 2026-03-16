import React, { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Users,
  FileText,
  Settings,
  BarChart3,
  Search,
  MoreVertical,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  UserPlus,
  Eye,
  Trash2,
  Shield,
  X,
  CheckCircle,
  Ban,
  Clock,
  Image,
  Link,
  Plus,
  Edit,
  Edit2,
  Folder,
  GripVertical,
} from 'lucide-react';
import styles from '@/pages/admin/AdminPage.module.css';
import { Navbar } from '@/components/header/Navbar';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface AdminPageProps {
  onBack: () => void;
  user: any;
  accessToken: string | null;
  profileImage: string | null;
  onSignupClick: () => void;
  onLoginClick: () => void;
  onLogoClick: () => void;
  onNoticeClick: () => void;
  onMyPageClick: () => void;
  onMiniGameClick: () => void;
  onMyMeetingsClick: () => void;
  onLogout: () => void;
  onNavigateToCommunity?: (communityId: string) => void;
}

interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  isSubscribed?: boolean;
  reportCount?: number; // 신고 횟수
}

interface CommunityData {
  id: string;
  title: string;
  category: string;
  leaderName: string;
  memberCount: number;
  createdAt: string;
  status: 'active' | 'pending' | 'inactive';
}

interface ReportData {
  id: string;
  reporterName: string;
  reportedContent: string;
  reportedUserId?: string; // 신고된 사용자 ID
  reportedUserName?: string; // 신고된 사용자 이름
  reportedUserEmail?: string; // 신고된 사용자 이메일
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

interface BannerData {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: string;
  order: number;
  position: 'Main' | 'Side' | 'PopUp';
  startDate: string;
  endDate: string;
  clickCount: number;
  description?: string; // 배너 설명 (선택 사항)
}

const ItemTypes = {
  SUBCATEGORY: 'subcategory',
  PARENT_CATEGORY: 'parentcategory'
};

interface DraggableSubCategoryProps {
  sub: { id: string; name: string; description: string; createdAt: string; communityCount: number; parentId?: string | null; iconUrl?: string };
  index: number;
  parentId: string;
  moveSubCategory: (parentId: string, dragIndex: number, hoverIndex: number) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DraggableSubCategory({ sub, index, parentId, moveSubCategory, onEdit, onDelete }: DraggableSubCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 2초 후 자동으로 모드 해제
  useEffect(() => {
    if (isDeleteMode || isEditMode) {
      const timer = setTimeout(() => {
        setIsDeleteMode(false);
        setIsEditMode(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isDeleteMode, isEditMode]);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SUBCATEGORY,
    item: { index, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isDeleteMode && !isEditMode, // 모드가 활성화되면 드래그 비활성화
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SUBCATEGORY,
    hover(item: { index: number; parentId: string }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragParentId = item.parentId;

      // 같은 부모의 자식끼리만 순서 변경 가능
      if (dragParentId !== parentId) {
        return;
      }

      // 같은 위치면 아무것도 하지 않음
      if (dragIndex === hoverIndex) {
        return;
      }

      moveSubCategory(parentId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 18px',
        borderRadius: '30px',
        border: isDeleteMode ? '2px solid #ef4444' : isEditMode ? '2px solid #00A651' : '2px solid #e5e7eb',
        backgroundColor: isDeleteMode ? '#fee2e2' : isEditMode ? '#f0fdf4' : '#ffffff',
        cursor: isDragging ? 'grabbing' : (isDeleteMode || isEditMode ? 'pointer' : 'grab'),
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isDeleteMode ? '0 4px 6px -1px rgba(239, 68, 68, 0.1)' : isEditMode ? '0 4px 6px -1px rgba(0, 166, 81, 0.15)' : '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (isDeleteMode) {
          onDelete();
          setIsDeleteMode(false);
        } else if (isEditMode) {
          onEdit();
          setIsEditMode(false);
        } else {
          setIsDeleteMode(true);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteMode(false);
        setIsEditMode(true);
      }}
      onMouseEnter={(e) => {
        if (!isDeleteMode && !isEditMode) {
          e.currentTarget.style.borderColor = '#00A651';
          e.currentTarget.style.backgroundColor = '#f0fdf4';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 166, 81, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDeleteMode && !isEditMode) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
      }}
    >
      {/* 삭제 아이콘 (삭제 모드일 때만) */}
      {isDeleteMode && (
        <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
      )}
      
      {/* 수정 아이콘 (수정 모드일 때만) */}
      {isEditMode && (
        <Edit2 className="w-4 h-4" style={{ color: '#00A651' }} />
      )}
      
      {/* 카테고리명 */}
      <div style={{ 
        fontSize: '0.9375rem', 
        fontWeight: '600', 
        color: isDeleteMode ? '#ef4444' : isEditMode ? '#00A651' : '#374151',
        letterSpacing: '-0.01em',
      }}>
        {sub.name}
      </div>
    </div>
  );
}

interface DraggableParentCategoryProps {
  parent: { id: string; name: string; description: string; createdAt: string; communityCount: number; parentId?: string | null; iconUrl?: string };
  index: number;
  moveParentCategory: (dragIndex: number, hoverIndex: number) => void;
  onDelete: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

function DraggableParentCategory({ parent, index, moveParentCategory, onDelete, onEdit, children }: DraggableParentCategoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PARENT_CATEGORY,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.PARENT_CATEGORY,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // 같은 위치면 아무것도 하지 않음
      if (dragIndex === hoverIndex) {
        return;
      }

      moveParentCategory(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div 
      ref={ref}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        opacity: isDragging ? 0.6 : 1,
        cursor: 'grab',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
      }}
    >
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, rgba(0, 166, 81, 0.05) 0%, rgba(0, 166, 81, 0.02) 100%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      
      {/* 대분류 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f3f4f6',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <GripVertical className="w-5 h-5" style={{ color: '#9ca3af', cursor: 'grab', flexShrink: 0 }} />
          
          {/* 대분류 이미지 */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #00A651',
            flexShrink: 0,
            boxShadow: '0 4px 6px -1px rgba(0, 166, 81, 0.2)',
            background: parent.iconUrl ? 'transparent' : 'linear-gradient(135deg, #00A651 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.25rem',
            fontWeight: '700',
          }}>
            {parent.iconUrl ? (
              <img 
                src={parent.iconUrl} 
                alt={parent.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              parent.name.substring(0, 2)
            )}
          </div>
          
          <div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#111827', 
              margin: 0,
              marginBottom: '4px',
            }}>
              {parent.name}
            </h3>
            {parent.description && (
              <p style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                margin: 0,
                fontWeight: '500',
              }}>
                {parent.description}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            padding: '6px 14px',
            backgroundColor: '#f0fdf4',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#00A651',
            border: '1px solid #bbf7d0',
          }}>
            {parent.communityCount}개 모임
          </div>
          {onEdit && (
            <button
              className={styles.editButton}
              onClick={onEdit}
              title="수정"
              style={{
                padding: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#00A651';
                e.currentTarget.style.borderColor = '#00A651';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) (icon as HTMLElement).style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                const icon = e.currentTarget.querySelector('svg');
                if (icon) (icon as HTMLElement).style.color = '#6b7280';
              }}
            >
              <Edit2 className="w-5 h-5" style={{ color: '#6b7280', transition: 'color 0.2s' }} />
            </button>
          )}
          <button
            className={styles.deleteButton}
            onClick={onDelete}
            title="삭제"
            style={{
              padding: '10px',
              backgroundColor: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.borderColor = '#ef4444';
              const icon = e.currentTarget.querySelector('svg');
              if (icon) (icon as HTMLElement).style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#fecaca';
              const icon = e.currentTarget.querySelector('svg');
              if (icon) (icon as HTMLElement).style.color = '#ef4444';
            }}
          >
            <Trash2 className="w-5 h-5" style={{ color: '#ef4444', transition: 'color 0.2s' }} />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

export function AdminPage({
  onBack,
  user,
  accessToken,
  profileImage,
  onSignupClick,
  onLoginClick,
  onLogoClick,
  onNoticeClick,
  onMyPageClick,
  onMiniGameClick,
  onMyMeetingsClick,
  onLogout,
  onNavigateToCommunity,
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'communities' | 'reports' | 'banners' | 'categories'>('dashboard');
  
  // 샘플 사용자 데이터
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      username: '관리자',
      email: 'admin',
      createdAt: '2024-01-15T09:00:00Z',
      isAdmin: true,
      isSubscribed: true,
    },
    {
      id: '2',
      username: '테스트유저',
      email: 'test',
      createdAt: '2024-02-20T14:30:00Z',
      isAdmin: false,
      isSubscribed: true,
    },
    {
      id: '3',
      username: '테스트리더',
      email: 'testleader',
      createdAt: '2024-03-10T11:20:00Z',
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: '4',
      username: '김독서',
      email: 'kimdokseo',
      createdAt: '2024-03-15T16:45:00Z',
      isAdmin: false,
      isSubscribed: true,
    },
    {
      id: '5',
      username: '이운동',
      email: 'leeundong',
      createdAt: '2024-04-01T10:10:00Z',
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: '6',
      username: '박음악',
      email: 'parkeumak',
      createdAt: '2024-04-12T13:25:00Z',
      isAdmin: false,
      isSubscribed: true,
    },
    {
      id: '7',
      username: '최여행',
      email: 'choiyeohaeng',
      createdAt: '2024-05-05T08:50:00Z',
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: '8',
      username: '정요리',
      email: 'jungyori',
      createdAt: '2024-05-18T15:15:00Z',
      isAdmin: false,
      isSubscribed: true,
    },
    {
      id: '9',
      username: '강게임',
      email: 'kanggame',
      createdAt: '2024-06-02T12:40:00Z',
      isAdmin: false,
      isSubscribed: false,
    },
    {
      id: '10',
      username: '윤사진',
      email: 'yoonsajin',
      createdAt: '2024-06-20T09:30:00Z',
      isAdmin: false,
      isSubscribed: false,
    },
  ]);
  
  // 샘플 모임 데이터
  const [communities, setCommunities] = useState<CommunityData[]>([
    {
      id: '1',
      title: '독서 모임',
      category: '취미',
      leaderName: '김독서',
      memberCount: 15,
      createdAt: '2024-03-15T16:45:00Z',
      status: 'active',
    },
    {
      id: '2',
      title: '조깅 모임',
      category: '운동',
      leaderName: '이운동',
      memberCount: 22,
      createdAt: '2024-04-01T10:10:00Z',
      status: 'active',
    },
    {
      id: '3',
      title: '기타 동호회',
      category: '음악',
      leaderName: '박음악',
      memberCount: 8,
      createdAt: '2024-04-12T13:25:00Z',
      status: 'active',
    },
    {
      id: '4',
      title: '제주도 여행',
      category: '여행',
      leaderName: '최여행',
      memberCount: 12,
      createdAt: '2024-05-05T08:50:00Z',
      status: 'pending',
    },
    {
      id: '5',
      title: '홈 베이킹',
      category: '요리',
      leaderName: '정요리',
      memberCount: 18,
      createdAt: '2024-05-18T15:15:00Z',
      status: 'active',
    },
    {
      id: '6',
      title: '보드게임 클럽',
      category: '게임',
      leaderName: '강게임',
      memberCount: 25,
      createdAt: '2024-06-02T12:40:00Z',
      status: 'active',
    },
    {
      id: '7',
      title: '사진 촬영 모임',
      category: '사진',
      leaderName: '윤사진',
      memberCount: 14,
      createdAt: '2024-06-20T09:30:00Z',
      status: 'active',
    },
    {
      id: '8',
      title: '영어 스터디',
      category: '학습',
      leaderName: 'test',
      memberCount: 10,
      createdAt: '2024-07-01T11:00:00Z',
      status: 'active',
    },
    {
      id: '9',
      title: '테니스 동호회',
      category: '운동',
      leaderName: '이운동',
      memberCount: 16,
      createdAt: '2024-07-10T14:20:00Z',
      status: 'pending',
    },
    {
      id: '100',
      title: '[테스트] 두루두룹 운영진 모임',
      category: '기타',
      leaderName: 'testleader',
      memberCount: 5,
      createdAt: '2024-07-15T10:00:00Z',
      status: 'active',
    },
  ]);
  
  // 샘플 신고 데이터
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: 'report-1',
      reporterName: '박음악',
      reportedContent: '독서 모임 - 부적절한 게시글',
      reportedUserId: '4', // 김독서
      reportedUserName: '김독서',
      reportedUserEmail: 'kimdokseo',
      reason: '욕설 및 비방',
      createdAt: '2024-07-20T10:30:00Z',
      status: 'pending',
    },
    {
      id: 'report-2',
      reporterName: '정요리',
      reportedContent: '조깅 모임 - 스팸 홍보',
      reportedUserId: '5', // 이운동
      reportedUserName: '이운동',
      reportedUserEmail: 'leeundong',
      reason: '스팸/홍보',
      createdAt: '2024-07-18T14:15:00Z',
      status: 'resolved',
    },
    {
      id: 'report-3',
      reporterName: '최여행',
      reportedContent: '기타 동호회 - 사용자 김독서',
      reportedUserId: '4', // 김독서
      reportedUserName: '김독서',
      reportedUserEmail: 'kimdokseo',
      reason: '사기 의심',
      createdAt: '2024-07-15T09:45:00Z',
      status: 'pending',
    },
    {
      id: 'report-4',
      reporterName: '윤사진',
      reportedContent: '홈 베이킹 모임 - 악의적인 댓글',
      reportedUserId: '9', // 강게임
      reportedUserName: '강게임',
      reportedUserEmail: 'kanggame',
      reason: '욕설 및 비방',
      createdAt: '2024-07-22T16:20:00Z',
      status: 'pending',
    },
    {
      id: 'report-5',
      reporterName: '이운동',
      reportedContent: '사진 촬영 모임 - 개인정보 유출',
      reportedUserId: '10', // 윤사진
      reportedUserName: '윤사진',
      reportedUserEmail: 'yoonsajin',
      reason: '개인정보 침해',
      createdAt: '2024-07-21T11:50:00Z',
      status: 'resolved',
    },
    {
      id: 'report-6',
      reporterName: '강게임',
      reportedContent: '제주도 여행 모임 - 금전 요구',
      reportedUserId: '7', // 최여행
      reportedUserName: '최여행',
      reportedUserEmail: 'choiyeohaeng',
      reason: '사기 의심',
      createdAt: '2024-07-19T13:30:00Z',
      status: 'pending',
    },
    {
      id: 'report-7',
      reporterName: '김독서',
      reportedContent: '보드게임 클럽 - 부적절한 이미지',
      reportedUserId: '9', // 강게임
      reportedUserName: '강게임',
      reportedUserEmail: 'kanggame',
      reason: '음란물/선정성',
      createdAt: '2024-07-23T09:15:00Z',
      status: 'pending',
    },
  ]);
  
  // 배너 데이터
  const [banners, setBanners] = useState<BannerData[]>([
    {
      id: 'banner-1',
      title: '두루두룹 프리미엄 구독 홍보',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=200&fit=crop',
      linkUrl: '/payment',
      isActive: true,
      createdAt: '2024-01-10T10:00:00Z',
      order: 1,
      position: 'Main',
      startDate: '2024-01-10',
      endDate: '2024-12-31',
      clickCount: 1250,
      description: '프리미엄 구독으로 무제한 AI 검색과 더 많은 기능을 즐겨보세요!',
    },
    {
      id: 'banner-2',
      title: '신규 모임 생성 이벤트',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=200&fit=crop',
      linkUrl: 'https://example.com/very/long/url/path/to/event/page/with/many/parameters?utm_source=banner&utm_medium=display&utm_campaign=spring2024&session_id=abc123def456',
      isActive: true,
      createdAt: '2024-02-15T14:30:00Z',
      order: 2,
      position: 'Side',
      startDate: '2024-02-15',
      endDate: '2024-06-30',
      clickCount: 820,
      description: '새로운 소모임을 만들고 다양한 사람들과 함께하세요.',
    },
    {
      id: 'banner-3',
      title: '여름 특별 할인',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=200&fit=crop',
      linkUrl: '/payment',
      isActive: false,
      createdAt: '2024-03-20T09:15:00Z',
      order: 3,
      position: 'PopUp',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      clickCount: 450,
      description: '여름 시즌 한정! 구독료 30% 할인 혜택을 놓치지 마세요.',
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityData | null>(null);
  const [showCommunityDetailModal, setShowCommunityDetailModal] = useState(false);
  const [showCommunityDeleteModal, setShowCommunityDeleteModal] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showReportDeleteModal, setShowReportDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState<{ userId: string; userName: string } | null>(null);
  const [blockType, setBlockType] = useState<'temporary' | 'permanent' | null>(null);
  const [blockDays, setBlockDays] = useState<number>(7); // 기본값 7일
  const [toastMessage, setToastMessage] = useState<string>('삭제 되었습니다');
  const [openReportDropdown, setOpenReportDropdown] = useState<string | null>(null);

  // 배너 관리 상태
  const [selectedBanner, setSelectedBanner] = useState<BannerData | null>(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showBannerDetailModal, setShowBannerDetailModal] = useState(false);
  const [showBannerDeleteModal, setShowBannerDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    order: 1,
    position: 'Main' as 'Main' | 'Side' | 'PopUp',
    startDate: '',
    endDate: '',
    clickCount: 0,
    description: '',
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showBannerErrorModal, setShowBannerErrorModal] = useState(false);
  const [bannerErrorMessage, setBannerErrorMessage] = useState('');

  // 카테고리 관리 상태
  const [categories, setCategories] = useState<{ id: string; name: string; description: string; createdAt: string; communityCount: number; parentId?: string | null; iconUrl?: string }[]>([
    { id: '1', name: '독서', description: '책을 읽고 토론하는 모임', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '2', name: '운동', description: '건강한 운동 활동', createdAt: '2024-01-01T00:00:00Z', communityCount: 2, parentId: null },
    { id: '3', name: '음악', description: '음악 관련 활동', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '4', name: '여행', description: '여행 계획 및 정보 공유', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '5', name: '요리', description: '요리 레시피 및 팁 공유', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '6', name: '게임', description: '게임 관련 모임', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '7', name: '사진', description: '사진 촬영 및 편집', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '8', name: '학습', description: '학습 및 자기계발', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    { id: '9', name: '기타', description: '기타 카테고리', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: null },
    // 독서 소분류
    { id: '10', name: '소설', description: '소설 읽기', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '1', iconUrl: 'https://images.unsplash.com/photo-1593882100241-aef1449fe351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3ZlbCUyMGJvb2slMjBpY29ufGVufDF8fHx8MTc2OTc1MjAyMnww&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '11', name: '자기계발서', description: '자기계발 도서', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '1', iconUrl: 'https://images.unsplash.com/photo-1593882100241-aef1449fe351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2slMjBpY29ufGVufDF8fHx8MTc2OTc1MjAyMnww&ixlib=rb-4.1.0&q=80&w=400' },
    // 운동 소분류
    { id: '12', name: '축구', description: '축구 활동', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: '2', iconUrl: 'https://images.unsplash.com/photo-1760890518049-47b9822e1c89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBiYWxsJTIwaWNvbnxlbnwxfHx8fDE3Njk2OTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '13', name: '요가', description: '요가 및 스트레칭', createdAt: '2024-01-01T00:00:00Z', communityCount: 1, parentId: '2', iconUrl: 'https://images.unsplash.com/photo-1758599880425-7862af0a4b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMGljb258ZW58MXx8fHwxNzY5NzUxNzM5fDA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '14', name: '러닝', description: '달리기 활동', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '2', iconUrl: 'https://images.unsplash.com/photo-1590646299178-1b26ab821e34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzY5NjcwNzcxfDA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '15', name: '사이클', description: '자전거 라이딩', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '2', iconUrl: 'https://images.unsplash.com/photo-1631090626454-a0d8c2d02ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwY3ljbGluZ3xlbnwxfHx8fDE3Njk3NTIwNDJ8MA&ixlib=rb-4.1.0&q=80&w=400' },
    // 음악 소분류
    { id: '16', name: '기타', description: '기타 연주', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '3', iconUrl: 'https://images.unsplash.com/photo-1760302356433-c4649245ab8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBtdXNpYyUyMGljb258ZW58MXx8fHwxNzY5NzUyMDMzfDA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '17', name: '피아노', description: '피아노 연주', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '3', iconUrl: 'https://images.unsplash.com/photo-1601701088665-a1e1b53d164c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWFubyUyMGtleWJvYXJkJTIwaWNvbnxlbnwxfHx8fDE3Njk3NTIwMzN8MA&ixlib=rb-4.1.0&q=80&w=400' },
    // 여행 소분류
    { id: '18', name: '등산', description: '산 등반', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '4', iconUrl: 'https://images.unsplash.com/photo-1516570733062-ef4ea4643c45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGljb258ZW58MXx8fHwxNzY5NzUyMDMzfDA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '19', name: '해외여행', description: '해외 여행', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '4', iconUrl: 'https://images.unsplash.com/photo-1741762700358-0caffc392a7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHRyYXZlbCUyMGljb258ZW58MXx8fHwxNzY5NzUyMDM0fDA&ixlib=rb-4.1.0&q=80&w=400' },
    // 요리 소분류
    { id: '20', name: '한식', description: '한국 음식', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '5', iconUrl: 'https://images.unsplash.com/photo-1617850606395-fb6c1f0ce918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGhhdHxlbnwxfHx8fDE3Njk3NTIwNDB8MA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '21', name: '베이킹', description: '제과 제빵', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '5', iconUrl: 'https://images.unsplash.com/photo-1670843840225-2ffcaf483c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWtlJTIwYmFraW5nfGVufDF8fHx8MTc2OTc1MjA0MXww&ixlib=rb-4.1.0&q=80&w=400' },
    // 게임 소분류
    { id: '22', name: '비디오게임', description: '콘솔/PC 게임', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '6', iconUrl: 'https://images.unsplash.com/photo-1611734242174-451181387ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyJTIwaWNvbnxlbnwxfHx8fDE3Njk3NTIwMzV8MA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '23', name: '보드게임', description: '보드게임 모임', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '6', iconUrl: 'https://images.unsplash.com/photo-1769577063771-b83ebe4c4c13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWUlMjBpY29ufGVufDF8fHx8MTc2OTc1MjAzNXww&ixlib=rb-4.1.0&q=80&w=400' },
    // 사진 소분류
    { id: '24', name: '풍경사진', description: '풍경 촬영', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '7', iconUrl: 'https://images.unsplash.com/photo-1656699218644-a2dc232cb950?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGljb258ZW58MXx8fHwxNzY5Njc1MzE0fDA&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '25', name: '인물사진', description: '인물 촬영', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '7', iconUrl: 'https://images.unsplash.com/photo-1735827323331-4c95a1a702b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvJTIwaWNvbnxlbnwxfHx8fDE3Njk3NTIwMzZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
    // 학습 소분류
    { id: '26', name: '영어', description: '영어 학습', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '8', iconUrl: 'https://images.unsplash.com/photo-1645594287996-086e2217a809?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGFuZ3VhZ2UlMjBpY29ufGVufDF8fHx8MTc2OTc1MjAzNnww&ixlib=rb-4.1.0&q=80&w=400' },
    { id: '27', name: '프로그래밍', description: '코딩 학습', createdAt: '2024-01-01T00:00:00Z', communityCount: 0, parentId: '8', iconUrl: 'https://images.unsplash.com/photo-1565229284535-2cbbe3049123?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGljb258ZW58MXx8fHwxNzY5NzUyMDM3fDA&ixlib=rb-4.1.0&q=80&w=400' },
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; description: string; createdAt: string; communityCount: number; parentId?: string | null; iconUrl?: string } | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '', parentId: null as string | null, iconUrl: '' });
  const [showCategoryDeleteModal, setShowCategoryDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // 소분류 순서 변경 함수
  const moveSubCategory = (parentId: string, dragIndex: number, hoverIndex: number) => {
    const subCategories = categories.filter(c => c.parentId === parentId);
    const draggedItem = subCategories[dragIndex];
    
    // 드래그된 항목을 제거하고 새 위치에 삽입
    const updatedSubCategories = [...subCategories];
    updatedSubCategories.splice(dragIndex, 1);
    updatedSubCategories.splice(hoverIndex, 0, draggedItem);
    
    // 전체 카테고리 목록에서 해당 부모의 소분류들만 순서 변경
    const otherCategories = categories.filter(c => c.parentId !== parentId);
    setCategories([...otherCategories, ...updatedSubCategories]);
  };

  // 대분류 순서 변경 함수
  const moveParentCategory = (dragIndex: number, hoverIndex: number) => {
    const parentCategories = categories.filter(c => !c.parentId);
    const draggedItem = parentCategories[dragIndex];
    
    // 드래그된 항목을 제거하고 새 위치에 삽입
    const updatedParentCategories = [...parentCategories];
    updatedParentCategories.splice(dragIndex, 1);
    updatedParentCategories.splice(hoverIndex, 0, draggedItem);
    
    // 전체 카테고리 목록에서 대분류만 순서 변경
    const subCategories = categories.filter(c => c.parentId);
    setCategories([...updatedParentCategories, ...subCategories]);
  };

  // 관리자 권한 확인
  const isAdmin = user?.isAdmin === true || user?.userId === 'admin';

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      loadUsers();
    } else if (isAdmin && activeTab === 'communities') {
      loadCommunities();
    } else if (isAdmin && activeTab === 'banners') {
      loadBanners();
    }
  }, [activeTab, isAdmin]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
      if (openReportDropdown) {
        setOpenReportDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown, openReportDropdown]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      // Mock 데이터 사용 (Supabase 연결 실패 시)
      console.log('사용자 목록: Mock 데이터 사용 중');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/admin/communities`,
        {
          headers: {
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCommunities(data.communities || []);
      }
    } catch (error) {
      // Mock 데이터 사용 (Supabase 연결 실패 시)
      console.log('모임 목록: Mock 데이터 사용 중');
    } finally {
      setLoading(false);
    }
  };

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/admin/banners`,
        {
          headers: {
            Authorization: `Bearer ${accessToken || publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      // Mock 데이터 사용 (Supabase 연결 실패 시)
      console.log('배너 목록: Mock 데이터 사용 중');
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = () => {
    // 프론트엔드 전용 배너 저장
    if (!bannerFormData.title || !bannerFormData.linkUrl) {
      setBannerErrorMessage('제목과 링크 URL을 입력해주세요.');
      setShowBannerErrorModal(true);
      return;
    }

    let imageUrl = bannerFormData.imageUrl;

    // 이미지 파일이 업로드되었다면 로컬 URL 사용
    if (uploadedImage) {
      imageUrl = URL.createObjectURL(uploadedImage);
    }

    if (!imageUrl) {
      setBannerErrorMessage('이미지 URL을 입력하거나 파일을 선택해주세요.');
      setShowBannerErrorModal(true);
      return;
    }

    // 배너 데이터 준비
    const bannerData = {
      title: bannerFormData.title,
      imageUrl,
      linkUrl: bannerFormData.linkUrl,
      isActive: bannerFormData.isActive,
      order: bannerFormData.order,
      position: bannerFormData.position,
      startDate: bannerFormData.startDate,
      endDate: bannerFormData.endDate,
      clickCount: bannerFormData.clickCount,
      description: bannerFormData.description,
    };

    if (selectedBanner) {
      // 수정
      setBanners(banners.map(b => b.id === selectedBanner.id ? { ...b, ...bannerData } : b));
      setToastMessage('배너가 수정되었습니다');
    } else {
      // 추가
      const newBanner = {
        id: `banner-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...bannerData,
      };
      setBanners([...banners, newBanner]);
      setToastMessage('배너가 추가되었습니다');
    }

    setShowBannerModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const deleteBanner = (bannerId: string) => {
    // 프론트엔드 전용 배너 삭제
    setBanners(banners.filter(b => b.id !== bannerId));
    setToastMessage('배너가 삭제되었습니다');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <header className={styles.navbar}>
          <Navbar
            onSignupClick={onSignupClick}
            onLoginClick={onLoginClick}
            onLogoClick={onLogoClick}
            onNoticeClick={onNoticeClick}
            onMiniGameClick={onMiniGameClick}
            user={user}
            profileImage={profileImage}
            onLogout={onLogout}
            onMyPageClick={onMyPageClick}
            onMyMeetingsClick={onMyMeetingsClick}
          />
        </header>
        <main className={styles.main}>
          <div className={styles.accessDenied}>
            <Shield className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">접근 권한이 없습니다</h2>
            <p className="text-gray-500 mb-6">관리자만 접근할 수 있는 페이지입니다.</p>
            <button onClick={onBack} className={styles.backButton}>
              메인으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 대시보드 통계 (목업 데이터)
  const stats = {
    totalUsers: 1247,
    totalCommunities: 89,
    totalReports: 23,
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunities = communities.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(
    (r) =>
      r.reportedUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 신고 당한 횟수 계산 함수
  const getReportCount = (userId?: string) => {
    if (!userId) return 0;
    return reports.filter(r => r.reportedUserId === userId).length;
  };

  // ��한 변경 함수
  const handleToggleSubscription = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isSubscribed: !u.isSubscribed } : u
    ));
    setOpenDropdown(null);
    alert('권한이 변경되었습니다.');
  };

  // 사용자 삭제 함수
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 모임 삭제 함수
  const handleDeleteCommunity = (communityId: string) => {
    setCommunities(communities.filter(c => c.id !== communityId));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <header className={styles.navbar}>
          <Navbar
            onSignupClick={onSignupClick}
            onLoginClick={onLoginClick}
            onLogoClick={onLogoClick}
            onNoticeClick={onNoticeClick}
            onMiniGameClick={onMiniGameClick}
            user={user}
            profileImage={profileImage}
            onLogout={onLogout}
            onMyPageClick={onMyPageClick}
            onMyMeetingsClick={onMyMeetingsClick}
          />
        </header>

        <main className={styles.main}>
          <div className={styles.contentWrapper}>
          {/* 헤더 */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>관리자 대시보드</h1>
              <p className={styles.subtitle}>두루두룹 서비스 관리</p>
            </div>
            <button onClick={onBack} className={styles.backButtonSmall}>
              메인으로
            </button>
          </div>

          {/* 탭 메뉴 */}
          <div className={styles.tabs}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${styles.tab} ${activeTab === 'dashboard' ? styles.tabActive : ''}`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>대시보드</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
            >
              <Users className="w-5 h-5" />
              <span>사용자 관리</span>
            </button>
            <button
              onClick={() => setActiveTab('communities')}
              className={`${styles.tab} ${activeTab === 'communities' ? styles.tabActive : ''}`}
            >
              <FileText className="w-5 h-5" />
              <span>모임 관리</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${styles.tab} ${activeTab === 'reports' ? styles.tabActive : ''}`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>신고 관리</span>
            </button>
            <button
              onClick={() => setActiveTab('banners')}
              className={`${styles.tab} ${activeTab === 'banners' ? styles.tabActive : ''}`}
            >
              <Image className="w-5 h-5" />
              <span>광고 배너 관리</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${styles.tab} ${activeTab === 'categories' ? styles.tabActive : ''}`}
            >
              <Folder className="w-5 h-5" />
              <span>카테고리 관리</span>
            </button>
          </div>

          {/* 대시보드 탭 */}
          {activeTab === 'dashboard' && (
            <div className={styles.dashboardContent}>
              {/* 통계 카드 */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#E8F5E9' }}>
                    <Users className="w-6 h-6" style={{ color: '#00A651' }} />
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>전체 사용자</p>
                    <p className={styles.statValue}>{stats.totalUsers.toLocaleString()}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#FFF3E0' }}>
                    <FileText className="w-6 h-6" style={{ color: '#FF9800' }} />
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>전체 모임</p>
                    <p className={styles.statValue}>{stats.totalCommunities}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon} style={{ backgroundColor: '#F3E5F5' }}>
                    <Shield className="w-6 h-6" style={{ color: '#9C27B0' }} />
                  </div>
                  <div className={styles.statInfo}>
                    <p className={styles.statLabel}>신고 접수 내역</p>
                    <p className={styles.statValue}>{stats.totalReports}</p>
                  </div>
                </div>
              </div>

              {/* 최근 활동 */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>최근 활동</h2>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{ backgroundColor: '#E8F5E9' }}>
                      <CheckCircle className="w-5 h-5" style={{ color: '#00A651' }} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>새로운 모임 "독서 토론방"이 생성되었습니다</p>
                      <p className={styles.activityTime}>10분 전</p>
                    </div>
                  </div>

                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{ backgroundColor: '#E3F2FD' }}>
                      <Users className="w-5 h-5" style={{ color: '#2196F3' }} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>새로운 사용자 5명이 가입했습니다</p>
                      <p className={styles.activityTime}>1시간 전</p>
                    </div>
                  </div>

                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon} style={{ backgroundColor: '#FFF3E0' }}>
                      <FileText className="w-5 h-5" style={{ color: '#FF9800' }} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>공지사항이 업데이트되었습니다</p>
                      <p className={styles.activityTime}>3시간 전</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 사용자 관리 탭 */}
          {activeTab === 'users' && (
            <div className={styles.tabContent}>
              {/* 검색 바 */}
              <div className={styles.searchBar}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="닉네임 또는 이메일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* 사용자 테이블 */}
              {loading ? (
                <div className={styles.loadingState}>로딩 중...</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>가입일</th>
                        <th>구독 상태</th>
                        <th>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr 
                            key={user.id}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetailModal(true);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                            <td>
                              <span className={
                                user.isAdmin 
                                  ? styles.badgeAdmin 
                                  : user.isSubscribed 
                                  ? styles.badgeSubscribed 
                                  : styles.badgeUser
                              }>
                                {user.isAdmin ? '관리자' : user.isSubscribed ? '구독 중' : '미구독'}
                              </span>
                            </td>
                            <td>
                              <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUserToDelete(user.id);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className={styles.emptyCell}>
                            {searchTerm ? '검색 결과가 없습니다' : '사용자 데이터를 불러오는 중입니다'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 모임 관리 탭 */}
          {activeTab === 'communities' && (
            <div className={styles.tabContent}>
              {/* 검색 바 */}
              <div className={styles.searchBar}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="모임명 또는 카테고리 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* 모임 테이블 */}
              {loading ? (
                <div className={styles.loadingState}>로딩 중...</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>모임명</th>
                        <th>카테고리</th>
                        <th>리더</th>
                        <th>멤버 수</th>
                        <th>생성일</th>
                        <th>삭제</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommunities.length > 0 ? (
                        filteredCommunities.map((community) => (
                          <tr 
                            key={community.id}
                            onClick={() => {
                              setSelectedCommunity(community);
                              setShowCommunityDetailModal(true);
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{community.title}</td>
                            <td>{community.category}</td>
                            <td>{community.leaderName}</td>
                            <td>{community.memberCount}</td>
                            <td>{new Date(community.createdAt).toLocaleDateString('ko-KR')}</td>
                            <td>
                              <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCommunityToDelete(community.id);
                                  setShowCommunityDeleteModal(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className={styles.emptyCell}>
                            {searchTerm ? '검색 결과가 없습니다' : '모임 데이터를 불러오는 중입니다'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 신고 관리 탭 */}
          {activeTab === 'reports' && (
            <div className={styles.tabContent}>
              {/* 검색 바 */}
              <div className={styles.searchBar}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="신고된 사용자 또는 신고 사유 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              {/* 신고 테이블 */}
              {loading ? (
                <div className={styles.loadingState}>로딩 중...</div>
              ) : (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>신고된 사용자 닉네임</th>
                        <th>이메일</th>
                        <th>신고 사유</th>
                        <th>신고 날짜</th>
                        <th style={{ textAlign: 'center' }}>신고 당한 횟수</th>
                        <th style={{ textAlign: 'center' }}>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                          <tr key={report.id}>
                            <td>{report.reportedUserName || '알 수 없음'}</td>
                            <td>{report.reportedUserEmail || '알 수 없음'}</td>
                            <td>{report.reason}</td>
                            <td>{new Date(report.createdAt).toLocaleDateString('ko-KR')}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={styles.reportCountBadge}>
                                {getReportCount(report.reportedUserId)}회
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', position: 'relative' }}>
                                <button
                                  className={styles.actionButton}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenReportDropdown(openReportDropdown === report.id ? null : report.id);
                                  }}
                                  title="작업"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                {openReportDropdown === report.id && (
                                  <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={() => {
                                        if (report.reportedUserId && report.reportedUserName) {
                                          setUserToBlock({ userId: report.reportedUserId, userName: report.reportedUserName });
                                          setShowBlockModal(true);
                                          setOpenReportDropdown(null);
                                        }
                                      }}
                                    >
                                      <Ban className="w-4 h-4" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                                      사용자 차단
                                    </button>
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={() => {
                                        // 보류 - 목록에서만 제거
                                        setReports(reports.filter(r => r.id !== report.id));
                                        setToastMessage('신고가 보류되었습니다');
                                        setShowToast(true);
                                        setTimeout(() => setShowToast(false), 2000);
                                        setOpenReportDropdown(null);
                                      }}
                                    >
                                      <Clock className="w-4 h-4" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                                      보류
                                    </button>
                                    <button
                                      className={styles.dropdownItem}
                                      onClick={() => {
                                        setReportToDelete(report.id);
                                        setShowReportDeleteModal(true);
                                        setOpenReportDropdown(null);
                                      }}
                                      style={{ color: '#ef4444' }}
                                    >
                                      <Trash2 className="w-4 h-4" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
                                      사용자 삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className={styles.emptyCell}>
                            {searchTerm ? '검색 결과가 없습니다' : '신고 데이터를 불러오는 중입니다'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 광고 배너 수정 탭 */}
          {activeTab === 'banners' && (
            <div className={styles.tabContent}>
              {/* 헤더: 배너 추가 버튼 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className={styles.sectionTitle}>광고 배너 관리</h2>
                <button
                  className={styles.modalButtonPrimary}
                  style={{ backgroundColor: '#00A651', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    setSelectedBanner(null);
                    setBannerFormData({
                      title: '',
                      imageUrl: '',
                      linkUrl: '',
                      isActive: true,
                      order: banners.length + 1,
                      position: 'Main',
                      startDate: '',
                      endDate: '',
                      clickCount: 0,
                      description: '',
                    });
                    setUploadedImage(null);
                    setShowBannerModal(true);
                  }}
                >
                  <Plus className="w-5 h-5" />
                  <span>배너 추가</span>
                </button>
              </div>

              {/* 배너 테이블 */}
              <div className={styles.bannerTableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ width: '100px', textAlign: 'center' }}>순서</th>
                      <th style={{ width: '200px', textAlign: 'center' }}>미리보기</th>
                      <th>제목</th>
                      <th>링크 URL</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>배너 위치</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>상태</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.length > 0 ? (
                      banners.sort((a, b) => a.order - b.order).map((banner) => (
                        <tr 
                          key={banner.id} 
                          style={{ opacity: banner.isActive ? 1 : 0.4, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedBanner(banner);
                            setShowBannerDetailModal(true);
                          }}
                        >
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{banner.order}</td>
                          <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              style={{
                                width: '100%',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb',
                              }}
                            />
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>{banner.title}</td>
                          <td style={{ 
                            fontSize: '0.875rem', 
                            color: '#6b7280', 
                            verticalAlign: 'middle',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{banner.linkUrl}</td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setBanners(banners.map(b =>
                                  b.id === banner.id ? { ...b, position: b.position === 'popup' ? 'main' : 'popup' } : b
                                ));
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: banner.position === 'popup' ? '#e0e7ff' : '#ffedd5',
                                color: banner.position === 'popup' ? '#4f46e5' : '#ea580c',
                                cursor: 'pointer',
                              }}
                            >
                              {banner.position === 'popup' ? 'Popup' : 'Main'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBanners(banners.map(b =>
                                    b.id === banner.id ? { ...b, isActive: !b.isActive } : b
                                  ));
                                }}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  backgroundColor: banner.isActive ? '#d1fae5' : '#f3f4f6',
                                  color: banner.isActive ? '#00A651' : '#6b7280',
                                  cursor: 'pointer',
                                }}
                              >
                                {banner.isActive ? '활성화' : '비활성화'}
                              </span>
            </div>
                          </td>
                          <td style={{ verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                className={styles.actionButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBanner(banner);
                                  setBannerFormData({
                                    title: banner.title,
                                    imageUrl: banner.imageUrl,
                                    linkUrl: banner.linkUrl,
                                    isActive: banner.isActive,
                                    order: banner.order,
                                    position: banner.position,
                                    startDate: banner.startDate,
                                    endDate: banner.endDate,
                                    clickCount: banner.clickCount,
                                    description: banner.description || '',
                                  });
                                  setUploadedImage(null);
                                  setShowBannerModal(true);
                                }}
                                title="수정"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBannerToDelete(banner.id);
                                  setShowBannerDeleteModal(true);
                                }}
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className={styles.emptyCell}>
                          등록된 배너가 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 카테고리 관리 탭 */}
          {activeTab === 'categories' && (() => {
            const parentCategories = categories.filter(c => !c.parentId);
            const getSubCategories = (parentId: string) => categories.filter(c => c.parentId === parentId);
            
            return (
              <div className={styles.tabContent}>
                {/* 헤더: 카테고리 추가 버튼 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 className={styles.sectionTitle}>카테고리 관리</h2>
                  <button
                    className={styles.modalButtonPrimary}
                    style={{ backgroundColor: '#00A651', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryFormData({ name: '', description: '', parentId: null, iconUrl: '' });
                      setShowCategoryModal(true);
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>대분류 추가</span>
                  </button>
                </div>

                {/* 카테고리 카드 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {parentCategories.map((parent, parentIndex) => {
                    const subCategories = getSubCategories(parent.id);
                    
                    return (
                      <DraggableParentCategory
                        key={parent.id}
                        parent={parent}
                        index={parentIndex}
                        moveParentCategory={moveParentCategory}
                        onEdit={() => {
                          setSelectedCategory(parent);
                          setCategoryFormData({ name: parent.name, description: parent.description, parentId: parent.parentId || null, iconUrl: parent.iconUrl || '' });
                          setShowCategoryModal(true);
                        }}
                        onDelete={() => {
                          setCategoryToDelete(parent.id);
                          setShowCategoryDeleteModal(true);
                        }}
                      >
                        {/* 소분류 태그들 */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px',
                          alignItems: 'center',
                        }}>
                          {subCategories.map((sub, index) => (
                            <DraggableSubCategory
                              key={sub.id}
                              sub={sub}
                              index={index}
                              parentId={parent.id}
                              moveSubCategory={moveSubCategory}
                              onEdit={() => {
                                setSelectedCategory(sub);
                                setCategoryFormData({ name: sub.name, description: sub.description, parentId: sub.parentId || null, iconUrl: sub.iconUrl || '' });
                                setShowCategoryModal(true);
                              }}
                              onDelete={() => {
                                setCategoryToDelete(sub.id);
                                setShowCategoryDeleteModal(true);
                              }}
                            />
                          ))}
                          
                          {/* 소분류 추가 버튼 */}
                          <div 
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 16px',
                              borderRadius: '30px',
                              border: '2px dashed #d1d5db',
                              backgroundColor: '#fafafa',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onClick={() => {
                              setSelectedCategory(null);
                              setCategoryFormData({ name: '', description: '', parentId: parent.id, iconUrl: '' });
                              setShowCategoryModal(true);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#00A651';
                              e.currentTarget.style.backgroundColor = '#f0fdf4';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 166, 81, 0.15)';
                              const icon = e.currentTarget.querySelector('svg');
                              const text = e.currentTarget.querySelector('div');
                              if (icon) (icon as HTMLElement).style.color = '#00A651';
                              if (text) (text as HTMLElement).style.color = '#00A651';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.backgroundColor = '#fafafa';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                              const icon = e.currentTarget.querySelector('svg');
                              const text = e.currentTarget.querySelector('div');
                              if (icon) (icon as HTMLElement).style.color = '#9ca3af';
                              if (text) (text as HTMLElement).style.color = '#9ca3af';
                            }}
                          >
                            <Plus className="w-5 h-5" style={{ color: '#9ca3af', transition: 'color 0.2s' }} />
                            <div style={{ 
                              fontSize: '0.9375rem', 
                              fontWeight: '600', 
                              color: '#9ca3af',
                              transition: 'color 0.2s',
                            }}>
                              소분류 추가
                            </div>
                          </div>
                        </div>
                      </DraggableParentCategory>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      {/* 사용자 상세 정보 모달 */}
      {showUserDetailModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserDetailModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>사용자 상세 정보</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowUserDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>닉네임</div>
                <div className={styles.detailValue}>{selectedUser.username}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>이메일</div>
                <div className={styles.detailValue}>{selectedUser.email}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>가입일</div>
                <div className={styles.detailValue}>
                  {new Date(selectedUser.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>구독 상태</div>
                <div className={styles.detailValue}>
                  <span className={
                    selectedUser.isAdmin 
                      ? styles.badgeAdmin 
                      : selectedUser.isSubscribed 
                      ? styles.badgeSubscribed 
                      : styles.badgeUser
                  }>
                    {selectedUser.isAdmin ? '관리자' : selectedUser.isSubscribed ? '구독 중' : '미구독'}
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>신고 횟수</div>
                <div className={styles.detailValue}>
                  <span className={styles.reportCountBadge}>
                    {getReportCount(selectedUser.id)}회
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>사용자 ID</div>
                <div className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>#{selectedUser.id}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowUserDetailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 삭제 확인 모달 */}
      {showDeleteModal && userToDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>사용자 삭제 확인</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowDeleteModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>정말로 사용자 ID #{userToDelete}을 삭제하시겠습니까?</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  handleDeleteUser(userToDelete);
                  setShowDeleteModal(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모임 상세 정보 모달 */}
      {showCommunityDetailModal && selectedCommunity && (
        <div className={styles.modalOverlay} onClick={() => setShowCommunityDetailModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>모임 상세 정보</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowCommunityDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>모임명</div>
                <div className={styles.detailValue}>{selectedCommunity.title}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>카테고리</div>
                <div className={styles.detailValue}>{selectedCommunity.category}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>리더</div>
                <div className={styles.detailValue}>{selectedCommunity.leaderName}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>멤버 수</div>
                <div className={styles.detailValue}>{selectedCommunity.memberCount}명</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>생성일</div>
                <div className={styles.detailValue}>
                  {new Date(selectedCommunity.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>상태</div>
                <div className={styles.detailValue}>
                  <span className={
                    selectedCommunity.status === 'active' 
                      ? styles.badgeSubscribed 
                      : selectedCommunity.status === 'pending'
                      ? styles.badgePending
                      : styles.badgeUser
                  }>
                    {selectedCommunity.status === 'active' ? '활성' : selectedCommunity.status === 'pending' ? '대기' : '비활성'}
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>모임 ID</div>
                <div className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>#{selectedCommunity.id}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowCommunityDetailModal(false)}
              >
                닫기
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  // 모임 상세 페이지로 이동
                  if (onNavigateToCommunity) {
                    onNavigateToCommunity(selectedCommunity.id);
                  }
                  setShowCommunityDetailModal(false);
                }}
                style={{ backgroundColor: '#00A651' }}
              >
                이동하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모임 삭제 확인 모달 */}
      {showCommunityDeleteModal && communityToDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowCommunityDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>모임 삭제 확인</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowCommunityDeleteModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>정말로 모임 ID #{communityToDelete}을 삭제하시겠습니까?</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowCommunityDeleteModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  handleDeleteCommunity(communityToDelete);
                  setShowCommunityDeleteModal(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 신고 삭제 확인 모달 */}
      {showReportDeleteModal && reportToDelete && (() => {
        const report = reports.find(r => r.id === reportToDelete);
        return (
          <div className={styles.modalOverlay} onClick={() => setShowReportDeleteModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>신고된 사용자 삭제 확인</h2>
                <button
                  className={styles.modalCloseButton}
                  onClick={() => setShowReportDeleteModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className={styles.modalBody}>
                {report?.reportedUserName ? (
                  <p className={styles.modalText}>
                    신고된 사용자 <strong>{report.reportedUserName}</strong>를 삭제하시겠습니까?<br />
                    해당 신고 기록도 함께 삭제됩니다.
                  </p>
                ) : (
                  <p className={styles.modalText}>
                    정말로 신고 ID #{reportToDelete}을 삭제하시겠습까?
                  </p>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalButtonSecondary}
                  onClick={() => setShowReportDeleteModal(false)}
                >
                  취소
                </button>
                <button
                  className={styles.modalButtonPrimary}
                  onClick={() => {
                    // 신고된 사용자가 있으면 삭제
                    if (report?.reportedUserId) {
                      setUsers(users.filter(u => u.id !== report.reportedUserId));
                    }
                    // 신고 기록 삭제
                    setReports(reports.filter(r => r.id !== reportToDelete));
                    setShowReportDeleteModal(false);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 차단 모달 */}
      {showBlockModal && userToBlock && (
        <div className={styles.modalOverlay} onClick={() => setShowBlockModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>사용자 차단</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowBlockModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                사용자 <strong>{userToBlock.userName}</strong>을(를) 차단하시겠습니까?
              </p>
              <div className={styles.blockTypeSelector}>
                <label>
                  <input
                    type="radio"
                    name="blockType"
                    value="temporary"
                    checked={blockType === 'temporary'}
                    onChange={() => setBlockType('temporary')}
                  />
                  일시적 차단
                </label>
                <label>
                  <input
                    type="radio"
                    name="blockType"
                    value="permanent"
                    checked={blockType === 'permanent'}
                    onChange={() => setBlockType('permanent')}
                  />
                  영구적 차단
                </label>
              </div>
              {blockType === 'temporary' && (
                <div className={styles.blockEndDate}>
                  <label>차단 기간 (1일 ~ 90일):</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      value={blockDays}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 1 && value <= 90) {
                          setBlockDays(value);
                        }
                      }}
                      min="1"
                      max="90"
                      style={{ flex: '0 0 80px' }}
                    />
                    <span style={{ color: '#92400e', fontWeight: 600 }}>일</span>
                  </div>
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #d97706' }}>
                    <span style={{ fontSize: '0.875rem', color: '#92400e' }}>차단 종료일: </span>
                    <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: 600 }}>
                      {new Date(Date.now() + blockDays * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowBlockModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={async () => {
                  // 차단 로직 구현
                  if (blockType && accessToken) {
                    try {
                      const response = await fetch(
                        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/admin/users/${userToBlock.userId}/block`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                          },
                          body: JSON.stringify({
                            blockType,
                            blockDays: blockType === 'temporary' ? blockDays : undefined,
                          }),
                        }
                      );

                      if (response.ok) {
                        const data = await response.json();
                        console.log('사용자 차단 성공:', data);
                        setShowBlockModal(false);
                        setBlockType(null);
                        setBlockDays(7); // 초기화
                        setToastMessage('차단 완료 하였습니다');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      } else {
                        const errorData = await response.json();
                        console.error('차단 실패:', errorData);
                        alert(errorData.error || '차단에 실패했습니다.');
                      }
                    } catch (error) {
                      console.error('차단 요청 오류:', error);
                      alert('차단 요청 중 오류가 발생했습니다.');
                    }
                  }
                }}
              >
                차단
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 추가/수정 모달 */}
      {showBannerModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBannerModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedBanner ? '배너 수정' : '배너 추가'}</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowBannerModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>배너 제목</label>
                <input
                  type="text"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                  placeholder="배너 제목을 입력하세요"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>이미지</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={bannerFormData.imageUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                  <label
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#00A651',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    파일 선택
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedImage(file);
                          // 미리보기를 위해 로컬 URL 생성
                          const localUrl = URL.createObjectURL(file);
                          setBannerFormData({ ...bannerFormData, imageUrl: localUrl });
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {uploadedImage ? `선택된 파일: ${uploadedImage.name}` : 'URL 입력 또는 파일 선택 (권장 사이즈: 800x200px)'}
                </p>
              </div>

              {bannerFormData.imageUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>미리보기</label>
                  <img
                    src={bannerFormData.imageUrl}
                    alt="배너 미리보기"
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>링크 URL</label>
                <input
                  type="text"
                  value={bannerFormData.linkUrl}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })}
                  placeholder="/payment 또는 https://example.com"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>설명</label>
                <textarea
                  value={bannerFormData.description}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, description: e.target.value })}
                  placeholder="배너에 대한 간단한 설명을 입력하세요 (선택 사항)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>노출 시작일</label>
                  <input
                    type="date"
                    value={bannerFormData.startDate}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>노출 종료일</label>
                  <input
                    type="date"
                    value={bannerFormData.endDate}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>표시 순서</label>
                <input
                  type="number"
                  min="1"
                  value={bannerFormData.order}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, order: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100px',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={bannerFormData.isActive}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                    style={{ width: '18px', height: '18px', marginRight: '8px', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '500' }}>배너 활성화</span>
                </label>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowBannerModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={saveBanner}
                style={{ backgroundColor: '#00A651' }}
              >
                {selectedBanner ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 상세 정보 모달 */}
      {showBannerDetailModal && selectedBanner && (
        <div className={styles.modalOverlay} onClick={() => setShowBannerDetailModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>배너 상세 정보</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowBannerDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>제목</div>
                <div className={styles.detailValue}>{selectedBanner.title}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>이미지</div>
                <div className={styles.detailValue}>
                  <img
                    src={selectedBanner.imageUrl}
                    alt={selectedBanner.title}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  />
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>링크 URL</div>
                <div className={styles.detailValue}>{selectedBanner.linkUrl}</div>
              </div>
              {selectedBanner.description && (
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>설명</div>
                  <div className={styles.detailValue} style={{ color: '#374151', lineHeight: '1.6' }}>
                    {selectedBanner.description}
                  </div>
                </div>
              )}
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>활성화 여부</div>
                <div className={styles.detailValue}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: selectedBanner.isActive ? '#d1fae5' : '#f3f4f6',
                      color: selectedBanner.isActive ? '#00A651' : '#6b7280',
                    }}
                  >
                    {selectedBanner.isActive ? '활성화' : '비활성화'}
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>노출 시작일</div>
                <div className={styles.detailValue}>{selectedBanner.startDate}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>노출 종료일</div>
                <div className={styles.detailValue}>{selectedBanner.endDate}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>정렬 순서</div>
                <div className={styles.detailValue}>{selectedBanner.order}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>클릭 수</div>
                <div className={styles.detailValue}>
                  <span style={{ fontWeight: '600', color: '#00A651' }}>
                    {selectedBanner.clickCount.toLocaleString()}회
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowBannerDetailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 삭제 확인 모달 */}
      {showBannerDeleteModal && bannerToDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowBannerDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>배너 삭제 확인</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowBannerDeleteModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>정말로 이 배너를 삭제하시겠습니까?</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowBannerDeleteModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  if (bannerToDelete) {
                    deleteBanner(bannerToDelete);
                  }
                  setShowBannerDeleteModal(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 오류 모달 */}
      {showBannerErrorModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBannerErrorModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>알림</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowBannerErrorModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>{bannerErrorMessage}</p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => setShowBannerErrorModal(false)}
                style={{ backgroundColor: '#00A651' }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 추가/수정 모달 */}
      {showCategoryModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCategoryModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedCategory ? '카테고리 수정' : '카테고리 추가'}</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowCategoryModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* 대표 이미지 썸네일 - 대분류인 경우 최상단에 표시 */}
              {!categoryFormData.parentId && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '24px',
                }}>
                  <div 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '3px solid #00A651',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      const fileInput = document.getElementById('category-image-upload') as HTMLInputElement;
                      fileInput?.click();
                    }}
                    onMouseEnter={(e) => {
                      const overlay = e.currentTarget.querySelector('div');
                      if (overlay) (overlay as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const overlay = e.currentTarget.querySelector('div');
                      if (overlay) (overlay as HTMLElement).style.opacity = '0';
                    }}
                  >
                    <img 
                      src={categoryFormData.iconUrl || 'https://images.unsplash.com/photo-1762503203730-ca33982518af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwZ3JhZGllbnQlMjBwYXR0ZXJufGVufDF8fHx8MTc3MDEwODQ2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'} 
                      alt="카테고리 이미지" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}>
                      <Edit2 className="w-8 h-8" style={{ color: '#ffffff' }} />
                    </div>
                  </div>
                  <input
                    id="category-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCategoryFormData({ ...categoryFormData, iconUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  분류 타입
                </label>
                <div style={{ 
                  padding: '10px 12px', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6b7280',
                }}>
                  {categoryFormData.parentId 
                    ? `소분류 (상위: ${categories.find(c => c.id === categoryFormData.parentId)?.name || '알 수 없음'})` 
                    : '대분류'}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>카테고리명 *</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 5) {
                      setCategoryFormData({ ...categoryFormData, name: value });
                    }
                  }}
                  placeholder="예: 독서, 운동, 요리"
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                  {categoryFormData.name.length}/5자
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>설명</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="카테고리에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowCategoryModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  if (!categoryFormData.name.trim()) {
                    alert('카테고리명을 입력해주세요.');
                    return;
                  }
                  
                  if (selectedCategory) {
                    // 수정
                    setCategories(categories.map(c =>
                      c.id === selectedCategory.id
                        ? { ...c, name: categoryFormData.name, description: categoryFormData.description, parentId: categoryFormData.parentId, iconUrl: categoryFormData.iconUrl }
                        : c
                    ));
                    setToastMessage('카테고리가 수정되었습니다');
                  } else {
                    // 추가
                    const newCategory = {
                      id: String(Date.now()),
                      name: categoryFormData.name,
                      description: categoryFormData.description,
                      createdAt: new Date().toISOString(),
                      communityCount: 0,
                      parentId: categoryFormData.parentId,
                      iconUrl: categoryFormData.iconUrl,
                    };
                    setCategories([...categories, newCategory]);
                    setToastMessage('카테고리가 추가되었습니다');
                  }
                  
                  setShowCategoryModal(false);
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
                style={{ backgroundColor: '#00A651' }}
              >
                {selectedCategory ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 카테고리 삭제 확인 모달 */}
      {showCategoryDeleteModal && categoryToDelete && (
        <div className={styles.modalOverlay} onClick={() => setShowCategoryDeleteModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>카테고리 삭제 확인</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowCategoryDeleteModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                정말로 이 카테고리를 삭제하시겠습니까?
                {(() => {
                  const category = categories.find(c => c.id === categoryToDelete);
                  return category && category.communityCount > 0 ? (
                    <><br /><span style={{ color: '#ef4444', fontWeight: '600' }}>
                      현재 {category.communityCount}개의 모임이 이 카테고리를 사용 중입니다.
                    </span></>
                  ) : null;
                })()}
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.modalButtonSecondary}
                onClick={() => setShowCategoryDeleteModal(false)}
              >
                취소
              </button>
              <button
                className={styles.modalButtonPrimary}
                onClick={() => {
                  setCategories(categories.filter(c => c.id !== categoryToDelete));
                  setShowCategoryDeleteModal(false);
                  setToastMessage('카테고리가 삭제되었습니다');
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <div className={styles.toast}>
          <p>{toastMessage}</p>
        </div>
      )}
      </div>
    </DndProvider>
  );
}