package com.yashwanth.pms.project.repository;

import com.yashwanth.pms.project.domain.Project;
import com.yashwanth.pms.project.domain.ProjectMember;
import com.yashwanth.pms.project.domain.ProjectMemberId;
import com.yashwanth.pms.project.domain.ProjectMemberRole;
import com.yashwanth.pms.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, ProjectMemberId> {

    List<ProjectMember> findByProject(Project project);

    List<ProjectMember> findByUser(User user);

    Optional<ProjectMember> findByProjectAndUser(Project project, User user);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role = :role")
    List<ProjectMember> findByProjectIdAndRole(@Param("projectId") UUID projectId,
                                               @Param("role") ProjectMemberRole role);

    @Query("SELECT pm.user FROM ProjectMember pm WHERE pm.project.id = :projectId")
    List<User> findUsersByProjectId(@Param("projectId") UUID projectId);

    @Query("SELECT COUNT(pm) FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role = :role")
    long countByProjectIdAndRole(@Param("projectId") UUID projectId,
                                 @Param("role") ProjectMemberRole role);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.id = :projectId AND pm.role = :role")
    List<ProjectMember> findLeadersByProjectId(@Param("projectId") UUID projectId);

    void deleteByProjectAndUser(Project project, User user);
}