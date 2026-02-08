package com.yashwanth.pms.issue.repository;

import com.yashwanth.pms.issue.domain.Issue;
import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IssueRepository extends JpaRepository<Issue, UUID> {

    List<Issue> findByProject(Project project);

    List<Issue> findByAssignee(User assignee);

}
