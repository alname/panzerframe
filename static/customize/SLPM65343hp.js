(function(){
	/*---------------------
	-
	---------------------*/
	var doc=document;
	var set=[];
	var asm=[];
	var key=[];
	var Effect,General,Correction,Wep,Wcs;
	/*---------------------
	*
	---------------------*/
	var hyphen=0;
	var rank=["E","D","C","B","A","S"];
	var attr=["-","無属性","衝撃","熱","内部破壊","兵器破壊","電波","防御完全","防御軽減","飛行補助","戦闘補助"];
	var attrClass=["","neutral","impulse","thermal","inner","destraction","jammer","guard","guard","support","regenerate"];
	var weaponGroup=["装備なし","Sマシンガン","カタナ","パイルバンカー","ノーマルハンマー","ウィングシールド","ライトガード","バトルアックス","サンダコン","V・シールド","フォルテシモ","ゴッドアーム","Mガントレット","ショットガン","レーザーソード","レーザースピア","カタール","ロングバズーカ","バスターランチャー","ブラフォードソード","ブラフォードガード","ポプリステッキ","ショートバズーカ","レーザーピストル","クラブ","ヤミフブキ","死人鎌","スマートガン","斬馬刀","アサシンファング","プラズマライフル","ヴィクトリアル","フローティングマイン","デッキブラシ","ウィング","十文字大手裏剣","モーターキャノン","ガトリング砲","AAFミサイル","カウンターリング","ラグーンブースト","ポプリウィング","ナイン","2連ミサイルポッド","プチマシンガン","MLRS","スライスカッター","レールキャノン","キャノン","プロポシブルキラー","エキスプロード","マインドラム","ホールモーター"];
	/*---------------------
	lib
	---------------------*/
	function ID(name) {return doc.getElementById(name);}
	//URLパラメータ取得
	function getParameter(key) {var str = location.search.split("?");if (str.length < 2) {return "";}var params = str[1].split("&");for (var i = 0; i < params.length; i++) {var keyVal = params[i].split("=");if (keyVal[0] == key && keyVal.length == 2) {return decodeURIComponent(keyVal[1]);}}return "";}
	//32進数
	function cov32(n,rank){var sin = "0123456789ABCDEFGHIJKLMNOPQRSTUV";if(rank==1){if(n<0 || n>32) return '0';/*error*/return sin.charAt(n%32);/*32進数1桁を返す*/}else if(rank==2){if(n<0 || n>32*32) return '00';/*error*/return sin.charAt(Math.floor(n/32))+sin.charAt(n%32);/*32進数2桁を返す*/}}
	function dec32(n){var sin = "0123456789ABCDEFGHIJKLMNOPQRSTUV";var a=[];for(var i=0;i<n.length;i++){a.push(parseInt(sin.search(n.charAt(i))))}return a;}
	function doppel(num){if(num<0) return "-"; else return num;}
	function rankFunc(num){if(num<0) return "-"; else return rank[num];}
	/*---------------------
	function
	---------------------*/
	function customType(e){
		var num=ID("TYPE").value;
		hyphen=data.customize[num];
		//arm
		if(hyphen[2]==1){
			ID("RIGHTARM").disabled=true;
			ID("RIGHTARM").checked=true;
		}else{
			ID("RIGHTARM").disabled=false;
		}
		//WCS
		for(var i=0;i<3;i++){
			fsel[13+i].disabled=(hyphen[5]<=i) ?true :false;
			fsel[13+i].selectedIndex=(hyphen[5]<=i) ?0 :(fsel[13+i].selectedIndex==0) ?1 :fsel[13+i].selectedIndex;
		}
		//purge
		if(hyphen[3]==1){
			ID("PURGE").disabled=false;
			ID("PURGE").selectedIndex=(ID("PURGE").selectedIndex>0) ?ID("PURGE").selectedIndex :1;
		}else{
			ID("PURGE").disabled=true;
			ID("PURGE").selectedIndex=0;
		}
		//transform
		if(hyphen[4]==1){
			for(var i=0;i<4;i++){
				trssel[i].disabled=false;
				trssel[i].selectedIndex=(trssel[i].selectedIndex>0) ?trssel[i].selectedIndex :1;
			}
		}else{
			for(var i=0;i<4;i++){
				trssel[i].disabled=true;
				trssel[i].selectedIndex=0;
			}
		}
		assemble(e);
	}
	function formatSelect(e){
		var asm=data.format[ID("FORMAT").selectedIndex];
		for(var i=0;i<selbox.length-1;i++){
			selbox[i].selectedIndex=asm[i+2];
			if(ID("RIGHTARM").checked && fsel[3].value==fsel[2].value){
				fsel[3].disabled=ID("RIGHTARM").checked=ID("RIGHTARM").disabled=false;
			}
		}
		customType(e);
	}
	function assemble(e){
		//customize
		if(e.target!=ID("FORMAT")){
			ID("FORMAT").selectedIndex=0;
		}
		//symmetry arm
		fsel[3].disabled=ID("RIGHTARM").checked;
		if(ID("RIGHTARM").checked){
			fsel[3].value=fsel[2].value;
		}
		//weapon
		if(e.target==fsel[5] || e.target==fsel[6] || e.target==fsel[7] || e.target==fsel[8]){
			var cur=(e.target==fsel[5]) ?5 :(e.target==fsel[6]) ?6 :(e.target==fsel[7]) ?7 :8;
			var oth=(e.target==fsel[5]) ?6 :(e.target==fsel[6]) ?5 :(e.target==fsel[7]) ?8 :7;
			var cWep=(cur<=6) ?data.hundWeapon[fsel[cur].value][16] :data.shoulderWeapon[fsel[cur].value][16];
			var oWep=(cur<=6) ?data.hundWeapon[fsel[oth].value][16] :data.shoulderWeapon[fsel[oth].value][16];
			if(cWep==2 || oWep==2 || oWep==4) fsel[oth].selectedIndex=0;
			if(cWep==4) fsel[oth].selectedIndex=fsel[cur].selectedIndex;
			//十文字大手裏剣
			if(data.shoulderWeapon[fsel[7].value][2]==35) (e.target==fsel[7]) ?fsel[5].selectedIndex=0 :fsel[7].selectedIndex=0;
			if(data.shoulderWeapon[fsel[8].value][2]==35) (e.target==fsel[8]) ?fsel[6].selectedIndex=0 :fsel[8].selectedIndex=0;
		}
		//function
		currentAssemble();
		weight();
		
	}
	function currentAssemble(){
		var len=selbox.length;
		for(var i=0;i<len-1;i++){
			key[i]=selbox[i].selectedIndex;
		}
		asm[0]=data.head[fsel[0].value];
		asm[1]=data.main[fsel[1].value];
		asm[2]=data.arm[fsel[2].value];
		asm[3]=data.arm[fsel[3].value];
		asm[4]=data.leg[fsel[4].value];
		asm[5]=data.hundWeapon[fsel[5].value];
		asm[6]=data.hundWeapon[fsel[6].value];
		asm[7]=data.shoulderWeapon[fsel[7].value];
		asm[8]=data.shoulderWeapon[fsel[8].value];
		asm[9]=data.material[fsel[9].value];
		asm[10]=data.booster[fsel[10].value];
		asm[11]=data.innerBox[fsel[11].value];
		asm[12]=data.generator[fsel[12].value];
		asm[13]=data.wcs[fsel[13].value];
		asm[14]=data.wcs[fsel[14].value];
		asm[15]=data.wcs[fsel[15].value];
		asm[16]=data.heatGel[fsel[16].value];
		//
		asm[17]=data.innerWeapon[asm[0][2]];//headWeapom
		asm[18]=data.innerWeapon[asm[1][2]];//mainWeapon
	}
	function weight(){
		var w=asm[0][3];//head
		w+=asm[1][3];//main
		w+=asm[2][2];//lArm
		w+=asm[3][2];//rArm
		w+=asm[4][2];//leg
		w*=asm[9][2];//material
		w+=asm[5][4];//lHundWeapon
		w+=asm[6][4];//rHundWeapon
		w+=asm[7][4];//lShoulderWeapon
		w+=asm[8][4];//rShoulderWeapon
		w+=asm[10][2];//booster
		w+=asm[11][2];//innerBox
		w+=asm[16][2];//heatGel
		if(asm[5][0]=="真・双斬破" && asm[6][0]=="真・双斬破"){
			w=~~(w>>1);
		}
		if(asm[16][0]=="ウエイトG"){
			w-=1000;
		}
		ID("WEIGHT").value=w;
		var maxw=asm[4][6];
		ID("WEIGHT").style.outline=(w>maxw) ?"solid 1px red" :"none";
		ID("WE").style.color=(w>maxw) ?"red" :"";
		ID("WE").innerHTML=[w,maxw].join("/");
		
		var e=asm[0][4];//head
		e+=asm[1][4];//main
		e+=asm[2][3];//lArm
		e+=asm[3][3];//rArm
		e+=asm[4][3];//leg
		e*=asm[9][3];//material
		ID("EP").value=e;
		var maxe=asm[11][3];
		ID("EP").max=maxe;
		ID("EP").optimum=0;
		ID("EP").high=maxe;
		ID("EP").low=~~(maxe*0.69);
		ID("EP").style.outline=(e>maxe) ?"solid 1px red" :"none";
		ID("EN").style.color=(e>maxe) ?"red" :"";
		ID("EN").innerHTML=[e,maxe].join("/");
		
		var ohp=asm[0][5];//head
		ohp+=asm[1][5];//main
		ohp+=asm[2][4];//lArm
		ohp+=asm[3][4];//rArm
		ohp+=asm[4][4];//leg
		ohp*=asm[9][4];//material
		
		var ihp=asm[10][6];//booster
		ihp+=asm[12][5];//generator
		ihp+=(key[0]==1) ?asm[13][2]*3 :(key[0]==1) ?asm[13][2]*2 :asm[13][2];//wcs1
		ihp+=asm[14][2];//wcs2
		ihp+=asm[15][2];//wcs3
		ihp+=~~((asm[11][4]+asm[1][7]-2)*ihp);//innerBox//main
		
		var hp=ohp+ihp;
		var rateihp=~~(ihp/hp*100);
		var rateohp=100-rateihp;
		
		var def=asm[0][6];//head
		def+=asm[1][6];//main
		def+=asm[2][5];//lArm
		def+=asm[3][5];//rArm
		def+=asm[4][5];//leg
		def*=asm[9][5];//material
		
		var defali=7
		defali+=[-5,0,-1,1][asm[0][8]];//head
		defali+=[-5,0,-1,1][asm[1][9]];//main
		defali+=[-5,0,-1,1][asm[2][9]];//lArm
		defali+=[-5,0,-1,1][asm[3][9]];//rArm
		defali+=[-5,0,-1,1][asm[4][10]];//leg
		defali+=[-5,0,-1,1][asm[10][8]];//booster
		defali+=[-5,0,-1,1][asm[12][2]];//generator
		var defRateIm=100-(7*defali+1);
		var defRateTh=7*defali+1;
		var defRateRes	= (defali>50) ?0.5 :(defali<50) ?-0.5 :0;
		//
		////////////////////////////////////////////////////////////////////////////////////////////////
		var dd=Effect.getElementsByTagName("dd");
		if(true){//規格仕様
			var compo=0;
			var a1=key.slice(1,6).join(",");
			if(key[0]!=0){
				for(var i=1;i<data.format.length;i++){
					var a0=data.format[i].slice(3,8).join(",");
					if(a1==a0){
						compo=1;
						a0=data.format[i].slice(2,25);
						if(a0[19]<2) a0[19]="\\d+";
						if(a0[20]<2) a0[20]="\\d+";
						if(a0[21]<2) a0[21]="\\d+";
						if(a0[22]<2) a0[22]="\\d+";
						var myRe = new RegExp(a0.join(","), "g");
						if(myRe.test(key.join(","))) compo=2;
						break;
					}
				}
			}
		}
		if(true){//特殊装備
			var special=0;
			special|=asm[5][17];
			special|=asm[6][17];
			special|=asm[7][17];
			special|=asm[8][17];
			special|=asm[9][6];
			special|=asm[11][6];
			special|=asm[12][7];
		}
		if(true){//腕部無装
			//肩部無装備0x8//肩にウィングかスパイダー0x4//肩にミサイルショット0x2//腕部無装備0x1//
			var efNon=0;
			if(key[6]+key[7]==0) efNon|=1;
			if(key[8]+key[9]==0) efNon|=8;
			efNon=(efNon&9==9) ?1 :(efNon&1==1) ? 2 :0;
		}
		if(true){//攻属特化
			
		}
		if(true){//防御特化
			var efDef=0;
			if(w<=maxw && e<=maxe && defRateIm==defRateTh && def<2000 && hp<9000){
				efDef=1;
			}
		}
		if(true){//機体重量
			var efWei=0;
			efWei=(key[0]==0) ?0
				:(w<1154) ?1 :(w<1539) ?2 :(w<1924) ?3 :(w<2463) ?4 :(w<3081) ?5
				:(w>7230) ?6 :(w>6769) ?7 :(w>6307) ?8 :(w>5769) ?9 :(w>5459) ?10
				:0
		}
		if(true){//積載重量
			var efCap=0;
			var wRate=~~(w/maxw);
			if(compo>0){
				efCap=21;
			}
			else if(key[0]>0 && efWei>0){
				if(0<efWei && efWei<6){//軽量
					efCap=(wRate>84) ?1 :(wRate>82) ?2 :(wRate>80) ?3 :(wRate>78) ?4 :(wRate>75) ?5
					:(wRate<21) ?6 :(wRate<23) ?7 :(wRate<36) ?8 :(wRate<41) ?9 :(wRate<50) ?10
					:0
				}
				else if(5<efWei && efWei<11){//重量
					efCap=(wRate>98) ?11 :(wRate>96) ?12 :(wRate>94) ?13 :(wRate>90) ?14 :(wRate>88) ?15
					:(wRate<71) ?16 :(wRate<73) ?17 :(wRate<75) ?18 :(wRate<77) ?19 :(wRate<79) ?20
					:0
				}
			}
		}
		if(true){//左右対称
			var symmetry=0;//ヘッドフレーム対称0x8//腕部兵器対称0x4//肩部兵器対称0x2//肩部装備0x1//
			if(key[8]!=0 && key[9]!=0) symmetry|=1;
			if(key[8]==key[9]) symmetry|=2;
			if(key[6]==key[7]) symmetry|=4;
			if(asm[0][9]==1) symmetry|=8;
			symmetry=((symmetry&14)==14) ?3 :((symmetry&6)==6) ?2 :((symmetry&3)==3) ?1 :0;
		}
		
		dd[0].innerHTML=["-","全規格外装","完全一致"][compo];
		dd[2].innerHTML=["-","積載軽量A","積載軽量B","積載軽量C","積載軽量D","積載軽量E","積載重量A","積載重量B","積載重量C","積載重量D","積載重量E","積載軽量A","積載軽量B","積載軽量C","積載軽量D","積載軽量E","積載重量A","積載重量B","積載重量C","積載重量D","積載重量E","積載量補正","積載量一致","積載量前賞"][efCap];
		dd[3].innerHTML=["-","特殊装備"][special];
		dd[4].innerHTML=["-","完全無装","腕部無装"][efNon];
		dd[6].innerHTML=["-","防御無属性"][efDef];
		dd[7].innerHTML=["-","機体軽量A","機体軽量B","機体軽量C","機体軽量D","機体軽量E","機体重量A","機体重量B","機体重量C","機体重量D","機体重量E"][efWei];
		dd[9].innerHTML=["-","肩装備対称","兵器左右対","完全左右対"][symmetry];
		
		Effect=ID("number").replaceChild(Effect,ID("EFFECT"));
		//////////////////////////////////////////////////////////////////////////////////////////////////////////
		dd=General.getElementsByTagName("dd");
		dd[0].innerHTML=[rateohp,rateihp].join(":");
		dd[1].innerHTML=[defRateIm,defRateTh].join(":");
		dd[2].innerHTML=hp;
		dd[3].innerHTML=ohp;
		dd[4].innerHTML=ihp;
		dd[5].innerHTML=w;
		dd[6].innerHTML=e;
		dd[7].innerHTML=def;
		dd[8].innerHTML=~~(def*defRateIm/50);//~~(def*(2+defRateRes)*defRateIm/100);
		dd[9].innerHTML=~~(def*defRateTh/50);//~~(def*(2-defRateRes)*defRateTh/100);
		dd[10].innerHTML=asm[2][6];//lHundPower
		dd[11].innerHTML=asm[3][6];//rHundPower
		dd[12].innerHTML=maxe;
		dd[13].innerHTML=asm[12][3];//出力
		dd[14].innerHTML=asm[12][4];//出力回復
		dd[15].innerHTML=rank[asm[1][8]];//空中旋回
		dd[16].innerHTML=maxw;
		dd[17].innerHTML=rank[asm[4][9]];//地上旋回
		dd[18].innerHTML=rank[asm[4][7]];//歩行速度
		dd[19].innerHTML=["減重力","なし","過重力"][asm[10][7]+1];//重力補正
		dd[20].innerHTML=rank[asm[10][3]];//最高速度
		dd[21].innerHTML=rank[asm[10][4]];//加速力
		
		dd[10].className=attrClass[asm[2][8]];//lHundPower
		dd[11].className=attrClass[asm[3][8]];//rHundPower
		General=ID("number").replaceChild(General,ID("GENERAL"));
		//
		var dc=Correction.getElementsByTagName("dd");
		for(var i=0;i<dc.length;i++){
			dc[i].innerHTML="0";
		}
		Correction=ID("number").replaceChild(Correction,ID("CORRECTION"));
		//
		var td=Wep.getElementsByTagName("td");
		for(var i=0;i<6;i++){
			var k=i%10;
			var n=(i<4) ?asm[5+k] :asm[13+k];
			td[k+0].innerHTML=doppel(n[6]);
			td[k+10].innerHTML=attr[doppel(n[5])];
			td[k+10].className=attrClass[doppel(n[5])];
			td[k+20].innerHTML=doppel(n[9]);
			td[k+30].innerHTML=doppel(n[10]);
			td[k+40].innerHTML=doppel(n[7]);
			td[k+50].innerHTML=rankFunc(n[12]);
			td[k+60].innerHTML=rankFunc(n[13]);
			td[k+70].innerHTML=rankFunc(n[11]);
		}
		Wep=ID("WEP").parentNode.replaceChild(Wep,ID("WEP"));
		//
		var td=Wcs.getElementsByTagName("td");
		for(var i=0;i<3;i++){
			var n=asm[13+i];
			var ava=n[3+i];
			td[0+i].innerHTML=(ava>0) ?n[15+i] :"-";
			td[3+i].innerHTML=(ava>0) ?rank[n[6+i]] :"-";
			td[6+i].innerHTML=(ava<0) ?"-" :["ロック不可","PF","弾丸","PF・弾丸"][ava];//n3n4
			td[6+i].style.color=(ava==0) ?"red" :"";//n3n4
			td[9+i].innerHTML=(ava>0) ?[n[9+i],n[12+i]].join(" ~ ") :"-";
		}
		Wcs=ID("WCS").parentNode.replaceChild(Wcs,ID("WCS"));
		
		return [w,e];
	}
	
	function htmlFormat(){
		var optgroup={};
		for (x in data){
			var t=data[x];
			for(var i=0;i<t.length;i++){
				var a=t[i];
				var elm=doc.createElement('option');
				elm.innerHTML=a[0];
				elm.value=i;
				//elm.title=a[1];
				switch(x){
					case "customize":
						selbox[0].appendChild(elm);break;
					case "head":
						selbox[1].appendChild(elm);break;
					case "main":
						selbox[2].appendChild(elm);break;
					case "arm":
						selbox[3].appendChild(elm);
						break;
					case "leg":
						selbox[5].appendChild(elm);break;
					case "hundWeapon":
						if(a[3]!=0) break;
						var str=weaponGroup[a[2]];
						var group=optgroup[str];
						if(!group){
							group=doc.createElement('optgroup');
							group.label=str;
							selbox[6].appendChild(group);
							optgroup[str]=group;
						}
						else if(a[2]==0){
							group=selbox[6];
						}
						group.appendChild(elm);
						break;
					case "shoulderWeapon":
						if(a[3]!=0) break;
						var str=weaponGroup[a[2]];
						var group=optgroup[str];
						if(!group){
							group=doc.createElement('optgroup');
							group.label=str;
							selbox[8].appendChild(group);
							optgroup[str]=group;
						}
						else if(a[2]==0){
							group=selbox[8];
						}
						group.appendChild(elm);
						break;
					case "material":
						selbox[10].appendChild(elm);break;
					case "booster":
						selbox[11].appendChild(elm);break;
					case "innerBox":
						selbox[12].appendChild(elm);break;
					case "generator":
						selbox[13].appendChild(elm);break;
					case "wcs":
						selbox[14].appendChild(elm);
						if(i==0){
							elm.disabled=true;
						}break;
					case "heatGel":
						selbox[17].appendChild(elm);break;
					case "purge":
						selbox[18].appendChild(elm);
						if(i==0){
							elm.disabled=true;
						}break;
					case "variable":
						selbox[19].appendChild(elm);
						if(i==0){
							elm.disabled=true;
						}break;
					case "format":
						var str=a[1];
						var group=optgroup[str];
						if(!group){
							group=doc.createElement('optgroup');
							group.label=str;
							selbox[23].appendChild(group);
							optgroup[str]=group;
						}
						group.appendChild(elm);
						break;
					default:
						console.log(x);
				}
				//コピー
				selbox[4].innerHTML=selbox[3].innerHTML;//rArm
				selbox[7].innerHTML=selbox[6].innerHTML;//rHundWeapon
				selbox[9].innerHTML=selbox[8].innerHTML;//rShoulderWeapon
				selbox[15].innerHTML=selbox[16].innerHTML=selbox[14].innerHTML;//wcs
				selbox[20].innerHTML=selbox[21].innerHTML=selbox[22].innerHTML=selbox[19].innerHTML;//variable
			}
		}
	}
	function output(){
		var key=[];
		var len=selbox.length;
		if(selbox[18].selectedIndex==1 || selbox[19].selectedIndex*selbox[20].selectedIndex*selbox[21].selectedIndex*selbox[22].selectedIndex==1){
			alert("カスタムタイプの不備により出撃不可");
			return false;
		}
		for(var i=0;i<len-1;i++){
			var num=selbox[i].selectedIndex;
			//key.push((i>=5 && i<=8) ?cov32(num,2) :cov32(num,1));
			key.push(num);
		}
		//psswd = prompt("機体パスワード", key.join(""));
		psswd = prompt("機体パスワード", key.join(","));
		if(psswd){
			var pasarr=psswd.split(",");
			for(var i=0;i<len-1;i++){
				selbox[i].selectedIndex=pasarr[i];
			}
			customType(event);
		}
	}
	
	window.onload=function(){
		ID("FRAME").addEventListener("change", assemble);
		ID("TRANSFORM").addEventListener("change", assemble);
		ID("CUSTOMIZETYPE").addEventListener("change", customType);
		ID("FORMAT").addEventListener("change", formatSelect);
		ID("OUTPUT").addEventListener("click", output);
		//
		Effect=ID("EFFECT").cloneNode(true);
		General=ID("GENERAL").cloneNode(true);
		Correction=ID("CORRECTION").cloneNode(true);
		Wep=ID("WEP").cloneNode(true);
		Wcs=ID("WCS").cloneNode(true);
		//
		selbox=ID("FORM").getElementsByTagName('select');
		fsel=ID("FRAME").getElementsByTagName('select');
		trssel=ID("TRANSFORM").getElementsByTagName('select');
		//
		htmlFormat();
	}
	window.addEventListener("load", customType);
	
})()