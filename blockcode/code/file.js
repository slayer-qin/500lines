(function(global){
    'use strict';

    var scriptElem = document.querySelector('.script'); // querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素 .表示class定位 #表示ID对位
    var title = '__' + document.querySelector('title').textContent.toLowerCase().replace(' ', '_');

    function saveLocal(){
        //将所有block的字符串形式存入本地变量localStorage[title]
        var script = scriptToJson();
        if (script){
            localStorage[title] = script;
        }else{
            delete localStorage[title];
        }
    }

    // 返回blocks的json对象的字符串形式
    function scriptToJson(){
        // 选取class为script的元素的所有class="clock"的所有元素存为数组
        // querySelector()返回非实时NodeList对象
        // []相当于Array，[].slice.call(nodelist)将nodelist转化为数组，从而可以采用数组的方法操作
        var blocks = [].slice.call(document.querySelectorAll('.script > .block'));
        // 返回blocks的字符串形，若无block返回null
        // 对blocks的每个元素调用Block.script函数
        // stringify()从对象解析出字符串，parse()将字符串解析出JSON对象
        return blocks.length ? JSON.stringify(blocks.map(Block.script)) : null;
    }
    // 重新加载blocks
    function jsonToScript(json){
        // 清空所有block
        clearScript();
        // 从字符串恢复block，加入作为.script的子元素
        JSON.parse(json).forEach(function(block){
            scriptElem.appendChild(Block.create.apply(null, block));
        });
        Menu.runSoon();
    }

    // 从本地变量恢复script下的block
    function restoreLocal(){ jsonToScript(localStorage[title] || '[]' ); }

    // 清空blocks
    function clearScript(){
        // 清空所有block
        // 对每个block都调用匿名函数删除自己，删除该block的父元素下的该block元素
        // 实际是删除class =script的元素的所有子元素
        [].slice.call(document.querySelectorAll('.script > .block')).forEach(function(block){
            block.parentElement.removeChild(block);
        });
        // 调用Menu.runSoon函数
        Menu.runSoon();
    }


    function saveFile(evt){
        var title = prompt("Save file as: ");  // prompt() 方法用于显示可提示用户进行输入的对话框
        if (!title){ return; }
        var file = new Blob([scriptToJson()], {type: 'application/json'});  // 新建Blob对象
        var reader = new FileReader();
        var a = document.createElement('a');
        // 读取完成后触发
        reader.onloadend = function(){
            var a = elem('a', {'href': reader.result, 'download': title + '.json'}); // 新建带有属性的<a>元素
            a.click(); //模拟鼠标点击事件, 从而将href中的内容存在download命名的文件中
        };
        reader.readAsDataURL(file); // 将file中的内容读取成DATA url字符串，存储在result属性中
    }

    // 读取文件
    function readFile(file){
        var fileName = file.name;
        if (fileName.indexOf('.json', fileName.length - 5) === -1) {
            return alert('Not a JSON file');
        }
        var reader = new FileReader();
        reader.readAsText( file );
        reader.onload = function (evt){ jsonToScript(evt.target.result); };
    }

    // 选择文件加载
    function loadFile(){
        var input = elem('input', {'type': 'file', 'accept': 'application/json'});
        if (!input){ return; }
        input.addEventListener('change', function(evt){ readFile(input.files[0]); });
        input.click();
    }

    // 加载示例
    function loadExample(evt){
        var exampleName = evt.target.value;
        if (exampleName === ''){ return; }
        clearScript();
        file.examples[exampleName].forEach(function(block){
            scriptElem.appendChild(Block.create.apply(null, block));
        });
        Menu.runSoon();
    }

    global.file = {
        saveLocal: saveLocal,
        restoreLocal: restoreLocal,
        examples: {}
    };

    // 给3个按钮和下拉列表增加监听事件
    document.querySelector('.clear-action').addEventListener('click', clearScript, false);
    document.querySelector('.save-action').addEventListener('click', saveFile, false);
    document.querySelector('.load-action').addEventListener('click', loadFile, false);
    document.querySelector('.choose-example').addEventListener('change', loadExample, false);

})(window);
