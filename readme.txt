﻿/*
ajaxpage API：

1、option参数说明：
pagenum : 每页多少条记录
method : ajax请求方式，get或者post
ajaxurl: ajax请求地址
data : ajax发送过去的数据格式，注意：$spage和 $epage 代表发给后台的 开始记录指针位置和结束记录指针位置
totalkey : 表示后端返回的JSON数据格式中 所以记录条数的 KEY，这个一定要设置正确:如果返回结果为:{data:{total:80}, content:...} 则这里设置为：$data.data.total
putcallback : 表示后端返回结果后的回调，2个参数data为后端返回的数据，obj即为 Spout_ajaxpage 实例对象

2、Spout_ajaxpage实例对象的属性：
total: 总记录条数
curpage : 当前页码
allpage : 总页数
start : 当前记录起始指针位置
end : 当前结束记录指针位置
pagenum : 每页记录数

3、Spout_ajaxpage实例对象的方法：
first([callback])方法：跳转第一页,如果不传callback回调函数，默认使用 option.putcallback(data, obj),同样传2个参数，下同。
prev([callback])方法：跳转上一页。
next([callback])方法：跳转下一页。
last([callback])方法：跳转末页。
specify(pagenum, [callback])方法：跳转到指定pagenum页面，当pagenum不符合要求，不做任何动作
intial()方法：跳转至第一页，初始化数据重新计算分页
*/

示例代码：

html代码：

<div id="content">
</div>
<div id="status"></div>
<div id="page">
    <a id="f" href="javascript:;">首页</a><br />
    <a id="p" href="javascript:;">上一页</a><br />
    <a id="n" href="javascript:;">下一页</a><br />
    <a id="l" href="javascript:;">末页</a><br />
    <a id="p2" href="javascript:;">2</a><br />
    <a id="p3" href="javascript:;">3</a><br />
    <a id="p5" href="javascript:;">5</a><br />
</div>
<script src="http://static.tieba.baidu.com/tb/js/lib/jquery.js" type="text/javascript"></script>
<script src="./jquery.spout.ajaxpage.js" type="text/javascript"></script>

JS代码：
<script>
var option = {
	pagenum:15,
	ajaxurl:'./ajax.txt',
	ajaxmethod:'GET',
	data:{a:'getpage', s:'$start',e:'$end'},
	totalkey:'to',
	putcallback:function(data, obj){
			$('#content').html(data.content);
			$('#status').html('每页'+obj.pagenum+'条记录，总共'+obj.total+'条记录， 当前是第'+obj.curpage+'页，共有'+obj.allpage+'页，当前S和E的值为：'+obj.start+'/'+obj.end)
		}
	};
var ap = new Spout_ajaxpage(option);
$('#f').click(function(){
	ap.first()	
	})
$('#p').click(function(){
	ap.prev()	
	})
$('#n').click(function(){
	ap.next()	
	})
$('#l').click(function(){
	ap.last(function(data, obj){
		alert('你点了末页！')
		option.putcallback(data, obj);
		})	
	})
$('#p2').click(function(){
	ap.specify(2)	
	})
$('#p3').click(function(){
	ap.specify(3)	
	})
$('#p5').click(function(){
	ap.specify(5)	
	})
</script>





