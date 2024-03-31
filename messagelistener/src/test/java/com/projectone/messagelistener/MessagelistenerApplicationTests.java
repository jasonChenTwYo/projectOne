package com.projectone.messagelistener;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.file.Path;
import java.nio.file.Paths;


class MessagelistenerApplicationTests {

	@Test
	void contextLoads() {
		String userHome = System.getProperty("user.home");
		Path documentsPath = Paths.get(userHome, "Documents");

		System.out.println("documentsPath: " + documentsPath);
	}

}
