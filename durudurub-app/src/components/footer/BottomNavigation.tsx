import { Home, User, LayoutGrid, Search } from 'lucide-react';

interface BottomNavigationProps {
  onHomeClick: () => void;
  onMyPageClick: () => void;
  onCategoryClick: () => void;
  onSearchClick: () => void;
  currentPage?: string;
  isLoggedIn?: boolean;
}

export function BottomNavigation({
  onHomeClick,
  onMyPageClick,
  onCategoryClick,
  onSearchClick,
  currentPage = 'home',
  isLoggedIn = false,
}: BottomNavigationProps) {
  const navItems = [
    {
      id: 'home',
      icon: Home,
      label: '홈',
      onClick: onHomeClick,
    },
    {
      id: 'search',
      icon: Search,
      label: '검색',
      onClick: onSearchClick,
    },
    {
      id: 'category',
      icon: LayoutGrid,
      label: '카테고리',
      onClick: onCategoryClick,
    },
    {
      id: 'mypage',
      icon: User,
      label: '마이페이지',
      onClick: onMyPageClick,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-[#00A651]' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-[#00A651] font-semibold' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
