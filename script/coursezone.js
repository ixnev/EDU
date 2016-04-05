// 课程区组件

!function(){


    // 课程区构造函数
    function CourseZone (courseNode, url, pageNo, psize, type) {
        this.courseNode = courseNode;
        this.url = url;
        this.pageNo = pageNo;
        this.psize = psize;
        this.type = type;
        this.courseListUrl = this.url + this.pageNo + "&psize="+ this.psize + "&type=" + this.type;
    }

    extend(CourseZone.prototype, {
        // 获取课程
        getCourse : function () {
            try {
                var xhr = new window.XDomainRequest();
                xhr.onload = function() {
                    xhrload()
                }
                xhr.open("get",this.courseListUrl);
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
                xhr.open("get",this.courseListUrl);
                xhr.send();
            }
            var that = this;
            function xhrload () {
                that.courseNode.innerHTML = "";
                var courseInfo = JSON.parse(xhr.responseText).list;
                var totalPage = JSON.parse(xhr.responseText).pagination.totlePageCount;
                that.totalpage = totalPage;
                for (var i = 0; i <= that.psize-1; i++) {
                    if (courseInfo[i].price==0) {
                        courseInfo[i].price = '免费';
                    }
                    else{courseInfo[i].price = "￥"+courseInfo[i].price};
                    var courses = [];
                    courses[i] = new OneCourse(courseInfo[i]);
                    that.courseNode.appendChild(courses[i].courseHtml);
                    addEvent(getElementsByClassName(that.courseNode,'courseCard')[i],'mouseenter',moveinCourse);
                    addEvent(getElementsByClassName(that.courseNode,'courseDetail')[i],'mouseleave',moveoutCourse);
                    if (i >= 15) {
                        getElementsByClassName(that.courseNode,'card')[i].setAttribute("class","card hidden");
                    };
                }
            }
        },
    })


    // 课程卡片构造函数
    function OneCourse (courseInfo) {
        this.courseInfo = courseInfo;
        this.courseHtmlStr = '<div class="card"><div class="courseCard"><img class="coursepic" src='
                                +this.courseInfo.middlePhotoUrl
                                +' alt=""><h4 class="coursetil">'+this.courseInfo.name
                                +'</h4><span class="courseorg">'+this.courseInfo.provider
                                +'</span><div class="coursemem"><i class="mempic"></i><span>'
                                +this.courseInfo.learnerCount+'</span></div><span class="coursepri">'
                                +this.courseInfo.price+'</span></div><div class="courseDetail"><img src='
                                +this.courseInfo.middlePhotoUrl+' alt=""><div class="courseInfo"><h3>'
                                +this.courseInfo.name+'</h3><div class="studymemb"><i class="mempic"></i><span>'
                                +this.courseInfo.learnerCount+'</span><span>人在学</span></div><p class="author">发布者：'
                                +this.courseInfo.provider+'</p><p class="courseclass">分类：'
                                +this.courseInfo.categoryName+'</p></div><div class="coursedes"><p>'
                                +this.courseInfo.description+'</p></div></div></div>';
        this.courseHtml = html2node(this.courseHtmlStr)
    }

    // 鼠标停留
    var moveinCourse = function (event) {
        var target = event.target || event.srcElement;
        getElementsByClassName(target.parentNode,'courseDetail')[0].setAttribute("class","courseDetail coursehov");
    }
    // 鼠标移开
    var moveoutCourse = function (event) {
        var target = event.target || event.srcElement;
        getElementsByClassName(target.parentNode,'courseDetail')[0].setAttribute("class","courseDetail");
    }


    // 暴露到全局
    window.CourseZone = CourseZone;
}()

