package com.doners.donersbackend.api.service;

import com.doners.donersbackend.api.dto.request.UserInfoSetRequestDTO;
import com.doners.donersbackend.api.dto.response.UserLoginResponseDTO;
import com.doners.donersbackend.db.entity.User;
import com.doners.donersbackend.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // 회원가입 : 필수 회원 정보 입력 - 이름, 이메일, 닉네임
    @Override
    public Integer setUserInfo(UserInfoSetRequestDTO userInfoSetRequestDTO) {
        String userEmail = userInfoSetRequestDTO.getUserEmail();
        String userAccount = userInfoSetRequestDTO.getUserAccount();

        // 이미 해당 이메일로 가입한 계정 존재하는지 확인
        if(userRepository.findByUserEmailAndUserIsDeleted(userEmail, false).isPresent()) {
            return 409;
        }

        // 이미 해당 메타마스크 계정 주소로 가입한 계정 존재하는지 확인
        if(userRepository.findByUserAccountAndUserIsDeleted(userAccount, false).isPresent()) {
            return 409;
        }

        // account 정보 추가할 것
        User user = User.builder()
                .userName(userInfoSetRequestDTO.getUserName())
                .userNickname(userInfoSetRequestDTO.getUserNickname())
                .userEmail(userEmail)
                .userAccount(userAccount).build();

        userRepository.save(user);
        return 201;
    }

    @Override
    public UserLoginResponseDTO getUserLoginResponseDTO(String userAccount) {
        User user = userRepository.findByUserAccountAndUserIsDeleted(userAccount, false)
                .orElseThrow(() -> new IllegalArgumentException("해당 메타마스크 계정 주소로 가입된 정보가 없습니다."));

        try {
            return UserLoginResponseDTO.builder()
                    .userNickname(user.getUserNickname()).build();

        } catch (Exception e) {
            return null;
        }
    }

    // 닉네임 변경
    @Override
    public Integer changeUserNickname(String userNickname) {
        // 추후 변경
        User user = userRepository.findByUserNickname("웅이")
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임을 찾을 수 없습니다."));

        try {
            user.changeNickname(userNickname);
        } catch(Exception e) {
            return 409;
        }

        userRepository.save(user);
        return 200;
    }

    // 닉네임 중복 체크
    // 중복이면 409(불가) , 아니면 200(가능)
    @Override
    public Integer checkNickname(String userNickname) {
        if(userRepository.findByUserNickname(userNickname).isPresent())
            return 409;

        return 200;
    }

}
