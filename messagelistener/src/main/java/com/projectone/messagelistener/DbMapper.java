package com.projectone.messagelistener;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface DbMapper {
    void insertVideo(@Param("video") Video video);

    void insertVideoCategoryAssociation(VideoCategoryAssociation videoCategoryAssociation);
}