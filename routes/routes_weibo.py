from flask import (
    render_template,
    Blueprint,
)

from routes import login_required

main = Blueprint('weibo', __name__)


# 微博相关页面
@main.route('/index')
@login_required
def index():
    return render_template('weibo_index.html')
