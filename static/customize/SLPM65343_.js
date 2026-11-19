(function(){
	/*---------------------
	-
	---------------------*/
	var set=[];
	var Effect,General,Correction,Wep,Wcs;
	/*---------------------
	function
	---------------------*/
	function weight(){
		
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
			if(compo==2 && efWei<6) efWei=0;
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
		
		dd[0].innerHTML=["-","全規格外装","完全規格"][compo];
		dd[2].innerHTML=["-","積載軽量A","積載軽量B","積載軽量C","積載軽量D","積載軽量E","積載重量A","積載重量B","積載重量C","積載重量D","積載重量E","積載軽量A","積載軽量B","積載軽量C","積載軽量D","積載軽量E","積載重量A","積載重量B","積載重量C","積載重量D","積載重量E","積載量補正","積載量一致","積載量前賞"][efCap];
		dd[3].innerHTML=["-","特殊装備"][special];
		dd[4].innerHTML=["-","完全無装","腕部無装"][efNon];
		dd[6].innerHTML=["-","防御無属性"][efDef];
		dd[7].innerHTML=["-","機体軽量A","機体軽量B","機体軽量C","機体軽量D","機体軽量E","機体重量A","機体重量B","機体重量C","機体重量D","機体重量E"][efWei];
		dd[9].innerHTML=["-","肩装備対称","兵器左右対","完全左右対"][symmetry];
		
		Effect=document.getElementById("number").replaceChild(Effect,document.getElementById("EFFECT"));
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
		dd[8].innerHTML=~~(def*(2+defRateRes)*defRateIm/100);
		dd[9].innerHTML=~~(def*(2-defRateRes)*defRateTh/100);
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
		General=document.getElementById("number").replaceChild(General,document.getElementById("GENERAL"));
		//
		var dc=Correction.getElementsByTagName("dd");
		for(var i=0;i<dc.length;i++){
			dc[i].innerHTML="0";
		}
		Correction=document.getElementById("number").replaceChild(Correction,document.getElementById("CORRECTION"));
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
		Wep=document.getElementById("WEP").parentNode.replaceChild(Wep,document.getElementById("WEP"));
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
		Wcs=document.getElementById("WCS").parentNode.replaceChild(Wcs,document.getElementById("WCS"));
		
		return [w,e];
	}
	
	
	
})()