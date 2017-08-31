import time

from models import Model
from models.comment import Comment
from utils import formatted_time, log


class Weibo(Model):
    """
    微博类
    """
    @classmethod
    def valid_names(cls):
        names = super().valid_names()
        names = names + [
            'content',
            'user_id',
            'created_time',
            'updated_time',
        ]
        return names

    @classmethod
    def new(cls, form, user_id):
        m = super().new(form)
        m.user_id = user_id

        t = int(time.time())
        m.created_time = t
        m.updated_time = t

        m.save()
        return m

    @classmethod
    def update(cls, id, form):
        m = super().update(id, form)
        log('weibo update', m)
        m.updated_time = int(time.time())
        m.save()
        return m

    def formatted_created_time(self):
        return formatted_time(self.created_time)

    def formatted_updated_time(self):
        return formatted_time(self.updated_time)

    def is_owner(self, id):
        return self.user_id == id

    def comments(self):
        return Comment.find_all(weibo_id=self.id)