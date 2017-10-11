/*
* @Author: lenovo
* @Date:   2017-10-10 12:04:32
* @Last Modified by:   lenovo
* @Last Modified time: 2017-10-11 19:56:18
*/
window.onload=function(){
    let tools=document.querySelectorAll('.tool');
    let eraser1=document.querySelector('.eraser1');
    let opacity=document.querySelector('.opacity');
    let clipObj=document.querySelector('.clipObj');
    
    
    let canvas=document.querySelector('canvas');
    let ctx=canvas.getContext('2d');
    let pal=new Palette(canvas,ctx,opacity);
   

    tools.forEach(element=>{
    	element.onclick=function(){
    		let num=0;
    		document.querySelector('li[active=true]').setAttribute('active',false);
    		this.setAttribute('active',true);
    		if (this.id=='pencil'){
    			pal.pencil();
    			return;
    		}
            if (this.id=='eraser'){
                w=prompt('请输入尺寸',30);
                eraser1.style.width=`${w}px`;
                eraser1.style.height=`${w}px`;
                pal.eraser(eraser1,w,w);
                return;
            }
            if(this.id=='font'){
                pal.font();
                return;
            }
            if (this.id=='clip'){
                pal.clip(clipObj);
                return;
            }
            if (this.id=='back'){
                pal.back();
                return;
            }
    		if (this.id=='poly'||this.id=='polyJ'){
    			num=prompt('请输入边数',5);
    		}
    		pal.draw(this.id,num);
    	}
        tools[0].onclick();  //默认第一个，直接进去就能画
    })
}