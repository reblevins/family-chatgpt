import json
import base64
from urllib.request import urlopen

from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from jose import jwt

from authlib.integrations.flask_oauth2 import ResourceProtector
from validator import Auth0JWTBearerTokenValidator

from openai import OpenAI

from models import db, Chat

AUTH0_DOMAIN = "dev-07p28ainp0fse0b3.us.auth0.com"
API_AUDIENCE = "https://family-chat-gpt/api"
ALGORITHMS = ["RS256"]
require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(AUTH0_DOMAIN, API_AUDIENCE)
require_auth.register_token_validator(validator)

open_ai_client = OpenAI()

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///myfamilychat.db"
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

# enable CORS
CORS(app)


# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def encode_image(image):
    image_string = base64.b64encode(image.read())
    image_string = image_string.decode("utf-8")
    return image_string


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


@app.route("/", methods=["GET"])
@cross_origin(headers=["Content-Type", "Authorization"])
def index():
    return jsonify({"message": "Hello World"})


@app.route("/users/<string:user_id>/chats", methods=["GET"])
@cross_origin(headers=["Content-Type", "Authorization"])
@require_auth(None)
def get_all_chats_for_user(user_id):
    try:
        print(user_id)
        chats = (
            Chat.query.filter_by(user_id=user_id).order_by(Chat.updated_at.desc()).all()
        )
        print(chats)
        return jsonify({"chats": [chat.to_dict() for chat in chats]})
    except Exception as e:
        print(e)
        return jsonify({"error": e})


@app.route("/users/<string:user_id>/chats", methods=["PUT"])
@cross_origin(headers=["Content-Type", "Authorization"])
@require_auth(None)
def create_new_chat(user_id):
    messages = []

    messages.append(
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are a helpful AI assistant.",
                }
            ],
        }
    )

    text = request.form.get("content")
    image = request.form.get("image")

    if image:
        messages.append(
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image,
                        },
                    },
                ],
            }
        )

    messages.append(
        {
            "role": "user",
            "content": [
                {"type": "text", "text": text},
            ],
        }
    )

    print(messages)

    response = open_ai_client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=messages,
        max_tokens=600,
    )
    response_message = response.choices[0].message.content
    print(response_message)

    messages.append(
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": response_message,
                }
            ],
        }
    )

    new_chat = Chat(messages=messages, user_id=user_id, name="")

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Based on this answer given by ChatGPT, please give this chat a name in 5 words or less. Please only return the name of the chat: {response_message}",
                }
            ],
        }
    ]
    naming_response = open_ai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=600,
    )
    new_chat.name = naming_response.choices[0].message.content

    db.session.add(new_chat)
    db.session.commit()
    print(new_chat.to_dict())

    return jsonify({"chat": new_chat.to_dict()})


@app.route("/chats/<string:chat_id>/messages", methods=["POST"])
@cross_origin(headers=["Content-Type", "Authorization"])
@require_auth(None)
def post_to_chat(chat_id):
    chat = Chat.query.filter_by(id=chat_id).first()

    if chat:
        text = request.form.get("content")
        image = request.form.get("image")

        if image:
            chat.add_message(
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image,
                            },
                        },
                    ],
                }
            )

        chat.add_message(
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": text},
                ],
            }
        )

        messages = chat.messages
        print(messages)

        response = open_ai_client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=messages,
            max_tokens=600,
        )
        response_message = response.choices[0].message.content
        print(response_message)

        chat.add_message(
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": response_message,
                    }
                ],
            }
        )

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Based on this answer given by ChatGPT, please give this chat a name in 5 words or less. Please only return the name of the chat: {response_message}",
                    }
                ],
            }
        ]
        naming_response = open_ai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=600,
        )

        chat.name = naming_response.choices[0].message.content
        db.session.commit()
        return jsonify({"chat": chat.to_dict()})
    else:
        return jsonify({"error": "Chat not found"}), 404


if __name__ == "__main__":
    app.run()
