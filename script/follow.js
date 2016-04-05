// 关注组件


!function(){

    // Follow
    // -------

    var template = 
    '<div>\
        <span class="follow">\
            <i></i>关注\
        </span>\
        <span class="followed">\
            <i class="right"></i>已关注<i class="sep"> | </i><span class="cancel">取消</span>\
        </span>\
        <span class="fans">粉丝 45</span>\
    </div>';

    function Follow(node,login,options){
        this.node = node;
        this.login = login;
        options = options || {};

        this.container = this._layout.cloneNode(true);
        this.node.appendChild(this.container);

        // 关注[0]未关[1]取消[2]人数[3]
        this.fol = this.node.querySelectorAll('span');


        extend(this, options);

        this._initEvent();

    }



    extend(Follow.prototype, {

        _layout: html2node(template),

        // 设置地址
        setUrl: function (url) {
            this.url = url;
        },

        // 关注+1
        addFollow: function () {
            this.fol[3].innerHTML = "粉丝 " + String(parseInt(this.fol[3].innerHTML.slice(3))+1);
        },

        // 关注-1
        minFollow: function () {
            this.fol[3].innerHTML = "粉丝 " + String(parseInt(this.fol[3].innerHTML.slice(3))-1);
        },

        // 设置关注
        setFollow: function () {
            try {
                var xhr = new window.XDomainRequest();
                xhr.onload = function() {
                    xhrload()
                }
                xhr.open("get",this.url);
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
                xhr.open("get",this.url);
                xhr.send();
            }
            var that = this;
            function xhrload () {
                var result = JSON.parse(xhr.responseText);
                    if (result == 1) {
                        setCookie("followSuc","1");
                        that.addFollow();
                        that.fol[0].style.display = "none";
                        that.fol[1].style.display = "inline-block";
                    }
            }
        },


        // 初始化事件
        _initEvent: function(){

            // 注册关注
            addEvent(this.fol[0],'click', this._follow.bind(this))
    
            // 注册取关
            addEvent(this.fol[2],'click',this._cfollow.bind(this))
        },


        // 关注
        _follow: function(){
            this.emit('follow');
        },

        // 取消关注
        _cfollow: function (event) {
            this.emit('cfollow');
            this.minFollow();
            setCookie("followSuc","0");
            this.fol[1].style.display = "none";
            this.fol[0].style.display = "inline-block";
        },

    })


    extend(Follow.prototype, emitter);

    window.Follow = Follow;


}()

