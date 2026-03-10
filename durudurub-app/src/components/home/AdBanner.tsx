import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const banners = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1716852451478-c8965a17f65e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmFuZCUyMGFkdmVydGlzZW1lbnQlMjBiYW5uZXJ8ZW58MXx8fHwxNzY5NTkwODgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '프리미엄 원두 커피',
    subtitle: '신규 회원 20% 할인',
    brand: 'Coffee House',
    link: '#',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1464854860390-e95991b46441?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2FsZSUyMHByb21vdGlvbiUyMGJhbm5lcnxlbnwxfHx8fDE3Njk1OTA4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: '2026 봄 시즌 패션 위크',
    subtitle: '최대 50% 특별 할인',
    brand: 'Fashion Mall',
    link: '#',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1764795850248-97a5e986b242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwcHJvZHVjdCUyMGFkdmVydGlzZW1lbnQlMjBkaXNwbGF5fGVufDF8fHx8MTc2OTU5MDg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: '최신 스마트 기기',
    subtitle: '사전 예약 시 10% 추가 할인',
    brand: 'Tech Store',
    link: '#',
  },
];

export function AdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // 5초마다 자동 슬라이드

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full">
        {/* "광고" 라벨 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-medium">Sponsored</span>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 광고 배너 이미지 */}
          <a href={currentBanner.link} target="_blank" rel="noopener noreferrer" className="block relative">
            <ImageWithFallback
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-64 sm:h-72 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* 광고 텍스트 콘텐츠 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold mb-2 text-white/90">{currentBanner.brand}</p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
                  {currentBanner.title}
                </h3>
                <p className="text-base sm:text-lg text-white/90 mb-4">
                  {currentBanner.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                  <span className="text-sm font-medium">자세히 보기</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </a>

          {/* 이전/다음 버튼 */}
          {banners.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                aria-label="이전 배너"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-lg opacity-0 group-hover:opacity-100"
                aria-label="다음 배너"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    width: index === currentIndex ? '24px' : '8px',
                  }}
                  aria-label={`${index + 1}번 배너로 이동`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}