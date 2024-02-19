-- 修改用戶表
create table users (
    user_id char(36) primary key comment '用戶ID，主鍵，UUID',
    user_name varchar(255) not null comment '用戶名，不允許為空',
    email varchar(255) not null unique comment '電子郵箱，唯一，不允許為空',
    password_hash varchar(255) not null comment '密碼哈希值，不允許為空',
    create_time timestamp default current_timestamp comment '創建時間，默認為當前時間戳'
) comment='用戶資訊表';

-- 修改影片分類表
create table categories (
    category_id char(36) primary key comment '分類ID，主鍵，UUID',
    category_name varchar(255) not null comment '分類名稱，不允許為空'
) comment='影片分類資訊表';

-- 修改影片表
create table videos (
    video_id char(36) primary key comment '影片ID，主鍵，UUID',
    user_id char(36) comment '用戶ID，外鍵，引用用戶表的user_id',
    category_id char(36) comment '分類ID，外鍵，引用分類表的category_id',
    title varchar(255) not null comment '影片標題，不允許為空',
    description text comment '影片描述',
    upload_time timestamp default current_timestamp comment '上傳時間，默認為當前時間戳',
    video_path varchar(255) not null comment '影片路徑，不允許為空',
    thumbnail_path varchar(255) not null comment '縮略圖路徑，不允許為空',
    foreign key (user_id) references users(user_id),
    foreign key (category_id) references categories(category_id)
) comment='影片資訊表';

-- 修改評論表
create table comments (
    comment_id char(36) primary key comment '評論ID，主鍵，UUID',
    video_id char(36) comment '影片ID，外鍵，引用影片表的video_id',
    user_id char(36) comment '用戶ID，外鍵，引用用戶表的user_id',
    comment_text text not null comment '評論內容，不允許為空',
    comment_time timestamp default current_timestamp comment '評論時間，默認為當前時間戳',
    foreign key (video_id) references videos(video_id),
    foreign key (user_id) references users(user_id)
) comment='用戶評論資訊表';

-- 修改用戶觀看歷史表
create table watch_history (
    watch_id char(36) primary key comment '觀看記錄ID，主鍵，UUID',
    user_id char(36) comment '用戶ID，外鍵，引用用戶表的user_id',
    video_id char(36) comment '影片ID，外鍵，引用影片表的video_id',
    watch_time timestamp default current_timestamp comment '觀看時間，默認為當前時間戳',
    foreign key (user_id) references users(user_id),
    foreign key (video_id) references videos(video_id)
) comment='用戶觀看歷史資訊表';
