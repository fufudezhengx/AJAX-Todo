var apiCommentAll = function(callback) {
    var path = '/api/comment/all'
    ajax('GET', path, '', callback)
}

var apiCommentDelete = function(id, callback) {
    var path = '/api/comment/delete?id=' + id
    ajax('GET', path, '', callback)
}

var apiCommentAdd = function(form, callback){
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}


// 评论模板
var commentTemplate = function(comment) {
    var content = comment.content
    var id = comment.id
    // data-* 是 HTML5 新增的自定义标签属性的方法
    // data-id="1" 获取属性的方式是 .dataset.id
    var c = `
        <div class="comment-cell" data-id="${id}">
            <span>评论</span>
            <span class="comment-content">${content}</span>
            <button class="comment-edit">编辑</button>
            <button class="comment-delete" data-id="${id}">删除</button>
        </div>
    `
    return c
}


// 评论编辑模板
var commentEditTemplate = function() {
    var c = `
        <div class="comment-update-form">
            <input class="comment-update-input">
            <button class="comment-update-commit">修改</button>
        </div>
    `
    return c
}

// 根据对应的 weibo_id 插入评论
var insertComment = function(comment) {
    c = commentTemplate(comment)
    weibo_id = comment.weibo_id
    id = `.weibo-cell[data-id="${weibo_id}"]`
    var weiboCell = e(id)
//    log('通过weiboId找到的weiboCell', weiboCell)
    if (weiboCell != null) {
        commentList = weiboCell.querySelector('.comment-list')
        commentList.insertAdjacentHTML('beforeend', c)
    }
}


// 加载评论
var loadComments = function() {
    // 调用 ajax api 来载入数据
    apiCommentAll(function(r) {
//        console.log('load all', r)
        // 解析为 数组
        var comments = JSON.parse(r)
        log('comments', comments)
        // 循环添加到页面中
        for(var i = 0; i < comments.length; i++) {
            var comment = comments[i]
            insertComment(comment)
        }
    })
}


// 事件绑定
// 添加评论
var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    log(weiboList)
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        var self = event.target
        var weibo_id = self.dataset.id
        log('weibo_id', weibo_id)
        if (self.classList.contains('comment-add')) {
            log('点到了 添加评论 按钮')
            var weiboCell = self.closest('.weibo-cell')
            log('被评论的微博', weiboCell)
            var input = weiboCell.querySelector('.comment-input')
            log('输入的评论', input)
            var id = weiboCell.dataset.id
            var form = {
                weibo_id: Number(id),
                content: input.value,
            }
            log('comment form', form)
            apiCommentAdd(form, function(r) {
                var comment = JSON.parse(r)
                log('comment.JSON', comment)
                insertComment(comment)
            })
        }
    })
}


// 删除评论
var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')
    log(weiboList)
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('comment-delete')) {
            log('点到了 评论删除 按钮')
            var commentId = self.dataset.id
            apiCommentDelete(commentId, function(r) {
                log('服务器响应删除成功', r)
                // 收到返回的数据, 删除 self 的父节点
                self.parentElement.remove()
            })
          }
      })

}


// 编辑评论
var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    log(weiboList)
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('comment-edit')) {
            log('点击到了 评论编辑 按钮')
            var c = commentEditTemplate()
            self.parentElement.insertAdjacentHTML('beforeend', c)
        }
    })
}


// 提交修改的评论 aaaaaaaaaaaaa
var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    log(weiboList)
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target

        if (self.classList.contains('comment-update-commit')) {
          // 获取评论 id 和 修改内容
          var commentCell = self.closest('.comment-cell')
          var id = commentCell.dataset.id
          var input = commentCell.querySelector('.comment-update-input')
          var form = {
            // id 要转换为数字
            id: Number(id),
            content: input.value,
          }
          log('comment update form', form)
          apiCommentUpdate(form, function(r) {
              log('update', r)
              var updateForm = commentCell.querySelector('.comment-update-form')
              updateForm.remove()

              var comment = JSON.parse(r)
              var content = commentCell.querySelector('.comment-content')
              content.innerHTML = comment.content
          })
      }
    })
}


var bindEvents = function() {
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadComments()
}

__main()
