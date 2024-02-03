# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG PYTHON_VERSION=3.12.1
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt
    
# Switch to the non-privileged user to run the application.
USER appuser

# Copy the source code into the container.
COPY . ./backend

#ENV FLASK_RUN_HOST 0.0.0.0
#ENV FLASK_APP app

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
# CMD flask run

#CMD ["flask","--app","app","run","--host","0.0.0.0"]

# -w 3: 設定 worker 的數量為 3。
#每個 worker 是一個獨立的進程，用於處理應用程式的請求。這個數字通常根據你的伺服器的 CPU 核心數來調整，以充分利用硬體資源。
# -t 60: 設定 worker 的 timeout 為 60 秒。
#如果一個 worker 在指定時間內沒有處理完請求，它將被強制終止。這有助於防止長時間的請求佔用 worker 資源。
# -b 0.0.0.0:8000: 指定 Gunicorn 監聽的 IP 位址和端口
CMD ["gunicorn", "-w", "3", "-t", "60", "-b", " 0.0.0.0:8000", "backend:app"]