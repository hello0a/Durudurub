package com.aloha.durudurub.security.oauth;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.aloha.durudurub.dto.User;
import com.aloha.durudurub.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService{
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        User user = null;

        String userNameAttributeName = userRequest.getClientRegistration()
                                     .getProviderDetails()
                                     .getUserInfoEndpoint()
                                     .getUserNameAttributeName();

        String provider = userRequest.getClientRegistration().getRegistrationId();

        // 읽기 전용 에러
        Map<String,Object> attributes = new HashMap<>(oAuth2User.getAttributes());

        // 2. Factory 적용
        OAuth2UserInfo userInfo =
            OAuth2UserInfoFactory.get(provider, attributes);

        // 1. provider 별 정보 파싱
        // OAuth2UserInfo userInfo;

        // if (provider.equals("google")) {
        //     userInfo = new GoogleUserInfo(attributes);
        // } else if (provider.equals("naver")) {
        //     userInfo = new NaverUserInfo(attributes);
        // } else {
        //     userInfo = new KakaoUserInfo(attributes);
        // }

        // DB 회원 확인
        user = userService.findByProviderAndProviderId(userInfo.getProvider(), userInfo.getProviderId()); 

        // 회원가입
        // 1. 회원 없으면 자동 가입
        if (user == null) {
            user = new User();

            // 2. 소셜 이메일 중복 방지
            String socialUserId = 
                userInfo.getProvider() + "_" + userInfo.getProviderId();

            // 3. 네이버 오류 방지
            String username = userInfo.getUserName();
            
            if (username == null || username.isBlank()) {
                username = userInfo.getProvider() + "_" + userInfo.getProviderId();
            }

            // 닉네임 중복 체크
            if (userService.existsByUsername(username)) {
                username = username + "_" + (int)(Math.random() * 10000);
            }
            
            user.setUserId(socialUserId);
            user.setUsername(username);
            // user.setUsername(userInfo.getUserName());
            user.setProvider(userInfo.getProvider());
            user.setProviderId(userInfo.getProviderId());

            // 임의값 password으로 변경 및 권한 조회
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.getAuthList();

            userService.insert(user);
            // 신규 가입 후 재조회
            user = userService.findByProviderAndProviderId(userInfo.getProvider(), userInfo.getProviderId());
        }

        // JWT 생성용 userId
        // 읽기 전용 Map - 에러
        attributes.put("userId", user.getUserId());

        // DB에서 가져온 권한 -> GrantedAuthority로 변환
        Collection<GrantedAuthority> authorities = 
            user.getAuthList().stream()
                .map(auth -> new SimpleGrantedAuthority(auth.getAuth()))
                .collect(Collectors.toList());
            
        DefaultOAuth2User result = new DefaultOAuth2User(
                                        authorities,
                                        attributes,
                                        userNameAttributeName);

        System.out.println("provider = " + userInfo.getProvider());
        System.out.println("providerId = " + userInfo.getProviderId());
        System.out.println("user = " + user);

        return result;
    }
}
