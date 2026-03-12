package com.aloha.durudurub.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.durudurub.dto.Board;
import com.aloha.durudurub.dto.Category;
import com.aloha.durudurub.dto.Club;
import com.aloha.durudurub.dto.ClubMember;
import com.aloha.durudurub.dto.SubCategory;
import com.aloha.durudurub.dto.User;
import com.aloha.durudurub.service.BoardService;
import com.aloha.durudurub.service.CategoryService;
import com.aloha.durudurub.service.ClubService;
import com.aloha.durudurub.service.LikeService;
import com.aloha.durudurub.service.UserService;


@RestController
@RequestMapping("/api/clubs")
public class ClubApiController {

    @Autowired
    private ClubService clubService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private LikeService likeService;

    /**
     * 모임 목록 조회
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "category", required = false) Integer categoryNo,
            @RequestParam(value = "sub", required = false) Integer subCategoryNo,
            @RequestParam(value = "keyword", required = false) String keyword) {

        List<Club> clubs;

        if (keyword != null && !keyword.trim().isEmpty()) {
            clubs = clubService.search(keyword);
        } else if (subCategoryNo != null) {
            clubs = clubService.listBySubCategory(subCategoryNo);
        } else if (categoryNo != null) {
            clubs = clubService.listByCategory(categoryNo);
        } else {
            clubs = clubService.list();
        }

        List<Category> categories = categoryService.list();

        Map<String, Object> result = new HashMap<>();
        result.put("clubs", clubs);
        result.put("categories", categories);

        return ResponseEntity.ok(result);
    }

    /**
     * 모임 상세 조회
     */
    @GetMapping("/{no}")
    public ResponseEntity<Map<String, Object>> detail(
            @PathVariable("no") int no,
            Principal principal) {

        clubService.incrementViewCount(no);
        Club club = clubService.selectByNo(no);

        if (club == null) {
            return ResponseEntity.notFound().build();
        }

        List<ClubMember> members = clubService.listApproveMembers(no);
        List<Board> boards = boardService.listByClub(no);

        Map<String, Object> result = new HashMap<>();
        result.put("club", club);
        result.put("members", members);
        result.put("boards", boards);

        if (principal != null) {
            User user = userService.selectByUserId(principal.getName());
            ClubMember myMembership = clubService.selectMember(no, user.getNo());
            result.put("myMembership", myMembership);
            result.put("isHost", club.getHostNo() == user.getNo());
            result.put("isLoggedIn", true);

            club.setLiked(likeService.isClubLiked(no, user.getNo()));

            if (boards != null) {
                for (Board board : boards) {
                    board.setLiked(likeService.isBoardLiked(board.getNo(), user.getNo()));
                }
            }
        } else {
            result.put("isHost", false);
            result.put("isLoggedIn", false);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * 카테고리 목록 조회
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> categories() {
        return ResponseEntity.ok(categoryService.list());
    }

    /**
     * 서브카테고리 목록 조회
     */
    @GetMapping("/subcategories/{categoryNo}")
    public ResponseEntity<List<SubCategory>> subcategories(
            @PathVariable("categoryNo") int categoryNo) {
        return ResponseEntity.ok(categoryService.listBySubCategory(categoryNo));
    }
}
