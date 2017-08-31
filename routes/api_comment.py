from models.comment import Comment
from routes import login_required
from utils import log
from flask import (
    jsonify,
    Blueprint,
    request,
)

main = Blueprint('comment_api', __name__)


@main.route('/all', methods=['GET'])
@login_required
def all():
    # weibo_list = Weibo.all()
    # # 要转换为 dict 格式才行
    # weibos = [t.json() for t in weibo_list]
    comments = Comment.all_json()
    log('All weibos', comments)
    return jsonify(comments)


@main.route('/add', methods=['POST'])
@login_required
def add_comment():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.get_json()
    log('form.json', form)
    # 创建一个 comment
    # user = current_user(request)
    user_id = 0
    c = Comment.new(form, user_id)
    log('new comment', c)
    # 把创建好的 comment 返回给浏览器
    return jsonify(c.json())


@main.route('/delete', methods=['GET'])
@login_required
def delete_comment():
    comment_id = int(request.args.get('id'))
    c = Comment.delete(comment_id)
    return jsonify(c.json())


@main.route('/update', methods=['POST'])
@login_required
def update_comment():
    form = request.get_json()
    log('update comment form', form)
    comment_id = form.get("id")
    log('update comment id', comment_id)
    c = Comment.update(comment_id, form)
    log('aaaaaaa', Comment.find(comment_id))
    log('update comment', c)
    return jsonify(c.json())