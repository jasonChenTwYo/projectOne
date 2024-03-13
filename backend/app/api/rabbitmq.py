import json
import pika


def publish_message_to_rabbitmq(task_data: dict):
    credentials = pika.PlainCredentials("guest", "guest")
    connection_parameters = pika.ConnectionParameters(
        host="localhost",
        port=5672,
        credentials=credentials,
    )

    connection = pika.BlockingConnection(connection_parameters)
    channel = connection.channel()
    channel.queue_declare(queue="file_processing_tasks")

    channel.basic_publish(
        exchange="", routing_key="file_processing_tasks", body=json.dumps(task_data)
    )
    connection.close()
