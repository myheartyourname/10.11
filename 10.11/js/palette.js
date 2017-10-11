/*
* @Author: lenovo
* @Date:   2017-10-10 11:05:28
* @Last Modified by:   lenovo
* @Last Modified time: 2017-10-11 20:01:02
*/
class Palette{
  constructor(canvas,ctx,opacity){
    this.canvas=canvas;
    this.ctx=ctx;
    this.cw=this.canvas.width;
    this.ch=this.canvas.height;
    this.opacity=opacity;
    /*样式*/
    this.lineWidth=1;
    this.lineCap='butt';
    /*描边  填充*/
    this.style='stroke';
    /*颜色*/
    this.fillstyle='#000';
    this.strokestyle='#000';
    /*历史记录*/
    this.history=[];
    /*裁切部分*/
    this.temp=null;
  }
  /*初始化*/
  init(){
  	this.ctx.lineWidth=this.lineWidth;
  	this.ctx.lineCap=this.lineCap;
  	this.ctx.strokeStyle=this.strokeStyle;
  	this.ctx.fillStyle=this.fillStyle;
  }
  line(cx,cy,ox,oy){
    this.ctx.strokeStyle='orange';
    this.ctx.setLineDash([5,0]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx,cy);
    this.ctx.lineTo(ox,oy);
    this.ctx.stroke();
  } 
  dash(cx,cy,ox,oy){
    this.ctx.strokeStyle='orange';
    this.ctx.setLineDash([5,3]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx,cy);
    this.ctx.lineTo(ox,oy);
    this.ctx.stroke();
  }
  rect(cx,cy,ox,oy){
    this.ctx.setLineDash([5,0]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx,cy);
    this.ctx.fillRect(cx,cy,ox,oy);
    this.ctx[this.style]();
  }
  circle(cx,cy,ox,oy){
  	this.ctx.setLineDash([5,0]);
  	let r=Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
  	this.ctx.beginPath();
  	this.ctx.arc(cx,cy,r,0,Math.PI*2);
  	this.ctx.closePath();
  	this.ctx[this.style]();
  }
  poly(cx,cy,ox,oy,n){
    let rad=Math.PI*2/n;
    let r=Math.sqrt(Math.pow(ox-cx,2)+Math.pow(oy-cy,2));
    this.ctx.setLineDash([5,0]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx+r,cy);
    for (let i=0;i<n;i++){
      let x=cx+r*Math.cos(rad*i);
      let y=cy+r*Math.sin(rad*i);
      this.ctx.lineTo(x,y);
    }
    this.ctx.closePath();
    this.ctx[this.style]();
  }
  polyJ(cx,cy,ox,oy,n){
  	let rad=Math.PI/n;
    let r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2));
    this.ctx.setLineDash([5,0]);
    this.ctx.beginPath();
    this.ctx.moveTo(cx+r,cy);
    for (let i=0;i<2*n;i++){
      let r1=i%2==0?r:r/2;
      let x=cx+r1*Math.cos(rad*i);
      let y=cy+r1*Math.sin(rad*i);
      this.ctx.lineTo(x,y);
    }
    this.ctx.closePath();
    this.ctx[this.style]();
  }
  pencil(){
  	let that=this;
    that.opacity.onmousedown=function(e){
    let cx=e.offsetX,cy=e.offsetY;
    that.ctx.beginPath();
    that.ctx.moveTo(cx,cy);
    that.opacity.onmousemove=function(e){
     	let ox=e.offsetX,oy=e.offsetY;
     	if (that.history.length){
     		that.ctx.putImageData(that.history[that.history.length-1],0,0);
     	}
     	that.ctx.lineTo(ox,oy);
		  that.ctx.stroke();
      }
      that.opacity.onmouseup=function(){
      	that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
        that.opacity.onmousemove=null;
        that.opacity.onmouseup=null;
      }
    }
  }
  eraser(eraser1,w,h){
  	let that=this;
  	this.opacity.onmousedown=function(e){
      let cx=e.offsetX-w/2,cy=e.offsetY-h/2;
		  eraser1.style.display='block';
      eraser1.style.left=`${cx}px`;
      eraser1.style.top=`${cy}px`; 
      that.opacity.onmousemove=function(e){
      let ox=e.offsetX-w/2,oy=e.offsetY-h/2;
      if (ox>=1000-w){
        ox=1000-w;
  	  }
  	  if (ox<=0){
        ox=0;
  	  }
  	  if (oy>=500-h){
        oy=500-h;
  	  }
  	  if (oy<=0){
        oy=0;
  	  }
      eraser1.style.left=`${ox}px`;
      eraser1.style.top=`${oy}px`;
      that.ctx.clearRect(ox,oy,w,h);
      }
      that.opacity.onmouseup=function(){
        that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
	   	  eraser1.style.display='none';
		    that.opacity.onmousemove=null;
		    that.opacity.onmouseup=null;
	    }
	  }
  }
  font(){
    let that=this;
    this.opacity.onmousedown=function(e){
      that.opacity.onmousedown=null;
      let cx=e.offsetX,cy=e.offsetY;  //offset是相对于事件源的距离
      let lefts=cx,tops=cy;
      let divs=document.createElement('div');
      divs.contentEditable=true;
      divs.style.cssText=`
      width:100px;height:30px;border:1px solid #ccc;
      position:absolute;left:${cx}px;top:${cy}px;
      `;
      this.appendChild(divs);

      divs.onmousedown=function(e){
        let cx=e.clientX,cy=e.clientY;  //client是相对于浏览器的距离
        let left=divs.offsetLeft,top=divs.offsetTop;
        that.opacity.onmousemove=function(e){
          let ox=e.clientX,oy=e.clientY;
          lefts=left+ox-cx;
          tops=top+oy-cy;
          if (lefts<0){
            lefts=0;
          }
          if (lefts>=that.cw-100){
            lefts=that.cw-100;
          }
          if (tops<0){
            tops=0;
          }
          if (tops>=that.ch-30){
            tops=that.ch-30;
          }
          divs.style.left=`${lefts}px`;
          divs.style.top=`${tops}px`;
        }
        divs.onmouseup=function(){
          that.opacity.onmousemove=null;
          this.onmouseup=null;
        }
      }
      divs.onblur=function(){
        let value=this.innerText;
        that.opacity.removeChild(divs);
        that.ctx.font='bold 30px sans-serif';
        that.ctx.textAlign='center';
        that.ctx.textBaseline='middle';
        that.ctx.fillText(value,lefts,tops);
        that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
        console.log(lefts);
      }
    }
  }
  clip(obj){
    let that=this;
    let w,h,minX,minY;
    this.opacity.onmousedown=function(e){
      let cx=e.offsetX,cy=e.offsetY;
      obj.style.display='block';
      obj.style.width=0;
      obj.style.height=0;
      that.opacity.onmousemove=function(e){
        let ox=e.offsetX,oy=e.offsetY;
        //画选区
        w=Math.abs(cx-ox);
        h=Math.abs(cy-oy);
        minX=ox>=cx?cx:ox;
        minY=oy>=cy?cy:oy;
        obj.style.left=`${minX}px`;
        obj.style.top=`${minY}px`;
        obj.style.width=`${w}px`;
        obj.style.height=`${h}px`;
      }
      that.opacity.onmouseup=function(){
        //获取到选区
        that.temp=that.ctx.getImageData(minX,minY,w,h);
        //清空选区
        that.ctx.clearRect(minX,minY,w,h);
        that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
        //将选区再放回去
        that.ctx.putImageData(that.temp,minX,minY);
        
        // obj.style.display='none';
        that.opacity.onmousemove=null;
        that.opacity.onmouseup=null;
        that.drag(minX,minY,obj);
      }
    }
  }
  drag(x,y,obj){
    let that=this;
    this.opacity.onmousedown=function(e){
      let cx=e.offsetX,cy=e.offsetY;
      e.preventDefault();
      that.opacity.onmousemove=function(e){
        e.preventDefault();
        let ox=e.offsetX,oy=e.offsetY;
        let lefts=x+ox-cx,
            tops=y+oy-cy;
        obj.style.left=`${lefts}px`;
        obj.style.top=`${tops}px`;
        that.ctx.clearRect(0,0,that.cw,that.ch);
        if(that.history.length){
          that.ctx.putImageData(that.history[that.history.length-1],0,0);
        }
        that.ctx.putImageData(that.temp,lefts,tops);
      }
      that.opacity.onmouseup=function(){
        that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
        that.temp=null;
        obj.style.display='none';
        that.opacity.onmousemove=null;
        that.opacity.onmouseup=null;
      }
    }
  }
  back(){
    back.onclick=function(){
      if(!arr.length){
        return;
      }
      arr.pop();
      this.ctx.clearRect(0,0,that.cw,that.ch);
      this.ctx.putImageData(arr[arr.length-1],0,0);
    }
  }
  draw (type,n){
  	let that=this;
    that.opacity.onmousedown=function(e){
    	let cx=e.offsetX,cy=e.offsetY;
    	that.opacity.onmousemove=function(e){
    	  that.init();
     	  let ox=e.offsetX,oy=e.offsetY;
     	  let r=Math.sqrt(Math.pow(cx-ox,2)+Math.pow(cy-oy,2));
     	  that.ctx.clearRect(0,0,that.cw,that.ch);
     	  if (that.history.length){
     	  	that.ctx.putImageData(that.history[that.history.length-1],0,0);
     	  }
     	  that[type](cx,cy,ox,oy,n);
      }
      that.opacity.onmouseup=function(){
        that.history.push(that.ctx.getImageData(0,0,that.cw,that.ch));
        that.opacity.onmousemove=null;
        that.opacity.onmouseup=null;
      }
    }
  }
}