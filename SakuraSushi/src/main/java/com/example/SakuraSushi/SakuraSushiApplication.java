package com.example.SakuraSushi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class SakuraSushiApplication {

	public static void main(String[] args) {

		// 1. Cargar .env antes de que Spring se inicie
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMissing()
				.load();

		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

		// 2. Cargar Spring
		SpringApplication.run(SakuraSushiApplication.class, args);
	}
}
