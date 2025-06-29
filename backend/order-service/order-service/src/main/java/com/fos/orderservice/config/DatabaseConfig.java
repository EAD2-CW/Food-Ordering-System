package com.fos.orderservice.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.fos.orderservice.repository")
@EntityScan(basePackages = "com.fos.orderservice.model")
public class DatabaseConfig {
}