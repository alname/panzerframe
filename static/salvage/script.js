
var doc=document;
var current=-1;
var ul=['<li><a href="javascript:f(',0,')">',0,'</a> (',0,')</li>'];
function ID(name){return doc.getElementById(name);}
function f(num){
	if(num==current) return 0;
	current=num;
	ID("UNITLIST").innerHTML="";
	var leni=li[num].length;
	for(var i=0;i<leni;i++){
	  var obi=li[num][i];
	  if(i==0){
	  var head = document.createElement('h2');
	  head.setAttribute("id", "HEAD");
	  head.innerHTML=obi;
	  ID("UNITLIST").appendChild(head);
	  }
	  else{
	  var div = document.createElement('div');
	  div.className="unit";
	  var lenn=obi.length;
	  var obn=obi;
	  for(var n=0;n<lenn;n++){
		template[n*2+1]=obn[ite[n]];
	  }
	  div.innerHTML=template.join("");
	  ID("UNITLIST").appendChild(div);
	  }
	}
}
function format(){
	var leni=li.length;
	for(var i=0;i<leni;i++){
	  ul[1]=i;
	  ul[3]=li[i][0];
	  ul[5]=li[i].length-1;
	  ID("INDEX").innerHTML+=ul.join("");
	}
}

window.onload=format();