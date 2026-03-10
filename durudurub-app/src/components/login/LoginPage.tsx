import { useState, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface LoginPageProps {
  onClose: () => void;
  onSignupClick: () => void;
  onForgotPasswordClick?: () => void;
  onLoginSuccess?: (user: any, accessToken: string) => void;
}

export function LoginPage({ onClose, onSignupClick, onForgotPasswordClick, onLoginSuccess }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCreatingTestAccount, setIsCreatingTestAccount] = useState(false);
  const [testAccountMessage, setTestAccountMessage] = useState('');

  // 컴포넌트 마운트 시 저장된 아이디 불러오기
  useEffect(() => {
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
      setFormData(prev => ({
        ...prev,
        userId: savedUserId,
        rememberMe: true,
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 서버에 로그인 요청
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userId: formData.userId,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log('=== 로그인 성공 ===');
        console.log('받은 accessToken:', data.accessToken ? '존재함' : '없음');
        console.log('받은 user:', data.user);
        
        // 로그인 성공 - 토큰과 사용자 정보 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 아이디 저장 체크박스가 선택되어 있으면 아이디 저장
        if (formData.rememberMe) {
          localStorage.setItem('savedUserId', formData.userId);
        } else {
          localStorage.removeItem('savedUserId');
        }
        
        console.log('localStorage 저장 완료');
        console.log('저장된 토큰 확인:', localStorage.getItem('accessToken') ? '존재함' : '없음');
        console.log('저장된 user 확인:', localStorage.getItem('user') ? '존재함' : '없음');
        
        // 부모 컴포넌트에 로그인 성공 알림
        if (onLoginSuccess) {
          console.log('onLoginSuccess 콜백 호출');
          onLoginSuccess(data.user, data.accessToken);
        }
        
        // 메인 페이지로 이동
        onClose();
      } else {
        setErrorMessage(data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setErrorMessage('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // test 계정 생성 함수
  const handleCreateTestAccount = async () => {
    setIsCreatingTestAccount(true);
    setTestAccountMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-12a2c4b5/init-test-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setTestAccountMessage('✅ test 계정이 생성되었습니다! (이메일: test / 비밀번호: 123456)');
        // 자동으로 폼에 입력
        setFormData({
          userId: 'test',
          password: '123456',
          rememberMe: false,
        });
      } else {
        setErrorMessage(data.error || 'test 계정 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('test 계정 생성 오류:', error);
      setErrorMessage('서버 연결에 실패했습니다.');
    } finally {
      setIsCreatingTestAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 relative">
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00A651] mb-2">두루두룹</h1>
          <p className="text-gray-600">다시 만나서 반가워요!</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* test 계정 성공 메시지 */}
          {testAccountMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {testAccountMessage}
            </div>
          )}

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {errorMessage}
            </div>
          )}

          {/* 이메일 */}
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent transition-all"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 로그인 유지 & 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-[#00A651] bg-white border-gray-300 rounded focus:ring-[#00A651]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                이메일 저장
              </label>
            </div>
            {onForgotPasswordClick && (
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-sm text-gray-600 hover:text-[#00A651] transition-colors"
              >
                비밀번호 찾기
              </button>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#00A651] text-white py-3.5 rounded-full font-medium hover:bg-[#008f46] transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 회원가입 링크 */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              아직 회원이 아니신가요?{' '}
              <button
                type="button"
                onClick={onSignupClick}
                className="text-[#00A651] font-medium hover:text-[#008f46]"
              >
                회원가입하기
              </button>
            </p>
          </div>

          {/* test 계정 생성 버튼 (개발/테스트용) */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCreateTestAccount}
              disabled={isCreatingTestAccount}
              className="text-xs text-gray-500 hover:text-[#00A651] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingTestAccount ? '생성 중...' : '🧪 테스트 계정 생성하기 (개발용)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}