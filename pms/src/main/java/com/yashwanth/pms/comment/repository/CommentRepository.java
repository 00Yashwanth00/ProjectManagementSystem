package com.yashwanth.pms.comment.repository;

import com.yashwanth.pms.comment.domain.Comment;
import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.task.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByTaskOrderByCreatedAtAsc(Task task);

    List<Comment> findByIssueOrderByCreatedAtAsc(Issue issue);

    @Query("SELECT c FROM Comment c WHERE c.task.id = :taskId AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findTopLevelByTaskId(@Param("taskId") UUID taskId);

    @Query("SELECT c FROM Comment c WHERE c.issue.id = :issueId AND c.parentComment IS NULL ORDER BY c.createdAt ASC")
    List<Comment> findTopLevelByIssueId(@Param("issueId") UUID issueId);

    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentId ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentId(@Param("parentId") UUID parentId);

    long countByTaskId(UUID taskId);

    long countByIssueId(UUID issueId);
}