
/*
（function(global){...}(this) 表示立即执行的匿名函数
主要是预定义了几个全局函数，并且适配了多种浏览器
elem，返回一个标签为name，属性为attrs， 文本内容为children的HTML元素
matches，判断elem创建的元素是否与selector匹配
closest，向上寻找最近的匹配元素，若找不到返回null
requestAnimationFrame, 用于动画绘制
trigger，给HTML元素分配一个合成事件
*/
(function(global){
    'use strict';

    // 函数elem，返回一个标签为name，属性为attrs， 文本内容为children的HTML元素
    global.elem = function elem(name, attrs, children){
        attrs = attrs || {};
        children = children || [];
        var e = document.createElement(name);
        // 设置e的属性值为attrs
        Object.keys(attrs).forEach(function(key){  // Object.keys()返回属性名数组， forEach遍历数组
            e.setAttribute(key, attrs[key]);
        });
        // 将children中的字符串添加到e中
        children.forEach(function(child){
            if (typeof child === 'string'){
                child = document.createTextNode(child);
            }
            e.appendChild(child);
        });
        return e;
    };

    // 函数matches，指向elem元素的selector方法
    // 不同的的浏览器版本支持不同版本的matchesSelector方法，因此需要对selector方法进行包装
    // 这里是根据浏览器类型，将全局变量matches指向不同的Selector方法
    // 例如，若document.body元素存在matches方法，则matches指向elem元素的matches方法
    if (document.body.matches){
        global.matches = function matches(elem, selector){ return elem.matches(selector); };
    }else if(document.body.mozMatchesSelector){
        global.matches = function matches(elem, selector){ return elem.mozMatchesSelector(selector); };
    }else if (document.body.webkitMatchesSelector){
        global.matches = function matches(elem, selector){ return elem.webkitMatchesSelector(selector); };
    }else if (document.body.msMatchesSelector){
        global.matches = function matches(elem, selector){ return elem.msMatchesSelector(selector); };
    }else if(document.body.oMatchesSelector){
        global.matches = function matches(elem, selector){ return elem.oMatchesSelector(selector); };
    }

    // 函数closest，从自身向上寻找最近的匹配元素（包括自身），若找不到返回null
    global.closest = function closest(elem, selector){
        while(elem){
            if (matches(elem, selector)){ return elem };
            elem = elem.parentElement;
        }
        return null;
    };

    // 函数requestAnimationFrame, 用于动画绘制，根据浏览器支持情况对应到具体的requestAnimationFrame，性能较好。
    // 若都不支持则采用setTimeOut方法
    global.requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.msRequestAnimationFrame || global.webkitRequestAnimationFrame || function(fn){
        setTimeout(fn, 20);
    };

    //函数trigger，给HTML元素触发一个合成事件
    // target.dispatchEvent() 给target元素分配时间
    // CustomEvent() 自定义name事件
    // bubbles：是否起泡事件（即向上传播到windows并且在每一层若执行则执行）,cancelable：事件是否可取消，
    global.trigger = function trigger(name, target){
        target.dispatchEvent(new CustomEvent(name, {bubbles: true, cancelable: false}));
    };

})(window);