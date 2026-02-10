package com.yashwanth.pms.comment.repository;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.task.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByTaskOrderByCreatedAtAsc(Task task);
    List<Comment> findByIssueOrderByCreatedAtAsc(Issue issue);

}
