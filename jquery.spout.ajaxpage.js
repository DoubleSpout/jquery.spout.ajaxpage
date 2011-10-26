void function(){
	var Ajaxpage = function(option){
		this.pagenum = option.pagenum || 10; //每页多少条记录，默认10条
		this.ajaxurl= option.ajaxurl;//ajax请求地址
		this.ajaxmethod = option.method || 'GET';//ajax请求的方法，get或者post
		this.ajaxdata = option.data || {action:'ajaxpage',start:'$start',end:'$end'};//ajax请求发送过去的格式默认{action:'ajaxpage',start:起始页码,end:结束页码}
		this.totalkey = option.totalkey || '$data.total';//返回json数据中所以记录的条数KEY名称
		this.putcallback = option.putcallback || function(data, object){};//当ajax记录返回往页面插入内容和分页样式更改的回调
		this.allpage = 1;//总页数
		this.curpage = 1;//当前记录数
		this.start = 1;//起始记录数
		this.end = this.pagenum;//结束记录数
		this.total = 0;//总记录数
		this.ajaxing = false;//是否正在分页
		this.intial();//初始化函数
	}
	Ajaxpage.ajaxgo = function(callback, that){//私有方法，不能被调用
		if(that.ajaxing) return false;
		var serialdata = function(){ //序列化发送对象
				var data = {};
		    	for(var j in that.ajaxdata){
					data[j] = that.ajaxdata[j];		
		    		if(data[j] === '$start') data[j] = that.start;
		    		if(data[j] === '$end') data[j] = that.end;	
		    	}
		    	return data;  	
		    }
		that.ajaxing = true;
		$.ajax({dataType:'json',cache:false, type: that.ajaxmethod, url: that.ajaxurl, data: serialdata(),success: function(data){ callback(data, that);that.ajaxing = false;},error:function(){}})
	}
	Ajaxpage.prototype.first = function(callback, isfirst){
		var callback = !callback ? this.putcallback : callback,
			cb = function(data, obj){
				obj.curpage = 1;
				callback(data, obj);			
			};
		this.start = 1;
		if(!isfirst) this.end = this.pagenum > this.total ? this.total : this.pagenum;		
		else this.end = this.pagenum;
	 	if(this.curpage != 1 || isfirst) Ajaxpage.ajaxgo(cb, this);
	}
	Ajaxpage.prototype.next = function(callback){
		var callback = !callback ? this.putcallback : callback,
			cb = function(data, obj){
				obj.curpage++
				callback(data, obj);			
			};
		this.start = this.curpage*this.pagenum+1;
		this.end = (this.curpage+1)*this.pagenum >= this.total ? this.total : (this.curpage+1)*this.pagenum;
	 	if(this.curpage < this.allpage) Ajaxpage.ajaxgo(cb, this);
	}
	Ajaxpage.prototype.prev = function(callback){
		var callback = !callback ? this.putcallback : callback,
			cb = function(data, obj){
				obj.curpage--;
				callback(data, obj);			
			};
		this.start = (this.curpage-2)*this.pagenum+1;
		this.end = (this.curpage-1)*this.pagenum;
	 	if(this.curpage > 1) Ajaxpage.ajaxgo(cb, this);		
	}
	Ajaxpage.prototype.last = function(callback){
		var callback = !callback ? this.putcallback : callback,
			cb = function(data, obj){
				obj.curpage = obj.allpage;
				callback(data, obj);			
			};
		this.start = (this.allpage-1)*this.pagenum+1;
		this.end = this.total;
	 	if(this.curpage != this.allpage) Ajaxpage.ajaxgo(cb, this);		
	}
	Ajaxpage.prototype.specify = function(page, callback){
		var jp = parseInt(page);	
		if(this.curpage == jp || jp <1 || jp > this.allpage || jp != page) return false;
		var callback = !callback ? this.putcallback : callback,
			cb = function(data, obj){
					obj.curpage = jp;	
					callback(data, obj);			
				};
		this.start = (jp-1)*this.pagenum+1;
		this.end = jp*this.pagenum >= this.total ? this.total : jp*this.pagenum;
		Ajaxpage.ajaxgo(cb, this);
	}
	Ajaxpage.prototype.ical =function(total){
		this.curpage=1;
		this.total = parseInt(total);
		this.allpage = Math.ceil(this.total/this.pagenum);	
		if(this.allpage===0) this.allpage =1;
	}
	Ajaxpage.prototype.gettotal = function(data){
		return eval('('+this.totalkey.replace('$data', 'data')+')');
	}
	Ajaxpage.prototype.intial=function(total){
		var that = this;
		that.first(function(data, obj){
			var dt = that.gettotal(data);
			that.ical(dt);
			that.putcallback(data, obj);
		}, true);
	}
	window.Spout_ajaxpage = Ajaxpage;
}()