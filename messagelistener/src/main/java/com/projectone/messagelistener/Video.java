package com.projectone.messagelistener;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.Date;

@Data
public class Video {
    @SerializedName("video_id")
    private String videoId;

    @SerializedName("user_id")
    private String userId;

    private String title;

    private String description;

    @SerializedName("upload_time")
    private Date uploadTime;

    @SerializedName("video_path")
    private String videoPath;

    @SerializedName("thumbnail_path")
    private String thumbnailPath;

    private  String categories;
}
