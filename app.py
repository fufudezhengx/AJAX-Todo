from flask import (
    Flask,
    render_template,
)

from routes.routes_todo import main as todo_view
from routes.api_todo import main as todo_api
from routes.routes_weibo import main as weibo_view
from routes.api_weibo import main as weibo_api
from routes.api_comment import main as comment_api
from routes.routes_user import main as user_view
from routes.api_user import main as user_api
from routes.routes_static import main as index_view

app = Flask(__name__)

# 注册路由
app.register_blueprint(todo_view, url_prefix='/todo')
app.register_blueprint(todo_api, url_prefix='/api/todo')

app.register_blueprint(weibo_view, url_prefix='/weibo')
app.register_blueprint(weibo_api, url_prefix='/api/weibo')

app.register_blueprint(comment_api, url_prefix='/api/comment')

app.register_blueprint(user_view, url_prefix='/user')
app.register_blueprint(user_api, url_prefix='/api/user')
app.register_blueprint(index_view)

app.secret_key = '23jk123%_$^><}>lki12as24Jda4s234ldf3jk123l/*+'


@app.errorhandler(404)
def error(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.register_blueprint(todo_view, url_prefix='/todo')
    app.register_blueprint(todo_api, url_prefix='/api/todo')

    app.register_blueprint(weibo_view, url_prefix='/weibo')
    app.register_blueprint(weibo_api, url_prefix='/api/weibo')

    app.register_blueprint(comment_api, url_prefix='/api/comment')

    app.register_blueprint(user_view, url_prefix='/user')
    app.register_blueprint(user_api, url_prefix='/api/user')
    app.register_blueprint(index_view)

    # 生成配置并且运行程序
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=3000,
    )
    # 如果不了解 **kwargs 的用法, 上过基础课的请复习函数, 新同学自行搜索
    app.run(**config)
