import json
import pika
from app.config.config import settings

credentials = pika.PlainCredentials("guest", "guest")
connection_parameters = pika.ConnectionParameters(
    host=settings.RABBITMQ_HOST,
    port=5672,
    credentials=credentials,
)


def get_connection():
    with pika.BlockingConnection(connection_parameters) as connection:
        yield connection


def publish_message_to_rabbitmq(task_data: dict):

    for connection in get_connection():
        channel = connection.channel()
        channel.queue_declare(queue="file_processing_tasks")

        channel.basic_publish(
            exchange="", routing_key="file_processing_tasks", body=json.dumps(task_data)
        )


def init_queue():
    for connection in get_connection():
        channel = connection.channel()
        channel.queue_declare(queue="file_processing_tasks")
