/**
 * ...
 * @author sivayu
 */

(function() {
//
//
var global = {}
global.attr = ["-","無属性","衝撃","熱","内部破壊","兵器破壊","電波","防御完全","防御軽減","飛行補助","戦闘補助"];
global.attrClass = ["","neutral","impulse","thermal","inner","destraction","jammer","guard","guard","support","regenerate"];
var form = null;

/*param*/
function getParameter(key) {var str = location.search.split("?");if (str.length < 2) {return "";}var params = str[1].split("&");for (var i = 0; i < params.length; i++) {var keyVal = params[i].split("=");if (keyVal[0] == key && keyVal.length == 2) {return decodeURIComponent(keyVal[1]);}}return "";}
/*32進数*/
function cov32(n,rank){var sin = "0123456789ABCDEFGHIJKLMNOPQRSTUV";if(rank==1){if(n<0 || n>32) return '0';/*error*/return sin.charAt(n%32);/*32進数1桁を返す*/}else if(rank==2){if(n<0 || n>32*32) return '00';/*error*/return sin.charAt(Math.floor(n/32))+sin.charAt(n%32);/*32進数2桁を返す*/}}
function dec32(n){var sin = "0123456789ABCDEFGHIJKLMNOPQRSTUV";var a=[];for(var i=0;i<n.length;i++){a.push(parseInt(sin.search(n.charAt(i))))}return a;}
function doppel(num){if(num<0) return "-"; else return num;}
function rankFunc(num){if(num<0) return "-"; else return ["E","D","C","B","A","S"][num];}

/*--------------------------
object
--------------------------*/
function Form(){
	document.getElementById("FORM").addEventListener("change", this.assemble);
}
Form.prototype.key=[];
Form.prototype.data=[];
Form.prototype.assemble = function(e){
	var targetClass = e.target.className;
	switch (targetClass){
		case "type":;case "frame":;case "arm":;case "weapon":;case "inner":;case "wcs":;case "purge":;case "trans":
			document.querySelector("#FORM .format").selectedIndex=0;
	}
	switch (targetClass){
		case "format":
			form.formatCheck();
	}
	switch (targetClass){
		case "type":;case "format":
			form.typeCheck();
	}
	switch (targetClass){
		case "type":;case "frame":;case "arm":;case "format":
			form.armsCheck();
	}
	switch (targetClass){
		case "weapon":
			form.weaponCheck(e);
	}
	form.input();
	form.weightCheck();
	form.energyCheck();
	form.hitpointCheck();
}
Form.prototype.typeCheck = function(){
	//customizetype
	var CUSTOMIZE_TYPE = document.querySelector("#FORM .type").value;
	var w = document.querySelectorAll("#FORM .wcs");
	var p = document.querySelector("#FORM .purge");
	var t = document.querySelectorAll("#FORM .trans");
	var a = document.querySelector("#FORM .arm")
	var key=[0,0,0,0,0,0];
	switch(CUSTOMIZE_TYPE){
		case "0":	//プロトタイプ
			key=[1,0,0,0,0,0];
			break;
		case "1":	//ベーシックA
			key=[1,1,0,0,0,0];
			break;
		case "2":	//ベーシックB
			key=[1,1,1,0,0,1];
			break;
		case "3":	//頭胸部オート
			key=[1,1,1,0,0,1];
			break;
		case "4":	//ダブルBMS
			key=[1,1,1,1,0,1];
			break;
		case "5":	//兵器変形機体
			key=[1,1,1,0,1,1];
			break;
	}
	for(var i=0;i<3;i++){
		w[i].disabled = !(key[i]);
		if(!key[i]) w[i].selectedIndex = 0;
		else if(w[i].selectedIndex==0) w[i].selectedIndex = 1;
	}
	for(var i=0;i<1;i++){
		p.disabled = !(key[3]);
		if(!key[3]) p.selectedIndex = 0
		else if(p.selectedIndex==0) p.selectedIndex = 1;
	}
	for(var i=0;i<4;i++){
		t[i].disabled = !(key[4]);
		if(!key[4]) t[i].selectedIndex = 0;
		else if(t[i].selectedIndex==0) t[i].selectedIndex = 1;
	}
	for(var i=0;i<1;i++){
		a.disabled = !(key[5]);
		if(!key[5]) a.checked = true;
	}
	//assemble(e);
}
Form.prototype.armsCheck = function(){
	//arm
	var a = document.querySelector("#FORM .arm");
	var ARMS_ARE_SAME = (a.checked);
	var larm = document.querySelectorAll("#FORM .frame")[2];
	var rarm = document.querySelectorAll("#FORM .frame")[3];
	if(ARMS_ARE_SAME){
		rarm.selectedIndex = larm.selectedIndex;
		rarm.disabled = true;
	}
	else{
		rarm.disabled = false;
	}
}
Form.prototype.weaponCheck = function(e){
	var t = e.target;
	var f = document.querySelectorAll("#FORM .weapon");
	//
	var cur=(t==f[0]) ?0 :(t==f[1]) ?1 :(t==f[2]) ?2 :3;//current
	var oth=(t==f[0]) ?1 :(t==f[1]) ?0 :(t==f[2]) ?3 :2;//other
	var cWep=(cur<=1) ?data.hundWeapon[f[cur].value][16] :data.shoulderWeapon[f[cur].value][16];//equip
	var oWep=(cur<=1) ?data.hundWeapon[f[oth].value][16] :data.shoulderWeapon[f[oth].value][16];//equip
	if(cWep==2 || oWep==2 || oWep==4) f[oth].selectedIndex=0;
	if(cWep==4) f[oth].selectedIndex=f[cur].selectedIndex;
	//十文字大手裏剣
	if(data.shoulderWeapon[f[2].value][2]==35) (t==f[2]) ?f[0].selectedIndex=0 :f[2].selectedIndex=0;
	if(data.shoulderWeapon[f[3].value][2]==35) (t==f[3]) ?f[1].selectedIndex=0 :f[3].selectedIndex=0;
}
Form.prototype.formatCheck = function(){
	var n = document.querySelector("#FORM .format").selectedIndex;
	var s = document.querySelectorAll("#FORM select");
	var a = document.querySelector("#FORM .arm");
	var d=data.format[n];
	a.checked = false;
	for(var i=0;i<s.length-1;i++){
		s[i].selectedIndex=d[i+2];
	}
}
Form.prototype.input = function(){
	var s = document.querySelectorAll("#FORM select");
	var f = document.querySelectorAll("#FRAME select");
	var header = ["head","main","arm","arm","leg","hundWeapon","hundWeapon","shoulderWeapon","shoulderWeapon","material","booster","innerBox","generator","wcs","wcs","wcs","heatGel"];
	//
	for(var i=0;i<s.length - 1;i++){
		this.key[i]=s[i].selectedIndex;
	}
	//
	for(var i=0;i<f.length;i++){
		this.data[i]=data[header[i]][f[i].value];
	}
	this.data[17]=data.innerWeapon[this.data[0][2]];//headWeapom
	this.data[18]=data.innerWeapon[this.data[1][2]];//mainWeapon
}
Form.prototype.weightCheck = function(){
	var w=this.data[0][3];//head
		w+=this.data[1][3];//main
		w+=this.data[2][2];//lArm
		w+=this.data[3][2];//rArm
		w+=this.data[4][2];//leg
		w*=this.data[9][2];//material
		//
		w+=this.data[5][4];//lHundWeapon
		w+=this.data[6][4];//rHundWeapon
		w+=this.data[7][4];//lShoulderWeapon
		w+=this.data[8][4];//rShoulderWeapon
		w+=this.data[10][2];//booster
		w+=this.data[11][2];//innerBox
		w+=this.data[16][2];//heatGel
		if(this.data[5][0]=="真・双斬破" && this.data[6][0]=="真・双斬破"){
			w=~~(w>>1);
		}
		if(this.data[16][0]=="ウエイトG"){
			w-=1000;
		}
		document.getElementById("WEIGHT").value=w;
		var maxw=this.data[4][6];
		document.getElementById("WEIGHT").style.outline=(w>maxw) ?"solid 1px red" :"none";
		document.getElementById("WE").style.color=(w>maxw) ?"red" :"";
		document.getElementById("WE").innerHTML=[w,maxw].join("/");
}
Form.prototype.energyCheck = function(){
	var ep=document.getElementById("EP");
	var en=document.getElementById("EN");
	var e=this.data[0][4];//head
	e+=this.data[1][4];//main
	e+=this.data[2][3];//lArm
	e+=this.data[3][3];//rArm
	e+=this.data[4][3];//leg
	e*=this.data[9][3];//material
	ep.value=e;
	var maxe=this.data[11][3];
	ep.max=maxe;
	ep.optimum=0;
	ep.high=maxe;
	ep.low=~~(maxe*0.69);
	ep.style.outline=(e>maxe) ?"solid 1px red" :"none";
	en.style.color=(e>maxe) ?"red" :"";
	en.innerHTML=[e,maxe].join("/");
}
Form.prototype.hitpointCheck = function(){
	var ohp=this.data[0][5];//head
	ohp+=this.data[1][5];//main
	ohp+=this.data[2][4];//lArm
	ohp+=this.data[3][4];//rArm
	ohp+=this.data[4][4];//leg
	ohp*=this.data[9][4];//material
	
	var ihp=this.data[10][6];//booster
	ihp+=this.data[12][5];//generator
	ihp+=(this.key[0]==1) ?this.data[13][2]*3 :(this.key[0]==1) ?this.data[13][2]*2 :this.data[13][2];//wcs1
	ihp+=this.data[14][2];//wcs2
	ihp+=this.data[15][2];//wcs3
	ihp+=~~((this.data[11][4]+this.data[1][7]-2)*ihp);//innerBox//main
	
	var hp=ohp+ihp;
	var rateihp=~~(ihp/hp*100);
	var rateohp=100-rateihp;
	
	var def=this.data[0][6];//head
	def+=this.data[1][6];//main
	def+=this.data[2][5];//lArm
	def+=this.data[3][5];//rArm
	def+=this.data[4][5];//leg
	def*=this.data[9][5];//material
	
	var defali=7
	defali+=[-5,0,-1,1][this.data[0][8]];//head
	defali+=[-5,0,-1,1][this.data[1][9]];//main
	defali+=[-5,0,-1,1][this.data[2][9]];//lArm
	defali+=[-5,0,-1,1][this.data[3][9]];//rArm
	defali+=[-5,0,-1,1][this.data[4][10]];//leg
	defali+=[-5,0,-1,1][this.data[10][8]];//booster
	defali+=[-5,0,-1,1][this.data[12][2]];//generator
	var defRateIm=100-(7*defali+1);
	var defRateTh=7*defali+1;
	if(this.data[16][0]=="耐衝撃G"){
		defRateIm=~~((defRateIm+100)>>1);
		defRateTh=100-defRateIm;
	}
	else if(this.data[16][0]=="耐熱G"){
		defRateTh=~~((defRateTh+100)>>1);
		defRateIm=100-defRateTh;
	}
	var defRateRes	= (defRateIm>50) ?0.5 :(defRateTh>50) ?-0.5 :0;
	//
}

/*other*/
function htmlFormat(e){
	var weaponGroup=["装備なし","Sマシンガン","カタナ","パイルバンカー","ノーマルハンマー","ウィングシールド","ライトガード","バトルアックス","サンダコン","V・シールド","フォルテシモ","ゴッドアーム","Mガントレット","ショットガン","レーザーソード","レーザースピア","カタール","ロングバズーカ","バスターランチャー","ブラフォードソード","ブラフォードガード","ポプリステッキ","ショートバズーカ","レーザーピストル","クラブ","ヤミフブキ","死人鎌","スマートガン","斬馬刀","アサシンファング","プラズマライフル","ヴィクトリアル","フローティングマイン","デッキブラシ","ウィング","十文字大手裏剣","モーターキャノン","ガトリング砲","AAFミサイル","カウンターリング","ラグーンブースト","ポプリウィング","ナイン","2連ミサイルポッド","プチマシンガン","MLRS","スライスカッター","レールキャノン","キャノン","プロポシブルキラー","エキスプロード","マインドラム","ホールモーター"];
	var optgroup={};
	var s = document.querySelectorAll("#FORM select");
	for (x in data){
		var t=data[x];
		for(var i=0;i<t.length;i++){
			var a=t[i];
			var elm=document.createElement('option');
			elm.innerHTML=a[0];
			elm.value=i;
			//elm.title=a[1];
			switch(x){
				case "customize":
					s[0].appendChild(elm);break;
				case "head":
					s[1].appendChild(elm);break;
				case "main":
					s[2].appendChild(elm);break;
				case "arm":
					s[3].appendChild(elm);
					break;
				case "leg":
					s[5].appendChild(elm);break;
				case "hundWeapon":
					if(a[3]!=0) break;
					var str=weaponGroup[a[2]];
					var group=optgroup[str];
					if(!group){
						group=document.createElement('optgroup');
						group.label=str;
						s[6].appendChild(group);
						optgroup[str]=group;
					}
					else if(a[2]==0){
						group=s[6];
					}
					group.appendChild(elm);
					break;
				case "shoulderWeapon":
					if(a[3]!=0) break;
					var str=weaponGroup[a[2]];
					var group=optgroup[str];
					if(!group){
						group=document.createElement('optgroup');
						group.label=str;
						s[8].appendChild(group);
						optgroup[str]=group;
					}
					else if(a[2]==0){
						group=s[8];
					}
					group.appendChild(elm);
					break;
				case "material":
					s[10].appendChild(elm);break;
				case "booster":
					s[11].appendChild(elm);break;
				case "innerBox":
					s[12].appendChild(elm);break;
				case "generator":
					s[13].appendChild(elm);break;
				case "wcs":
					s[14].appendChild(elm);
					if(i==0){
						elm.disabled=true;
					}break;
				case "heatGel":
					s[17].appendChild(elm);break;
				case "purge":
					s[18].appendChild(elm);
					if(i==0){
						elm.disabled=true;
					}break;
				case "variable":
					s[19].appendChild(elm);
					if(i==0){
						elm.disabled=true;
					}break;
				case "format":
					var str=a[1];
					var group=optgroup[str];
					if(!group){
						group=document.createElement('optgroup');
						group.label=str;
						s[23].appendChild(group);
						optgroup[str]=group;
					}
					group.appendChild(elm);
					break;
				default:
					console.log(x);
			}
			//コピー
			s[4].innerHTML=s[3].innerHTML;//rArm
			s[7].innerHTML=s[6].innerHTML;//rHundWeapon
			s[9].innerHTML=s[8].innerHTML;//rShoulderWeapon
			s[15].innerHTML=s[16].innerHTML=s[14].innerHTML;//wcs
			s[20].innerHTML=s[21].innerHTML=s[22].innerHTML=s[19].innerHTML;//variable
		}
	}
}
function output(e){
	var key=[];
	var s = document.querySelectorAll("#FORM select");
	var len = s.length;
	if(s[18].selectedIndex==1 || s[19].selectedIndex*s[20].selectedIndex*s[21].selectedIndex*s[22].selectedIndex==1){
		alert("カスタムタイプの不備により出撃不可");
		return false;
	}
	for(var i=0;i<len-1;i++){
		var num=s[i].selectedIndex;
		//key.push((i>=5 && i<=8) ?cov32(num,2) :cov32(num,1));
		key.push(num);
	}
	//psswd = prompt("機体パスワード", key.join(""));
	psswd = prompt("機体パスワード", key.join(","));
	if(psswd){
		var pasarr=psswd.split(",");
		for(var i=0;i<len-1;i++){
			s[i].selectedIndex=pasarr[i];
		}
		typeCheck(event);
	}
}
function onload(e){
	form = new Form();
	var changeEvent = document.createEvent("UIEvents");
	changeEvent.initEvent("change", true, false);
	document.querySelector("#FORM .format").dispatchEvent(changeEvent);//fire!!
	//
	/*Effect=document.getElementById("EFFECT").cloneNode(true);
	General=document.getElementById("GENERAL").cloneNode(true);
	Correction=document.getElementById("CORRECTION").cloneNode(true);
	Wep=document.getElementById("WEP").cloneNode(true);
	Wcs=document.getElementById("WCS").cloneNode(true);*/
	//
	document.getElementById("OUTPUT").addEventListener("click", output);
}
/*--------------------------
event
--------------------------*/
window.addEventListener("load", htmlFormat);
window.addEventListener("load", onload);
})();