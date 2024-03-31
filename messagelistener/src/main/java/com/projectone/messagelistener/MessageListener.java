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

    private final com.projectone.messagelistener.DbMapper dbMapper;

    @RabbitListener(queues = "file_processing_tasks")
    public void receiveMessage(String message) {
        com.projectone.messagelistener.Video video = gson.fromJson(message, com.projectone.messagelistener.Video.class);
        String userId = video.getUserId();
        video.setVideoId(UUID.randomUUID().toString().replaceAll("-",""));
        video.setUserId(video.getUserId().replaceAll("-",""));
        video.setUploadTime(new Date());
        dbMapper.insertVideo(video);
        if(StringUtils.isNotBlank(video.getCategories())){
            String[] results = video.getCategories().split(",");
            for(String result:results){
                var videoCategoryAssociation = new com.projectone.messagelistener.VideoCategoryAssociation();
                videoCategoryAssociation.setCategoryId(result.replaceAll("-",""));
                videoCategoryAssociation.setVideoId(video.getVideoId().replaceAll("-",""));
                dbMapper.insertVideoCategoryAssociation(videoCategoryAssociation);
            }
        }
        // 获取用户的主目录
        String userHome = System.getProperty("user.home");

        try {
            Path sourcePath = Paths.get(userHome,"Documents\\projectOne\\backend\\static\\temp\\video\\"+video.getVideoPath()+".mp4");
            if(Files.exists(sourcePath)){
                log.info("exists");
            }
            Path targetPath = Paths.get(userHome,"Documents\\projectOne\\backend\\static\\video\\"+userId+"\\"+video.getVideoPath()+".mp4");
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            System.err.println("move fail：" + e.getMessage());
        }

        try {
            Path sourcePath = Paths.get(userHome,"Documents\\projectOne\\backend\\static\\temp\\img\\"+video.getThumbnailPath());
            Path targetPath = Paths.get(userHome,"Documents\\projectOne\\backend\\static\\img\\"+userId+"\\"+video.getThumbnailPath());
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            log.error(e.getMessage(),e);
            System.err.println("move fail：" + e.getMessage());
        }

        log.info("VideoId : {} save finish",video.getVideoId());
    }
}
