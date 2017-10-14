function select(map,x,y){
	//清除覆盖物
	//myComapOverlay.disableMassClear();
	
	// 复杂的自定义覆盖物
    function ComplexCustomOverlay(point){
      this._point = point;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
      div.style.backgroundColor = "transparent";
      div.style.overflow = "hidden";
      div.style.cursor = "pointer";
      div.style.color = "white";
      div.style.height = "230px";
      div.style.width = "230px";
      div.style.borderRadius = "50%";
      div.style.fontSize = "12px"
      div.style.zIndex = '15';
      /*第0个*/
      var arrow3 = this._arrow = document.createElement("img");
      arrow3.src = "images/map_btn3.png"
      arrow3.style.position = "absolute";
      arrow3.style.bottom = "2px";
      arrow3.style.left = "16px";
      arrow3.style.overflow = "hidden";
      div.appendChild(arrow3);
	  /*第一个*/
      var arrow1 = this._arrow = document.createElement("img");
      arrow1.src = "images/map_btn1.png"
      arrow1.style.position = "absolute";
	  arrow1.style.borderRadius = "0 0 200px 0";
      arrow1.style.top = "1px";
      arrow1.style.left = "0px";
      arrow1.style.overflow = "hidden";
      div.appendChild(arrow1);
      /*第二个*/
      var arrow2 = this._arrow = document.createElement("img");
      arrow2.src = "images/map_btn2.png"
      arrow2.style.position = "absolute";
	  arrow2.style.borderRadius = "0 0 0 200px";
      arrow2.style.top = "1px";
      arrow2.style.right = "0px";
      arrow2.style.overflow = "hidden";
      div.appendChild(arrow2);
      /*第三个*/
      var arrow = this._arrow = document.createElement("img");
      arrow.src = "images/map_btn0.png"
	  arrow.style.borderRadius = "50%";
      arrow.style.position = "absolute";
      arrow.style.top = "76.5px";
      arrow.style.left = "78.5px";
      arrow.style.overflow = "hidden";
      div.appendChild(arrow);
      
      
      /*arrow1.addEventListener("click", function(e){ 
		  //$('#report').animate({top:'-19px'},500)
	  },false)*/
      
      div.addEventListener("click", function(e){ 
    	  e.stopPropagation();
      },false)
      arrow2.addEventListener("click", function(e){ 
    	  e.stopPropagation();
    	  $('#report1').animate({top:'-19px'},500)
    	  
      },false)
      arrow3.addEventListener("click", function(e){ 
    	  e.stopPropagation();
    	  $('#report2').animate({top:'-19px'},500)
      },false)
      /*div.onmouseover = function(){
        this.style.backgroundColor = "#6BADCA";
        this.style.borderColor = "#0000ff";
        this.getElementsByTagName("span")[0].innerHTML = that._overText;
        arrow.style.backgroundPosition = "0px -20px";
      }
	  
      div.onmouseout = function(){
        this.style.backgroundColor = "#EE5D5B";
        this.style.borderColor = "#BC3B3A";
        this.getElementsByTagName("span")[0].innerHTML = that._text;
        arrow.style.backgroundPosition = "0px 0px";
      }*/

      map.getPanes().labelPane.appendChild(div);
      
      return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - this._div.offsetWidth/2 + "px";
      this._div.style.top  = pixel.y - this._div.offsetHeight/2 + "px";
    }
    var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(x,y));

    map.addOverlay(myCompOverlay);
}