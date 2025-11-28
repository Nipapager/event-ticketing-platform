package com.nipapager.eventticketingplatform.role.entity;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing user roles in the system
 * Maps to 'roles' table in database
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private UserRole name;

    @ManyToMany(mappedBy = "roles")  // Matches field name in User
    @ToString.Exclude  // Prevents infinite loop
    private List<User> users;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}