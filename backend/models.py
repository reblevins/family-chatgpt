# models.py
from flask_sqlalchemy import SQLAlchemy

# from sqlalchemy.ext.mutable import Mutable
# from sqlalchemy import event
from sqlalchemy.orm.attributes import flag_modified

db = SQLAlchemy()


class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(200), nullable=True)
    messages = db.Column(db.PickleType, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
        server_onupdate=db.func.now(),
    )

    def add_message(self, message):
        self.messages.append(message)
        flag_modified(self, "messages")

    # messages = db.relationship("Message", backref="chat", lazy=False)
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "messages": self.messages,
        }
