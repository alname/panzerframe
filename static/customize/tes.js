
var doc=document;
var li=[];
var T=doc.getElementsByTagName('table');
for(var i=0;i<T.length;i++){
	var tbl=T[i];
	var td=tbl.getElementsByTagName('td');
	//
	li.push([
		"comment",
		td[1].innerText,
		td[8].innerText,
		td[20].innerText,
		td[14].innerText,
		td[30].innerText,
		td[10].innerText,
		td[16].innerText,
		td[22].innerText,
		td[28].innerText,
		"-\n-\n-\n-\n-\n-\n-\n-",
		td[26].innerText,
		"-\n-\n-\n-\n-\n-\n-\n-\n-\n-",
		]);
	//
	for(var j=0;j<li[i].length;j++){
		li[i][j]=li[i][j].split("\n");
		for(var k=0;k<li[i][j].length;k++){
			if(isNaN(li[i][j][k])){
				li[i][j][k]='"'+li[i][j][k]+'"';
			}
		}
	}
	//
	if(li[i][11].length<8){
		li[i][11]=['"-"','"-"','"-"','"-"','"-"','"-"','"-"','"-"'];
	}
	
	
	li[i]='['+li[i].join(",")+'],<br />';
}

doc.getElementsByTagName('html')[0].innerHTML=li.join("\n");

function smart(){
	
var doc=document;
var B=doc.getElementById("body");
var O=doc.getElementById("output");
li=B.innerText.split("\n");
for(var i=0;i<li.length;i++){
	li[i]=li[i].split("\t");
	if(li[i][1]==""){
		li[i]='<option>'+li[i][0]+'</option>';
	}
	else if(li[i][1]=="特殊兵器" || li[i][1]=="変形兵器"){
		li[i]='<option class="invisible" disabled>'+li[i][0]+'</option>';
	}
	else{
		li[i]='<option value="'+li[i][1]+'">'+li[i][0]+'</option>';
	}
}
O.innerHTML=li.join("\n");

}

function csv(){
	
var doc=document;
var B=doc.getElementById("body");
var O=doc.getElementById("output");
li=B.innerText.split("\n");
for(var i=0;i<li.length;i++){
	li[i]=li[i].split("\t");
	li[i].splice(3, 1);
}
O.innerHTML=li.join("\n");

}
function csv2(){
	
doc=document;
li=doc.getElementById("input").innerText.split("\n");
for(var i=0;i<li.length;i++){
	li[i]=li[i].split("\t");
	for(var k=0;k<li[i].length;k++){
		if(li[i][k]=="TRUE"){	li[i][k]="true";	}
		else if(li[i][k]=="FALSE"){	li[i][k]="false";	}
		else{
			li[i][k]=(isNaN(li[i][k])) ?['',li[i][k],''].join('"') :li[i][k];
		}
	}
	li[i].splice(li[i].length-1, 1);
	li[i].splice(2, 1);
	li[i].splice(1, 1);
}
doc.getElementById("output").innerText=["[[",li.join("],["),"]],\n"].join("");

}
function csvBURM(){

doc=document;
li=doc.getElementById("input").innerText.split("\n");
for(var i=0;i<li.length;i++){
	li[i]=li[i].split("\t");
	for(var k=0;k<li[i].length;k++){
		if(li[i][k]=="TRUE"){	li[i][k]="true";	}
		else if(li[i][k]=="FALSE"){	li[i][k]="false";	}
		else if(li[i][k]=='\\'){	li[i][k]=0	}
		else if(li[i][k]=='*'){	li[i][k]=1	}
		else if(k==5){	li[i][k]=["none","LIGHT","MIDDLE","!HEAVY","HEAVY","!MIDDLE","!LIGHT",""].indexOf(li[i][k])	}
		else if(k==0 || k==4 || k==18 || k==19){		}
		else{
			li[i][k]=(isNaN(li[i][k])) ?['',li[i][k],''].join('"') :(100+Number(li[i][k]))/100;
		}
	}
	li[i].splice(3, 1);
	//li[i].splice(1, 1);
	li[i][2]=0;
}
doc.getElementById("output").innerText=["[",li.join("],\n[")].join("");

}