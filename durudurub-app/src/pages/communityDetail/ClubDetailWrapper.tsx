import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CommunityDetailPage } from './CommunityDetailPage';

export default function ClubDetailWrapper() {

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [club, setClub] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`/api/clubs/${id}`, { credentials: 'include' });
        if (!res.ok) {
          navigate('/explore');
          return;
        }
        const data = await res.json();
        setClub(data);
      } catch (e) {
        console.error('모임 조회 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
      </div>
    );
  }

  if (!club?.club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">모임을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const c = club.club;

  return (
    <CommunityDetailPage
      id={c.no}
      image={c.thumbnailImg || ''}
      title={c.title || ''}
      description={c.description || ''}
      location={c.location || ''}
      hostName={c.host?.nickname || '호스트'}
      hostId={c.host?.userId}
      participants={{ current: c.currentMembers || 0, max: c.maxMembers || 0 }}
      user={null}
      onBack={() => navigate(-1)}
      onLoginClick={() => navigate('/login')}
    />
  );
}