// 兼容及通用

// getElementsByClassName兼容
if (!document.getElementsByClassName) {
    document.getElementsByClassName = function (className, element) {
        var children = (element || document).getElementsByTagName('*');
        var elements = new Array();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }
        return elements;
    };
}

function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

// 事件
var addEvent = document.addEventListener ?
    function (elem, type, listener, useCapture) {
        elem.addEventListener(type, listener, useCapture);
    }:
    function (elem, type, listener, useCapture) {
        elem.attachEvent('on' + type, listener);
    };

var delEvent = document.removeEventListener ?
    function (elem, type, listener, useCapture) {
        elem.removeEventListener(type, listener, useCapture);
    }:
    function (elem, type, listener, useCapture) {
        elem.detachEvent('on' + type, listener);
    };


// bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
                fToBind = this, 
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || this,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
                };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// -------------------------------------------------------------------

// 将HTML转换为节点
function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
}

// 赋值属性
// extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
        o1[i] = o2[i]
    } 
    return o1
};


// cookie
// 获取cookie函数
function getCookie () {
    var cookie = {};
    var all = document.cookie;
    if (all === '')
        return cookie;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
// 设置cookie函数
function setCookie (name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
// 移除cookie函数
function removeCookie (name, path, domain) {
    document.cookie = name + '='
    + '; path=' + path
    + '; domain=' + domain
    + '; max-age=0';
}

// 动画函数
function animation (ele, attr, from, to, unit, time) {
    var time = time||1000;
    var distance = Math.abs(to-from);
    var stepLength = distance/100;
    var sign = (to-from)/distance;
    var offset = 0;
    var step = function () {
        var tmpOffset = offset + stepLength;
        if (tmpOffset < distance) {
            ele.style[attr] = from+tmpOffset*sign+unit;
            offset=tmpOffset;
        }else{
            ele.style[attr] = to+unit;
            clearInterval(intervalID);
        }
    }
    ele.style[attr] = from+unit;
    var intervalID = setInterval(step,time/100);
};