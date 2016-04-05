// 登录弹窗组件

var emitter = {
    // 注册事件
    on: function(event, fn) {
        var handles = this._handles || (this._handles = {}),
            calls = handles[event] || (handles[event] = []);

        calls.push(fn);

        return this;
    },
    // 解绑事件
    off: function(event, fn) {
        if(!event || !this._handles) this._handles = {};
        if(!this._handles) return;

        var handles = this._handles , calls;

        if (calls = handles[event]) {
            if (!fn) {
                handles[event] = [];
                return this;
            }
            // 找到栈内对应listener 并移除
            for (var i = 0, len = calls.length; i < len; i++) {
                if (fn === calls[i]) {
                    calls.splice(i, 1);
                    return this;
                }
            }
        }
        return this;
    },
    // 触发事件
    emit: function(event){
        var args = [].slice.call(arguments, 1),
            handles = this._handles, calls;

        if (!handles || !(calls = handles[event])) return this;
        // 触发所有对应名字的listeners
        for (var i = 0, len = calls.length; i < len; i++) {
            calls[i].apply(this, args)
        }
        return this;
    }
}

!function(){

    // Login
    // -------

    var template = 
    '<div class="m-login">\
        <div class="g-login">\
            <h3>登录网易云课堂</h3>\
            <form action="" name="login">\
                <input type="text" class="account" placeholder="帐号" name="account" required>\
                <input type="password" class="password" placeholder="密码" name="password" required>\
                <div class="msg" id="message"></div>\
                <button name = "button">登 录</button>\
            </form>\
            <i></i>\
        </div>\
    </div>';


    function Login(options){
        options = options || {};
        
        this.container = this._layout.cloneNode(true);
        document.body.appendChild(this.container);
        
        this.title = this.container.querySelector('h3'); // title 用于插入自定义标题内容
        this.form = this.form||document.forms.login; // 当前form
        this.loginForm = this.container.querySelector('form') // form节点
        this.nmesg = this.container.querySelector('.msg'); // 错误信息节点


        extend(this, options);

        this._initEvent();

    }



    extend(Login.prototype, {

        _layout: html2node(template),

        // 设置标题内容
        setContent: function(content){
            if(!content) return;
            if(content.nodeType === 1){ 
                this.title.innerHTML = 0;
                this.title.appendChild(content);
            }else{
                this.title.innerHTML = content;
            }
        },

        // 设置地址
        setUrl: function (url) {
            this.loginForm.action = url;
        },


        // 显示弹窗
        show: function(content){
            if(content) this.setContent(content);
            this.container.style.display = 'block';
        },

        // 隐藏弹窗
        hide: function(){
            this.container.style.display = 'none';
        },

        // 登录成功设置cookie
        success: function () {
            setCookie("loginSuc","1");
        },

        // 登录错误通知
        invalid: function (msg) {
            this.nmesg.innerHTML = msg;
        },

        // 清除登录错误通知
        clearInvalid: function () {
            this.nmesg.innerHTML = '';
        },

        // 初始化事件
        _initEvent: function(){

            // 注册关闭按钮
            addEvent(this.container.querySelector('i'),'click', this._onCancel.bind(this))
    
            // 注册提交事件
            addEvent(this.form,'submit',this._submit.bind(this))
        },

        // 取消登录
        _onCancel: function(){
            this.emit('cancel');
            this.hide();
        },

        // 登录
        _submit: function (event) {
            this.emit('submit');
            if(document.all){
                window.event.returnValue = false;
            }
            else{
                event.preventDefault();
            };

            var account = this.form.account.value;
            var password = this.form.password.value;

            try {
                var xhr = new window.XDomainRequest();
                xhr.onload = function() {
                    xhrload()
                }
                var url = this.loginForm.action + '?userName=' + md5(account) + '&password=' + md5(password);
                xhr.open("get",url);
                xhr.send();
            }catch(e){
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState==4) {
                        if((xhr.status>=200&&xhr.status<300)||
                            xhr.status==304){
                            xhrload()
                        }
                        // else{alert('Request was unsuccessful:'+xhr.status)}
                    };
                }
                var url = this.loginForm.action + '?userName=' + md5(account) + '&password=' + md5(password);
                xhr.open("get",url);
                xhr.send();
            }
            var that = this;
            function xhrload () {
                var result = JSON.parse(xhr.responseText);
                if (result == 1) {
                    that.success();
                    that.clearInvalid();
                    that.hide();
                }else{
                    that.invalid("登录错误！ 帐号：studyOnline 密码：study.163.com");
                }
            }
        },

    })


    extend(Login.prototype, emitter);

    window.Login = Login;


}()

