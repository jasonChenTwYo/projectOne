package com.projectone.messagelistener;

import com.google.gson.Gson;
import io.micrometer.common.util.StringUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.UUID;

@Component
@AllArgsConstructor
@Slf4j
public class MessageListener {

    private final Gson gson = new Gson();

    private final DbMapper dbMapper;

    @RabbitListener(queues = "file_processing_tasks")
    public void receiveMessage(String message) {
        Video video = gson.fromJson(message, Video.class);
        video.setVideoId(UUID.randomUUID().toString());
        video.setUploadTime(new Date());

        // 获取用户的主目录
        String userHome = System.getProperty("user.home");

        try {
//            Path sourcePath = Paths.get(userHome, "Documents\\projectOne\\backend\\static\\temp\\video\\" + video.getVideoPath() + ".mp4");
            Path sourcePath = Paths.get("/app/static/temp/video/" + video.getVideoPath() + ".mp4");
//            Path targetPath = Paths.get(userHome, "Documents\\projectOne\\backend\\static\\video\\" + video.getUserId() + "\\" + video.getVideoPath() + ".mp4");
            Path targetPath = Paths.get("/app/static/video/" + video.getUserId() + "/" + video.getVideoPath() + ".mp4");
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            System.err.println("move fail：" + e.getMessage());
        }

        try {
            Path sourcePath = Paths.get("/app/static/temp/img/" + video.getThumbnailPath());
//            Path sourcePath = Paths.get(userHome, "Documents\\projectOne\\backend\\static\\temp\\img\\" + video.getThumbnailPath());
            Path targetPath = Paths.get("/app/static/img/" + video.getUserId() + "/" + video.getThumbnailPath());
//            Path targetPath = Paths.get(userHome, "Documents\\projectOne\\backend\\static\\img\\" + video.getUserId() + "\\" + video.getThumbnailPath());
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);

            dbMapper.insertVideo(video);
            if (StringUtils.isNotBlank(video.getCategories())) {
                String[] results = video.getCategories().split(",");
                for (String result : results) {
                    var videoCategoryAssociation = new VideoCategoryAssociation();
                    videoCategoryAssociation.setCategoryId(result);
                    videoCategoryAssociation.setVideoId(video.getVideoId());
                    dbMapper.insertVideoCategoryAssociation(videoCategoryAssociation);
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            System.err.println("move fail：" + e.getMessage());
        }

        log.info("VideoId : {} save finish", video.getVideoId());
    }
}
