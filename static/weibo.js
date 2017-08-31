// TODO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}


// 增加一个 weibo
var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}


// 删除一个 weibo
var apiWeiboDelete = function(id, callback) {
    var path = '/api/weibo/delete?id=' + id
    ajax('GET', path, '', callback)
}


// 更新一个 weibo
var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}


//  DOM
var weiboTemplate = function(weibo) {
    var content = weibo.content
    var id = weibo.id
    // data-* 是 HTML5 新增的自定义标签属性的方法
    // data-id="1" 获取属性的方式是 .dataset.id
    var w = `
        <tr class="weibo-cell" data-id="${id}">
            <td><span class="weibo-content">${content}</span></td>

            <td><button class="weibo-edit" data-id="${id}">编辑</button></td>
            <td><button class="weibo-delete" data-id="${id}">删除</button></td>

            <td><input class="comment-input" data-id="${id}"></td>
            <td><button class="comment-add" data-id="${id}">添加评论</button></td>
            <td><div class="comment-list" data-id="${id}"></div></td>
        </tr>
    `
    return w
}



var weiboUpdateFormTemplate = function(weibo) {
    var t = `
      <div class="weibo-update-form">
        <input class="weibo-update-input">
        <button class="weibo-update">更新</button>
      </div>
    `
    return t
}


var insertWeibo = function(weibo) {
    // var task = weibo['task']
    // var task = weibo.task
    var weiboCell = weiboTemplate(weibo)
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}



var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    apiWeiboAll(function(r) {
//        console.log('load all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        log('weibos', weibos)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
    // python 的同步写法
    // weibos = apiWeiboAll()
    // console.log('load all', r)
    // // 解析为 数组
    // var weibos = JSON.parse(r)
    // // 循环添加到页面中
    // for(var i = 0; i < weibos.length; i++) {
    //     var weibo = weibos[i]
    //     insertWeibo(weibo)
    // }
}


// 事件绑定
var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            log('response', r)
            log('JSON.parse(r)', JSON.parse(r))
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
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
        if (self.classList.contains('weibo-delete')) {
            log('点到了 删除按钮')
            var weiboId = self.dataset.id
            apiWeiboDelete(weiboId, function(r) {
                log('服务器响应删除成功', r)
                // 收到返回的数据, 删除 self 的父节点
                self.parentElement.remove()
            })
          }
      })

}

var bindEventWeiboEdit = function() {
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
        if (self.classList.contains('weibo-edit')) {
            log('点击到了 编辑 按钮')
            var t = weiboUpdateFormTemplate()
            self.parentElement.insertAdjacentHTML('beforeend', t)
        }
    })
}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    log(weiboList)
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event){
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target

        if (self.classList.contains('weibo-update')) {
          var weiboCell = self.closest('.weibo-cell')
          var input = weiboCell.querySelector('.weibo-update-input')
          var id = weiboCell.dataset.id
          var form = {
            id: Number(id),
            content: input.value,
          }
          log('update form', form)
          apiWeiboUpdate(form, function(r) {
              log('update', r)
              var updateForm = weiboCell.querySelector('.weibo-update-form')
              updateForm.remove()

              var weibo = JSON.parse(r)
              var content = weiboCell.querySelector('.weibo-content')
              content.innerHTML = weibo.content
          })
      }
    })
}


var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
    log('1111', e('#id-input-weibo'))
}

__main()






/*
给 删除 按钮绑定删除的事件
1, 绑定事件
2, 删除整个 weibo-cell 元素
*/
// var weiboList = e('.weibo-list')
// // 事件响应函数会被传入一个参数, 就是事件本身
// weiboList.addEventListener('click', function(event){
//     // log('click weibolist', event)
//     // 我们可以通过 event.target 来得到被点击的元素
//     var self = event.target
//     // log('被点击的元素是', self)
//     // 通过比较被点击元素的 class 来判断元素是否是我们想要的
//     // classList 属性保存了元素的所有 class
//     // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
//     // log(self.classList)
//     // 判断是否拥有某个 class 的方法如下
//     if (self.classList.contains('weibo-delete')) {
//         log('点到了 删除按钮')
//         // 删除 self 的父节点
//         // parentElement 可以访问到元素的父节点
//         self.parentElement.remove()
//     } else {
//         // log('点击的不是删除按钮******')
//     }
// })
