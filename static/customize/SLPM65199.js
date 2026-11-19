var doc=document;
var selbox=doc.getElementById("FORM").getElementsByTagName('select');
//
var arr=[],parr=[],corr=[];
var burm_rate, iregurar, symmetry, special, noweapon, weaponpower, atsyncro, personal;
var flg_format_frame, flg_format_perfect, flg_weight_agreement, flg_weight_nearmiss;
var weight_total, energy_total, weight_capacity, energy_capacity;
var weaponaliarr=["-","無属性","衝撃系","熱系","内部破壊系","兵器破壊系","電波系","防御系","飛行補助系","戦闘補助系"];
var weaponaliarreasy=["-","無","衝撃","熱","内破","兵破","電波","防御","飛補","戦補"];
var weaponclassarr=["variable","neutral","impulse","thermal","inner","destraction","jammer","guard","support","regenerate"];
//
function ID(name) {return doc.getElementById(name);}
//
function appburm(t,c){
	try{
	for(var i=0;i<26;i++){
		if(i==12 || i==13){
			t[i]+=(c[i+5]);
		}
		else if(i==20 || i==21){
			t[i]|=(c[i+5]);
		}
		else{
			t[i]=~~(t[i]*c[i+5]*1000) *0.001;
		}
	}
	}catch(e){
	}
}
function selectformat(){
	var sel=selbox[16].selectedIndex;
	
	if(sel>-1 && sel<formatarr.length){
		for(var i=0;i<16;i++){
			arr[i]=formatarr[sel][i];
			selbox[i].selectedIndex=arr[i];
		}
	}
	
	calc();
}
function arm(isLeft){
	var pos=(isLeft) ?4 :5;
	var other=(isLeft) ?5 :4;
	if ([56,62].indexOf(selbox[pos].selectedIndex)>=0){
		selbox[other].selectedIndex=0;
	}//片手専用兵器
	
	if ([26,27,28,61].indexOf(selbox[pos].selectedIndex)>=0){
		if ([22,40,57].indexOf(selbox[other].selectedIndex)==-1){
			selbox[other].selectedIndex=0;
		}
	}
	else if ([26,27,28,61].indexOf(selbox[other].selectedIndex)>=0){
		if ([22,40,57].indexOf(selbox[pos].selectedIndex)==-1){
			selbox[other].selectedIndex=0;
		}
	}
	
	if ([66].indexOf(selbox[pos].selectedIndex)>=0){//両手使用兵器
		selbox[other].selectedIndex=selbox[pos].selectedIndex;
	}
	else if([66].indexOf(selbox[other].selectedIndex)>=0){//両手専用兵器
		selbox[other].selectedIndex=0;
	}
}
function shoulder(isLeft){
	var pos=(isLeft) ?6 :7;
	var other=(isLeft) ?7 :6;
	if ([8,25,26,34].indexOf(selbox[pos].selectedIndex)>=0){
		selbox[other].selectedIndex=selbox[pos].selectedIndex;
	}
	else if([8,25,26,34].indexOf(selbox[other].selectedIndex)>=0){
		selbox[other].selectedIndex=0;
	}
}
function customize(pos) {
	//input
	for(var i=0;i<16;i++){
		arr[i]=selbox[i].selectedIndex;
	}
	calc();
}
function WeightTotal(last){
	if(last){	return (arr[15]==1) ?weight_total-1000 :weight_total;	}
	else{	return weight_total;	}
}
function WeightCapacity(last){
	if(last){	return ~~(weight_capacity * ((flg_format_perfect) ?1.015 :1));	}
	else{	return ~~(weight_capacity * ((flg_format_perfect) ?1.015 :1));	}
}
function EnergyTotal(last){
	if(last){	return (arr[15]==4) ?energy_total-1000 :energy_total;	}
	else{	return energy_total;	}
}
function EnergyCapacity(last){
	if(last){	return parr[8][3];	}
	else{	return parr[8][3];	}
}

function calc(){
	//
	for(var i=0;i<16;i++){
		parr[i]=data[[0,1,2,3,4,4,5,5,6,7,8,9,10,11,12,13][i]][arr[i]];
	}
	parr[16]=data[14][parr[0][10]];//ヘッド兵器
	parr[17]=data[14][parr[1][8]];//フレーム兵器
	//
	burm_rate=iregurar=symmetry=special=noweapon=weaponpower=atsyncro=personal=0;
	flg_format_frame=flg_format_perfect=flg_weight_agreement=flg_weight_nearmiss=false;
	//formatcheck
	var f1text=[arr[0],arr[1],arr[2],arr[3]];
	loop:for(i=1;i<33;i++){
		if(f1text.join(",")==[formatarr[i][0],formatarr[i][1],formatarr[i][2],formatarr[i][3]].join(",")){
			flg_format_frame=i;
			flg_format_perfect=(arr.join(",")==formatarr[i].join(",")) ?i :0;
			break loop;
		}
	}
	judgetab:{
		//symmetrycheck//ヘッドフレーム対称0x8//腕部兵器対称0x4//肩部兵器対称0x2//肩部装備0x1//
		symmetry|=(parr[0][12]) ?0x8 :0;
		symmetry|=(arr[4]==arr[5]) ?0x4 :0;
		symmetry|=(arr[6]==arr[7]) ?0x2 :0;
		symmetry|=(arr[6]+arr[7] > 0) ?0x1 :0;
		//personal//
		personal=(flg_format_perfect==23) ?1//アシュラ
			:(flg_format_perfect==9) ?2//アルサレアGS
			:(flg_format_perfect==29) ?3//アリス
			:(flg_format_perfect==25) ?4//ラセツ
			:(flg_format_perfect==30) ?5//リリス
			:(flg_format_perfect==31) ?6//マリア
			:(arr[14]==10 && (arr[4]==33 || arr[5]==33)) ?7//ホルス試作型+インパルススピア
			:(parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && (arr[4]==34 || arr[5]==34)) ?8//外装パーツ全女性PF+レディーレイピア
			:(parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && (arr[4]==35 && arr[5]==35)) ?9//外装パーツ全女性PF+シノビザクラ両手
			:(parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && (arr[4]==35 || arr[5]==35)) ?10//外装パーツ全女性PF+シノビザクラ片手
			:0;
		//special//
		special|=((arr[6]==8 && arr[7]==8) || (arr[6]==25 && arr[7]==25)) ?0x0001 :0;//ウィングまたはエンジェルウィング装備
		special|=(arr[6]==34 && arr[7]==34) ?0x0002 :0;//シャドーウィング装備
		special|=((special&0x1 || special&0x2) && (arr[3]==2 || arr[3]==28)) ?0x0004 :0;//飛行補助系装着時レッグが、Jフェニックスまたはカルラ
		special|=(arr[0]==23) ?0x0008 :0;//サイト強化ヘッド
		special|=(arr[0]==13) ?0x0010 :0;//ロック速度強化型ヘッド
		special|=(arr[0]==12) ?0x0020 :0;//アルサレアGSヘッド
		special|=(arr[4]==36 && arr[5]==36) ?0x0040 :0;//双斬破を両手に装備時
		special|=(arr[4]==65 || arr[5]==65) ?0x0080 :0;//光牙
		special|=(arr[6]==16 || arr[7]==16) ?0x0100 :0;//スパイダー装備
		special|=(arr[6]==42 || arr[7]==42) ?0x0200 :0;//スパイダー軽量型装備
		special|=(special&0x200 && (parr[4][15]>0 && parr[5][15]>0)) ?0x0400 :0;//スパイダー軽量型装備、腕兵器弾発射系無装備
		special|=(arr[6]==20 || arr[7]==20) ?0x0800 :0;//ミサイルショット
		special|=(arr[12]==9) ?0x1000 :0;//ウルクβ
		special|=(arr[12]==8) ?0x2000 :0;//ニブル改
		special|=(arr[1]==24) ?0x4000 :0;//Jメガバスターメイン
		special|=(special>0) ?0x8000 :0;//
		//noweaponcheck//肩部無装備0x8//肩にウィングかスパイダー0x4//肩にミサイルショット0x2//腕部無装備0x1//
		noweapon|=(arr[6]+arr[7]==0) ?0x8 :0;
		noweapon|=((arr[6]==8&&arr[7]==8) || (arr[6]==25&&arr[7]==25) || (arr[6]==34&&arr[7]==34) || arr[6]==16 || arr[7]==16) ?0x4 :0;
		noweapon|=(arr[6]==20 || arr[7]==20) ?0x2 :0;
		noweapon|=(arr[4]+arr[5]==0) ?0x1 :0;
		//atsyncro//左手0x8//右手0x4//左肩0x2//右肩0x1//
		atsyncro|=(parr[4][5]==0 ||parr[4][5]==parr[2][8] ||parr[4][5]>((parr[2][8]==2) ?6 :7)) ?0x8 :0;
		atsyncro|=(parr[5][5]==0 ||parr[5][5]==parr[2][8] ||parr[5][5]>((parr[2][8]==2) ?6 :7)) ?0x4 :0;
		atsyncro|=(parr[6][5]==0 ||parr[6][5]==parr[2][8] ||parr[6][5]>((parr[2][8]==2) ?6 :7)) ?0x2 :0;
		atsyncro|=(parr[7][5]==0 ||parr[7][5]==parr[2][8] ||parr[7][5]>((parr[2][8]==2) ?6 :7)) ?0x1 :0;
	}
	//
	corr = [1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1,1,1];
	
	//["軽A","軽B","軽C","軽D","軽E","-","重E","重D","重C","重B","重A"];//~5~
	weight_capacity	= ~~(parr[3][7]*parr[14][9]);
	energy_capacity	= parr[8][3];
	weight_total	= parr[0][1]+parr[1][1]+parr[2][1]+parr[3][1]+parr[4][1]+parr[5][1]+parr[6][1]+parr[7][1]+parr[8][1]+parr[9][1]+parr[10][1]+parr[11][1]+parr[12][1]+parr[13][1]+parr[14][1]+parr[15][1];
	energy_total	= parr[0][2]+parr[1][2]+parr[2][2]+parr[3][2]+parr[10][2]+parr[11][2]+parr[12][2]+parr[13][2]+parr[14][2]+parr[15][2];
	
	var HP_frame	= parr[0][3]+parr[1][3]+parr[2][3]+parr[3][3];
	var HP_inner	= ~~((parr[8][5]+parr[9][5]+parr[11][5]+parr[12][3]+parr[13][4]+parr[14][3])*parr[1][7]);
	var HP_total	= HP_frame + HP_inner;
	var HP_ratio_inner	=~~(HP_inner/HP_total * 100);
	var HP_ratio_frame	=100 - HP_ratio_inner;
	
	var def_size_impulse	= parr[0][5]+parr[1][5]+parr[2][5]+parr[3][5]+parr[8][6]+parr[9][6]+parr[11][6]+parr[12][4]+parr[13][5]+parr[14][4];
	var def_size_thermal	= parr[0][6]+parr[1][6]+parr[2][6]+parr[3][6]+parr[8][7]+parr[9][7]+parr[11][7]+parr[13][6]+parr[14][5];
	var def_size_total	= def_size_impulse + def_size_thermal;
	
	var def_ratio_impulse	= ~~(def_size_impulse / def_size_total * 100);
	var def_ratio_thermal	= 100 - def_ratio_impulse;
	var def_ratio_result	= (def_ratio_impulse>def_ratio_thermal) ?0.5 :(def_ratio_impulse<def_ratio_thermal) ?-0.5 :0;
	
	var def_total	= parr[0][4]+parr[1][4]+parr[2][4]+parr[3][4];//c
	

	//積載量
	flg_weight_agreement=(WeightTotal(true)==WeightCapacity(true));
	flg_weight_nearmiss=(WeightTotal(true)+1==WeightCapacity(true));
	//EP
	flg_energy_agreement=(EnergyTotal(true)==EnergyCapacity(true));
	//違反
	iregurar|=(parr[8][9]) ?0x4 :0;
	iregurar|=(EnergyTotal(true)>EnergyCapacity(true)) ?0x2 :0;
	iregurar|=(WeightTotal(true)>WeightCapacity(true)) ?0x1 :0;
	
	//calc
	var energy_usage=energy_total/EnergyCapacity(true);
	var weight_usage=weight_total/WeightCapacity(true);
	var wrank=(weight_total<924) ?0 :(weight_total<1231) ?1 :(weight_total<1847) ?2 :(weight_total<3078) ?3 :(weight_total<3847) ?4 :(weight_total<5463) ?5 :(weight_total<5770) ?6 :(weight_total<6309) ?7 :(weight_total<6770) ?8 :(weight_total<7232) ?9 :10;
	var crank=
		 (wrank<5) ?(weight_usage<0.20) ?0 :(weight_usage<0.22) ?1 :(weight_usage<0.35) ?2 :(weight_usage<0.40) ?3 :(weight_usage<0.49) ?4 :(weight_usage<0.84) ?5 :(weight_usage<0.90) ?6 :(weight_usage<0.94) ?7 :(weight_usage<0.96) ?8 :(weight_usage<0.98) ?9 :10
		:(wrank>5) ?(weight_usage<0.20) ?0 :(weight_usage<0.32) ?1 :(weight_usage<0.44) ?2 :(weight_usage<0.50) ?3 :(weight_usage<0.60) ?4 :(weight_usage<0.80) ?5 :(weight_usage<0.90) ?6 :(weight_usage<0.94) ?7 :(weight_usage<0.96) ?8 :(weight_usage<0.98) ?9 :10
		:5;
	//
	basic:{//calc
		var burmarr=[0,0,0,0,0,0,0,0,0,0,0,0];
		var Bbox=doc.getElementById("EFFECT").getElementsByTagName('dd');
		var bn=0;
		//
		corr[1]*=Number(parr[13][7]);
		corr[4]*=Number(parr[0][7]);
		corr[17]*=Number(parr[13][8]);
		corr[26]*=Number(parr[0][8]);
		corr[27]*=Number(parr[0][9]);
		//
		b9:{//機体重量
			bn=9;
			burmarr[9]=(flg_format_frame) ?0 :(wrank<5) ?wrank+1 :(wrank>5) ?16-wrank :0;
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
			//
			if(parr[3][8]*parr[14][7]*corr[10]>=30){
				corr[10]*=[1,0.77,0.82,0.9,0.95,0.98,2.1,1.92,1.8,1.35,1.25][burmarr[bn]];
			}
		}
		b4:{//積載量
			bn=4;
			b4f:if(flg_format_perfect){//積載量補正
				burmarr[4]=23;
			}
			else if(flg_weight_nearmiss){//積載量前賞
				burmarr[4]=22;
			}
			else if(burmarr[9]==0 && flg_weight_agreement && (wrank==5)){//積載量一致
				burmarr[4]=21;
			}
			else if(wrank<5){
				burmarr[4]=(crank<5) ?crank+1 :(crank>5) ?16-crank :0;
			}
			else if(wrank>5){
				burmarr[4]=(crank<5) ?crank+11 :(crank>5) ?26-crank :0;
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
			//
			if(burmarr[bn]==23){
				corr[1]*=(~~(parr[2][7]*corr[1])<300) ?8.15 :(~~(parr[2][7]*corr[1])<1000) ?3 :(~~(parr[2][7]*corr[1])<2000) ?1.5 :1.15;
				corr[7]*=(parr[9][4]*corr[7]<=1) ?3 :(parr[9][4]*corr[7]<=3) ?2 :(parr[9][4]*corr[7]<=10) ?1.5 :1;
				corr[10]*=(parr[3][8]*parr[14][7]*corr[10]<9) ?2.1 :1.3;
				if(~~(HP_frame*corr[19])+~~(HP_inner) <9000){corr[18]*=(~~(def_total*corr[18])<1500) ?2 :(~~(def_total*corr[18])<2000) ?1.5 :(~~(def_total*corr[18])<2500) ?1.3 :1.03;}
			}
			else if(burmarr[bn]==22){
				corr[1]*=(~~(parr[2][7]*corr[1])<300) ?4.1 :(~~(parr[2][7]*corr[1])<1000) ?1.5 :(~~(parr[2][7]*corr[1])<2000) ?1.1 :1.01;
				corr[10]*=(parr[3][8]*parr[14][7]*corr[10]<9) ?1.7 :1.05;
			}
			else if(burmarr[bn]>5 && burmarr[bn]<=10){
				if(~~(parr[8][2]*corr[3])>=1000){	corr[3]*=[0.8,0.85,0.9,0.94,0.98][burmarr[bn]-6];	}
				if(parr[3][8]*parr[14][7]*corr[10]<=20){	corr[10]*=[1.28,1.14,1.1,1.08,1.02][burmarr[bn]-6];	}
			}
			else if(burmarr[bn]>15 && burmarr[bn]<=20){
				if(~~(parr[8][2]*corr[3])>=6000){	corr[3]*=[0.1,0.2,0.3,0.4,0.5][burmarr[bn]-16];	}
				if(parr[3][8]*parr[14][7]*corr[10]<=10){	corr[10]*=[1.2,1.19,1.17,1.17,1.12][burmarr[bn]-16];	}
			}
		}
		b0:{//規格仕様
			bn=0;
			if(flg_format_perfect){//完全規格
				burmarr[bn]=3;
			}
			else if(flg_format_frame){//全規格外装
				burmarr[bn]=5;
			}
			else if((~~(HP_frame*corr[19])+HP_inner)>=15000 && def_total>=5500){//4//拠点防衛機
				burmarr[bn]=4;
			}
			else if((~~(HP_frame*corr[19])+HP_inner)>=15000){//1//HP肥大機
				burmarr[bn]=1;
			}
			else if(def_total>=5500){//2//異常硬度機
				burmarr[bn]=2;
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b2:{//BMS限界
			bn=2;
			burmarr[bn]=0;//Bbox[bn].selectedIndex;
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b3:{//専用兵器
			bn=3;
			burmarr[bn]=personal;
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b5:{//特殊装備
			bn=5;
			burmarr[bn]=(special>0) ?1 :0;
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			for(var n=1;n<17;n++){
				if(special&(1<<(n-1))){
					appburm(corr,BURMcorr[bn][n]);
					burm_rate+=BURMcorr[bn][n][3];
				}
			}
		}
		b6:{//無装備//肩部無装備0x8//肩にウィングかスパイダー0x4//肩にミサイルショット0x2//腕部無装備0x1//
			bn=6;
			if(!flg_format_frame && noweapon&1 && noweapon>1){
				burmarr[6]=((wrank<5) ?0 :(wrank>5) ?6 :3) + (((noweapon&9)==9) ?1 :((noweapon&5)==5) ?2 :((noweapon&3)==3) ?3 :0);
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
			//
			if(burmarr[bn]>0 && burmarr[bn]<=3){//punch
				corr[1]*=(~~(parr[2][7]*corr[1])<101) ?(1.25*(~~(HP_frame*corr[19])+HP_inner)/~~(parr[2][7]*corr[1])) :(wrank<5) ?2.45 :(wrank>5) ?1.2 :(wrank==5) ?1.5 :1
			}
			if(burmarr[bn]==1){//HP
				corr[19]*=(~~(HP_frame*corr[19])+~~(HP_inner*corr[19])<5000) ?(1.25*(~~(HP_frame*corr[19])+HP_inner)/weight_total) :1.4;
			}
		}
		b7:{//攻属特化
			bn=7;
			weaponpower=~~(parr[2][7]*parr[13][7]) +(((parr[4][15]==0) ?parr[4][4]*parr[13][8] :parr[4][4])*parr[13][8]) +(((parr[5][15]==0) ?parr[5][4]*parr[13][8] :parr[5][4])*parr[13][8]) +(parr[6][4]*parr[13][8]) +(parr[7][4]*parr[13][8]);
			if(weaponpower>=1000){
				if(parr[2][8]==2){//衝撃
					burmarr[7]=((parr[4][5]==2 || parr[4][5]==7) && (parr[5][5]==2 || parr[5][5]==7) && parr[6][5]==2 && parr[7][5]==2) ?1 :(atsyncro==0xF) ?5 :0;
				}
				else if(parr[2][8]==3){//熱
					burmarr[7]=(parr[4][5]==3 && parr[5][5]==3 && parr[6][5]==3 && parr[7][5]==3) ?2 :(atsyncro==0xF) ?6 :0;
				}
				else if(parr[2][8]==4){//内部破壊
					burmarr[7]=(parr[4][5]==4 && parr[5][5]==4 && parr[6][5]==4 && parr[7][5]==4) ?3 :(atsyncro==0xF) ?7 :0;
				}
				else if(parr[2][8]==5){//兵器破壊
					burmarr[7]=(parr[4][5]==5 && parr[5][5]==5 && parr[6][5]==5 && parr[7][5]==5) ?4 :(atsyncro==0xF) ?8 :0;
				}
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b10:{//武装形態
			bn=10;
			burmarr[10]=0;//Bbox[10].selectedIndex;
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b11:{//左右対称//symmetrycheck//ヘッドフレーム対称0x8//腕部兵器対称0x4//肩部兵器対称0x2//肩部装備0x1//
			bn=11;
			burmarr[11]=((symmetry&14)==14) ?1 :((symmetry&6)==6) ?2 :((symmetry&3)==3) ?3 :0;
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		b1:{//EP削減
			bn=1;
			b1f:if(flg_format_frame){
				break b1f;
			}
			else if(flg_energy_agreement && ((iregurar&3)==0)){//EP全消費
				burmarr[1]=11;
			}
			else if(wrank==5){
				if(energy_usage<0.69){//EP削減
					burmarr[1]=12;
				}
				else if(burm_rate==0){//無の境地//純粋なる力
					burmarr[1]=(def_ratio_thermal==def_ratio_impulse) ?14 :13;
				}
			}
			else if(((iregurar&3)==0) && wrank<5){//EP温存
				burmarr[1]=(energy_usage<0.51) ?1 :(energy_usage<0.61) ?2 :(energy_usage<0.68) ?3 :(energy_usage<0.71) ?4 :(energy_usage<0.78) ?5 :0;
			}
			else if(((iregurar&3)==0) && wrank>5){//EP温存
				burmarr[1]=(energy_usage<0.31) ?6 :(energy_usage<0.45) ?7 :(energy_usage<0.55) ?8 :(energy_usage<0.66) ?9 :(energy_usage<0.78) ?10 :0
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
			//
			if(burmarr[bn]==13){
				corr[18]*=(~~(def_total*corr[18])<2000 && ~~(HP_frame*corr[19])+HP_inner <9000) ?1.7
					:(~~(HP_frame*corr[19])+HP_inner <9000) ?1.05 :1;
			}
			else if(burmarr[bn]==14){
				corr[18]*=(~~(def_total*corr[18])<2000 && ~~(HP_frame*corr[19])+HP_inner <9000) ?2.3
					:(~~(def_total*corr[18])<3000 && ~~(HP_frame*corr[19])+HP_inner <9000) ?1.5
					:(~~(HP_frame*corr[19])+HP_inner <9000) ?1.07 :1;
			}
		}
		b8:{//防御特化
			bn=8;
			if(((iregurar&3)==0) && (def_ratio_thermal==def_ratio_impulse) && ~~(HP_frame*corr[19])+HP_inner<9000 && ~~(def_total*corr[18])<2000){//違反機体でない、耐久比50:50、基本防御力2000未満、総HP9000未満
				burmarr[8]=9;
			}
			else if(wrank<5){
				burmarr[8]=(def_size_impulse >= def_size_thermal*5) ?1 :(def_size_impulse >= def_size_thermal*3) ?2 :(def_size_impulse*5 <= def_size_thermal) ?3 :(def_size_impulse*3 <= def_size_thermal) ?4 :0;
			}
			else if(wrank>5){
				burmarr[8]=(def_size_impulse >= def_size_thermal*8) ?5 :(def_size_impulse >= def_size_thermal*6) ?6 :(def_size_impulse >= def_size_thermal*8) ?7 :(def_size_impulse >= def_size_thermal*6) ?8 :0;
			}
			Bbox[bn].innerHTML=BURMcorr[bn][burmarr[bn]][1];
			appburm(corr,BURMcorr[bn][burmarr[bn]]);
			burm_rate+=BURMcorr[bn][burmarr[bn]][3];
		}
		
	}
	//
	num:{//min
		var last_HP_frame=~~(HP_frame*corr[19])+((arr[15]==3) ?1000 :0);
		var last_HP_inner=HP_inner+((arr[15]==2) ?1000 :0);
		var last_HP_total=last_HP_frame + last_HP_inner;
		
		var last_def_total=~~(def_total*corr[18])+((arr[15]==9) ?1000 :0);
		var last_def_total_impulse=~~(last_def_total*(2+def_ratio_result)*def_ratio_impulse/100);
		var last_def_total_thermal=~~(last_def_total*(2-def_ratio_result)*def_ratio_thermal/100);
		
		var last_st_walk=(parr[3][8]*parr[14][7]*corr[10]+((arr[15]==5) ?10 :0)).toFixed(1);
		var last_st_jump=(arr[15]==8) ?10 :0;
		var last_st_turn_rand=(parr[3][10]+corr[12]+((arr[15]==10) ?10 :0));
		var last_st_turn_air=(parr[3][11]+corr[13]+((arr[15]==10) ?10 :0));
		var last_st_grip=parr[3][12]*corr[11];
		
		var last_st_genererater=~~(parr[8][4]*corr[2])+((arr[15]==6) ?10 :0);
		var last_st_genererater_gain=~~(parr[8][2]*corr[3]);
		var last_st_genererater_redzone=~~(parr[8][8]*corr[23]);
		
		var last_st_booster_waste=(parr[9][2]*corr[9]).toFixed(1);
		var last_st_booster_speed=(parr[9][3]*corr[8]+((arr[15]==7) ?10 :0)).toFixed(1);
		var last_st_booster_accel=(parr[9][4]*corr[7]+((arr[15]==7) ?10 :0)).toFixed(1);
		
		var last_punch=~~(parr[2][7]*corr[1]);
	}
	//
	tabcenter:{//center
		var infotd=doc.getElementById("INFORMATION").getElementsByTagName('span');
		//var warningtd=doc.getElementById("WARNING").getElementsByTagName('td');
		//var burmtd=doc.getElementById("BURM").getElementsByTagName('td');
		//var effecttd=doc.getElementById("EFFECT").getElementsByTagName('td');
		//
		/*warningtd[0].className=(iregurar>4) ?"coution" :"";
		warningtd[1].className=(iregurar&0x2) ?"error" :"";
		warningtd[2].className=(iregurar&0x1) ?"error" :"";
		
		warningtd[0].innerHTML=(iregurar>4) ?"出撃不可" :"出撃";
		warningtd[1].innerHTML=(iregurar&0x2) ?"EP不足" :"EP";
		warningtd[2].innerHTML=(iregurar&0x1) ?"重量過多" :"重量";*/
		
		infotd[0].innerHTML=EnergyTotal(true);
		infotd[1].innerHTML=EnergyCapacity(true);
		infotd[2].innerHTML=WeightTotal(true);
		infotd[3].innerHTML=WeightCapacity(true);
		
		/*burmtd[0].innerHTML=["LIGHT","LIGHT","LIGHT","LIGHT","LIGHT","MIDDLE","HEAVY","HEAVY","HEAVY","HEAVY","HEAVY"][wrank];
		burmtd[0].style.color=["blue","blue","blue","blue","blue","green","crimson","crimson","crimson","crimson","crimson"][wrank];
		burmtd[1].innerHTML=burm_rate+"%";*/
	}
	
	tab0:{//compo
		break tab0;
		var compotd=doc.getElementById("COMPOSITION").getElementsByTagName('table')[0].getElementsByTagName('td');
		compotr=doc.getElementById("COMPOSITION").getElementsByTagName('table')[0].getElementsByTagName('tr');
		
		for(i=0;i<4;i++){
			compotd[i*2].innerHTML=selbox[i].options[arr[i]].text;
			compotd[i*2+1].innerHTML=weaponaliarr[(parr[i][5]==50) ?1 :(parr[i][5]>50) ?2 :3];
			compotr[i+1].className=weaponclassarr[(parr[i][5]==50) ?1 :(parr[i][5]>50) ?2 :3];
			
			compotd[(i+6)*2].innerHTML=(arr[i+4]==0) ?"装備無し" :selbox[i+4].options[arr[i+4]].text;
			compotd[(i+6)*2+1].innerHTML=weaponaliarr[parr[4+i][5]];
			compotr[(i+6+1)].className=weaponclassarr[parr[4+i][5]];
		}
		for(i=0;i<2;i++){
			compotd[(i+4)*2].innerHTML=(selbox[i].options[arr[i]].getAttribute("value")) ?selbox[i].options[arr[i]].value :"兵器未搭載";
		}
		compotd[(4)*2+1].innerHTML=weaponaliarr[parr[16][5]];
		compotr[(4)+1].className=weaponclassarr[parr[16][5]];
		compotd[(5)*2+1].innerHTML=weaponaliarr[parr[17][5]];
		compotr[(5)+1].className=weaponclassarr[parr[17][5]];
			
		for(i=0;i<8;i++){
			compotd[(i+10)*2].innerHTML=selbox[i+8].options[arr[i+8]].text;
		}
		var compoarr=[8,6, 9,6, 0,0, 11,6, 12,4, 13,5, 14,4];
		for(i=0;i<7;i++){
			if(i!=2){
				compotd[(10+i)*2+1].innerHTML=weaponaliarr[(parr[compoarr[i*2+0]][compoarr[i*2+1]]==50) ?1 :(parr[compoarr[i*2+0]][compoarr[i*2+1]]>50) ?2 :3];
				compotr[10+i+1].className=weaponclassarr[(parr[compoarr[i*2+0]][compoarr[i*2+1]]==50) ?1 :(parr[compoarr[i*2+0]][compoarr[i*2+1]]>50) ?2 :3];
			}
		}
		
		compotd[17*2+1].innerHTML=weaponaliarr[1];
		compotr[17+1].className=weaponclassarr[3];
		//
		//
		compotd=doc.getElementById("COMPOSITION").getElementsByTagName('table')[1].getElementsByTagName('td');
		for(i=0;i<4;i++){
			compotd[i].innerHTML=(doc.getElementsByTagName('input')[1+i].checked)
				?"排除" :"-";
		}
	}
	
	tab1:{//general
		var generaltbl=doc.getElementById("GENERAL").getElementsByTagName('table');
		
		var generaltd=generaltbl[0].getElementsByTagName('td');
		generaltd[0].innerHTML=['<span class="impulse">',def_ratio_impulse,'</span>:<span class="thermal">',def_ratio_thermal,'</span>'].join("");
		generaltd[1].innerHTML=['<span class="framehp">',HP_ratio_frame,'</span>:<span class="innerhp">',HP_ratio_inner,'</span>'].join("");
		generaltd[2].innerHTML=last_HP_total;
		generaltd[3].innerHTML=last_HP_frame;
		generaltd[4].innerHTML=last_HP_inner;
		generaltd[5].innerHTML=EnergyTotal(true);
		generaltd[6].innerHTML=last_def_total;
		generaltd[7].innerHTML=last_def_total_thermal;
		generaltd[8].innerHTML=last_def_total_impulse;
		generaltd[9].innerHTML=last_punch;
		//generaltd[10].innerHTML=weaponaliarr[parr[2][8]];
		//generaltd[10].className=weaponclassarr[parr[2][8]];
		
		generaltd=generaltbl[1].getElementsByTagName('td');
		generaltd[0].innerHTML=WeightCapacity(true);
		generaltd[1].innerHTML=last_st_walk;
		generaltd[2].innerHTML=last_st_turn_rand;
		generaltd[3].innerHTML=last_st_turn_air;
		//generaltd[4].innerHTML=last_st_grip.toFixed(2);
		
		generaltd=generaltbl[2].getElementsByTagName('td');
		generaltd[0].innerHTML=last_st_genererater_gain;
		generaltd[1].innerHTML=EnergyCapacity(true);
		generaltd[2].innerHTML=last_st_genererater_redzone;
		generaltd[3].innerHTML=last_st_genererater;
		//generaltd[4].innerHTML=(parr[8][9]) ?"○" :"×";
		
		generaltd=generaltbl[3].getElementsByTagName('td');
		generaltd[0].innerHTML=last_st_booster_waste;
		generaltd[1].innerHTML=last_st_booster_speed;
		generaltd[2].innerHTML=parr[9][8].toFixed(2);
		generaltd[3].innerHTML=last_st_booster_accel;
		
		generaltd=generaltbl[4].getElementsByTagName('td');
		generaltd[0].innerHTML=parr[11][3];
		generaltd[1].innerHTML=["固定型A","固定型B","固定型C","可変型A","可変型B","可変型C"][parr[11][4]];
		
		generaltd=generaltbl[5].getElementsByTagName('td');
		//generaltd[0].innerHTML=parr[13][3];
		
	}
	
	tab2:{//weapon	//N,W,耐久度,カスタム,攻撃力,攻撃属性,弾速,連射性,弾数,弾寿命,爆風範囲,爆風攻撃力,追尾開始,追尾終了,精度,最大同時発射数,消費出力,ロック,種類
		break tab2;
		
		var weapontb=doc.getElementById("WEAPON").getElementsByTagName('table');
		var weapontd=weapontb[0].getElementsByTagName('td');
		for(i=0;i<6;i++){//weapontb[i].style.color=(arr[4+i]==0) ?"lightgray" :"";
			var wi=(i>=4) ?i+12 :i+4;
			var assult=(parr[wi][15]==0);
			weapontd[0*6+i].innerHTML=~~(~~(parr[wi][4]*corr[17])*((assult) ?parr[13][8] :1));
			weapontd[0*6+i].setAttribute("title",(i<4) ?doc.getElementsByTagName('select')[4+i].options[arr[4+i]].text :(selbox[i-4].options[arr[i-4]].getAttribute("value")) ?selbox[i-4].options[arr[i-4]].value :"兵器未搭載");
			weapontd[1*6+i].innerHTML=weaponaliarreasy[parr[wi][5]];
			weapontd[1*6+i].setAttribute("title",weaponaliarr[parr[wi][5]]);
			weapontd[2*6+i].innerHTML=(assult) ?"-" :parr[wi][6];
			weapontd[3*6+i].innerHTML=parr[wi][7];
			weapontd[4*6+i].innerHTML=parr[wi][8];
			weapontd[5*6+i].innerHTML=parr[wi][9];
			weapontd[6*6+i].innerHTML=parr[wi][10];
			weapontd[7*6+i].innerHTML=parr[wi][11];
			weapontd[8*6+i].innerHTML=(assult) ?"-" :(parr[wi][12]+parr[wi][13]>0) ?"あり" :"なし";
			weapontd[9*6+i].innerHTML= (parr[wi][13]==0) ?"-" :parr[wi][12];
			weapontd[10*6+i].innerHTML=(parr[wi][13]==0) ?"-" :parr[wi][13];
			weapontd[11*6+i].innerHTML=(parr[wi][13]==0) ?"-" :parr[wi][14].toFixed(2);
			weapontd[12*6+i].innerHTML=(assult) ?"-" :parr[wi][15];
			weapontd[13*6+i].innerHTML=(parr[wi][16]==0) ?"-" :parr[wi][16];
			//
			weapontd[1*6+i].className=weaponclassarr[parr[wi][5]];
		}
		//
		//WCS
		weapontd=weapontb[1].getElementsByTagName('td');
		for(i=0;i<3;i++){
			var weapontd=weapontb[1].getElementsByTagName('td');
			if((parr[10][7+8*i]) || (parr[10][8+8*i])){
				weapontd[0*3+i].innerHTML=[(parr[10][7+8*i]) ?"○" :"×",(parr[10][8+8*i]) ?"○" :"×"].join(" / ");
				weapontd[1*3+i].innerHTML=parr[10][5+8*i];
				weapontd[2*3+i].innerHTML=parr[10][6+8*i];
				weapontd[3*3+i].innerHTML=[parr[10][9+8*i],parr[10][10+8*i]].join(" ~ ");
				weapontd[4*3+i].innerHTML=["W:",~~(parr[10][3+8*i]*corr[26]),"/H:",~~(parr[10][4+8*i]*corr[27])].join("");
			}
			else{
				weapontd[0*3+i].innerHTML=weapontd[1*3+i].innerHTML=weapontd[2*3+i].innerHTML=weapontd[3*3+i].innerHTML=weapontd[4*3+i].innerHTML="不可";
			}
		}
	}
	
	tab3:{//corr
		var correctiontd=doc.getElementById("CORRECTION").getElementsByTagName('td');
		
		for(i=0;i<28;i++){
			var s=0;
			if(i==4|i==9){ s=(corr[i]>1) ?-1 :(corr[i]<1) ?1 :0; }
			else if(i==12|i==13){ s=(corr[i]>0) ?1 :(corr[i]<0) ?-1 :0; }
			else if(i==20|i==21){ s=(corr[i]) ?1 :0; }
			else{ s=(corr[i]>1) ?1 :(corr[i]<1) ?-1 :0; }
			correctiontd[i].className=["minus","variable","plus"][s+1];
			correctiontd[i].innerHTML=(i==12 || i==13) ?corr[i]+"P" :Math.round((corr[i]-1)*100)+'%';
		}
		correctiontd[20].innerHTML=(corr[20]) ?"-" :"-";
		correctiontd[21].innerHTML=(corr[21]) ?"-" :"-";
	}
	
	tab5:{//graphic
		break tab5;
		var charttd=doc.getElementById("CHART").getElementsByTagName('td');
		var chartth=doc.getElementById("CHART").getElementsByTagName('th');
		
		//color
		for(i=0;i<4;i++){
			chartth[i*2].className=
			chartth[i*2+1].className=
			charttd[i*2].getElementsByTagName('div')[0].className=
			charttd[i*2+1].getElementsByTagName('div')[0].className=weaponclassarr[parr[4+i][5]];
		}
		for(i=0;i<2;i++){
			chartth[(4+i)*2].className=
			chartth[(4+i)*2+1].className=
			charttd[(4+i)*2].getElementsByTagName('div')[0].className=
			charttd[(4+i)*2+1].getElementsByTagName('div')[0].className=weaponclassarr[parr[16+i][5]];
		}
		
		chartth[12].className=
		charttd[12].getElementsByTagName('div')[0].className=weaponclassarr[parr[2][8]];
		
		//height
		
		for(i=0;i<4;i++){
			charttd[i*2].getElementsByTagName('div')[0].style.height=[(parr[4+i][4]>10000) ?100 :~~(parr[4+i][4]/100),"%"].join("");
			charttd[i*2+1].getElementsByTagName('div')[0].style.height=[(parr[4+i][10]>10000) ?100 :~~(parr[4+i][10]/100),"%"].join("");
		}
		for(i=0;i<2;i++){
			charttd[(i+4)*2].getElementsByTagName('div')[0].style.height=[(parr[16+i][4]>10000) ?100 :~~(parr[16+i][4]/100),"%"].join("");
			charttd[(i+4)*2+1].getElementsByTagName('div')[0].style.height=[(parr[16+i][10]>10000) ?100 :~~(parr[16+i][10]/100),"%"].join("");
		}
		charttd[12].getElementsByTagName('div')[0].style.height=[(last_punch>10000) ?100 :~~(last_punch/100),"%"].join("");//punch
		charttd[13].getElementsByTagName('div')[0].style.height=[(last_HP_total>15000) ?100 :~~(last_HP_total/150),"%"].join("");//hp
		charttd[14].getElementsByTagName('div')[0].style.height=[(last_HP_frame>15000) ?100 :~~(last_HP_frame/150),"%"].join("");//fhp
		charttd[15].getElementsByTagName('div')[0].style.height=[(last_HP_inner>15000) ?100 :~~(last_HP_inner/150),"%"].join("");//ihp
		charttd[16].getElementsByTagName('div')[0].style.height=[(EnergyTotal(true)>EnergyCapacity(true)) ?100 :~~(EnergyTotal(true)/EnergyCapacity(true)*100),"%"].join("");//ep
		
		charttd[29].getElementsByTagName('div')[0].style.height=[(last_def_total>12200) ?100 :~~(last_def_total/122),"%"].join("");//def
		charttd[30].getElementsByTagName('div')[0].style.height=[(last_def_total_impulse>12200) ?100 :~~(last_def_total_impulse/122),"%"].join("");//defim
		charttd[31].getElementsByTagName('div')[0].style.height=[(last_def_total_thermal>12200) ?100 :~~(last_def_total_thermal/122),"%"].join("");//defth
		charttd[32].getElementsByTagName('div')[0].style.height=[(WeightTotal(true)/WeightCapacity(true)>1) ?0 :~~((1-(WeightTotal(true)/WeightCapacity(true)))*100),"%"].join("");//weight
		charttd[33].getElementsByTagName('div')[0].style.height=[(WeightTotal(true)>7693) ?100 :~~(WeightTotal(true)/7693*100),"%"].join("");//weight
		
	}
	
}

window.onload=function(){
	def();
	ID("FORM").addEventListener("change", selectformat);
}

function def(){
	console.log(0);
	for(var i=0;i<framearr.length;i++){
		var arr=framearr[i];
		var dic={};
		for(var n=0;n<arr.length;n++){
			var elm=doc.createElement('option');
			elm.innerHTML=arr[n][0];
			if(arr[n][1]=="invisible"){
				elm.style.display="none";
				elm.setAttribute("disabled","disabled");
			}
			else if(arr[n][1]=="disabled"){
				elm.setAttribute("disabled","disabled");
			}
			else{
				elm.value=arr[n][1];
			}
			elm.setAttribute("title",arr[n][2]);
			if(arr[n][3]==null ||arr[n][3]==""){
				selbox[i].appendChild(elm);
			}
			else{
				if(dic[arr[n][3]]==null){
					dic[arr[n][3]]=doc.createElement('optgroup');
					dic[arr[n][3]].setAttribute("label",arr[n][3])
					selbox[i].appendChild(dic[arr[n][3]])
					console.log(arr[n][3]);
				}
				dic[arr[n][3]].appendChild(elm);
			}
		}
	}
}
//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//
var framearr=[
[
	["Jファーカスタム","","アルサレアの士官専用機ヘッド。\n非常にバランスが良い。"],
	["ヤシャ","","ヴァリムの士官専用機ヘッド。\nHPが若干高め。"],
	["Jフェニックス","","アルサレアの次世代機ヘッド。\n熱防御率高め。"],
	["イリア","","細型フレーム採用機。\n耐熱性で軽いがHPが低い。"],
	["Jグラップラー","","アルサレアの格闘戦機ヘッド。\n衝撃防御率高め。"],
	["タルカス","","ヴァリムの重機動機ヘッド。\n装甲が厚いが重い。"],
	["Jキャノン","","アルサレアの支援機ヘッド。\n若干重く消費EP少なめ。"],
	["アポロン","","戦士タイプPF。\n消費EP・重量共に大だが、HPも多い。"],
	["アリス","","リボンが似合う秀逸なデザイン。\n非常に防御力が高い。"],
	["オニ","","ヴァリムの決戦用ヘッド。\n重量の割に防御力が高い。"],
	["Jファー","","アルサレアの現行主力機ヘッド。\nやや省エネできる。"],
	["ヌエ","","ヴァリムの現行主力機ヘッド。\n平均的な性能で使いやすい。"],
	["アルサレアGS","","グレン将軍専用機ヘッド。\n烏帽子のような形が特徴。"],
	["ロック強化ヘッド","","WCSの能力を強化できるヘッド。\nロック時間を短縮できる。"],
	["Jブラスター","","J-フェニックス陸戦型ヘッド。\n消費EPが少ない。"],
	["ロキ","","ヌエの新開発タイプ。\n防御力は低いがHPが高い。"],
	["キシン","","アルサレア要塞攻略戦用PF。\n防御力が高いがHPは低い。"],
	["ヴェタール","","ヴァリムの重機動機ヘッド。\n耐衝撃に優れているが重い。"],
	["オードリー","","細型フレーム採用機。\n耐衝撃に優れるがHPが低い。"],
	["アシュラ","","ヴァリムのエース用ヘッド。\nバランスは良いが重め。"],
	["サーマルヘッド","","機能を特化させた試作ヘッド。\n熱防御に重点を置き強化。"],
	["ライトヘッド","","機能を特化させた試作ヘッド。\n軽量化のみに重点を置いている。"],
	["低EPヘッド","","機能を特化させた試作ヘッド。\nEP消費を極限まで抑えた。"],
	["サイト強化ヘッド","","WCSの能力を強化できるヘッド。\nサイトサイズが広くなる。"],
	["シンザン","バイオゼリー","ヴァリムの特殊部隊専用ヘッド。"],
	["Jアームド","アームドバルカン","アルサレアの最新鋭ヘッド。\n攻撃機能を有する。"],
	["Jファーバルカン","ヘッドマシンガン","Jファーをベースに改造。\n両サイドに取り付けたガトリングが特徴。"],
	["Jメガバスター","メガバスター","Jフェニックスをベースに高出力ビームが発射可能なように改造。"],
	["カルラ","グリーンコロナ","ヤシャをベースに攻撃能力を付加。"],
	["ラセツ","破毒針","オニの口部を開き、兵器を内部に装着した。"],
	["リリス","ダークアイ","両目から怪しい光のビームを放つ！要注意！"],
	["ヘリオス","デスレーザー","額から高出力のエネルギービームを発射可能。"],
	["マリア","ヒトミノカガヤキ","両眼より熱いビームを発射します。"],
	["スサノオ","対PFミサイル","ヴァリム軍、ベリウム専用機用ヘッド。"],
	["Jカイザー","","アルサレアの危険区域専属の特務部隊隊長機用ヘッド。"],
	["ミルク","アイレーザー","熱い視線で内側からダメージを与えます。"],
	["Jポーラヴェア","コールドゼリー","アルサレア極地戦用機用ヘッド。\n口部より特殊レーザー発射可能。"],
],
[
	["Jファーカスタム","","アルサレアの士官専用機メイン。\n非常にバランスが良い。"],
	["ヤシャ","","ヴァリムの士官専用機メイン。\nHPが若干高め。"],
	["Jフェニックス","","アルサレアの次世代機メイン。\n熱防御率高め。"],
	["イリア","","細型フレーム採用機メイン。\n耐熱性で軽いがHPが低い。"],
	["Jグラップラー","","アルサレアの格闘戦機メイン。\n衝撃に強く熱に弱い。"],
	["タルカス","","ヴァリムの重機動機メイン。\nトップクラスの装甲。"],
	["Jキャノン","","アルサレアの支援機メイン。\nやや衝撃に強い。"],
	["アポロン","","戦士タイプPFメイン。\n非常にHPが高い。"],
	["アリス","","クマさん型ブースターが特徴。\n軽いがHPが低い。"],
	["オニ","","ヴァリムの決戦用メイン。\nやや重いが非常に高スペック。"],
	["Jファー","","アルサレアの現行主力機メイン。\nやや省エネできる。"],
	["ヌエ","","ヴァリムの現行主力機メイン。\n平均的な性能で使いやすい。"],
	["アルサレアGS","","グレン将軍専用機メイン。\n若干重いが防御力高め。"],
	["ライトガード","","機能を特化させた試作メイン。\n軽量化を重視。"],
	["Jブラスター","","J-フェニックス陸戦型メイン。\n熱防御力が高い。"],
	["ロキ","","ヌエの新開発タイプ。\n重いがHPと衝撃防御が高い。"],
	["キシン","","アルサレア要塞攻略戦用PF。\n非常に高スペック。"],
	["ヴェタール","","ヴァリムの重機動機メイン。\n耐熱に優れているが重い。"],
	["オードリー","","細型フレーム採用機メイン。\n軽いがHPが低い。"],
	["サーマルガード","","機能を特化させた試作メイン。\n熱防御に重点を置き強化。"],
	["アシュラ","","軽量でHPも高いがEPの消費が大きい。"],
	["シンザン","扇之舞","ヴァリムの特殊部隊専用メイン。\n兵器搭載型メインフレーム。"],
	["Jアームド","コア・バスター","アルサレアの最新鋭メイン。\n攻撃機能を有する。"],
	["Jファーバルカン","ツインマシンガン","Jファーをベースに改造されたメイン。\n攻撃機能を有する。"],
	["Jメガバスター","ハイドロブラスト","熱系兵器を搭載したメインフレーム。"],
	["カルラ","スマートガン","胸部両サイドから機銃攻撃が可能なメインフレーム。"],
	["ラセツ","ダブルキャノン","アルサレアの技術力を応用した兵器搭載型メイン。"],
	["リリス","","内部HP還元率を強化した猫型メインフレーム。"],
	["ヘリオス","レーザーネット","ツヴァルコフ将軍専用PFのメインフレーム。\n内部HP還元率が非常に高い。\n攻撃機能を有する。"],
	["マリア","あやかしの鈴の音","鈴の音で誘導弾を狂わせる、猫型メインフレーム。"],
	["スサノオ","","ヴァリム軍、ベリウム専用PFのメインフレーム。"],
	["Jカイザー","","アルサレアの危険区域専属特務部隊の隊長機用PFのメインフレーム。"],
	["ミルク","","胸が無い分？軽量でEP消費量小。"],
	["Jポーラヴェア","ヴェアバルカン","胸部に兵器を搭載した極地専用機用メインフレーム。"],
],
[
	["Jファーカスタム","","アルサレアの士官専用機アーム。\n非常にバランスが良い。"],
	["ヤシャ","","ヴァリムの士官専用機アーム。\nHPが若干高め。"],
	["Jフェニックス","","アルサレアの次世代機アーム。\n熱防御率やや高め。"],
	["イリア","","細型フレーム採用機アーム。\n軽量で防御力が高い。"],
	["Jグラップラー","","アルサレアの格闘戦機アーム。\n抜群のパンチ力を誇る。"],
	["タルカス","","ヴァリムの重機動機アーム。\n高HPだが重量は、やや重め。"],
	["Jキャノン","","アルサレアの支援機アーム。\n低HPだが抜群の防御力。"],
	["アポロン","","戦士タイプPFアーム。\nパンチ性能が良い。"],
	["アリス","","腕は細いが働きます。\nだってメイドさんだから…。"],
	["オニ","","ヴァリムの決戦用機アーム。\nやや重いが全体的に高スペック。"],
	["Jファー","","アルサレアの現行主力機アーム。\nやや省エネできる。"],
	["ヌエ","","ヴァリムの現行主力機アーム。\n平均的な性能で使いやすい。"],
	["アルサレアGS","","グレン将軍専用機アーム。\n高いパンチ力と適度な防御力。"],
	["イリアα","","軽量化に重点が置かれている。\nEP消費が非常に大きい。"],
	["Jブラスター","","J-フェニックス陸戦型アーム。\n軽量で熱防御力が高い。"],
	["ロキ","","ヌエの新開発タイプ。\n軽量で高防御力だがHPは低い。"],
	["キシン","","アルサレア要塞攻略戦用PF。\n高性能だが若干EP消費多め。"],
	["ヴェタール","","ヴァリムの重機動機アーム。\n高HPだが熱防御は低い。"],
	["オードリー","","細型フレーム採用機アーム。\n耐衝撃性に優れている。"],
	["アシュラ","","軽量でHP・熱防御が高い。\n衝撃防御が低い。"],
	["シンザン","","ヴァリムの特殊部隊専用アーム。"],
	["Jアームド","","アルサレアの最新鋭アーム。\n防御力を強化。"],
	["Jファーバルカン","","アルサレアの近接格闘機用アーム。\nパンチは、内部破壊の攻撃属性。"],
	["Jメガバスター","","遠距離支援型PFのため、軽量化を意識した設計。"],
	["カルラ","","ヴァリムの空中戦機アーム。\nパンチは兵器破壊能力を持つ。"],
	["ラセツ","","攻撃を重視した設計。\nパンチ破壊力は絶大。"],
	["リリス","","細身の軽量低消費EP型アーム。"],
	["ヘリオス","","戦士タイプPFアーム。\n高い防御力を備えたアーム。"],
	["マリア","","猫の手も借りたい。\nそんなあなたに！"],
	["スサノオ","","ヴァリム軍、ベリウム専用機用PFのアーム。"],
	["Jカイザー","","アルサレアの危険区域専属特務部隊の隊長機用PFのアーム。"],
	["ミルク","","腕っ節には自信があります！"],
	["Jポーラヴェア","","極地戦専用PF用アーム。\nパンチ攻撃力、軽量化重視。\nEP消費率大。"],
],
[
	["Jファーカスタム","","非常にバランスが良い。\nジャンプ開始が若干遅い。"],
	["ヤシャ","","クセがなく使いやすい。\nHPが若干高めでやや滑る。"],
	["Jフェニックス","","ジャンプ時の瞬発力が良いが、旋回速度が遅い。\nウィング装備時に補正有り。"],
	["イリア","","歩行速度と旋回が速い。\n非常に滑りやすい。"],
	["Jグラップラー","","旋回は速いが歩行が遅い。\n衝撃に強く熱に弱い。"],
	["タルカス","","高いHPと積載量を誇る。\n歩行が遅い。"],
	["Jキャノン","","旋回性に優れ重量級。\nHP、防御力共に優れている。"],
	["アポロン","","積載量は高いが歩行が遅く、ほとんどジャンプできない。"],
	["アリス","","キビキビと働きます。\nでも荷物はあまり持てません。"],
	["オニ","","高めの積載量・適度な防御力とジャンプで高性能。"],
	["Jファー","","アルサレアの現行主力機レッグ。\nやや省エネできる。"],
	["ヌエ","","非常にジャンプ能力は悪いが、他は平均的な性能。"],
	["アルサレアGS","","若干歩行速度が遅いものの素直な性能で使いやすい。"],
	["超軽量レッグ","","軽量化を重視したレッグ。\n熱防御は高いが低EP。"],
	["フロッグ","","非常に高いジャンプ性能を有する。\nクセが強く歩行が遅い。"],
	["ロキ","","軽量だがHPが低い。\n防御力も高いが歩行が若干遅い。"],
	["キシン","","全体的に高性能だが滑りやすく、ジャンプ速度が遅い。"],
	["ヴェタール","","非常に重装甲だが歩行が遅い。\nジャンプ性能が良い。"],
	["オードリー","","歩行速度・旋回が速い。\nジャンプ性能も良い。"],
	["スリッド","","滑りやすい加工を施したレッグ。\nジャンプ開始が遅い。"],
	["Jブラスター","","積載量が多く歩行は遅い。\nジャンプ性能は悪い。"],
	["ストロング","","全体的に防御力が高いが、ジャンプ能力がない。"],
	["ウォーク","","全体的に機能が高いが、ジャンプ能力がない。"],
	["アシュラ","","歩行が速く熱防御が高い。\nほとんどジャンプできない。"],
	["シンザン","","ジャンプ速度に優れた機動性重視型レッグ。"],
	["Jアームド","","レッグの性能が全体的に若干劣るが積載能力が高い。"],
	["Jファーバルカン","","ジャンプ機能に超低速上昇機構を搭載した試験型レッグ。"],
	["Jメガバスター","","兵器の反動に耐えられるようにグリップ面を強化。"],
	["カルラ","","空中戦東洋に空気抵抗を考慮された設計。\nウィング装備時に補正有り。"],
	["ラセツ","","跳躍力が異常に優れたレッグ。"],
	["リリス","","機動性を維持しつつ、防御力を強化。"],
	["ヘリオス","","EP消費率は高いが、耐熱属性に優れている。\n積載量を強化。"],
	["マリア","","バネを持った機動性に優れたレッグ。\nしっぽでバランスをとる。"],
	["スサノオ","","ヴァリム軍、ベリウム専用機用レッグ。"],
	["Jカイザー","","アルサレアの危険区域専属特務部隊の隊長機用レッグ。"],
	["ミルク","","肉球でグリップ力を強化。\n小回りも利く運動性の優れたレッグ。"],
	["Jポーラヴェア","","極地戦用に開発されたレッグ。\nグリップ力、積載量強化。"],
],
[
	["解除","","装備なし。"],
	["ショットガン","","弾が5つに拡散する。\n広範囲に対しての攻撃が可能。","ノーマル"],
	["バスターランチャー","","強力な波動砲。\nエネルギー消費が激しい。","ノーマル"],
	["スマートガン","","PF用のスマートガン。\n連射は遅いが一発の威力は大。","ノーマル"],
	["レーザーピストル","","地形反射レーザーを発射。\n使用時にエネルギーを消費する。","ノーマル"],
	["サブマシンガン","","一発の威力は低いが、弾速が速く連射も効く。","ノーマル"],
	["バズーカ","","高い攻撃力と爆風で敵を圧倒。\nただし弾数が少ない。","ノーマル"],
	["グレネードランチャー","","追尾グレネード弾発射装置。\n効火力だが重い。","ノーマル"],
	["サーマルプラズマライフル","","熱プラズマ弾発射ライフル。\nエネルギー切れに注意！","ノーマル"],
	["フローティングマイン","","浮遊機雷発射装置。\n大量にバラまいて使う。","ノーマル"],
	["デッキブラシ","","アリスの基本装備。\n汚れた世界をキレイにしよう。","ノーマル"],
	["レーザーソード","","PFの代表的接近戦兵器。\nエネルギーが切れると使えない。","ノーマル"],
	["カタナ","","夜叉シリーズの代表的装備。\nエネルギーが切れても使える。","ノーマル"],
	["レーザースピア","","命中範囲の広い接近用兵器。\nふり回して使う。","ノーマル"],
	["カタール","","振るタイプの近接兵器。\nスピア系より軽量。","ノーマル"],
	["カイザーナックル","","アームフレームの攻撃力+αのダメージを与える。","ノーマル"],
	["パイルバンカー","","敵に杭を打ち込む接近戦兵器。\n強力だが重い。","ノーマル"],
	["クラブ","","PF用の棍棒。\n当てると対象がふっ飛ぶ。","ノーマル"],
	["アシッドスプレー","","混ぜると危険。\n悪いヤツラは掃除しちゃうぞ。","ノーマル"],
	["斬馬刀","","大型の剣。\n通称斬馬刀。\n攻撃力が高いが振りが遅い。","ノーマル"],
	["ウィングシールド","","大型のシールド。\nガードにより機体ダメージを軽減させる。","ノーマル"],
	["Vシールド","","開閉型シールド。\nガードにより機体ダメージを軽減させる。","ノーマル"],
	["ヴィクトリアウェーブ","","誘導ミサイルかく乱兵器。\n誘導制御装置を狂わせターゲットを敵に変更する。\n装備したまま両手使用兵器を扱える。","ノーマル"],
	["ビックフォーン","","タックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["アサシンファング","","巨大な刃が特徴的なタックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ドリルアーム","","ドリルによる体当たり攻撃で敵にダメージを与える。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ダークネスサァイフ","","なぎ払い型の大鎌。\nモーションが大きいが広範囲の攻撃が可。\n両手使用兵器。","ノーマル"],
	["クイーンネイル","","頭上振り下ろし型の大鎌。\nモーションが大きいが、攻撃力大。\n両手使用兵器。","ノーマル"],
	["ヤミフブキ","","手裏剣型の弾を射出する。\n速射性に優れている。\n両手使用兵器。","ノーマル"],
	["猫のツメ","","鋭いツメで相手を切り裂く！アームフレームの攻撃力+αのダメージを与える。","ノーマル"],
	["P・クロウ","","ツメにより敵を切り裂く。\nツメはもちろん出し入れ可能。","ノーマル"],
	["X.ハンマー","","大型のハンマー。\n当たれば致命傷となる。","ノーマル"],
	["シラギク","","非常に軽いカタナ。\n若干速く振ることができる。","ノーマル"],
	["インパルススピア","","長いリーチを活かし突きによる攻撃を行う。\n打撃系スピア。","ノーマル"],
	["レディーレイピア","","突きにより装甲の薄い隙間をねらい攻撃する。","ノーマル"],
	["シノビザクラ","","試作的兵器。\n特殊能力があるとの噂もある。","ノーマル"],
	["双斬破","","二刀流のために作られた剣。\n正しい装備で能力を発揮！","ノーマル"],
	["ノーマルサック","","軽量ショートレンジタイプのタックル系攻撃兵器。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ビッグプレート","","ダメージ完全吸収タイプのシールド。\nかなりの重量だが、吸収タイプでは耐久度が高い。\n構えまでの反応速度が一番遅い。","ノーマル"],
	["アームドシールド","","エネルギーを消費する代わりに軽量化に成功した。\nダメージ完全吸収タイプのシールド。","ノーマル"],
	["カイザーシールド","","ダメージ完全吸収タイプの軽量シールド。\n両手専用兵器に対応。","ノーマル"],
	["ブレイクショットガン","","弾が3つに拡散する。\n武器破壊専用兵器。","カスタム"],
	["S・スマートガン","","兵器破壊用に改良されたスマートガン。\n連射は遅いが一発の威力は大。","カスタム"],
	["レーザーアロー","","地形反射レーザーを発射。\n改造により攻撃力と弾速度を強化。","カスタム"],
	["レーザーマシンガン","","破壊力があり連射性も高い。\nエネルギー消費に注意。","カスタム"],
	["パンツァーシュレック","","低速だが破壊力が大。\n直撃時のダメージはすさまじい。","カスタム"],
	["ネットランチャー","","同時に複数弾の発射が可能。\n標的を包み込むような軌道をえがく。\n追尾性にくせがある。","カスタム"],
	["ディスポーザブルライフル","","高熱プラズマ弾発射ライフル。\n高エネルギーのため数発が限度。\n使い捨て兵器。","カスタム"],
	["フローティングマイン改","","浮遊機雷発射装置。\n追尾精度と破壊力を強化。","カスタム"],
	["フォースソード","","前線の兵士の要望により開発。\n攻撃時自動ブースター発動。\nレッグモーター加速補正対象兵器。","カスタム"],
	["ミチザネ","","攻撃時自動ブースター発動。\n攻撃時エネルギーを消費する。\nレッグモーター加速補正対象兵器。","カスタム"],
	["レーザースピア改","","使用するPFを選ぶ。\n特定PF専用レーザースピア。","カスタム"],
	["レーザーカタール","","エネルギー系カタール。\n熱属性の攻撃を与える。","カスタム"],
	["ゴッド・カイザー","","アームフレームの攻撃力+αのダメージを与える。\n激しい衝撃でPF内部にダメージを与える！","カスタム"],
	["ヒートパイルバンカー","","エネルギー系パイルバンカー。\n高熱の杭を打ち込む。","カスタム"],
	["ヒートクラブ","","クラブよりも強力だが、やや振りが遅くなる。","カスタム"],
	["エクスカリヴァ","","伝説の大型剣。\n攻撃力が高いが耐久度に不安が残る。\n片手専用兵器。","カスタム"],
	["ヴィクトリアルウェーブ2","","改良を加え、敵に送り返す際の誘導性能を大幅に増幅する。\nただし、性能と引き換えに耐久度が犠牲になっている。\n装備したまま両手使用兵器を扱える。","カスタム"],
	["アームドライトピック","","タックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\n軽量化に重点を置いた設計。","カスタム"],
	["死人鎌","","なぎ払い型の大鎌。\nPFに対する攻撃力は低下したものの兵器に対する破壊力は絶大。\n片手での装備が可能","カスタム"],
	["ブーストサァイフ","","攻撃時自動ブースターを発動でき、片手での装備が可能。\nレッグモーター加速補正対象兵器。","カスタム"],
	["シャドーガントレット","","手裏剣型の弾を射出する篭手。\n連射性を若干抑え、攻撃力を強化。\n両手使用兵器。","カスタム"],
	["X.ハンマー2","","大型のハンマー。\n改良を加え大幅に攻撃力UP！重量と、少々もろいのが欠点。\n片手専用兵器。","カスタム"],
	["妖邪刀","","全体をエネルギーコーティング。\n怪しい光を放つカタナ。","カスタム"],
	["インブレイクスピア","","長いリーチを活かし突きによる攻撃を行う。\n内部HPに対して大きなダメージを与える！","カスタム"],
	["光牙","","非常に攻撃力の高いカタナ。\nそのため一戦闘で一撃のみ可。","カスタム"],
	["真・双斬破","","二刀流のために作られた剣。\n一本でも破壊されるとPFの能力に異常をきたす。\n両手専用兵器。","カスタム"],
	["スパークフック","","パンチ攻撃補助兵器。\nアームフレームの攻撃力+αのダメージを与える。\n破壊力は絶大だが、非常にもろい。","カスタム"],
	["スイングソード","","耐久度が低いが、軽量で攻撃力も高い。","カスタム"],
	["レーザーライフル","","電磁砲弾を発射するライフル型兵器。\n強力だがエネルギー消費が大きい。","カスタム"],
	["ハンドMLRS","","多連装ロケットシステム、MLRSを腕部兵器として改造。\n6発までロック可能。","カスタム"],
],
[
	["解除","","装備なし。"],
	["ショットガン","","弾が5つに拡散する。\n広範囲に対しての攻撃が可能。","ノーマル"],
	["バスターランチャー","","強力な波動砲。\nエネルギー消費が激しい。","ノーマル"],
	["スマートガン","","PF用のスマートガン。\n連射は遅いが一発の威力は大。","ノーマル"],
	["レーザーピストル","","地形反射レーザーを発射。\n使用時にエネルギーを消費する。","ノーマル"],
	["サブマシンガン","","一発の威力は低いが、弾速が速く連射も効く。","ノーマル"],
	["バズーカ","","高い攻撃力と爆風で敵を圧倒。\nただし弾数が少ない。","ノーマル"],
	["グレネードランチャー","","追尾グレネード弾発射装置。\n効火力だが重い。","ノーマル"],
	["サーマルプラズマライフル","","熱プラズマ弾発射ライフル。\nエネルギー切れに注意！","ノーマル"],
	["フローティングマイン","","浮遊機雷発射装置。\n大量にバラまいて使う。","ノーマル"],
	["デッキブラシ","","アリスの基本装備。\n汚れた世界をキレイにしよう。","ノーマル"],
	["レーザーソード","","PFの代表的接近戦兵器。\nエネルギーが切れると使えない。","ノーマル"],
	["カタナ","","夜叉シリーズの代表的装備。\nエネルギーが切れても使える。","ノーマル"],
	["レーザースピア","","命中範囲の広い接近用兵器。\nふり回して使う。","ノーマル"],
	["カタール","","振るタイプの近接兵器。\nスピア系より軽量。","ノーマル"],
	["カイザーナックル","","アームフレームの攻撃力+αのダメージを与える。","ノーマル"],
	["パイルバンカー","","敵に杭を打ち込む接近戦兵器。\n強力だが重い。","ノーマル"],
	["クラブ","","PF用の棍棒。\n当てると対象がふっ飛ぶ。","ノーマル"],
	["アシッドスプレー","","混ぜると危険。\n悪いヤツラは掃除しちゃうぞ。","ノーマル"],
	["斬馬刀","","大型の剣。\n通称斬馬刀。\n攻撃力が高いが振りが遅い。","ノーマル"],
	["ウィングシールド","","大型のシールド。\nガードにより機体ダメージを軽減させる。","ノーマル"],
	["Vシールド","","開閉型シールド。\nガードにより機体ダメージを軽減させる。","ノーマル"],
	["ヴィクトリアウェーブ","","誘導ミサイルかく乱兵器。\n誘導制御装置を狂わせターゲットを敵に変更する。\n装備したまま両手使用兵器を扱える。","ノーマル"],
	["ビックフォーン","","タックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["アサシンファング","","巨大な刃が特徴的なタックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ドリルアーム","","ドリルによる体当たり攻撃で敵にダメージを与える。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ダークネスサァイフ","","なぎ払い型の大鎌。\nモーションが大きいが広範囲の攻撃が可。\n両手使用兵器。","ノーマル"],
	["クイーンネイル","","頭上振り下ろし型の大鎌。\nモーションが大きいが、攻撃力大。\n両手使用兵器。","ノーマル"],
	["ヤミフブキ","","手裏剣型の弾を射出する。\n速射性に優れている。\n両手使用兵器。","ノーマル"],
	["猫のツメ","","鋭いツメで相手を切り裂く！アームフレームの攻撃力+αのダメージを与える。","ノーマル"],
	["P・クロウ","","ツメにより敵を切り裂く。\nツメはもちろん出し入れ可能。","ノーマル"],
	["X.ハンマー","","大型のハンマー。\n当たれば致命傷となる。","ノーマル"],
	["シラギク","","非常に軽いカタナ。\n若干速く振ることができる。","ノーマル"],
	["インパルススピア","","長いリーチを活かし突きによる攻撃を行う。\n打撃系スピア。","ノーマル"],
	["レディーレイピア","","突きにより装甲の薄い隙間をねらい攻撃する。","ノーマル"],
	["シノビザクラ","","試作的兵器。\n特殊能力があるとの噂もある。","ノーマル"],
	["双斬破","","二刀流のために作られた剣。\n正しい装備で能力を発揮！","ノーマル"],
	["ノーマルサック","","軽量ショートレンジタイプのタックル系攻撃兵器。\nレッグモーター加速補正対象兵器。","ノーマル"],
	["ビッグプレート","","ダメージ完全吸収タイプのシールド。\nかなりの重量だが、吸収タイプでは耐久度が高い。\n構えまでの反応速度が一番遅い。","ノーマル"],
	["アームドシールド","","エネルギーを消費する代わりに軽量化に成功した。\nダメージ完全吸収タイプのシールド。","ノーマル"],
	["カイザーシールド","","ダメージ完全吸収タイプの軽量シールド。\n両手専用兵器に対応。","ノーマル"],
	["ブレイクショットガン","","弾が3つに拡散する。\n武器破壊専用兵器。","カスタム"],
	["S・スマートガン","","兵器破壊用に改良されたスマートガン。\n連射は遅いが一発の威力は大。","カスタム"],
	["レーザーアロー","","地形反射レーザーを発射。\n改造により攻撃力と弾速度を強化。","カスタム"],
	["レーザーマシンガン","","破壊力があり連射性も高い。\nエネルギー消費に注意。","カスタム"],
	["パンツァーシュレック","","低速だが破壊力が大。\n直撃時のダメージはすさまじい。","カスタム"],
	["ネットランチャー","","同時に複数弾の発射が可能。\n標的を包み込むような軌道をえがく。\n追尾性にくせがある。","カスタム"],
	["ディスポーザブルライフル","","高熱プラズマ弾発射ライフル。\n高エネルギーのため数発が限度。\n使い捨て兵器。","カスタム"],
	["フローティングマイン改","","浮遊機雷発射装置。\n追尾精度と破壊力を強化。","カスタム"],
	["フォースソード","","前線の兵士の要望により開発。\n攻撃時自動ブースター発動。\nレッグモーター加速補正対象兵器。","カスタム"],
	["ミチザネ","","攻撃時自動ブースター発動。\n攻撃時エネルギーを消費する。\nレッグモーター加速補正対象兵器。","カスタム"],
	["レーザースピア改","","使用するPFを選ぶ。\n特定PF専用レーザースピア。","カスタム"],
	["レーザーカタール","","エネルギー系カタール。\n熱属性の攻撃を与える。","カスタム"],
	["ゴッド・カイザー","","アームフレームの攻撃力+αのダメージを与える。\n激しい衝撃でPF内部にダメージを与える！","カスタム"],
	["ヒートパイルバンカー","","エネルギー系パイルバンカー。\n高熱の杭を打ち込む。","カスタム"],
	["ヒートクラブ","","クラブよりも強力だが、やや振りが遅くなる。","カスタム"],
	["エクスカリヴァ","","伝説の大型剣。\n攻撃力が高いが耐久度に不安が残る。\n片手専用兵器。","カスタム"],
	["ヴィクトリアルウェーブ2","","改良を加え、敵に送り返す際の誘導性能を大幅に増幅する。\nただし、性能と引き換えに耐久度が犠牲になっている。\n装備したまま両手使用兵器を扱える。","カスタム"],
	["アームドライトピック","","タックル系攻撃兵器。\n体当たりして相手を吹っ飛ばす。\n軽量化に重点を置いた設計。","カスタム"],
	["死人鎌","","なぎ払い型の大鎌。\nPFに対する攻撃力は低下したものの兵器に対する破壊力は絶大。\n片手での装備が可能","カスタム"],
	["ブーストサァイフ","","攻撃時自動ブースターを発動でき、片手での装備が可能。\nレッグモーター加速補正対象兵器。","カスタム"],
	["シャドーガントレット","","手裏剣型の弾を射出する篭手。\n連射性を若干抑え、攻撃力を強化。\n両手使用兵器。","カスタム"],
	["X.ハンマー2","","大型のハンマー。\n改良を加え大幅に攻撃力UP！重量と、少々もろいのが欠点。\n片手専用兵器。","カスタム"],
	["妖邪刀","","全体をエネルギーコーティング。\n怪しい光を放つカタナ。","カスタム"],
	["インブレイクスピア","","長いリーチを活かし突きによる攻撃を行う。\n内部HPに対して大きなダメージを与える！","カスタム"],
	["光牙","","非常に攻撃力の高いカタナ。\nそのため一戦闘で一撃のみ可。","カスタム"],
	["真・双斬破","","二刀流のために作られた剣。\n一本でも破壊されるとPFの能力に異常をきたす。\n両手専用兵器。","カスタム"],
	["スパークフック","","パンチ攻撃補助兵器。\nアームフレームの攻撃力+αのダメージを与える。\n破壊力は絶大だが、非常にもろい。","カスタム"],
	["スイングソード","","耐久度が低いが、軽量で攻撃力も高い。","カスタム"],
	["レーザーライフル","","電磁砲弾を発射するライフル型兵器。\n強力だがエネルギー消費が大きい。","カスタム"],
	["ハンドMLRS","","多連装ロケットシステム、MLRSを腕部兵器として改造。\n6発までロック可能。","カスタム"],
],
[
	["解除","","装備なし。"],
	["キャノン","","砲弾を発射する。\n非常に強力だが弾数が少ない。","ノーマル"],
	["モーターキャノン","","打ち上げ型の曲射弾道兵器。\n弾は放物線を描いて敵へ向かう。","ノーマル"],
	["レールキャノン","","電磁砲弾を発射する。\n強力だがエネルギー消費が大きい。","ノーマル"],
	["スライスカッター","","敵を切り裂く光輪を発射する。\n追尾性能あり。","ノーマル"],
	["ガトリング","","実弾の連射兵器。\nマシンガンの代わりに使える。","ノーマル"],
	["MLRS","","多連装ロケットシステム。\n6発までロックオン可能。","ノーマル"],
	["AAFミサイル","","追尾性能の高いミサイル。\n実弾のため迎撃される場合がある。","ノーマル"],
	["ウィング","","飛行時のエネルギー消費を軽減。\n空中戦向き。","ノーマル"],
	["対PFミサイル","","対PF用に開発されたミサイル。\n中遠距離において強力追尾。","ノーマル"],
	["ファーフレア","","遠距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["クラッカーボム","","目くらまし＆回避用。\n間合いをあける効果もある。","ノーマル"],
	["パワーモーター","","曲射弾道兵器。\n爆風の範囲が広い。","ノーマル"],
	["ニアフレア","","遠距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["高熱照明弾","","高熱照明弾。\n上空より落下死空中で爆発。","ノーマル"],
	["ミドルフレア","","中距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["スパイダー","","誘導ミサイル迎撃専用ミサイル。\n全ロックシステムが強制変更。","ノーマル"],
	["Sショット","","肩装備用ショットガン。\n威力は低いが連射性はよい。","ノーマル"],
	["ヘルファイア","","超高熱破壊兵器。\n存在するものすべてを抹殺する悪魔の兵器。","ノーマル"],
	["フライキラー","","対空迎撃用ミサイル。\n直上広範囲を攻撃。","ノーマル"],
	["ミサイルショット","","誘導ミサイル迎撃専用マシンガン。\n全ロックシステムが強制変更。","ノーマル"],
	["カウンターリング","","誘導ミサイルかく乱兵器。\n誘導制御装置を狂わせターゲットを敵に変更する。","ノーマル"],
	["プロポシブルキラー","","誘導ミサイルの推進力を奪う特殊電波兵器。\n電波に接触したミサイルは超低速移動となる","ノーマル"],
	["エキスプロードウェーブ","","誘導ミサイル誘爆用電波兵器。\nリング状の電波内を通過した誘導弾は誘導弾は爆発する。","ノーマル"],
	["十文字大手裏剣","disabled","大型手裏剣。\n大きな軌道を描きながら高い誘導性能で獲物を捕らえる。\n右肩部のみ装備可能。","ノーマル"],
	["エンジェルウィング","","天使の羽。","ノーマル"],
	["鬼眼光","","強力な波動ビームを発射。\n両肩専用兵器。\n細身のフレーム装備不可。","ノーマル"],
	["キャノン改","","キャノンを兵器破壊系兵器に改造。\n弾数は、増加したが壊れやすい。","カスタム"],
	["モーターキャノン2","","内部破壊系のモーターキャノン。\n誘導性能や攻撃力が強化されている。","カスタム"],
	["マスターキャノン","","兵器に対して大ダメージを与えられる。\n強力だが非常に壊れやすい。","カスタム"],
	["オローラカッター","","敵を切り裂く光輪を同時に複数発射する。\n特殊な軌道の誘導性能を持つ。\n内部破壊に適している。","カスタム"],
	["ガトリング2","","実弾の連射兵器。\n連射性を犠牲にして攻撃力を強化。","カスタム"],
	["MLRS-2","","多連装ロケットシステム。\n6発までロック可能。\n弾速が若干低下したが誘導精度が強化されている。","カスタム"],
	["AAFミサイル改","","追尾性能の高いミサイル。\nAAFミサイルを改良し最大同時発射数、誘導性能を増加。\n弾数を減らし軽量化している。","カスタム"],
	["シャドーウィング","","飛行時のエネルギー消費を軽減。\n空中戦向き。\nウィングよりも全体的に性能がUPしている。","カスタム"],
	["ツインスネイク","","対PF兵器破壊用に開発されたミサイル。\n改良により最大同時発射数が倍に！中遠距離において強力追尾。","カスタム"],
	["ファーフレア2","","遠距離起爆ミサイル。\n改造により飛距離と攻撃力が増加。\n一定時間経過後自動爆発。","カスタム"],
	["スキャラクラッカー","","目くらまし＆回避用。\n間合いをあける効果もある。\n改造により爆風範囲が増大。","カスタム"],
	["パワーモータープラス","","曲射弾道兵器。\n爆風の範囲を狭め攻撃力をプラス。","カスタム"],
	["ニアフレア2","","近距離。\n起爆ミサイル。\n弾速をUPし爆発時間を短く改造。\n一定時間経過後自動爆発。","カスタム"],
	["高熱照明弾2","","高熱照明弾を改造し弾数、攻撃力がUP。\n上空より落下し空中で爆発。","カスタム"],
	["ミドルフレア2","","中距離起爆ミサイル。\n弾数を減らし耐久度を落とす事で軽量化。\n一定時間経過後自動爆発。","カスタム"],
	["スパイダー軽量型","","誘導ミサイル迎撃専用ミサイル。\n頭胸部兵器には、ロックシステムの強制変更の影響なし。","カスタム"],
	["Sショット2","","肩装備用ショットガン。\n改造により同時発射数が増加。","カスタム"],
	["フライキラー2","","対空迎撃用ミサイル。\n直上広範囲を攻撃。\n改造により爆風範囲と攻撃力が強化。","カスタム"],
	["ミサイルショット改","","誘導ミサイル迎撃専用マシンガン。\n頭胸部兵器には、ロックシステムの強制変更の影響なし。","カスタム"],
	["クロスブーメラン","disabled","大型手裏剣。\n投てき後の手裏剣の強度を強化。\n攻撃力が若干低下したがその分軽量化に成功。\n右肩部のみ装備可能。","カスタム"],
	["弾数補充型パック","","装備することで積載量が若干軽減される。\n通常射撃の方法で補給が可能。\n残弾数・兵器HP回復用バックパック。","カスタム"],
	["HP回復型パック","","装備することで積載量が若干軽減される。\n通常射撃の方法で補給が可能。\nHP回復用バックパック。","カスタム"],
],
[
	["解除","","装備なし。"],
	["キャノン","","砲弾を発射する。\n非常に強力だが弾数が少ない。","ノーマル"],
	["モーターキャノン","","打ち上げ型の曲射弾道兵器。\n弾は放物線を描いて敵へ向かう。","ノーマル"],
	["レールキャノン","","電磁砲弾を発射する。\n強力だがエネルギー消費が大きい。","ノーマル"],
	["スライスカッター","","敵を切り裂く光輪を発射する。\n追尾性能あり。","ノーマル"],
	["ガトリング","","実弾の連射兵器。\nマシンガンの代わりに使える。","ノーマル"],
	["MLRS","","多連装ロケットシステム。\n6発までロックオン可能。","ノーマル"],
	["AAFミサイル","","追尾性能の高いミサイル。\n実弾のため迎撃される場合がある。","ノーマル"],
	["ウィング","","飛行時のエネルギー消費を軽減。\n空中戦向き。","ノーマル"],
	["対PFミサイル","","対PF用に開発されたミサイル。\n中遠距離において強力追尾。","ノーマル"],
	["ファーフレア","","遠距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["クラッカーボム","","目くらまし＆回避用。\n間合いをあける効果もある。","ノーマル"],
	["パワーモーター","","曲射弾道兵器。\n爆風の範囲が広い。","ノーマル"],
	["ニアフレア","","遠距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["高熱照明弾","","高熱照明弾。\n上空より落下死空中で爆発。","ノーマル"],
	["ミドルフレア","","中距離起爆ミサイル。\n一定時間経過後自動爆発。","ノーマル"],
	["スパイダー","","誘導ミサイル迎撃専用ミサイル。\n全ロックシステムが強制変更。","ノーマル"],
	["Sショット","","肩装備用ショットガン。\n威力は低いが連射性はよい。","ノーマル"],
	["ヘルファイア","","超高熱破壊兵器。\n存在するものすべてを抹殺する悪魔の兵器。","ノーマル"],
	["フライキラー","","対空迎撃用ミサイル。\n直上広範囲を攻撃。","ノーマル"],
	["ミサイルショット","","誘導ミサイル迎撃専用マシンガン。\n全ロックシステムが強制変更。","ノーマル"],
	["カウンターリング","","誘導ミサイルかく乱兵器。\n誘導制御装置を狂わせターゲットを敵に変更する。","ノーマル"],
	["プロポシブルキラー","","誘導ミサイルの推進力を奪う特殊電波兵器。\n電波に接触したミサイルは超低速移動となる","ノーマル"],
	["エキスプロードウェーブ","","誘導ミサイル誘爆用電波兵器。\nリング状の電波内を通過した誘導弾は誘導弾は爆発する。","ノーマル"],
	["十文字大手裏剣","","大型手裏剣。\n大きな軌道を描きながら高い誘導性能で獲物を捕らえる。\n右肩部のみ装備可能。","ノーマル"],
	["エンジェルウィング","","天使の羽。","ノーマル"],
	["鬼眼光","","強力な波動ビームを発射。\n両肩専用兵器。\n細身のフレーム装備不可。","ノーマル"],
	["キャノン改","","キャノンを兵器破壊系兵器に改造。\n弾数は、増加したが壊れやすい。","カスタム"],
	["モーターキャノン2","","内部破壊系のモーターキャノン。\n誘導性能や攻撃力が強化されている。","カスタム"],
	["マスターキャノン","","兵器に対して大ダメージを与えられる。\n強力だが非常に壊れやすい。","カスタム"],
	["オローラカッター","","敵を切り裂く光輪を同時に複数発射する。\n特殊な軌道の誘導性能を持つ。\n内部破壊に適している。","カスタム"],
	["ガトリング2","","実弾の連射兵器。\n連射性を犠牲にして攻撃力を強化。","カスタム"],
	["MLRS-2","","多連装ロケットシステム。\n6発までロック可能。\n弾速が若干低下したが誘導精度が強化されている。","カスタム"],
	["AAFミサイル改","","追尾性能の高いミサイル。\nAAFミサイルを改良し最大同時発射数、誘導性能を増加。\n弾数を減らし軽量化している。","カスタム"],
	["シャドーウィング","","飛行時のエネルギー消費を軽減。\n空中戦向き。\nウィングよりも全体的に性能がUPしている。","カスタム"],
	["ツインスネイク","","対PF兵器破壊用に開発されたミサイル。\n改良により最大同時発射数が倍に！中遠距離において強力追尾。","カスタム"],
	["ファーフレア2","","遠距離起爆ミサイル。\n改造により飛距離と攻撃力が増加。\n一定時間経過後自動爆発。","カスタム"],
	["スキャラクラッカー","","目くらまし＆回避用。\n間合いをあける効果もある。\n改造により爆風範囲が増大。","カスタム"],
	["パワーモータープラス","","曲射弾道兵器。\n爆風の範囲を狭め攻撃力をプラス。","カスタム"],
	["ニアフレア2","","近距離。\n起爆ミサイル。\n弾速をUPし爆発時間を短く改造。\n一定時間経過後自動爆発。","カスタム"],
	["高熱照明弾2","","高熱照明弾を改造し弾数、攻撃力がUP。\n上空より落下し空中で爆発。","カスタム"],
	["ミドルフレア2","","中距離起爆ミサイル。\n弾数を減らし耐久度を落とす事で軽量化。\n一定時間経過後自動爆発。","カスタム"],
	["スパイダー軽量型","","誘導ミサイル迎撃専用ミサイル。\n頭胸部兵器には、ロックシステムの強制変更の影響なし。","カスタム"],
	["Sショット2","","肩装備用ショットガン。\n改造により同時発射数が増加。","カスタム"],
	["フライキラー2","","対空迎撃用ミサイル。\n直上広範囲を攻撃。\n改造により爆風範囲と攻撃力が強化。","カスタム"],
	["ミサイルショット改","","誘導ミサイル迎撃専用マシンガン。\n頭胸部兵器には、ロックシステムの強制変更の影響なし。","カスタム"],
	["クロスブーメラン","","大型手裏剣。\n投てき後の手裏剣の強度を強化。\n攻撃力が若干低下したがその分軽量化に成功。\n右肩部のみ装備可能。","カスタム"],
	["弾数補充型パック","","装備することで積載量が若干軽減される。\n通常射撃の方法で補給が可能。\n残弾数・兵器HP回復用バックパック。","カスタム"],
	["HP回復型パック","","装備することで積載量が若干軽減される。\n通常射撃の方法で補給が可能。\nHP回復用バックパック。","カスタム"],
],
[
	["ダグザ","","PFの初期型ユニット。\n出力は小さいが軽い。"],
	["ヌザ","","初期型の出力と最大EPを増加。\n回復スピードも若干向上。"],
	["ルーフ","","エネルギー回復が早い。\n他の性能も使いやすい。"],
	["マクリル","","出力とレッドゾーンが大きい。\n回復スピードが遅い。"],
	["ディアン","","最大EPは高いが出力が低い。\n回復が若干遅め。"],
	["ゴヴニュ","","バランスは良いが重い。\n積載量に余裕が無いと積めない。"],
	["ダグザH","","出力・最大EP共に高いが、重く回復スピードも遅い。"],
	["ヌザ2","","最大出力を誇るがEPが低く、回復スピードも悪い。"],
	["ルーフX","","非常に回復力が良い。\n出力は低いが最大EPは高め。"],
	["アン","","出力は小さいが回復が早め。\nレッドゾーンが大きい。"],
	["ルーフM","","最大EPが最も高い。\n回復は最低ランク。"],
	["ディアL","","軽量化に特化している。\n出力が犠牲になっている。"],
	["ルアルヌ","","最大EPが高い。\n出力はやや劣るが、回復力でカバーしている。"],
	["ヴグザス","","出力は高いが、最大EPは最低。\n回復力がやや気になる。\nあらゆるHMが使用不可。"],
],
[
	["ミディール","","PFの標準的ブースター。\n軽量で適度な速度。"],
	["オイガス","","ミディールの改良型。\n全体的に向上している。"],
	["オガム","","減重力時対応型。\n最高速度、加速度向上に伴い、消費EPが増加。"],
	["オグマ","","減重力時対応型。\nバランスが良い。\n加速力が若干高い。"],
	["ヴァハ","","減重力時対応型。\n次世代型のプロトタイプ。\n使いやすく実用的。"],
	["ボアン","","過重力時対応型。\n消費EPの割に最高速が出る。\nただし重い。"],
	["ミディー","","過重力時対応型。\n加速度を重視している。\n消費EPが多い。"],
	["オイガスJ","","EPの使用効率がよいが、速力が著しく劣る。"],
	["オガムSP","","過重力時対応型。\n最高速が素晴らしい。\n消費EPと重量が難点。"],
	["オグマL","","軽量に特化している。\n機体によっては歩いた方が速い。"],
	["ヴァハG","","減重力時対応型。\n長時間高速移動が可能だが、非常に重い。\n減重力時の影響を全く受けない。"],
	["ボアンΣ2","","過重力時対応型。\n持続力よりダッシュ力を重視。\n消費EPがすさまじく悪い。\n過重力時の影響を全く受けない。"],
	["バトーバ","","減重力時対応型。\n重力が1G未満になった場合に自動補正で重力の影響を軽減できる。"],
	["モトゥーア","","過重力時対応型。\n重力が1Gを超えた場合に自動補正で重力の影響を軽減できる。"],
],
[
	["ラモント","","最も普及している武器管制装置。\nミサイル迎撃不可能。"],
	["プラトー","","横に広いサイトを持つ。\nミサイル迎撃可能。"],
	["シラー","","縦に長いサイトを持つ。\nミサイル迎撃不可能。\n腕部兵器は対象外。\nロック系射撃兵器使用不可。"],
	["テオフィルス","","遠距離ロック可能なサイト。\nミサイル迎撃可能。\n頭部及び胸部搭載兵器は、対象外。\n使用不可。"],
	["マウロリクス","","同時ロック数を重視。\nミサイル迎撃可能。"],
	["ジャンサン","","ロック速度を重視。\nミサイル迎撃不可能。"],
	["ラモントL","","軽量重視。\nミサイル迎撃不可能。"],
	["プラトー改","","ロック速度を重視。\nサイト形状が横長。"],
	["シラー2","","ロック速度を重視。\nサイト形状が縦長。"],
	["オフィル","","同時ロック数を重視。\nミサイル迎撃可能。"],
	["ウロリク","","超遠距離ロック可能なサイト。\nミサイル迎撃不可能。\n天候に注意！"],
	["ジャンD","","ロック時間が短いが射程も短い。\n頭部のみミサイル迎撃可能"],
	["シラー3","","高機能だがサイトが小さい。\nミサイル迎撃可能。"],
	["プラトーW","","サイトの大きさが最大。\nミサイル迎撃可能。"],
	["サン","","遠距離からの高速精密射撃が可能。\n頭胸部はミサイル迎撃専用。"],
	["リンート","","各装備箇所の役割を明確にした設計。\n肩部以外ミサイル迎撃可能。"],
	["ラジャロフ","","遠距離支援用PF専用に開発された。\n腕部兵器は対象外。\nロック系射撃兵器使用不可。\n天候に注意！"],
],
[
	["ミマス","","PFの標準的レーダー。\n近～中距離での精度が良好。\n範囲固定型レーダー。"],
	["エンケラ","","標準的な性能。\n範囲固定型レーダー。"],
	["テレスト","","近～中距離向けのレーダー。\n消費EPが多い。\n範囲固定型レーダー。"],
	["ディオーネ","","中距離での精度が良好。\nバランスが良い。\n範囲可変型レーダー。"],
	["ヘレーネ","","耐熱重視型。\n中～遠距離用レーダー。\n範囲固定型レーダー。"],
	["フェーベ","","耐衝撃重視型。\n中～遠距離用レーダー。\n範囲可変型レーダー。"],
	["ディオーR","","超近距離での精度が良好だが、敵を見失うと苦しい。\n範囲固定型レーダー。"],
	["テレスト2","","索敵範囲は広くないが、内部HPを強化。\n範囲可変型レーダー。"],
	["ヘレーネ2","","近距離だの精度が良好。\n内部HPも充実している。\n範囲固定型レーダー。"],
	["ミマス改","","長い索敵距離を持つ。\nEP消費も大。\n範囲可変型レーダー。"],
	["フェーベα","","軽量化に重点を置いたレーダー。\n範囲固定型レーダー。"],
	["エンケラA","","近～中距離向け。\n内部HPを重視している。\n範囲固定型レーダー。"],
	["ヘレーネ改","","中～遠距離向け。\nEP消費量削減タイプ。\n範囲固定型レーダー。"],
	["ベネネトラ","","中～遠距離向け。\n範囲可変型レーダー。"],
	["テデヘ","","最長の索敵範囲を持つレーダー。\n重く、EP消費も大。\n範囲可変型レーダー。"],
],
[
	["エリドゥ","","PFの標準的な装甲素材。\n軽量で消費EPも少ない。"],
	["ウルク","","ミラムーン製の装甲素材。\n耐衝撃が向上。"],
	["ウル","","ウルク装甲をアルサレアで改良。\n耐衝撃が向上。"],
	["ニブル","","ミラムーンの宇宙研究所で開発。\n耐衝撃が向上。"],
	["ラルサ","","ミラムーン製装甲の最高傑作。\n耐衝撃が向上。"],
	["エリドゥG","","エリドゥ改良版。\nEP消費は抑えたが重量が増大。"],
	["ウルG2","","衝撃防御が各段にUP。\n重量は抑えたが消費EP増大。"],
	["ラルサ2","","ラルサをさらに強化。\n重量、使用EP共に最大級。"],
	["ニブル改","","特殊な磁場によって装甲強化。\nレーダー、WCSにダメージ大。"],
	["ウルクβ","","磁気を帯びた材質でできている。\nWCSに悪影響を及ぼす。"],
	["ラルサJ","","軽量化を重視。\n装甲としてはいささか心細い。"],
	["ルサ11","","特化した部分もないが短所もなし。\n重量・使用EPの調整がつけば、それなりに使える。"],
	["ドゥークS","","ガード、内部HP、耐衝撃防御、全てにおいて優れている。"],
],
[
	["スヴェントヴィト","","アームの標準的パワーユニット。\nPFのパンチ力に影響する。"],
	["トリグラフ","","標準パワーユニットの性能向上。\n重量・消費EPが若干増加。"],
	["スヴァロヴィチ","","エネルギー増幅装置内蔵。\n重量が増加した。"],
	["ヤロヴィト","","エネルギー増幅装置を改良。\n消費EPが増加した。"],
	["ルエヴィト","","高出力化に伴い重量増加。"],
	["ヴァロヴィチ","","高出力だが、消費EPが非常に大。"],
	["リグラフQ","","重いが消費EPは極力抑えた。"],
	["エヴィトH","","最高出力のパワーユニット。\n重量・EP消費も多い。"],
	["ロヴィトS","","軽量化を重視。"],
	["ヴェントヴィα","","スヴェントヴィトの旧型モデル。"],
	["ヴィト試験型","","開発段階に作成された試験型パワーユニット。"],
	["フラフー9","","腕部への効果を無視し、腹部関節の稼働に重点を置いたパワーユニット。"],
	["ヴァーストΣ","","コンビネーションバースト時専用に開発されたパワーユニット。"],
],
[
	["ペルーン","","PFの標準的レッグモーター。\nPFの歩行速度に影響する。"],
	["ヴォーロス","","ペルーンの再設計で性能向上。"],
	["ストリーボグ","","冷却装置内蔵で性能が安定。"],
	["ダージボグ","","高性能ギヤ搭載により性能向上。"],
	["ホルス","","高出力モーター重量・消費EPが増大。"],
	["ペルーン2","","高出力だが、消費EP大。"],
	["ストリーΣ","","積載量を犠牲にして歩行速度とジャンプ力を強化。"],
	["ホルス改","","重くEP消費も大きいが、能力全般において性能が向上。"],
	["ヴォーロスβ","","軽量化を重視。"],
	["ダージボグα","","試作型レッグモーター。\nジャンプ能力重視。"],
	["ホルス試作型","","試作型レッグモーター。\n特定のPF用に作られたらしい。"],
	["ボグボーグ","","試作型レッグモーター。\n内部HPに重点を置いた設計。"],
	["リーボリー","","物資輸送PF用に開発された試作レッグモーター。\n積載量を重視。"],
],
[
	["未使用","","ヒートジェルを使用しません。"],
	["ウエイトジェル","","総積載量自体を減らして積載量に余裕を持たせます。"],
	["インサイドジェル","","内部HPを増加させます。"],
	["フレームジェル","","外部HPを増加させます。"],
	["EPジェル","","総使用EP自体を減らしてMAXEPに余裕を持たせます。"],
	["ウォークジェル","","歩行速度を高速化させます。"],
	["リカバージェル","","ジェネレーター回復力を強化します。"],
	["ブーストジェル","","ブースターの最高速度・加速度を上昇させます。"],
	["ジャンプジェル","","ジャンプ能力を上昇させます。"],
	["ガードジェル","","基本防御力を増加させます。"],
	["ターンジェル","","地上及び空中の旋回性能を向上させます。"],
],
[
	["未設定","",""],
	["全兵器","",""],
	["両手兵器","",""],
	["両肩兵器","",""],
	["左手兵器のみ","",""],
	["右手兵器のみ","",""],
	["左肩兵器のみ","",""],
	["右肩兵器のみ","",""],
	["左手・左肩","",""],
	["左手・右肩","",""],
	["右手・左肩","",""],
	["右手・右肩","",""],
	["両肩・左手","",""],
	["両肩・右手","",""],
	["両手・左肩","",""],
	["両手・右肩","",""],
],
[
	["初期値","",""],
	["Jカイザー","","","規格機体"],
	["Jアームド","","","規格機体"],
	["Jファー","","","規格機体"],
	["Jファーカスタム","","","規格機体"],
	["Jグラップラー","","","規格機体"],
	["Jキャノン","","","規格機体"],
	["Jフェニックス","","","規格機体"],
	["Jブラスター","","","規格機体"],
	["アルサレアGS","","","規格機体"],
	["Jファーバルカン","","","規格機体"],
	["Jメガバスター","","","規格機体"],
	["Jポールヴェア","","","規格機体"],
	["シンザン","","","規格機体"],
	["ヌエ","","","規格機体"],
	["ロキ","","","規格機体"],
	["ヤシャ","","","規格機体"],
	["オニ","","","規格機体"],
	["キシン","","","規格機体"],
	["タルカス","","","規格機体"],
	["ヴェタール","","","規格機体"],
	["オードリー","","","規格機体"],
	["イリア","","","規格機体"],
	["アシュラ","","","規格機体"],
	["カルラ","","","規格機体"],
	["ラセツ","","","規格機体"],
	["スサノオ","","","規格機体"],
	["アポロン","","","規格機体"],
	["ヘリオス","","","規格機体"],
	["アリス","","","規格機体"],
	["リリス","","","規格機体"],
	["マリア","","","規格機体"],
	["ミルク","","","規格機体"],
	["ポリターン3","","","規格機体"],
	["APF-205S","","","カスタム機"],
	["キース専用仕様","","","カスタム機"],
	["射撃強化カスタム","","","カスタム機"],
	["APF-021T","","","カスタム機"],
	["アイリ専用仕様","","","カスタム機"],
	["中近距離対応仕様","","","カスタム機"],
	["APF-027X","","","カスタム機"],
	["サリア専用仕様","","","カスタム機"],
	["近接戦強化仕様","","","カスタム機"],
	["APF-026","","","カスタム機"],
	["ギブソン専用仕様","","","カスタム機"],
	["連射性能強化仕様","","","カスタム機"],
	["APF-024A","","","カスタム機"],
	["ジータ専用仕様","","","カスタム機"],
	["ZC市街戦仕様","","","カスタム機"],
	["APF-205S","","","カスタム機"],
	["ムラキ専用仕様","","","カスタム機"],
	["支援強化カスタム","","","カスタム機"],
	["APF-205S","","","カスタム機"],
	["ランブル専用仕様","","","カスタム機"],
	["ランブル使用T2","","","カスタム機"],
	["チェンナ専用仕様","","","カスタム機"],
	["重装備カスタム","","","カスタム機"],
	["タックル攻撃仕様","","","カスタム機"],
	["APF-230S","","","カスタム機"],
	["マコト専用仕様","","","カスタム機"],
	["破壊力特化仕様","","","カスタム機"],
	["APF-022S","","","カスタム機"],
	["セイバー専用仕様","","","カスタム機"],
	["兵器破壊強化仕様","","","カスタム機"],
	["APF-022S","","","カスタム機"],
	["オスコット専用機","","","カスタム機"],
	["OC火力強化仕様","","","カスタム機"],
	["リンナ専用仕様","","","カスタム機"],
	["左腕強化カスタム","","","カスタム機"],
	["忍び系カスタム","","","カスタム機"],
	["バランス重視","","","簡易機体組立"],
	["耐熱防御重視","","","簡易機体組立"],
	["耐衝防御重視","","","簡易機体組立"],
	["EP効率重視","","","簡易機体組立"],
	["防御耐久度重視","","","簡易機体組立"],
	["機動性重視","","","簡易機体組立"],
	["積載量重視","","","簡易機体組立"],
	["空中戦重視","","","簡易機体組立"],
	["格闘戦重視","","","簡易機体組立"],
	["軽量化重視","","","簡易機体組立"],
	["重量過多","","","その他"],
	["積載量一致","","","その他"],
]
];
//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//		//

var BURMcorr=[
	[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[0,"HP肥大機",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,"異常硬度機",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,"完全規格",0,50,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1.15,1.5,1,1,1,1,1,1,1],
		[0,"拠点防衛機",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[0,"全規格外装",0,50,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[1,"EP温存A",0,30,1,1,1,1.48,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存B",0,30,1,1,1,1.35,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存C",0,30,1,1,1,1.28,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存D",0,30,1,1,1,1.22,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存E",0,30,1,1,1,1.1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存A",0,30,4,1,1,1.66,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存B",0,30,4,1,1,1.57,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存C",0,30,4,1,1,1.45,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存D",0,30,4,1,1,1.22,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP温存E",0,30,4,1,1,1.1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP全消費",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"EP削減",0,50,2,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,"純粋なる力",0,0,2,1.05,1.1,1.1,1.15,0.9,1.05,1.2,1.1,1.1,0.95,1.1,1.1,1,1,1.05,1.05,1,1.2,1,1.05,1,1,1,1,1,1],
		[1,"無の境地",0,0,2,1.1,1.15,1.15,1.25,0.85,1.1,1.3,1.15,1.15,0.9,1.15,1.2,3,2,1.1,1.1,1,1.4,1,1.03,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[2,"BMS限界",0,50,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[2,"BMS限界",0,50,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[3,"専用兵器",0,20,7,1.3,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1.15,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1.25,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1.15,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1.2,1,2,1,1,1,1,1,1,0.5,1,1,0,0,1,1,1,2,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1.6,3.5,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1.1,2,2,1,1,1,1,1,1,0.5,1,1,0,0,1,1,1,2,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,30,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,40,7,1.3,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[3,"専用兵器",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[4,"積載軽量A",0,50,1,1,1,1,1,1,1,1,1,1,1,2.2,1,0,0,1.5,1.35,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量B",0,50,1,1,1,1,1,1,1,1,1,1,1,1.9,1,0,0,1.3,1.2,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量C",0,50,1,1,1,1,1,1,1,1,1,1,1,1.9,1,0,0,1.2,1.1,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量D",0,50,1,1,1,1,1,1,1,1,1,1,1,1.6,1,0,0,1.2,1.05,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量E",0,50,1,1,1,1,1,1,1,1,1,1,1,1.6,1,0,0,1.1,1.05,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量A",0,60,1,1,1,0.88,1,1,1,1,1,1,1,1,1,6,-8,0.72,0.79,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量B",0,60,1,1,1,0.9,1,1,1,1,1,1,1,1,1,5,-8,0.88,0.83,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量C",0,60,1,1,1,0.92,1,1,1,1,1,1,1,1,1,4,-5,0.9,0.85,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量D",0,60,1,1,1,0.94,1,1,1,1,1,1,1,1,1,3,-5,0.93,0.9,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量E",0,60,1,1,1,0.96,1,1,1,1,1,1,1,1,1,2,-3,0.95,0.93,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量A",0,50,4,1,1,1,1,1,1,1,1,1,1,1.2,1,0,0,1.4,1.35,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量B",0,50,4,1,1,1,1,1,1,1,1,1,1,1.12,1,0,0,1.23,1.3,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量C",0,50,4,1,1,1,1,1,1,1,1,1,1,1.08,1,0,0,1.2,1.2,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量D",0,50,4,1,1,1,1,1,1,1,1,1,1,1.06,1,0,0,1.08,1.15,1,1,1,1,1,1,1,1,1,1],
		[4,"積載軽量E",0,50,4,1,1,1,1,1,1,1,1,1,1,1.02,1,0,0,1.03,1.1,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量A",0,60,4,1,1,0.74,1,1,1,1,1.5,1,0.82,1,1,9,-5,0.84,0.78,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量B",0,60,4,1,1,0.8,1,1,1,1,1.33,1,0.88,1,1,8,-5,0.85,0.83,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量C",0,60,4,1,1,0.84,1,1,1,1,1.24,1,0.92,1,1,8,-4,0.87,0.85,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量D",0,60,4,1,1,0.88,1,1,1,1,1.16,1,0.96,1,1,7,-3,0.9,0.9,1,1,1,1,1,1,1,1,1,1],
		[4,"積載重量E",0,60,4,1,1,0.92,1,1,1,1,1.08,1,0.98,1,1,5,-2,0.93,0.93,1,1,1,1,1,1,1,1,1,1],
		[4,"積載量一致",0,100,7,1,1,1,1,1,1,1,1,1,1,1,1,5,10,1.1,1.1,1,1.3,1,1,1,1,1,1,1,1],
		[4,"積載量前賞",0,50,7,1,1,1,1,1,1,1,1,1,1,1,1,2,4,1,1,1,1,1,1,1,1,1,1,1,1],
		[4,"積載量補正",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1.01,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,1,1,1,1,0.7,1,1,0,5,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,1,1,1,1,0.6,1,1,3,7,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,5,5,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,0.8,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,1.3,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,0.55,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,20,7,1,1,1,1,1,0.02,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,200,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[5,"特殊装備",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[6,"完全無装備",0,30,1,2,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.9,1,1,1,1,1,1,1],
		[6,"腕部無装A",0,20,1,1.5,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.3,1.3,1,1,1,1,1,1],
		[6,"腕部無装B",0,10,1,1.3,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.4,1.4,1,1,1,1,1,1],
		[6,"完全無装備",0,30,2,1.8,1.6,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.5,1.3,1,1,1,1,1,1],
		[6,"腕部無装A",0,20,2,1.6,1.3,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.3,1.1,1,1,1,1,1,1],
		[6,"腕部無装B",0,10,2,1.3,1.15,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.4,1.1,1,1,1,1,1,1],
		[6,"完全無装備",0,30,4,2,1.5,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.24,1.4,1,1,1,1,1,1],
		[6,"腕部無装A",0,20,4,1.7,1.2,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.12,1.1,1,1,1,1,1,1],
		[6,"腕部無装B",0,10,4,1.3,1.1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.08,1.3,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[7,"究極特化衝",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"究極特化熱",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"究極特化内",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"究極特化破",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"攻属特化衝",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"攻属特化熱",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"攻属特化内",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[7,"攻属特化破",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[8,"防御特衝A",0,20,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特衝B",0,20,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特熱A",0,20,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特熱B",0,20,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特衝A",0,20,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特衝B",0,20,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特熱A",0,20,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御特熱B",0,20,4,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[8,"防御無属性",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1.95,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[9,"機体軽量A",0,70,1,1,1,1,4,1,1,1,3,2.3,0.5,1,0.5,-6,-8,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体軽量B",0,70,1,1,1,1,2.75,1,1,1,2.6,2,0.6,1,0.5,-5,-7,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体軽量C",0,70,1,1,1,1,1.64,1,1,1,2,1.8,0.7,1,0.7,-4,-5,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体軽量D",0,70,1,1,1,1,1.43,1,1,1,1.8,1.6,0.8,1,0.7,-3,-4,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体軽量E",0,70,1,1,1,1,1.01,1,1,1,1.5,1.4,0.96,1,0.9,-2,-2,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体重量A",0,70,4,1,1,1,2,1,1,1,0.1,0.81,0.8,1,1.4,16,12,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体重量B",0,70,4,1,1,1,1.85,1,1,1,0.15,0.85,0.84,1,1.3,10,8,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体重量C",0,70,4,1,1,1,1.64,1,1,1,0.24,0.88,0.88,1,1.2,8,6,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体重量D",0,70,4,1,1,1,1.43,1,1,1,0.5,0.92,0.92,1,1.1,6,5,1,1,1,1,1,1,1,1,1,1,1,1],
		[9,"機体重量E",0,70,4,1,1,1,1.21,1,1,1,0.75,0.96,0.96,1,1.08,4,3,1,1,1,1,1,1,1,1,1,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[10,"いざ参る！",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[10,"くのいち",0,0,7,1.3,1,1.09,1.18,1,1,1,1,1.2,1,1.65,1,0,0,1,1.24,1,1.2,1.3,1.05,1,1,1,1.18,1,1],
		[10,"一刀侍魂",0,-50,7,1.5,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,3,0.33,1,1,1,1,1,1,1],
		[10,"完全捕捉",0,0,7,1,1,0.8,1.12,0.76,1.15,1.2,1,1,1,1.52,1,5,4,1,1,1,1.11,0.7,1,1,1,1,1.12,1,1],
		[10,"騎士の称号",0,100,3,1,1,1,1,1,1,1,1,1,1,1,1,4,0,1,1,1,1,1,1,1,1,1.4,1,1,1],
		[10,"御庭之者",0,0,7,1,1,1,1,1,1,1,1,1,1,1.5,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1],
		[10,"左腕の剣豪",0,-30,7,2,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1.5,0.6,1,1,1,1,1,1,1],
		[10,"秋分の空",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1.5,1,1,1],
		[10,"重火器重装",0,0,7,1,1,1.1,0.88,1,1,1,1,1,1,1.25,1,3,4,1,1,1,1.05,1,1,1,1,1,1,1,1],
		[10,"重破壊型",0,0,7,1.16,1,0.88,1.12,1,1,1,1,1,1,1.25,1,3,2,1,1,1,1,1.1,1,1,1,1,1,1,1],
		[10,"女神降臨",0,200,3,1.35,1,1,1,1,1,1,1,1,0.95,1,1,6,5,1,1,1,1,1,1,1,1,1.09,1,1,1],
		[10,"真・二刀流",0,0,7,1.55,1,1,1,0.9,1.1,1,1,1,0.5,1.5,1,8,4,1,1,1,1,1,1,1,1,1,1,1,1],
		[10,"戦士の称号",0,50,3,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1.3,2],
		[10,"船上の騎士",0,100,3,1.35,1,1,1,1,1,1,1,1,0.95,3.5,1,4,0,1,1,1,1,1,1,1,1,1.2,1,1,1],
		[10,"二刀流",0,0,7,1.15,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1.4,1.32,1,1,1,1,1,1,1],
		[10,"必殺の受身",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,2.2,1,1,1],
		[10,"別離の悲痛",0,0,7,1,1,1,1,1.2,1,1,1,1,2,0.5,1,-8,-4,1,1,1,1,1,1,1,1,1,1,1,1],
		[10,"野生の電撃",0,-80,7,1.6,1,0.8,0.5,1,1,1,4.9,1,1,1.4,1,0,0,1,1.2,1,1,1,1,1,1,1,1,1,1],
		[10,"籠絡の計",0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1.8,1,1,1],
	],[
		[0,"-",0,0,7,1,1,1,1,1,1,1,1,1,1, 1,1,0,0,1,1,1,1,1,1, false,false,1,1,1,1],
		[11,"完全左右対",0,30,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1.32,1,1,1,1,1,1,1,1,1],
		[11,"左右対称",0,20,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1.28,1,1,1,1,1,1,1,1,1],
		[11,"肩装備対称",0,10,7,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1.08,1,1,1,1,1,1,1,1,1],
	]
];

var data=[
	[[0,157,500,800,250,50,50,1,1.1,1,0,false,true],[1,165,540,816,250,50,50,1,1,1,0,false,true],[2,141,490,640,250,37,63,0.99,1.03,1.03,0,false,true],[3,78,100,400,188,26,74,0.96,0.97,0.97,0,true,true],[4,471,530,1600,250,66,34,1.16,1.11,1.11,0,false,true],[5,478,580,1440,313,64,36,1,1,1,0,false,false],[6,235,400,864,250,52,48,1,1,1,0,false,true],[7,424,640,1200,250,45,55,1,1,1,0,false,true],[8,761,700,1520,500,66,34,1.11,1.07,1.07,0,true,false],[9,220,600,960,313,21,79,1,1,1,0,false,true],[10,149,350,1120,188,52,48,1.1,1.1,1.1,0,false,true],[11,157,440,880,244,51,49,1,1.09,1.09,0,false,true],[12,173,500,800,263,32,68,1.3,1,1,0,false,true],[13,259,700,40,25,74,26,0.8,1,1,0,true,true],[14,314,200,800,250,51,49,0.94,0.9,1.1,0,false,true],[15,283,450,1376,125,56,44,1,1,1,0,false,true],[16,330,550,720,388,50,50,1,1,1,0,false,true],[17,487,590,1328,388,68,32,0.94,1,1,0,false,false],[18,267,150,560,250,81,19,1,1,1,0,true,true],[19,432,540,1056,325,84,16,1,1,1,0,false,true],[20,204,1200,10,313,0,100,0.97,1.13,1.09,0,false,false],[21,8,500,7,4,67,33,1.02,0.98,0.98,0,false,true],[22,471,4,800,18,71,29,1.05,0.99,1,0,false,true],[23,173,630,125,25,77,23,1,1.2,1.2,0,false,true],[24,673,1140,700,406,90,10,0.95,1.05,1.08,1,false,true],[25,573,1410,1500,480,80,20,1,1.02,1.01,2,false,true],[26,597,1300,810,200,40,60,0.99,1.03,0.98,3,false,true],[27,714,1520,720,220,13,87,1.03,0.99,0.98,4,false,true],[28,652,1240,820,260,24,76,1.08,1.04,0.95,5,false,true],[29,683,1360,990,240,19,81,1.1,0.94,1.06,6,false,true],[30,777,1340,1550,320,30,70,1.09,1.02,1.03,7,true,true],[31,514,1860,940,420,1,99,1.13,0.91,0.8,8,false,true],[32,677,1340,1240,420,1,99,1.23,0.91,0.8,9,true,true],[33,699,680,1000,1060,99,1,1.05,1.11,0.9,10,false,true],[34,200,384,1050,300,84,16,1.02,1.06,0.95,0,false,true],[35,560,1420,990,300,76,24,1,1,1,11,true,false],[36,200,1084,1050,400,84,16,1.2,0.95,0.95,12,false,false]],
	[[0,780,1990,3000,1000,50,50,1,0,false],[1,790,2200,3100,1000,70,30,1,0,false],[2,697,1980,3000,1000,45,55,1,0,false],[3,628,1780,2700,1300,38,62,1,0,true],[4,792,2000,3000,1000,85,15,1,0,false],[5,1941,2600,4200,1500,60,40,1,0,false],[6,864,2380,2960,1000,56,44,1,0,false],[7,2212,3000,4600,1500,65,35,1,0,false],[8,471,2390,2000,1250,39,61,1,0,true],[9,842,2190,3000,1200,46,54,1,0,false],[10,769,1890,2780,950,50,50,1,0,false],[11,785,1900,3100,1000,53,47,1,0,false],[12,942,1985,3000,1100,67,33,1,0,false],[13,157,2800,1000,600,20,80,1,0,true],[14,675,1995,2800,1200,38,62,1,0,false],[15,1225,2300,3300,1100,54,46,1,0,false],[16,942,2090,3000,1300,25,75,1,0,false],[17,1884,2790,3600,1300,41,59,1,0,false],[18,707,1990,2700,1000,10,90,1,0,true],[19,785,2200,3100,1500,0,100,1,0,false],[20,628,2700,4000,750,47,53,1,0,false],[21,772,1000,600,800,60,40,5,13,false],[22,1955,3400,700,1500,100,0,6.8,14,false],[23,1177,2400,2100,600,70,30,3,15,false],[24,79,1200,200,600,20,80,7,16,false],[25,1120,2050,800,1200,33,67,4.5,17,false],[26,898,2500,500,2000,25,75,3.46,18,false],[27,628,1900,500,1800,67,33,5.25,0,true],[28,1660,0,15,0,99,1,9.99,19,false],[29,970,2200,400,400,99,1,7,20,true],[30,1370,2800,600,1000,1,99,5,0,false],[31,888,2080,3300,1500,78,22,1.1,0,false],[32,400,1110,200,250,7,93,8.1,0,true],[33,1788,580,4400,1700,100,0,0.8,21,false]],
	[[0,314,1000,990,100,50,50,1000,2,1,false],[1,314,1100,1050,100,50,50,500,2,1,false],[2,314,1000,980,100,45,55,450,2,1.2,false],[3,126,1000,900,150,40,60,1200,5,1.18,true],[4,471,1380,1180,160,94,6,1300,2,0.95,false],[5,377,700,1190,100,60,40,600,3,1,false],[6,157,600,400,450,49,51,100,5,1,false],[7,314,1000,1000,100,48,52,1200,2,0.93,false],[8,283,900,890,250,60,40,700,2,1.2,true],[9,377,1100,1000,110,50,50,500,3,1.06,false],[10,290,900,980,95,50,50,500,2,1.4,false],[11,324,900,1090,95,53,47,1000,4,1,false],[12,377,1000,995,110,50,50,1200,2,1.05,false],[13,53,2000,690,70,50,50,80,5,1.1,true],[14,236,800,800,100,45,55,140,3,1.2,false],[15,157,900,490,200,51,49,600,4,1.05,false],[16,377,1100,995,110,50,50,500,2,1.08,false],[17,377,1500,1400,80,75,25,1100,4,1,false],[18,283,1000,900,250,80,20,780,5,1.1,true],[19,283,1170,1300,140,26,74,400,2,1.2,false],[20,247,1500,700,134,80,20,1170,5,1.3,false],[21,281,520,750,400,88,12,700,5,0.9,false],[22,314,1100,1050,100,50,50,500,4,1,false],[23,105,1100,450,84,10,90,105,5,0.75,false],[24,204,900,525,200,22,78,500,5,1.07,false],[25,437,1300,150,60,90,10,4000,4,1,false],[26,114,660,550,10,50,50,120,2,1,true],[27,550,1100,100,800,0,100,500,2,0.8,false],[28,130,990,870,100,70,30,700,2,1.24,true],[29,80,1500,200,700,100,0,100,3,1.33,false],[30,388,990,770,210,40,60,1100,3,0.95,false],[31,408,1190,270,210,50,50,2100,3,0.95,true],[32,188,2390,170,710,20,80,3100,3,0.95,false]],
	[[0,785,990,3000,300,50,50,4082,10,17,24,24,0.8,false],[1,785,1095,3050,290,50,50,4150,10,10.2,24,20,0.7,false],[2,550,1500,1400,310,48,52,3548,11,13.6,12,36,0.7,false],[3,1021,1180,2800,470,43,57,4328,11,22.1,28,28,0.4,true],[4,597,860,2000,260,96,4,4249,8,11.9,30,18,0.8,false],[5,942,1090,3600,300,55,45,5550,7,27.2,22,26,0.9,false],[6,785,950,4000,550,44,56,4749,9,29.8,38,14,0.8,false],[7,864,1100,2600,360,50,50,6673,6,6.8,26,22,0.9,false],[8,722,980,2700,370,46,54,4145,12,23.8,30,26,0.6,true],[9,942,1095,3600,310,50,50,4710,10,11.9,23,23,0.8,false],[10,864,900,3000,285,50,50,4082,9,8.5,22,22,0.9,false],[11,785,890,3100,285,53,47,4082,9,10.2,21,21,0.8,false],[12,942,1000,3000,310,50,50,4632,9,10.2,24,24,0.8,false],[13,393,1240,1800,500,30,70,3140,8,11.1,18,28,0.5,true],[14,1099,1400,2900,270,50,50,5495,7,42.5,20,11,0.9,false],[15,471,1200,2100,380,52,48,4082,9,10.2,18,30,0.8,false],[16,785,1020,3600,310,50,50,4710,10,5.9,25,18,0.6,false],[17,1021,1100,3700,400,29,71,6170,7,25.5,26,22,0.7,false],[18,707,970,2700,350,46,54,4161,11,10.2,26,26,0.7,true],[19,1021,1070,3050,300,50,50,4361,9,10.2,24,17,0.1,false],[20,1570,2010,4200,470,48,52,5746,6,2.6,40,10,0.4,false],[21,3297,3300,5000,2000,50,50,7693,3,0,40,8,0.9,false],[22,864,800,3300,300,52,48,6437,13,0,36,12,0.6,false],[23,487,820,1900,250,20,80,4019,11,10.2,25,23,0.7,false],[24,575,1000,3000,300,30,70,4184,13,63,29,29,0.8,false],[25,1685,1674,2100,600,90,10,6100,9.6,10,22,4,0.9,false],[26,1595,1370,1500,1000,84,16,5897,10,2,44,6,0.8,false],[27,947,990,3000,200,14,86,5070,8.5,1,37,24,1.9,false],[28,507,1000,3000,500,77,23,3887,10,17,21,30,0.7,false],[29,785,1000,3000,320,16,84,4517,8.8,82,20,34,0.9,false],[30,620,1300,1000,900,50,50,4060,11,18,25,32,1,true],[31,960,2000,1000,300,10,90,5700,10,15,24,24,0.9,false],[32,393,970,1200,400,100,0,3944,12.5,28.7,20,38,1,true],[33,952,570,2200,400,100,0,5070,11.5,16.2,40,18,1.2,false],[34,620,880,1600,250,80,20,4044,11.5,15.7,27,21,1,false],[35,720,910,1800,490,30,70,4144,11.2,20.6,35,34,1.9,true],[36,620,880,1600,250,80,20,6088,6.5,7.7,20,28,1,false]],
	[[0,0,0,false,0,0,0,0,0,0,0,0,0,0,0,0,0,false],[1,455,9000,false,180,4,108,7,900,160,0,0,0,0,0,5,0,false],[2,1178,9000,false,4000,3,0,10,0,0,50,100,0,0,0,1,3800,false],[3,393,9000,false,360,2,128,14,320,160,0,0,0,0,0,1,0,false],[4,314,9000,false,160,3,296,8,700,160,0,0,0,5,0.01,1,250,false],[5,314,9000,false,145,2,128,26,900,160,0,0,0,0,0,1,0,false],[6,707,9000,false,2810,2,96,5,32,160,20,300,10,100,0,1,0,false],[7,660,9000,false,1440,2,68,10,80,160,30,600,5,100,0.01,1,0,true],[8,471,9000,false,360,3,80,15,400,160,0,0,0,0,0,1,200,false],[9,495,9000,false,846,2,14,20,500,480,24,500,30,400,0.03,1,0,true],[10,330,9000,false,2907,3,0,9,0,0,0,0,0,0,0,0,2940,false],[11,235,9000,false,3833,3,0,10,0,0,0,0,0,0,0,0,840,false],[12,314,9000,false,3272,2,0,10,0,0,0,0,0,0,0,0,0,false],[13,550,9000,false,3332,3,0,10,0,0,0,0,0,0,0,0,940,false],[14,393,9000,false,2829,2,0,10,0,0,0,0,0,0,0,0,0,false],[15,502,9000,false,480,2,0,10,0,0,0,0,0,0,0,0,2000,false],[16,785,9000,false,7514,4,0,10,0,0,5,0,0,0,0,0,0,false],[17,408,9000,false,3825,2,0,10,0,0,0,0,0,0,0,0,0,false],[18,644,9000,false,220,2,120,14,999,180,0,0,0,180,0.2,1,0,false],[19,408,9000,false,4913,2,0,9,0,0,0,0,0,0,0,0,0,false],[20,308,4500,false,0,7,0,10,0,0,0,0,0,0,0,0,0,false],[21,208,3000,false,0,7,0,12,0,0,0,0,0,0,0,0,20,false],[22,471,9000,false,0,6,40,11,400,160,0,0,0,0,0,1,200,false],[23,681,9000,false,6050,3,0,5,0,0,200,500,0,0,0,0,2000,false],[24,553,9000,false,5402,4,0,9,0,0,0,0,0,0,0,0,1600,false],[25,673,9000,false,6630,5,0,7,0,0,80,800,0,0,0,0,1900,false],[26,1077,6000,false,6000,4,0,8,0,0,0,0,0,0,0,0,0,false],[27,953,5000,false,7402,2,0,8,0,0,0,0,0,0,0,0,0,false],[28,495,9000,false,500,4,60,9,900,320,0,0,1,10,0.01,3,400,false],[29,408,4000,false,562,1,0,15,0,0,0,0,0,0,0,0,3200,false],[30,408,9000,false,5240,2,0,15,0,0,0,0,0,0,0,0,0,false],[31,1193,9000,false,6240,2,0,7,0,0,0,0,0,0,0,0,0,false],[32,236,9000,false,3281,4,0,12,0,0,0,0,0,0,0,0,0,false],[33,550,9000,false,4280,2,0,5,0,0,0,0,0,0,0,0,0,false],[34,275,9000,false,4690,4,0,20,0,0,0,0,0,0,0,0,0,false],[35,314,9000,false,3396,2,0,10,0,0,0,0,0,0,0,0,2500,false],[36,1099,9000,false,6000,1,0,9,0,0,80,0,0,0,0,0,2000,false],[37,190,4800,false,2102,2,0,10,0,0,0,0,0,0,0,0,800,false],[38,1008,1999,false,0,7,0,6,0,0,0,0,0,0,0,0,0,false],[39,778,1800,false,0,7,0,8,0,0,0,0,0,0,0,0,16,false],[40,366,800,false,0,7,0,12,0,0,0,0,0,0,0,0,16,false],[41,580,680,true,227,5,110,7,90,160,0,0,0,0,0,3,0,false],[42,620,800,true,560,5,60,10,80,160,0,0,0,0,0,1,0,false],[43,400,904,true,460,4,436,6,540,120,0,0,0,1,0.4,1,250,false],[44,942,1800,true,336,3,270,22,900,160,0,0,0,0,0,1,680,false],[45,1492,1800,true,6250,3,46,2,20,160,150,1700,10,100,0,1,0,false],[46,960,772,true,220,5,66,10,80,80,40,1000,20,400,0.06,6,0,true],[47,770,480,true,3600,3,80,6,4,160,0,0,0,0,0,1,2000,false],[48,630,960,true,46,5,10,18,20,2680,10,1600,30,600,0.07,1,0,true],[49,353,9000,true,4083,3,0,10,0,0,0,0,0,0,0,0,1600,false],[50,500,9000,true,4837,2,0,10,0,0,0,0,0,0,0,0,1700,false],[51,550,1800,true,4188,3,0,8,0,0,0,0,0,0,0,0,1080,false],[52,393,1800,true,2859,3,0,10,0,0,0,0,0,0,0,0,3000,false],[53,640,1200,true,800,4,0,7,0,0,0,0,0,0,0,0,2000,false],[54,785,1800,true,7512,3,0,10,0,0,30,0,0,0,0,0,4000,false],[55,408,1800,true,4652,3,0,9,0,0,30,0,0,0,0,0,3000,false],[56,520,850,true,8670,4,0,9,0,0,0,0,0,0,0,0,0,false],[57,600,1340,true,0,6,60,12,400,160,0,0,0,0,0,1,200,false],[58,330,1000,true,2402,3,0,7,0,0,0,0,0,0,0,0,2200,false],[59,450,400,true,7667,5,0,10,0,0,0,0,0,0,0,0,1600,false],[60,450,1200,true,4402,1,0,10,0,0,0,0,0,0,0,0,1600,false],[61,630,800,true,2250,5,70,7,80,320,0,0,1,10,0.01,1,0,false],[62,1420,880,true,9740,5,0,7,0,0,0,0,0,0,0,0,0,false],[63,314,1800,true,4250,4,0,10,0,0,30,0,0,0,0,0,5000,false],[64,900,1112,true,6460,4,0,5,0,0,0,0,0,0,0,0,0,false],[65,314,1800,true,12250,1,0,10,1,0,0,0,0,0,0,0,0,false],[66,1760,188,true,16000,4,0,1,0,0,80,0,0,0,0,0,0,false],[67,40,480,true,4800,3,0,10,0,0,0,0,0,0,0,0,1600,false],[68,393,1800,true,2859,4,0,10,0,0,0,0,0,0,0,0,0,false],[69,550,9000,true,710,3,296,5,80,160,10,600,10,160,0,1,1200,false],[70,259,9000,true,1000,2,42,10,260,240,0,0,10,200,0.02,6,0,true]],
	[[0,0,0,false,0,0,0,0,0,0,0,0,0,0,0,0,0,false],[1,495,9000,false,2250,2,232,5,10,320,50,250,1,10,0,1,0,true],[2,573,9000,false,1000,2,36,10,60,240,30,300,1,200,0.02,1,0,true],[3,550,9000,false,710,3,296,7,80,160,0,0,10,160,0,1,1200,false],[4,471,9000,false,1440,2,48,10,100,160,0,0,1,160,0.02,1,0,false],[5,393,9000,false,160,2,128,30,350,160,0,0,0,0,0,1,0,false],[6,259,9000,false,1000,2,42,10,260,240,0,0,10,200,0.02,6,0,true],[7,510,9000,false,1322,2,52,10,40,160,10,80,1,150,0.01,1,0,true],[8,79,9000,false,0,8,0,0,0,0,0,0,0,0,0,0,0,false],[9,510,9000,false,1790,2,56,5,32,100,12,120,50,70,0.06,1,0,true],[10,557,9000,false,1210,3,32,10,80,60,120,300,40,60,0.01,6,100,true],[11,495,9000,false,0,2,30,20,100,5,40,5,0,0,0.03,8,0,true],[12,573,9000,false,250,2,60,10,40,900,300,100,1,9000,0.02,5,0,true],[13,518,9000,false,640,3,40,97,55,20,50,50,1,5,0.01,6,0,true],[14,369,9000,false,250,2,60,10,40,100,100,80,1,9000,0.02,5,0,true],[15,416,9000,false,810,3,20,97,70,80,30,320,1,22,0.01,6,0,true],[16,157,9000,false,1,2,90,97,900,220,50,1,1,2200,0.34,6,0,true],[17,606,9000,false,90,2,128,10,650,160,0,0,0,0,0,4,0,false],[18,930,200,false,32000,3,20,10,1,300,300,30000,5,400,0.08,1,9999,true],[19,494,9000,false,4000,2,60,10,950,40,200,100,10,100,0.01,5,0,false],[20,785,9000,false,1,2,328,40,600,160,0,0,0,0,0,3,0,false],[21,321,9000,false,0,6,40,10,400,160,0,0,0,0,0,1,400,false],[22,409,6000,false,0,6,40,10,600,160,0,0,0,0,0,1,80,false],[23,380,9000,false,0,6,40,10,880,160,0,0,0,0,0,1,100,false],[24,495,9000,false,2250,2,20,10,80,320,50,250,1,300,0.08,1,200,true],[25,79,9000,false,0,8,0,0,0,0,0,0,0,0,0,0,0,false],[26,480,9000,false,4000,3,0,10,0,0,50,100,0,0,0,2,2800,false],[27,630,82,false,2250,5,256,5,20,320,50,250,1,10,0.01,1,0,true],[28,730,136,true,1200,4,66,10,50,240,60,600,1,200,0.03,2,0,true],[29,700,64,true,1910,5,296,7,40,160,0,0,10,160,0,1,1200,false],[30,600,400,true,1640,4,28,10,100,160,0,0,60,80,0.42,3,0,false],[31,500,200,true,240,4,86,20,650,160,0,0,0,0,0,1,0,false],[32,330,268,true,1200,5,32,10,560,240,0,0,10,200,0.02,6,0,true],[33,350,160,true,1322,4,28,10,30,160,10,80,10,150,0.02,3,0,true],[34,100,600,true,0,8,0,0,0,0,0,0,0,0,0,0,0,false],[35,650,240,true,1940,5,48,5,64,100,12,120,50,70,0.06,2,0,true],[36,310,400,true,1210,4,128,10,40,70,140,400,50,70,0.01,6,100,true],[37,630,400,true,0,5,60,20,50,500,200,10,15,6,1.9,8,0,true],[38,730,160,true,500,5,55,10,80,900,200,400,1,9000,0.02,5,0,true],[39,360,400,true,640,5,80,97,35,10,50,50,1,2,0,6,0,true],[40,470,400,true,650,4,40,10,80,150,100,180,1,9000,0.02,4,0,true],[41,270,288,true,810,4,80,97,57,20,80,80,1,12,0,6,0,true],[42,100,140,true,1,2,90,97,700,220,50,1,1,2200,0.34,6,0,true],[43,500,400,true,110,3,128,10,660,240,0,0,0,0,0,6,0,false],[44,530,200,true,4000,2,80,10,950,250,250,300,10,100,0.01,5,0,false],[45,200,120,true,1,2,328,40,900,160,0,0,0,0,0,3,0,false],[46,330,420,true,1850,4,26,10,60,1220,50,250,100,500,0.05,2,100,true],[47,79,9000,true,0,9,0,10,1,0,0,0,0,0,0,0,0,false],[48,79,9000,true,0,9,0,10,1,0,0,0,0,0,0,0,0,false]],
	[[0,79,10000,6800,19,100,50,50,800,false],[1,137,12000,7000,20,90,0,100,1000,false],[2,181,11000,7600,28,80,10,90,1100,true],[3,267,13000,8000,16,600,83,17,3000,true],[4,329,9000,8700,24,70,16,84,1200,false],[5,699,15000,8100,30,955,90,10,1300,true],[6,827,18000,9500,18,1100,100,0,500,true],[7,609,22000,6000,14,900,94,6,2,true],[8,352,5000,7620,46,120,30,70,200,false],[9,454,6000,7150,26,110,0,100,2500,false],[10,517,7200,9999,12,40,80,20,600,true],[11,6,800,7050,30,0,84,16,100,false],[12,920,4500,9900,29,10,1,99,400,false],[13,1046,13800,5050,22,20,2,98,2000,false]],
	[[0,79,30,20.7,1.2,112,63,37,1],[1,94,30,21.6,1.3,161,63,37,1],[2,102,51,26.7,2.8,189,37,63,0.92],[3,165,43,23.3,3.7,411,47,53,0.88],[4,196,38,22.4,2,435,53,47,0.72],[5,258,34,25,5.5,822,58,42,1.02],[6,301,60,28.4,9.2,1100,26,74,1.04],[7,214,20,17.3,0.9,640,69,31,1],[8,402,70,36,3.7,1899,13,87,1.1],[9,8,40,10.5,1.8,40,51,49,1],[10,610,15,30.1,9.2,2451,82,18,0.25],[11,355,80,32,29.4,1755,1,99,1.5],[12,536,33,26.4,10,770,96,4,0.45],[13,473,49,29,21,600,50,50,1.3]],
	[[0,79,300,19,16,32,5,true,false,0,514,18,15,32,5,true,false,0,514,20,17,32,5,true,false,0,514],[1,86,390,22,16,29,5,true,true,0,441,21,15,36,5,true,true,0,514,23,17,36,5,true,true,0,441],[2,87,380,0,0,0,0,false,false,0,0,18,21,27,4,true,false,0,610,20,23,27,4,true,false,43,610],[3,90,290,15,15,43,3,true,true,70,893,14,14,48,3,true,true,140,882,0,0,0,0,false,false,0,0],[4,94,300,17,17,36,5,true,true,0,419,18,18,36,6,true,true,0,419,19,19,36,6,true,true,0,419],[5,83,460,16,16,18,4,true,false,42,550,18,17,16,4,true,false,64,571,18,17,16,4,true,false,105,592],[6,8,20,15,13,20,3,true,false,68,183,17,17,9,2,true,false,175,266,17,17,9,2,true,false,0,266],[7,143,480,20,17,21,2,true,true,0,235,21,16,19,2,true,true,90,308,21,16,19,2,true,true,90,319],[8,210,620,17,20,19,1,true,true,0,352,16,21,22,1,true,true,0,352,16,21,22,1,true,true,0,352],[9,281,800,24,21,17,8,true,true,115,610,26,22,23,8,true,true,266,683,26,22,21,8,true,true,266,683],[10,371,820,21,12,48,3,true,false,350,1323,23,8,67,5,true,false,700,1470,23,8,66,5,true,false,700,1470],[11,234,400,20,20,14,5,true,false,0,278,22,18,15,6,true,false,0,279,22,18,15,6,true,true,0,279],[12,396,900,12,12,25,3,true,true,126,661,11,11,25,6,true,true,140,735,13,13,25,6,true,true,140,735],[13,287,700,32,23,31,5,true,true,0,360,33,24,31,6,true,true,0,360,33,24,31,4,true,true,0,360],[14,194,1000,11,11,18,1,true,false,161,955,9,9,18,2,true,false,350,1102,9,9,18,2,false,true,70,1102],[15,317,790,32,23,27,3,true,true,0,258,33,24,31,6,true,false,235,515,33,24,36,4,true,true,480,771],[16,225,860,0,0,0,0,false,false,0,0,20,19,23,6,true,true,680,1396,19,20,25,6,true,true,770,1470]],
	[[0,79,290,1478,0,174,50,50],[1,86,400,1531,1,163,64,36],[2,104,490,1653,2,379,30,70],[3,129,450,1925,3,274,50,50],[4,121,550,2178,1,175,20,80],[5,190,500,2275,4,119,78,22],[6,158,660,300,0,1020,92,8],[7,137,300,500,4,752,88,12],[8,221,600,875,1,482,38,62],[9,281,730,2800,5,32,0,100],[10,16,20,80,2,95,10,90],[11,253,790,1356,0,995,100,0],[12,355,100,2205,1,165,50,50],[13,302,820,2350,3,0,70,30],[14,475,991,3800,5,114,100,0]],
	[[0,79,300,100,50,1],[1,94,310,150,60,1],[2,123,280,200,80,1],[3,139,400,300,70,1],[4,178,390,300,90,1],[5,284,320,600,72,1.3],[6,216,890,700,87,1.4],[7,441,1090,880,95,1.6],[8,212,420,1000,0,2.1],[9,147,390,1100,0,2.6],[10,6,10,10,7,1],[11,360,970,550,60,1.2],[12,540,1220,1300,100,3.2]],
	[[0,39,290,11,318,50,50,1,1,1],[1,43,300,10,405,41,59,1.1,0.95,0.97],[2,87,380,9,543,65,35,1.14,0.9,0.92],[3,118,520,9,601,26,74,1.2,0.84,0.86],[4,144,610,8,852,17,83,1.25,0.79,0.81],[5,193,1100,12,938,35,65,1.33,0.7,0.72],[6,259,720,10,1105,63,37,1.3,0.74,0.76],[7,426,920,13,1352,26,74,1.509999,0.51,0.52],[8,8,5,14,24,32,68,0.24,0.88,0.6],[9,231,800,18,0,80,20,0.62,1.2,0.8],[10,361,600,20,160,98,2,1.1,0.95,0.97],[11,261,750,45,100,44,56,0.98,0.96,0.98],[12,305,860,11,216,71,29,0.87,0.87,1.3]],
	[[0,39,280,200,50,50,1,1,1.17,1],[1,40,290,100,45,55,0.95,(1.1),1.04,1.02],[2,86,300,180,42,58,0.92,1.15,1.08,0.99],[3,117,400,160,39,61,0.88,1.22,1.13,1],[4,238,500,140,36,64,0.85,1.28,0.95,1.03],[5,186,900,600,30,70,0.77,1.4,0.89,1.04],[6,198,606,300,33,67,0.82,1.34,1.26,0.88],[7,402,1305,400,24,76,1.5,1.51,1.2,1.19],[8,20,100,8,72,28,1.08,0.55,0.94,1.12],[9,159,708,40,52,48,1.1,0.96,1.28,0.98],[10,304,840,340,51,49,1.15,0.98,1.05,1],[11,511,1008,1100,90,10,1,0.94,0.8,1.09],[12,345,1240,57,100,0,0.66,0.45,0.5,1.29]],
	[[0,0,0,0],[1,0,9,1000],[2,1,8,1000],[3,2,7,1000],[4,3,0,1000],[5,4,5,10],[6,5,4,10],[7,6,3,10],[8,7,2,10],[9,8,1,1000],[10,9,6,10]],
	[[0,0,0,false,0,0,0,0,0,0,0,0,0,0,0,0,0,false],[1,0,0,false,736,5,4,5,200,2460,0,0,0,2460,0.9,5,980,false],[2,0,0,false,84,2,160,35,900,20,0,0,0,0,0,1,0,false],[3,0,0,false,40,4,178,42,900,10,0,0,0,0,0,2,0,false],[4,0,0,false,4000,3,48,10,0,160,50,100,0,0,0,1,3800,false],[5,0,0,false,336,3,2,2,900,360,0,0,0,0,0,1,980,false],[6,0,0,false,736,5,290,5,900,160,0,0,0,0,0,5,980,false],[7,0,0,false,2000,3,48,8,0,160,50,100,0,0,0,2,3800,false],[8,0,0,false,4000,4,48,3,0,160,50,100,0,0,0,1,9999,false],[9,0,0,false,2000,3,48,8,0,160,50,100,0,0,0,2,3800,false],[10,0,0,false,1790,2,52,5,32,100,12,120,50,70,0.06,1,0,false],[11,0,0,false,2000,4,0,8,0,0,50,100,0,0,0,2,3800,false],[12,0,0,false,56,5,10,5,50,530,0,0,0,530,0.7,1,980,false],[13,0,0,false,144,5,24,4,600,160,0,0,80,100,0.6,10,0,false],[14,0,0,false,3000,3,48,8,0,160,50,100,0,0,0,1,2800,false],[15,0,0,false,150,4,118,32,900,30,0,0,0,0,0,2,0,false],[16,0,0,false,8000,3,96,3,2,200,50,100,0,0,0,1,3800,false],[17,0,0,false,360,5,128,25,320,160,0,0,0,0,0,1,0,false],[18,0,0,false,2250,2,256,5,20,320,50,250,1,10,0.01,2,0,false],[19,0,0,false,2,5,44,5,100,400,0,0,50,400,0.35,20,180,false],[20,0,0,false,0,6,36,10,600,160,0,0,0,0,0,3,200,false],[21,0,0,false,47,2,160,29,900,60,0,0,0,0,0,2,0,false]],
];

var formatarr = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[34,31,30,34,40,11,5,0,1,0,0,9,2,2,1,0],[25,22,21,25,39,58,42,42,4,0,0,0,10,2,8,0],[10,10,10,10,8,49,5,0,0,0,1,0,0,0,0,0],[0,0,0,0,5,49,2,0,2,1,1,1,1,0,0,0],[4,4,4,4,17,15,1,0,0,2,6,0,2,1,1,0],[6,6,6,6,7,11,1,6,1,4,5,4,4,8,2,0],[2,2,2,2,5,14,8,8,1,4,1,0,4,1,1,0],[14,14,14,20,2,11,5,1,1,0,1,0,1,0,1,0],[12,12,12,12,1,19,0,0,3,6,1,1,3,0,5,0],[26,23,22,26,67,67,0,0,12,13,1,0,1,0,1,0],[27,24,23,27,21,21,21,45,3,1,1,9,1,0,3,0],[36,33,32,36,70,70,5,2,2,4,9,13,3,0,2,7],[24,21,20,24,24,0,0,46,10,4,2,4,2,1,12,0],[11,11,11,11,3,11,5,0,0,1,3,2,4,2,0,0],[15,15,15,15,5,12,3,6,0,0,1,1,1,8,1,0],[1,1,1,1,5,12,7,0,3,1,0,0,4,1,1,0],[9,9,9,9,1,32,0,3,2,3,0,0,4,0,1,0],[16,16,16,16,5,12,1,1,0,0,0,0,1,1,1,0],[5,5,5,5,6,17,0,0,0,2,0,0,0,0,1,0],[17,17,17,17,8,16,6,6,2,2,6,1,1,8,1,0],[18,18,18,18,4,14,8,8,1,5,0,4,3,0,4,0],[3,3,3,3,4,13,4,0,3,2,1,0,2,8,3,0],[19,20,19,23,5,51,5,5,0,1,0,0,2,8,1,0],[28,25,24,28,20,32,34,34,1,1,0,0,1,1,1,0],[29,26,25,29,0,0,23,23,10,0,0,0,0,4,12,0],[33,30,29,33,19,19,26,26,12,2,0,0,10,0,1,1],[7,7,7,7,15,31,5,0,1,2,6,0,10,1,1,0],[31,28,27,31,66,66,22,22,1,12,1,1,1,0,0,0],[8,8,8,8,18,10,0,0,1,5,6,0,9,8,1,0],[30,27,26,30,0,56,34,34,3,2,1,1,1,0,1,0],[32,29,28,32,29,29,25,25,2,4,1,0,4,1,1,0],[35,32,31,35,0,68,25,25,3,2,1,3,5,1,1,9],[11,11,4,2,30,30,5,0,0,9,6,10,2,1,1,0],//ポリターン
	//
	[26,6,6,6,0,8,0,32,3,5,4,7,5,0,0,2],[0,2,0,4,0,8,2,7,3,1,9,2,5,0,0,1],[2,14,14,14,1,3,6,7,3,1,9,3,4,0,7,4],[0,0,0,0,37,37,6,3,0,2,6,0,2,1,1,2],[4,0,6,12,29,25,43,0,1,2,3,0,1,1,1,0],[0,0,12,12,5,24,33,0,2,1,1,1,1,0,2,0],[2,10,6,4,22,31,0,0,2,3,4,0,1,1,3,0],[13,23,0,4,0,31,36,44,2,2,1,1,1,0,4,1],[13,23,12,2,67,30,41,41,3,2,1,2,1,4,4,1],[6,6,6,6,8,5,9,15,0,0,0,0,0,0,0,0],[25,22,21,25,6,5,6,6,6,0,1,0,10,0,7,1],[26,23,21,25,3,1,5,31,2,0,1,0,10,0,0,1],[0,4,12,20,0,19,20,45,3,2,0,0,6,2,3,1],[0,0,0,2,22,19,8,8,2,0,1,0,0,0,0,0],[0,0,0,6,0,19,2,40,3,5,1,3,6,2,1,4],[26,6,6,6,0,8,0,32,3,5,4,2,5,0,0,2],[10,23,4,4,0,8,22,0,1,0,1,0,0,0,1,0],[10,2,0,14,0,8,35,21,2,0,1,0,0,0,1,0],[26,6,6,6,0,8,0,32,3,5,4,7,5,0,0,2],[2,2,0,14,0,8,17,3,1,0,3,0,0,0,0,2],[2,2,0,6,0,8,4,2,1,0,3,5,3,0,4,0],[26,0,4,12,27,40,0,0,2,5,1,1,1,1,7,4],[26,0,6,6,60,22,1,43,1,0,1,0,0,0,1,0],[26,0,4,6,21,24,0,30,2,0,1,0,0,0,1,0],[0,4,12,12,21,4,15,10,0,0,0,0,0,0,0,0],[12,2,22,25,52,43,23,28,3,0,1,0,4,0,4,0],[12,13,6,20,21,43,18,40,3,0,1,0,5,0,4,0],[28,28,21,3,66,66,43,30,10,2,1,0,7,0,7,1],[10,4,10,10,3,33,6,0,0,0,1,0,0,0,0,0],[10,4,10,12,42,13,0,27,0,0,1,0,0,0,1,0],[28,28,21,3,66,66,43,30,10,2,1,0,7,0,7,1],[25,24,21,25,2,13,0,0,6,0,1,0,0,0,1,0],[25,24,21,25,6,51,0,29,6,0,1,0,10,0,1,0],[13,13,13,2,50,0,25,25,6,1,1,0,1,0,0,0],[13,24,22,13,32,0,0,0,6,1,1,0,2,0,4,0],[13,13,23,13,28,0,0,24,4,6,3,1,1,0,1,9],
	//
	[6,10,13,19,0,0,0,0,10,5,4,1,9,4,6,0],[3,19,30,10,0,0,0,0,10,11,6,9,10,11,3,0],[12,14,4,22,0,0,0,0,4,10,6,8,6,1,8,8],[22,28,21,33,0,0,0,0,10,10,6,10,10,8,8,0],[14,15,1,21,0,0,0,0,12,10,11,10,10,8,8,0],[16,9,10,31,0,0,0,0,12,8,7,10,4,8,1,0],[21,24,13,21,0,0,0,0,12,9,6,10,10,8,8,0],[21,24,13,13,0,0,0,0,10,10,6,10,10,8,8,0],[21,0,27,16,0,0,0,0,10,7,6,12,3,11,3,0],[21,24,13,13,0,0,0,0,11,9,6,10,10,8,8,0],
	//
	[30,7,27,21,45,45,0,0,13,10,12,14,12,7,12,0],//heavy
	[21,13,23,0,2,2,0,0,0,5,4,0,0,0,0,5]//agree
];
