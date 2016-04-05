// 翻页器组件

!function(){

    var template = 
    '<div onselectstart="return false">\
        <i class="lastp"></i>\
        <div class="pages">\
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>\
        </div>\
        <i class="nextp"></i>\
    </div>';


    function PageSlector(node, now, total, options){
        this.node = node;
        this.now = now;
        this.total = total;
        options = options || {};
        this.container = this._layout.cloneNode(true);
        this.node.appendChild(this.container);
        this.pages = this.node.querySelectorAll("span"); // 页码
        this.lastpg = this.node.querySelectorAll("i")[0]; // 上一页
        this.nextpg = this.node.querySelectorAll("i")[1]; // 下一页

        extend(this, options);
        this._initEvent();
    }


    extend(PageSlector.prototype, {

        _layout: html2node(template),

        initPage : function (){
            this.node.appendChild(this.container);
        },

        // 设置翻页器
        setPage : function (now, total){
            this.now = now||this.now;
            this.total = total||this.total;
            var n;
            for (var i = 0; i < 8; i++) {
                this.pages[i].id = "";
                n = i;
                if (this.now - 4 <= 0) {
                    n += 5 - this.now
                };
                if (this.now + 3 > this.total) {
                    n -= this.now + 3 - this.total
                };
                this.pages[i].innerHTML = this.now - 4 + n;
                if (n==4) {
                    this.pages[i].id = "page";
                };
            };
        },


        // 初始化事件
        _initEvent: function(){

        this.initPage();
        this.setPage();

        addEvent(this.lastpg,'click',this.clickPageLast.bind(this));
        addEvent(this.nextpg,'click',this.clickPageNext.bind(this));

        },

        // 上一页
        clickPageLast: function () {
            this.emit('chlast');
        },
        // 下一页
        clickPageNext: function () {
            this.emit('chnext');
        },

    })


    extend(PageSlector.prototype, emitter);

    window.PageSlector = PageSlector;

}()

