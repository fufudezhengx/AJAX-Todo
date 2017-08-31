from routes import login_required
from utils import log
from models.weibo import Weibo

from flask import (
    jsonify,
    Blueprint,
    request,
)

main = Blueprint('weibo_api', __name__)


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
@main.route('/all', methods=['GET'])
@login_required
def all():
    # weibo_list = Weibo.all()
    # # 要转换为 dict 格式才行
    # weibos = [t.json() for t in weibo_list]
    weibos = Weibo.all_json()
    log('All weibos', weibos)
    return jsonify(weibos)


@main.route('/add', methods=['POST'])
@login_required
def add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    # 所以这里我们用新增加的 json 函数来获取格式化后的 json 数据
    form = request.get_json()
    log('form.json', form)
    # 创建一个 weibo
    # user = current_user(request)
    user_id = 0
    w = Weibo.new(form, user_id)
    log('new weibo', w)
    # 把创建好的 weibo 返回给浏览器
    return jsonify(w.json())


@main.route('/delete', methods=['GET'])
@login_required
def delete():
    weibo_id = int(request.args.get('id'))
    w = Weibo.delete(weibo_id)
    return jsonify(w.json())


@main.route('/update', methods=['POST'])
@login_required
def update():
    form = request.get_json()
    weibo_id = int(form.get('id'))
    w = Weibo.update(weibo_id, form)
    return jsonify(w.json())


