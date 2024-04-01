
FROM gradle:jdk21 AS builder

WORKDIR /app

COPY build.gradle settings.gradle /app/

COPY src ./src

RUN gradle build -x test --no-daemon

FROM openjdk:21-jdk-slim

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar /app/app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar","--spring.profiles.active=dev"]