from functools import wraps

from utils import log
from models.user import User

from flask import (
    request,
    session,
    redirect,
    url_for,
)


def current_user():
    log('cookies:', request.cookies)
    user_id = session.get('user_id', None)
    if user_id is not None:
        log('cookies:', user_id)
        u = User.find(user_id)
        return u
    else:
        return None


def login_required(route_function):
    """
    这个函数看起来非常绕
    所以你不懂也没有关系
    就直接复制粘贴拿来用就好了
    """

    @wraps(route_function)
    def f(*args, **kwargs):
        u = current_user()
        if u is None:
            log('非登录用户')
            return redirect(url_for('user.login'))
        else:
            return route_function(*args, **kwargs)

    return f