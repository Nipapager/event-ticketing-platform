package com.nipapager.eventticketingplatform.config;

import com.nipapager.eventticketingplatform.enums.UserRole;
import com.nipapager.eventticketingplatform.role.entity.Role;
import com.nipapager.eventticketingplatform.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds initial data into the database
 * Runs once at application startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
    }

    private void seedRoles() {
        // Check if roles already exist
        if (roleRepository.count() > 0) {
            log.info("Roles already exist, skipping seeding");
            return;
        }

        log.info("Seeding default roles...");

        // Create ROLE_USER
        Role roleUser = Role.builder()
                .name(UserRole.ROLE_USER)
                .createdAt(LocalDateTime.now())
                .build();
        roleRepository.save(roleUser);
        log.info("Created role: ROLE_USER");

        // Create ROLE_ORGANIZER
        Role roleOrganizer = Role.builder()
                .name(UserRole.ROLE_ORGANIZER)
                .createdAt(LocalDateTime.now())
                .build();
        roleRepository.save(roleOrganizer);
        log.info("Created role: ROLE_ORGANIZER");

        // Create ROLE_ADMIN
        Role roleAdmin = Role.builder()
                .name(UserRole.ROLE_ADMIN)
                .createdAt(LocalDateTime.now())
                .build();
        roleRepository.save(roleAdmin);
        log.info("Created role: ROLE_ADMIN");

        log.info("Default roles seeded successfully!");
    }
}