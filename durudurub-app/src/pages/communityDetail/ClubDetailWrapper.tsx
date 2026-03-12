import { useNavigate, useParams } from 'react-router-dom';
import { CommunityDetailPage } from './CommunityDetailPage';

export default function ClubDetailWrapper() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <CommunityDetailPage
      id={Number(id)}
      image=""
      title=""
      description=""
      location=""
      hostName=""
      participants={{ current: 0, max: 0 }}
      user={null}
      onBack={() => navigate(-1)}
      onLoginClick={() => navigate('/login')}
    />
  );
}