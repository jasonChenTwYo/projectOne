from flask import Blueprint, render_template, Response, app
from app import stream

bp = Blueprint("video", __name__, url_prefix="/video")

@bp.route("/getVideo",methods=['GET'])
def getVideo():
    return {
        "username": "jason1",
        "theme": 123,
    }

@bp.route("/stream1", methods=['GET'])
def get_stream_html():
    return render_template('stream.html')


from io import BytesIO
from PIL import Image


def resize_img_2_bytes(image, resize_factor, quality):
    bytes_io = BytesIO()
    img = Image.fromarray(image)

    w, h = img.size
    img.thumbnail((int(w * resize_factor), int(h * resize_factor)))
    img.save(bytes_io, 'jpeg', quality=quality)

    return bytes_io.getvalue()


def get_image_bytes():
    success, img = stream.cap.read()
    if success:
        img = stream.cv2.cvtColor(img, stream.cv2.COLOR_BGR2RGB)
        img_bytes = resize_img_2_bytes(img, resize_factor=0.5, quality=30)
        return img_bytes

    return None

def gen_frames():
    while True:
        img_bytes = get_image_bytes()
        if img_bytes:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + img_bytes + b'\r\n')

@bp.route('/api/stream')
def video_stream():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')