import { NoticePage } from "@/app/components/NoticePage";
import { NoticeWritePage } from "@/app/components/NoticeWritePage";
import { MiniGamePage } from "@/app/components/MiniGamePage";
import { CharacterDownloadPage } from "@/app/components/CharacterDownloadPage";
import { CommunityDetailPage } from "@/app/components/CommunityDetailPage";
import { Navbar } from "@/app/components/Navbar";
import { HeroSection } from "@/app/components/HeroSection";
import { CategorySection } from "@/app/components/CategorySection";
import { CategoryPage } from "@/app/components/CategoryPage";
import { SignupPage } from "@/app/components/SignupPage";
import { LoginPage } from "@/app/components/LoginPage";
import { ForgotPasswordPage } from "@/app/components/ForgotPasswordPage";
import { Footer } from "@/app/components/Footer";
import { CreateCommunityPage } from "@/app/components/CreateCommunityPage";
import { AdBanner } from "@/app/components/AdBanner";
import { ExplorePage } from "@/app/components/ExplorePage";
import { MyPage } from "@/app/components/MyPage";
import { MyGroupsManagement } from "@/app/components/MyGroupsManagement";
import { AdminPage } from "@/app/components/AdminPage";
import { PaymentPage } from "@/app/components/PaymentPage";
import { IconShowcase } from "@/app/components/IconShowcase";
import { DevMenu } from "@/app/components/DevMenu";
import { Error403Page } from "@/app/components/Error403Page";
import { Error404Page } from "@/app/components/Error404Page";
import { Error500Page } from "@/app/components/Error500Page";
import { FavoritesPage } from "@/app/components/FavoritesPage";
import { mockCommunities } from "@/app/data/mockCommunities";
import { useState, useEffect } from "react";
import styles from "@/app/App.module.css";
import { Toaster } from "sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "explore"
    | "signup"
    | "login"
    | "forgotPassword"
    | "notice"
    | "noticeWrite"
    | "noticeDetail"
    | "create"
    | "mypage"
    | "minigame"
    | "payment"
    | "mymeetings"
    | "favorites"
    | "admin"
    | "download"
    | "icons"
    | "error403"
    | "error404"
    | "error500"
  >("home");
  const [selectedCategory, setSelectedCategory] = useState<
    string | null
  >(null);
  const [selectedCommunity, setSelectedCommunity] =
    useState<any>(null);
  const [editingNotice, setEditingNotice] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );
  const [profileImage, setProfileImage] = useState<
    string | null
  >(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 로그인 정보 확인
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const storedProfileImage =
      localStorage.getItem("profileImage");

    if (storedToken && storedUser) {
      // 토큰 유효성 간단 체크 - JWT 형식인지 확인
      const tokenParts = storedToken.split(".");
      if (tokenParts.length === 3) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }
        console.log("저장된 로그인 정보 복원 성공");
      } else {
        // 잘못된 토큰 형식 - 클리어
        console.log(
          "잘못된 토큰 형식 감지 - localStorage 클리어",
        );
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("profileImage");
      }
    }
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setSelectedCommunity(null);
    setCurrentPage("home");
  };

  const handleExploreClick = (searchQuery?: string) => {
    setCurrentPage("explore");
    if (searchQuery) {
      setSearchQuery(searchQuery);
    } else {
      setSearchQuery("");
    }
  };

  const handleSignupClick = () => {
    setCurrentPage("signup");
  };

  const handleLoginClick = () => {
    setCurrentPage("login");
  };

  const handleForgotPasswordClick = () => {
    setCurrentPage("forgotPassword");
  };

  const handleDownloadClick = () => {
    setCurrentPage("download");
  };

  const handleCreateClick = () => {
    setCurrentPage("create");
  };

  const handleCommunityClick = (
    community: (typeof mockCommunities)[0],
  ) => {
    // spread로 전달하되, hostId가 없을 경우 추가
    const communityData = {
      ...community,
      hostId:
        "hostId" in community ? community.hostId : undefined,
    };
    setSelectedCommunity(communityData);
  };

  const handleMeetingClick = (meeting: any) => {
    // Meeting 데이터를 CommunityDetailPage에 맞는 형식으로 변환
    const communityData = {
      id: meeting.id,
      image: meeting.image,
      title: meeting.title,
      description: `${meeting.date}에 진행되는 ${meeting.title}입니다. 함께 즐거운 시간을 보내요!`,
      location: meeting.location,
      hostName: meeting.host,
      hostId: meeting.hostId, // hostId 추가
      participants: {
        current: meeting.participants,
        max: meeting.maxParticipants,
      },
    };
    setSelectedCommunity(communityData);
  };

  const handleLoginSuccess = (userData: any, token: string) => {
    setUser(userData);
    setAccessToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    setUser(null);
    setAccessToken(null);
    setProfileImage(null);
  };

  const handleProfileImageUpdate = (
    newImage: string | null,
  ) => {
    setProfileImage(newImage);
    if (newImage) {
      localStorage.setItem("profileImage", newImage);
    } else {
      localStorage.removeItem("profileImage");
    }
  };

  const handleCommunityClickFromExplore = (
    communityId: string,
  ) => {
    // 목업 데이터에서 해당 모임 찾기
    const community = mockCommunities.find(
      (c) => c.id === communityId,
    );
    if (community) {
      // CommunityDetailPage에 맞는 형식으로 변환
      const communityData = {
        id: community.id,
        image: community.imageUrl || "", // 이미지 URL 추가
        title: community.title,
        description: community.description,
        location: community.location,
        hostName: community.hostName,
        hostId: community.hostId, // hostId 추가
        participants: {
          current: community.memberCount,
          max: community.maxMembers,
        },
        category: community.category,
        createdAt: community.createdAt,
      };
      setSelectedCommunity(communityData);
      setCurrentPage("home"); // 페이지를 home으로 설정하여 상세 페이지가 표시되도록
    } else {
      // mockCommunities에 없는 경우 (내 모임 관리에서 온 경우)
      console.log(
        "mockCommunities에서 모임을 찾지 못함, 기본 데이터로 생성:",
        communityId,
      );

      // communityId를 기반으로 기본 데이터 생성
      let title = "모임";
      let category = "기타";
      let memberCount = 10;
      let maxMembers = 20;

      // ID별 매핑 (MyGroupsManagement의 mock 데이터와 동기화)
      if (communityId === "1") {
        title = "주말 등산 모임";
        category = "운동";
        memberCount = 12;
        maxMembers = 20;
      } else if (communityId === "2") {
        title = "독서 토론 클럽";
        category = "문화";
        memberCount = 8;
        maxMembers = 15;
      } else if (communityId === "3") {
        title = "사진 촬영 동호회";
        category = "취미";
        memberCount = 15;
        maxMembers = 25;
      } else if (communityId === "4") {
        title = "요리 레시피 공유";
        category = "요리";
        memberCount = 10;
        maxMembers = 20;
      }

      const communityData = {
        id: communityId,
        title: title,
        description: `${title}에 오신 것을 환영합니다!`,
        location: "서울",
        hostName: "모임 리더",
        hostId: "test", // test 계정을 기본 리더로 설정
        participants: {
          current: memberCount,
          max: maxMembers,
        },
        category: category,
        createdAt: new Date().toISOString(),
      };
      setSelectedCommunity(communityData);
      setCurrentPage("home"); // 페이지를 home으로 설정하여 상세 페이지가 표시되도록
    }
  };

  const handleMyPageClick = () => {
    setCurrentPage("mypage");
  };

  const handleGroupsManagementClick = () => {
    setCurrentPage("groups-management");
  };

  const handleNoticeClick = () => {
    setCurrentPage("notice");
  };

  const handleNoticeWriteClick = (notice: any = null) => {
    setEditingNotice(notice);
    setCurrentPage("noticeWrite");
  };

  const handleMiniGameClick = () => {
    setCurrentPage("minigame");
  };

  const handleMeetingsClick = () => {
    setCurrentPage("groups-management");
  };

  const handleFavoritesClick = () => {
    setCurrentPage("favorites");
  };

  const handleAdminClick = () => {
    setCurrentPage("admin");
  };

  const handlePaymentClick = () => {
    setCurrentPage("payment");
  };

  const handleIconsClick = () => {
    setCurrentPage("icons");
  };

  const handleError403Click = () => {
    setCurrentPage("error403");
  };

  const handleError404Click = () => {
    setCurrentPage("error404");
  };

  const handleError500Click = () => {
    setCurrentPage("error500");
  };

  const handleBackToPrevious = () => {
    setSelectedCategory(null);
  };

  const handleBackFromDetail = () => {
    setSelectedCommunity(null);
  };

  // 회원가입 페이지 표시
  if (currentPage === "signup") {
    return (
      <SignupPage
        onClose={
          selectedCategory
            ? handleBackToPrevious
            : handleBackToHome
        }
        onLoginClick={handleLoginClick}
      />
    );
  }

  // 로그인 페이지 표시
  if (currentPage === "login") {
    return (
      <LoginPage
        onClose={
          selectedCategory
            ? handleBackToPrevious
            : handleBackToHome
        }
        onSignupClick={handleSignupClick}
        onForgotPasswordClick={handleForgotPasswordClick}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // 비밀번호 찾기 페이지 표시
  if (currentPage === "forgotPassword") {
    return (
      <ForgotPasswordPage
        onClose={
          selectedCategory
            ? handleBackToPrevious
            : handleBackToHome
        }
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
      />
    );
  }

  // 다운로드 페이지 표시
  if (currentPage === "download") {
    return (
      <CharacterDownloadPage onBackClick={handleBackToHome} />
    );
  }

  // 아이콘 갤러리 페이지 표시
  if (currentPage === "icons") {
    return <IconShowcase />;
  }

  // 에러 페이지 표시
  if (currentPage === "error403") {
    return <Error403Page />;
  }

  if (currentPage === "error404") {
    return <Error404Page />;
  }

  if (currentPage === "error500") {
    return <Error500Page />;
  }

  // 모임 생성 페이지 표시
  if (currentPage === "create") {
    if (!user || !accessToken) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      return (
        <LoginPage
          onClose={handleBackToHome}
          onSignupClick={handleSignupClick}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }
    return (
      <CreateCommunityPage
        onBack={handleBackToHome}
        user={user}
        accessToken={accessToken}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        profileImage={profileImage}
        onLogout={handleLogout}
      />
    );
  }

  // 모임 둘러보기 페이지 표시
  if (currentPage === "explore") {
    return (
      <ExplorePage
        onBack={handleBackToHome}
        onCommunityClick={handleCommunityClickFromExplore}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        onPaymentClick={handlePaymentClick}
        user={user}
        accessToken={accessToken}
        profileImage={profileImage}
        onLogout={handleLogout}
        initialSearchQuery={searchQuery}
      />
    );
  }

  // 마이 페이지 표시
  if (currentPage === "mypage") {
    return (
      <MyPage
        onBack={handleBackToHome}
        user={user}
        profileImage={profileImage}
        onProfileImageUpdate={handleProfileImageUpdate}
        onNavigateToGroupsManagement={
          handleGroupsManagementClick
        }
        onNavigateToFavorites={handleFavoritesClick}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        onLogout={handleLogout}
        onPaymentClick={handlePaymentClick}
      />
    );
  }

  // 그룹 관리 페이지 표시
  if (currentPage === "groups-management") {
    return (
      <MyGroupsManagement
        onBack={handleBackToHome}
        user={user}
        profileImage={profileImage}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        onLogout={handleLogout}
        onCommunityClick={handleCommunityClickFromExplore}
      />
    );
  }

  // 공지사항 페이지 표시
  if (currentPage === "notice") {
    return (
      <NoticePage
        onBack={handleBackToHome}
        user={user}
        accessToken={accessToken}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        profileImage={profileImage}
        onLogout={handleLogout}
        onNoticeWriteClick={handleNoticeWriteClick}
      />
    );
  }

  // 공지사항 작성 페이지 표시
  if (currentPage === "noticeWrite") {
    return (
      <NoticeWritePage
        onBack={handleNoticeClick}
        user={user}
        accessToken={accessToken}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        profileImage={profileImage}
        onLogout={handleLogout}
        editingNotice={editingNotice}
      />
    );
  }

  // 미니게임 페이지 표시
  if (currentPage === "minigame") {
    return (
      <MiniGamePage
        onBack={handleBackToHome}
        user={user}
        accessToken={accessToken}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        profileImage={profileImage}
        onLogout={handleLogout}
      />
    );
  }

  // 즐겨찾기 페이지 표시
  if (currentPage === "favorites") {
    return (
      <FavoritesPage
        onBack={handleBackToHome}
        user={user}
        accessToken={accessToken || ""}
        profileImage={profileImage}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        onLogout={handleLogout}
        onCommunityClick={handleCommunityClickFromExplore}
        onExploreClick={handleExploreClick}
      />
    );
  }

  // 관리자 페이지 표시
  if (currentPage === "admin") {
    return (
      <AdminPage
        onBack={handleBackToHome}
        user={user}
        accessToken={accessToken}
        profileImage={profileImage}
        onSignupClick={handleSignupClick}
        onLoginClick={handleLoginClick}
        onLogoClick={handleBackToHome}
        onNoticeClick={handleNoticeClick}
        onMyPageClick={handleMyPageClick}
        onMiniGameClick={handleMiniGameClick}
        onMyMeetingsClick={handleMeetingsClick}
        onLogout={handleLogout}
        onNavigateToCommunity={(communityId) => {
          setSelectedCommunityId(parseInt(communityId));

          // AdminPage의 communities 데이터에서 해당 모임 찾기
          // mockCommunities에서 찾지 못할 경우 기본 데이터 생성
          const community = mockCommunities.find(
            (c) => c.id === communityId,
          );

          if (community) {
            // mockCommunities에서 찾은 경우
            setSelectedCommunity(community);
          } else {
            // AdminPage의 mock 데이터를 기반으로 커뮤니티 객체 생성
            const adminCommunityMap: { [key: string]: any } = {
              "1": {
                id: "1",
                title: "독서 모임",
                description:
                  "함께 책을 읽고 토론하는 독서 모임입니다.",
                category: "취미",
                location: "서울 강남구",
                hostName: "김독서",
                hostId: "test", // test 계정을 리더로 설정
                participants: { current: 15, max: 30 },
                createdAt: "2024-03-15T16:45:00Z",
              },
              "2": {
                id: "2",
                title: "조깅 모임",
                description:
                  "건강한 아침을 함께 시작하는 조깅 모임입니다.",
                category: "운동",
                location: "서울 한강공원",
                hostName: "이운동",
                hostId: "host2",
                participants: { current: 22, max: 30 },
                createdAt: "2024-04-01T10:10:00Z",
              },
              "3": {
                id: "3",
                title: "요리 클래스",
                description:
                  "다양한 요리를 배우고 함께 나누는 모임입니다.",
                category: "요리",
                location: "서울 마포구",
                hostName: "박요리",
                hostId: "host3",
                participants: { current: 18, max: 25 },
                createdAt: "2024-04-10T14:20:00Z",
              },
              "4": {
                id: "4",
                title: "영화 감상 모임",
                description:
                  "매주 영화를 보고 토론하는 시네마 클럽입니다.",
                category: "문화",
                location: "서울 종로구",
                hostName: "최영화",
                hostId: "host4",
                participants: { current: 20, max: 30 },
                createdAt: "2024-05-05T18:30:00Z",
              },
              "5": {
                id: "5",
                title: "사진 촬영 동호회",
                description:
                  "출사를 다니며 사진 실력을 키우는 모임입니다.",
                category: "취미",
                location: "서울 전역",
                hostName: "정사진",
                hostId: "host5",
                participants: { current: 12, max: 20 },
                createdAt: "2024-05-20T11:00:00Z",
              },
            };

            const communityData = adminCommunityMap[
              communityId
            ] || {
              id: communityId,
              title: "모임",
              description: "모임에 오신 것을 환영합니다!",
              category: "기타",
              location: "서울",
              hostName: "모임 리더",
              hostId: "test", // 기본 리더로 test 설정
              participants: { current: 10, max: 20 },
              createdAt: new Date().toISOString(),
            };

            setSelectedCommunity(communityData);
          }

          setCurrentPage("home");
        }}
      />
    );
  }

  // 결제 페이지 표시
  if (currentPage === "payment") {
    return (
      <PaymentPage
        onClose={handleBackToHome}
        onPaymentSuccess={() => {
          console.log("결제 성공 - 프리미엄 회원 전환");
          handleBackToHome();
        }}
        onBack={handleBackToHome}
      />
    );
  }

  // 커뮤니티 상세 페이지 표시
  if (selectedCommunity) {
    return (
      <div
        className={`${styles.detailContainer} min-h-screen bg-white`}
      >
        <Toaster position="top-center" richColors />
        {/* Header: 네비게이션 바 */}
        <header className={styles.navbar}>
          <Navbar
            onSignupClick={handleSignupClick}
            onLoginClick={handleLoginClick}
            onLogoClick={handleBackToHome}
            onNoticeClick={handleNoticeClick}
            onMiniGameClick={handleMiniGameClick}
            onAdminClick={handleAdminClick}
            onPaymentClick={handlePaymentClick}
            onExploreClick={handleExploreClick}
            onCommunityClick={handleCommunityClick}
            communities={mockCommunities}
            user={user}
            profileImage={profileImage}
            onLogout={handleLogout}
            onMyPageClick={handleMyPageClick}
            onMyMeetingsClick={handleMeetingsClick}
          />
        </header>
        <CommunityDetailPage
          {...selectedCommunity}
          user={user}
          onBack={handleBackFromDetail}
          onLoginClick={handleLoginClick}
        />
      </div>
    );
  }

  // 카테고리가 선택되면 카테고리 페이지만 표시
  if (selectedCategory) {
    return (
      <div
        className={`${styles.categoryContainer} min-h-screen bg-white`}
      >
        {/* Header: 네비게이션 바 */}
        <header className={styles.navbar}>
          <Navbar
            onSignupClick={handleSignupClick}
            onLoginClick={handleLoginClick}
            onLogoClick={handleBackToHome}
            onNoticeClick={handleNoticeClick}
            onMiniGameClick={handleMiniGameClick}
            onAdminClick={handleAdminClick}
            onPaymentClick={handlePaymentClick}
            onExploreClick={handleExploreClick}
            onCommunityClick={handleCommunityClick}
            communities={mockCommunities}
            user={user}
            profileImage={profileImage}
            onLogout={handleLogout}
            onMyPageClick={handleMyPageClick}
            onMyMeetingsClick={handleMeetingsClick}
          />
        </header>
        <CategoryPage
          category={selectedCategory}
          onBack={handleBackToHome}
          user={user}
          onSignupClick={handleSignupClick}
          onMeetingClick={handleMeetingClick}
          onLoginClick={handleLoginClick}
          onCreateClick={handleCreateClick}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} min-h-screen bg-white`}
    >
      <Toaster position="top-center" richColors />
      {/* Header: 네비게이션 바 */}
      <header className={styles.navbar}>
        <Navbar
          onSignupClick={handleSignupClick}
          onLoginClick={handleLoginClick}
          onLogoClick={handleBackToHome}
          onNoticeClick={handleNoticeClick}
          onMiniGameClick={handleMiniGameClick}
          onAdminClick={handleAdminClick}
          onPaymentClick={handlePaymentClick}
          onExploreClick={handleExploreClick}
          onCommunityClick={handleCommunityClickFromExplore}
          communities={mockCommunities}
          user={user}
          profileImage={profileImage}
          onLogout={handleLogout}
          onMyPageClick={handleMyPageClick}
          onMyMeetingsClick={handleMeetingsClick}
        />
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* 히어로 섹션 */}
        <section className={styles.heroSection}>
          <HeroSection onExploreClick={handleExploreClick} />
        </section>

        {/* 광고 배너 */}
        <section className={styles.adBanner}>
          <AdBanner />
        </section>

        {/* 카테고리 섹션 */}
        <section className={styles.categorySection}>
          <CategorySection
            onCategoryClick={handleCategoryClick}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <Footer onNoticeClick={handleNoticeClick} />
      </footer>

      {/* 개발자 메뉴 (개발 모드에서만 표시) */}
      <DevMenu
        onIconsClick={handleIconsClick}
        onError403Click={handleError403Click}
        onError404Click={handleError404Click}
        onError500Click={handleError500Click}
      />
    </div>
  );
}