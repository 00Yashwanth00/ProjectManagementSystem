package com.yashwanth.pms.project.repository;

import com.yashwanth.pms.project.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("SELECT p FROM Project p JOIN p.projectMembers pm WHERE pm.user.id = :userId")
    List<Project> findProjectsByMemberId(@Param("userId") UUID userId);

    @Query("SELECT p FROM Project p WHERE p.leader.id = :userId")
    List<Project> findProjectsByLeaderId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.leader.id = :userId")
    long countProjectsLedByUser(@Param("userId") UUID userId);
}