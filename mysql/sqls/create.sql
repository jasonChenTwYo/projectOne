-- 用戶表
create table user (
    user_id char(36) primary key comment '用戶ID，主鍵，UUID',
    account VARCHAR(255) NOT NULL unique COMMENT '帳號，唯一，不允許為空',
    user_name varchar(255) not null comment '用戶名，不允許為空',
    email varchar(255) not null unique comment '電子郵箱，唯一，不允許為空',
    password_hash varchar(255) not null comment '密碼哈希值，不允許為空',
    create_time timestamp default current_timestamp comment '創建時間，默認為當前時間戳'
) comment='用戶資訊表';

-- 影片分類表
create table category (
    category_id char(36) primary key comment '分類ID，主鍵，UUID',
    category_name varchar(255) not null unique comment '分類名稱，不允許為空'
) comment='影片分類資訊表';

-- 影片表
create table video (
    video_id char(36) primary key comment '影片ID，主鍵，UUID',
    user_id char(36) comment '用戶ID，外鍵，引用用戶表的user_id',
    title varchar(255) not null comment '影片標題，不允許為空',
    description text comment '影片描述',
    upload_time timestamp default current_timestamp comment '上傳時間，默認為當前時間戳',
    video_path varchar(255) not null comment '影片路徑，不允許為空',
    thumbnail_path varchar(255) not null comment '縮略圖路徑，不允許為空',
    foreign key (user_id) references user(user_id)
) comment='影片資訊表';

CREATE TABLE video_category_association (
    video_id CHAR(36),
    category_id CHAR(36),
    PRIMARY KEY (video_id, category_id),
    FOREIGN KEY (video_id) REFERENCES video(video_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
) COMMENT='影片和分類之間的多對多關聯表';

-- 用戶觀看歷史表
create table watch_history (
    watch_id char(36) primary key comment '觀看記錄ID，主鍵，UUID',
    user_id char(36) comment '用戶ID，外鍵，引用用戶表的user_id',
    video_id char(36) comment '影片ID，外鍵，引用影片表的video_id',
    watch_time timestamp '觀看時間，默認為當前時間戳',
    foreign key (user_id) references user(user_id),
    foreign key (video_id) references video(video_id)
) comment='用戶觀看歷史資訊表';
