package com.aloha.durudurub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.durudurub.dto.Notice;
import com.aloha.durudurub.service.NoticeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


/**
 * 공지사항 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeApiController {
    
    private final NoticeService noticeService;

    // 목록
    @GetMapping("")
    @ResponseBody
    public List<Notice> noticeList() 
    {
        return noticeService.getNoticeList();
    }
    
    // 상세보기
    @GetMapping("/{noticeNo}")
    @ResponseBody
    public Notice getNotice(
        @PathVariable("noticeNo") int noticeNo
    ) {
        // 조회수 증가
        return noticeService.getNoticeAndIncrease(noticeNo);
    }

    // 상세보기 - api
    @GetMapping("/api/{noticeNo}")
    @ResponseBody
    public Notice getNoticeDetail(@PathVariable int noticeNo) {
        return noticeService.getNotice(noticeNo);
    }
    
}
