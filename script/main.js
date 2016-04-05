// js主内容


// ----------------------------------------------------
// 通知栏

(function checkNotice(){
    var noticeBar = document.querySelector('.m-notice');
    function closeNotice(event){
        noticeBar.style.display="none";
        setCookie("noNotice","1");
    }
    addEvent(noticeBar.querySelector("i"),"click", closeNotice);
    if (getCookie().noNotice!="1") {
        noticeBar.style.display="block";
    }
})();


// ----------------------------------------------------
// 关注与登录

(function () {

    // 实例登录页面
    var login = new Login();
    login.setUrl('http://study.163.com/webDev/login.htm');

    // 实例关注按钮
    var folnode = document.getElementsByClassName('fol')[0];
    var follow = new Follow(folnode,login);
    follow.setUrl('http://study.163.com/webDev/attention.htm')

    // 点击关注按钮事件
    follow.on("follow",function() {
        if (getCookie().loginSuc=="1") {
            follow.setFollow()
        }else{
            login.show('登录网易云课堂');
            login.success = function () {
                setCookie("loginSuc","1");
                follow.setFollow();
            }
        }
    });

    // 加载页面时检查是否已关注
    (function checkFollow () {
        var fol = document.getElementsByClassName('fol')[0].querySelectorAll('span');
        if (getCookie().followSuc=="1") {
            fol[0].style.display = "none";
            fol[1].style.display = "inline-block";
        }
    })();


})();


// --------------------------------------
// 三张轮播图

(function () {
    var bannerNo = 0; //初始第一张banner图
    var opaTime = 500; //渐入时间为500ms
    var bannerChangeTime = 5000; //图片切换时间为5s
    var bannerNum = 3; //banner数为3

    var pointerList = document.getElementsByClassName("pointer")[0].querySelectorAll('i'); // 指示器
    var bannerList = document.getElementsByClassName("banner"); // 图片


    // 换指示器
    function changePointer() {
        bannerList[bannerNo].className = "banner";
        pointerList[bannerNo].className = "";
        bannerNo = (bannerNo+1) % bannerNum;
        bannerList[bannerNo].className = "banner dis";
        pointerList[bannerNo].className = "current";
    }

    // ie8渐入效果
    function fadeinIE8 () {
        var distance = 100;
        var stepLength = distance/100;
        var sign = 100/distance;
        var offset = 0;
        var step = function () {
            var tmpOffset = offset + stepLength;
            if (tmpOffset < distance) {
                bannerList[bannerNo].style.filter = 'alpha(opacity='+(0+tmpOffset*sign)+')';
                offset=tmpOffset;
            }else{
                bannerList[bannerNo].style.filter = 'alpha(opacity='+100+')';
                clearInterval(intervalID);
            }
        }
        bannerList[bannerNo].style.filter = 'alpha(opacity=0)';
        var intervalID = setInterval(step,opaTime/100);
    };


    // 轮播变化
    function changeBanner(){
        changePointer();
        animation(bannerList[bannerNo],'opacity',0,1,'',opaTime); // ie8以上渐入效果
        fadeinIE8 (); // ie8渐入效果
    }
    var bannerChange = setInterval(changeBanner, bannerChangeTime);

    // 鼠标悬浮
    for (var i = 0; i < bannerNum; i++) {
        addEvent(bannerList[i],'mouseenter', function(){clearInterval(bannerChange)});
        addEvent(bannerList[i],'mouseout', function(){bannerChange = setInterval(changeBanner, bannerChangeTime)});
    };

    // 鼠标选图
    function curPoint(event){
        var target = event.target || event.srcElement;
        bannerList[bannerNo].className = "banner";
        pointerList[bannerNo].className = "";
        bannerNo = target.innerHTML - 1;
        bannerList[bannerNo].className = "banner dis";
        pointerList[bannerNo].className = "current";
        animation(bannerList[bannerNo],'opacity',0,1,'',opaTime);
        fadeinIE8 ();
    }
    for (var i = 0; i < bannerNum; i++) {
        addEvent(pointerList[i],'mouseover', curPoint);
    };

})();


// ------------------------------------
// 主内容区

(function () {

    var tabNow = 10; // 产品设计

    // 实例课程区
    var courseList = document.getElementsByClassName("l-course")[0];
    var url1 = "http://study.163.com/webDev/couresByCategory.htm?pageNo=";
    var courseZone = new CourseZone(courseList, url1, 1, 20, tabNow);
    courseZone.getCourse();


    // 实例翻页器
    var pageSel= document.getElementsByClassName("l-page")[0];
    var page1 = new PageSlector(pageSel,1,8);


    // 翻页器注册
    //上一页 
    page1.on('chlast', function(){
        if (page1.now > 1) {
            page1.now -= 1;
            page1.setPage();
            courseZone = new CourseZone(courseList, url1, page1.now, 20, tabNow);
            courseZone.getCourse();
        };
    })
    // 下一页
    page1.on('chnext', function(){
        if (page1.now < page1.total) {
            page1.now += 1;
            page1.setPage();
            courseZone = new CourseZone(courseList, url1, page1.now, 20, tabNow);
            courseZone.getCourse();
        };
    })
    // 数字页
    function clickPageHandler(event){
        var target = event.target || event.srcElement;
        var clickPage = parseInt(target.innerHTML);
        page1.total = courseZone.totalpage;
        page1.setPage(clickPage);
        courseZone = new CourseZone(courseList, url1, clickPage, 20, tabNow);
        courseZone.getCourse();
    }
    (function () {
        for (var i = 0; i < 8; i++) {
            addEvent(pageSel.querySelectorAll("span")[i],'click',clickPageHandler);
        };
    })();


    // tab
    var tabList = document.getElementsByClassName("tab")[0].querySelectorAll("li");

    // 点击tab
    function clickTabHandler (event) {
        var target = event.target || event.srcElement;
        if (target==tabList[0]) {
            tabList[0].className = "act";
            tabList[1].className = "";
            tabNow = 10;
            courseZone = new CourseZone(courseList, url1, 1, 20, tabNow);
            courseZone.getCourse();
            page1.setPage(1);
        }
        if (target==tabList[1]) {
            tabList[0].className = "";
            tabList[1].className = "act";
            tabNow = 20;
            courseZone = new CourseZone(courseList, url1, 1, 20, tabNow);
            courseZone.getCourse();
            page1.setPage(1);
        }
    }
    addEvent(tabList[0],'click', clickTabHandler);
    addEvent(tabList[1],'click', clickTabHandler);


})();



// ----------------------------------------------
// 排行数据

(function () {

    var rankSlide = document.getElementsByClassName('rankslide')[0];

    // 显示排行
    function showRank(){
        try {
            var xhr = new window.XDomainRequest();
            xhr.onload = function() {
                xhrload()
            }
            xhr.open("get","http://study.163.com/webDev/hotcouresByCategory.htm");
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
            xhr.open("get","http://study.163.com/webDev/hotcouresByCategory.htm");
            xhr.send();
        }
        function xhrload () {
            var rankInfo = JSON.parse(xhr.responseText);
            for (var i = 0; i < rankInfo.length; i++) {
                rankSlide.appendChild(html2node(
                    '<div class="rankCourse">\
                        <img src="'+rankInfo[i].smallPhotoUrl+'">\
                        <h4 title='+rankInfo[i].name+'>'+rankInfo[i].name+'</h4>\
                        <span><i></i>'+rankInfo[i].learnerCount+'</span>\
                    </div>'));
            };
        }
    };
    showRank();

    // 排行滚动更新
    var changeRank = function () {
        animation(rankSlide, 'margin-top', 0, -70, 'px');
        rankSlide.appendChild(rankSlide.firstChild);
    }
    var rankChange = setInterval(changeRank, 5000);


})();


// -----------------------------------------------
// 视频

(function () {

    // 显示与关闭视频弹窗
    function showVedio(vmodal, video){
        video.currentTime = 0;
        vmodal.style.display = "block";
        video.play();
    }
    function closeVedio(vmodal, video){
        vmodal.style.display = "none";
        video.pause();
        video.currentTime = 0;
    }


    var videoModal = document.getElementsByClassName('m-video')[0]; // 视频弹窗
    var videoWin = videoModal.querySelector('.vi'); // video


    // 打开视频弹窗
    var videoOpen = document.getElementsByClassName('introvid')[0];
    addEvent(videoOpen,'click', function(){showVedio(videoModal,videoWin)});

    // 关闭视频弹窗
    var closeVideo = videoModal.querySelector('.vclose');
    addEvent(closeVideo,'click', function(){closeVedio(videoModal,videoWin)});


    // 实例视频控件
    var vControl = document.getElementsByClassName('videoCtrl')[0];
    var vCtrlBar = new VideoCtrl(vControl,videoWin);


    // 视频小图片hover效果
    addEvent(videoOpen,'mouseenter',function(){videoOpen.querySelector("i").style.display="inline-block"});
    addEvent(videoOpen,'mouseleave',function(){videoOpen.querySelector("i").style.display = "none"});


})();


// -----------------------------------------------

window.onload = function(){
};
