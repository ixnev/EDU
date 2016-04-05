// 视频控件


!function(){

    // VideoCtrl
    // -------

    var template = 
    '<div>\
        <div class="vManul">\
            <div class="vpause"></div>\
            <div class="vbanner" onselectstart="return false">\
                <span class= "vtime">00:00</span>\
                <span class="vtimetl">/10:00</span>\
            </div>\
            <div title="静音" class="vsound"></div>\
            <div class="vclear"></div>\
            <div title="全屏" class="vfull"></div>\
            <div class="vlogo"></div>\
        </div>\
        <div class="vBar">\
            <span class="vbuffer">\
                <span class="vprocess">\
                    <i class="vbut"></i>\
                </span>\
            </span>\
        </div>\
        <div class="vplayicon"></div>\
    </div>';


    function VideoCtrl(node, vnode, options){
        this.node = node; // 控件节点
        this.vnode = vnode; // 视频节点
        options = options || {};

        this.container = this._layout.cloneNode(true);
        this.node.appendChild(this.container);

        this.vPause = this.node.querySelector('.vpause'); // 暂停键
        this.vbanner = this.node.querySelector('.vbanner'); // 时间条
        this.vtime = this.node.querySelector('.vtime'); // 播放时间
        this.vtimetol = this.node.querySelector('.vtimetl'); // 总时间
        this.vSound = this.node.querySelector('.vsound'); // 静音键
        this.vfull = this.node.querySelector('.vfull'); // 全屏键
        this.vbar = this.node.querySelector('.vBar'); // 进度条
        this.vprocess = this.node.querySelector('.vprocess'); // 播放进度
        this.vbuffer = this.node.querySelector('.vbuffer'); // 缓冲进度
        this.vplayicon = this.node.querySelector('.vplayicon'); // 待播放图标
        this.drag = 0; // 是否拖拽进度条


        this.videoWidth = parseFloat(window.getComputedStyle(this.vnode).width.slice(0,-2)); //视频宽度


        extend(this, options);

        this._initEvent();

    }



    extend(VideoCtrl.prototype, {

        _layout: html2node(template),


        // 获取元素横坐标
        getElementLeft: function (element){ 
                var actualLeft = element.offsetLeft; 
                var current = element.offsetParent; 
                while (current !== null){
                        actualLeft += current.offsetLeft; 
                        current = current.offsetParent; 
                }
                return actualLeft; 
        },

        // 缓冲条结尾点
        showVbuffer: function () {
            var bufferend;
            for (var i = 0; i < this.vnode.buffered.length; i++) {
                if (this.vnode.buffered.start(i)<=this.vnode.currentTime) {
                    bufferend = this.vnode.buffered.end(i)
                };
            };
            return bufferend;
        },

        // 数字转时间
        num2time: function (num) {
            num = parseInt(num);
            var minuts = parseInt(num/60);
            var seconds = num - 60*minuts;
            if (String(minuts).length == 1) {
                minuts = "0"+minuts
            }
            if (String(seconds).length == 1) {
                seconds = "0"+seconds
            };
            return minuts+":"+seconds
        },



        // 初始化事件
        _initEvent: function(){

            // 设置视频控件长度
            this.vbanner.style.width=(this.videoWidth-160)+'px';

            // 暂停
            addEvent(this.vPause,"click",this._pauseVideo.bind(this));
            addEvent(this.vnode,'click',this._pauseVideo.bind(this));
            addEvent(this.vplayicon,'click',this._pauseVideo.bind(this));

            // 待播放图标
            addEvent(this.vnode,"click",this._showPlayicon.bind(this));
            addEvent(this.vplayicon,"click",this._showPlayicon.bind(this));
            addEvent(this.vPause,"click",this._showPlayicon.bind(this));

            // 静音
            addEvent(this.vSound,"click",this._muteVideo.bind(this));

            // 全屏
            addEvent(this.vfull,"click",this._vfullScreen.bind(this));

            // 点击与显示进度
            addEvent(this.vbar,'click',this._clickvProcess.bind(this));
            addEvent(this.vbar,'mousemove',this._showVtime.bind(this));


            // 刷新视频时间和进度条
            setInterval(this._whitevTime.bind(this),1000);


            // 拖拽
            addEvent(this.vbar,'mousedown',this._dragstart.bind(this));
            addEvent(this.node,'mousemove',this._dragmove.bind(this));
            addEvent(this.node,'mouseup',this._dragend.bind(this));
            addEvent(this.node,'mouseleave',this._dragend.bind(this));


        },

        // 暂停
        _pauseVideo: function () {
            if (this.vnode.paused) {
                this.vnode.play();
                this.vPause.className = "vpause";
            }else{
                this.vnode.pause();
                this.vPause.className = "vpause vplay";
            }
        },

        // 待播放图标
        _showPlayicon: function () {
            if (this.vnode.paused) {
                this.vplayicon.style.display = "block"
            }else{
                this.vplayicon.style.display = "none"
            }
        },

        // 静音
        _muteVideo: function () {
            if (this.vnode.muted) {
                this.vnode.muted = false;
                this.vSound.className = "vsound"
            }else{
                this.vnode.muted = true;
                this.vSound.className = "vsound vmute"
            }
        },

        // 全屏
        _vfullScreen: function () {
            if (this.vnode.webkitRequestFullScreen){
                this.vnode.webkitRequestFullScreen()
            }else if(this.vnode.mozRequestFullScreen){
                this.vnode.mozRequestFullScreen()
            }else if(this.vnode.requestFullscreen){
                this.vnode.requestFullscreen()
            }else{}
        },

        // 点击进度条
        _clickvProcess: function (event) {
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = event.pageX || event.clientX + scrollX;
            var process = (x-this.getElementLeft(this.node))/this.videoWidth;
            this.vnode.currentTime = this.vnode.duration*process;
        },

        // 显示进度条
        _showVtime: function (event) {
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = event.pageX || event.clientX + scrollX;
            var process = (x-this.getElementLeft(this.node))/this.videoWidth;
            this.vbar.title = this.num2time(process*this.vnode.duration);
        },

        // 刷新视频时间和进度条
        _whitevTime: function () {
            this.vtime.innerHTML = this.num2time(this.vnode.currentTime);
            this.vtimetol.innerHTML = "/"+this.num2time(this.vnode.duration);
            this.vprocess.style.width = (this.vnode.currentTime/this.vnode.duration)*this.videoWidth +'px';
            this.vbuffer.style.width = (this.showVbuffer()/this.vnode.duration)*this.videoWidth +'px';
        },



        // 拖拽进度条
        _dragstart: function(event){
            this.drag = 1;
        },

        _dragmove: function(event){
            if(!this.drag) return;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = event.pageX || event.clientX + scrollX;
            var dragnow = (x-this.getElementLeft(this.node))/this.videoWidth;
            this.vprocess.style.width = dragnow*this.videoWidth +'px';
            if (dragnow<0 || dragnow>1) {
                this.drag = 0;
            };
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (window.document.selection) {
                window.document.selection.empty();
            }
        },

        _dragend: function(event){
            if(!this.drag) return;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var x = event.pageX || event.clientX + scrollX;
            var dragnow = (x-this.getElementLeft(this.node))/this.videoWidth;
            this.vnode.currentTime = this.vnode.duration*dragnow;
            this.drag = 0;
        }



    })


    extend(VideoCtrl.prototype, emitter);

    window.VideoCtrl = VideoCtrl;


}()

