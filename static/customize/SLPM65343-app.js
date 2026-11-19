/**
 * PANZERFRAME - Dual Volume (SLPM65343) Customize App
 * Modern rewrite aligned with SLPM65199-app naming
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const WEAPON_GROUP = [
    "装備なし", "Sマシンガン", "カタナ", "パイルバンカー", "ノーマルハンマー",
    "ウィングシールド", "ライトガード", "バトルアックス", "サンダコン", "V・シールド",
    "フォルテシモ", "ゴッドアーム", "Mガントレット", "ショットガン", "レーザーソード",
    "レーザースピア", "カタール", "ロングバズーカ", "バスターランチャー", "ブラフォードソード",
    "ブラフォードガード", "ポプリステッキ", "ショートバズーカ", "レーザーピストル", "クラブ",
    "ヤミフブキ", "死人鎌", "スマートガン", "斬馬刀", "アサシンファング",
    "プラズマライフル", "ヴィクトリアル", "フローティングマイン", "デッキブラシ", "ウィング",
    "十文字大手裏剣", "モーターキャノン", "ガトリング砲", "AAFミサイル", "カウンターリング",
    "ラグーンブースト", "ポプリウィング", "ナイン", "2連ミサイルポッド", "プチマシンガン",
    "MLRS", "スライスカッター", "レールキャノン", "キャノン", "プロポシブルキラー",
    "エキスプロード", "マインドラム", "ホールモーター"
  ];

  const ATTR = ["-", "無属性", "衝撃", "熱", "内部破壊", "兵器破壊", "電波", "防御完全", "防御軽減", "飛行補助", "戦闘補助"];
  const ATTR_CLASS = ["", "neutral", "impulse", "thermal", "inner", "destraction", "jammer", "guard", "guard", "support", "regenerate"];

  // Select IDs in form order (logic indices)
  const SELECT_IDS = {
    type: "select_type",
    head: "select_head",
    main: "select_main",
    armL: "select_arm_l",
    armR: "select_arm_r",
    leg: "select_leg",
    weaponL: "select_weapon_l",
    weaponR: "select_weapon_r",
    shoulderL: "select_shoulder_l",
    shoulderR: "select_shoulder_r",
    material: "select_material",
    booster: "select_booster",
    innerBox: "select_innerbox",
    generator: "select_generator",
    wcs1: "select_wcs1",
    wcs2: "select_wcs2",
    wcs3: "select_wcs3",
    heatGel: "select_heatgel",
    purge: "select_purge",
    trans0: "select_trans0",
    trans1: "select_trans1",
    trans2: "select_trans2",
    trans3: "select_trans3",
    format: "select_format"
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let data = null;
  const state = {
    key: [],
    parts: [] // resolved rows
  };

  // ---------------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(id) {
    return document.getElementById(id);
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value == null ? "-" : String(value);
  }

  function sel(id) {
    return el(id);
  }

  function selectedIndex(id) {
    const s = sel(id);
    return s ? Math.max(0, s.selectedIndex) : 0;
  }

  function setSelectedIndex(id, index) {
    const s = sel(id);
    if (!s) return;
    if (index >= 0 && index < s.options.length) s.selectedIndex = index;
  }

  function setDisabled(id, disabled) {
    const s = sel(id);
    if (s) s.disabled = !!disabled;
  }

  // ---------------------------------------------------------------------------
  // Populate options
  // ---------------------------------------------------------------------------
  function appendOptions(selectEl, rows, options = {}) {
    if (!selectEl || !rows) return;
    selectEl.innerHTML = "";
    const groups = new Map();

    rows.forEach((row, i) => {
      if (options.skipIf && options.skipIf(row, i)) return;

      const opt = document.createElement("option");
      opt.textContent = row[0] || "";
      opt.value = String(i);
      if (row[1]) opt.title = String(row[1]);
      if (options.disableFirst && i === 0) opt.disabled = true;

      if (options.groupBy) {
        const label = options.groupBy(row);
        if (label) {
          let g = groups.get(label);
          if (!g) {
            g = document.createElement("optgroup");
            g.label = label;
            groups.set(label, g);
            selectEl.appendChild(g);
          }
          g.appendChild(opt);
          return;
        }
      }
      selectEl.appendChild(opt);
    });
  }

  function populateSelects() {
    appendOptions(sel(SELECT_IDS.type), data.customize);
    appendOptions(sel(SELECT_IDS.head), data.head);
    appendOptions(sel(SELECT_IDS.main), data.main);
    appendOptions(sel(SELECT_IDS.armL), data.arm);
    appendOptions(sel(SELECT_IDS.armR), data.arm);
    appendOptions(sel(SELECT_IDS.leg), data.leg);

    const weaponGroupBy = (row) => WEAPON_GROUP[row[2]] || "その他";
    appendOptions(sel(SELECT_IDS.weaponL), data.hundWeapon, {
      skipIf: (row) => row[3] != 0,
      groupBy: weaponGroupBy
    });
    appendOptions(sel(SELECT_IDS.weaponR), data.hundWeapon, {
      skipIf: (row) => row[3] != 0,
      groupBy: weaponGroupBy
    });
    appendOptions(sel(SELECT_IDS.shoulderL), data.shoulderWeapon, {
      skipIf: (row) => row[3] != 0,
      groupBy: weaponGroupBy
    });
    appendOptions(sel(SELECT_IDS.shoulderR), data.shoulderWeapon, {
      skipIf: (row) => row[3] != 0,
      groupBy: weaponGroupBy
    });

    appendOptions(sel(SELECT_IDS.material), data.material);
    appendOptions(sel(SELECT_IDS.booster), data.booster);
    appendOptions(sel(SELECT_IDS.innerBox), data.innerBox);
    appendOptions(sel(SELECT_IDS.generator), data.generator);
    appendOptions(sel(SELECT_IDS.wcs1), data.wcs, { disableFirst: true });
    appendOptions(sel(SELECT_IDS.wcs2), data.wcs, { disableFirst: true });
    appendOptions(sel(SELECT_IDS.wcs3), data.wcs, { disableFirst: true });
    appendOptions(sel(SELECT_IDS.heatGel), data.heatGel);
    appendOptions(sel(SELECT_IDS.purge), data.purge, { disableFirst: true });

    for (let i = 0; i < 4; i++) {
      appendOptions(sel(SELECT_IDS["trans" + i]), data.variable, { disableFirst: true });
    }

    // format with optgroup by faction name at [1]
    const formatSel = sel(SELECT_IDS.format);
    if (formatSel) {
      formatSel.innerHTML = "";
      const groups = new Map();
      data.format.forEach((row, i) => {
        const opt = document.createElement("option");
        opt.textContent = row[0] || "";
        opt.value = String(i);
        const label = row[1] || "その他";
        let g = groups.get(label);
        if (!g) {
          g = document.createElement("optgroup");
          g.label = label;
          groups.set(label, g);
          formatSel.appendChild(g);
        }
        g.appendChild(opt);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Custom type enable/disable
  // ---------------------------------------------------------------------------
  function applyCustomType() {
    const typeIdx = selectedIndex(SELECT_IDS.type);
    const cfg = data.customize[typeIdx];
    if (!cfg) return;

    // cfg: [name, comment, armSame, purge, transform, wcsCount]
    const armSame = cfg[2] === 1;
    const purgeOn = cfg[3] === 1;
    const transOn = cfg[4] === 1;
    const wcsCount = cfg[5] || 1;

    const rightArmChk = el("RIGHTARM");
    if (rightArmChk) {
      if (armSame) {
        rightArmChk.checked = true;
        rightArmChk.disabled = true;
      } else {
        rightArmChk.disabled = false;
      }
    }

    // WCS 1..3
    for (let i = 0; i < 3; i++) {
      const id = SELECT_IDS["wcs" + (i + 1)];
      const disabled = wcsCount <= i;
      setDisabled(id, disabled);
      if (disabled) setSelectedIndex(id, 0);
      else if (selectedIndex(id) === 0) setSelectedIndex(id, 1);
    }

    setDisabled(SELECT_IDS.purge, !purgeOn);
    if (!purgeOn) setSelectedIndex(SELECT_IDS.purge, 0);
    else if (selectedIndex(SELECT_IDS.purge) === 0) setSelectedIndex(SELECT_IDS.purge, 1);

    for (let i = 0; i < 4; i++) {
      const id = SELECT_IDS["trans" + i];
      setDisabled(id, !transOn);
      if (!transOn) setSelectedIndex(id, 0);
      else if (selectedIndex(id) === 0) setSelectedIndex(id, 1);
    }

    applyArmSymmetry();
  }

  function applyArmSymmetry() {
    const chk = el("RIGHTARM");
    const same = chk ? chk.checked : false;
    setDisabled(SELECT_IDS.armR, same);
    if (same) {
      setSelectedIndex(SELECT_IDS.armR, selectedIndex(SELECT_IDS.armL));
    }
  }

  // ---------------------------------------------------------------------------
  // Format preset
  // ---------------------------------------------------------------------------
  function applyFormat() {
    const idx = selectedIndex(SELECT_IDS.format);
    const row = data.format[idx];
    if (!row) return;

    // format row: [name, faction, ... select indices starting at [2]]
    // Order matches original: type, head, main, armL, armR, leg, wL, wR, sL, sR,
    // material, booster, inner, gen, wcs1, wcs2, wcs3, gel, purge, t0,t1,t2,t3
    const map = [
      SELECT_IDS.type, SELECT_IDS.head, SELECT_IDS.main, SELECT_IDS.armL, SELECT_IDS.armR,
      SELECT_IDS.leg, SELECT_IDS.weaponL, SELECT_IDS.weaponR, SELECT_IDS.shoulderL, SELECT_IDS.shoulderR,
      SELECT_IDS.material, SELECT_IDS.booster, SELECT_IDS.innerBox, SELECT_IDS.generator,
      SELECT_IDS.wcs1, SELECT_IDS.wcs2, SELECT_IDS.wcs3, SELECT_IDS.heatGel,
      SELECT_IDS.purge, SELECT_IDS.trans0, SELECT_IDS.trans1, SELECT_IDS.trans2, SELECT_IDS.trans3
    ];

    for (let i = 0; i < map.length; i++) {
      const val = row[i + 2];
      if (val != null) setSelectedIndex(map[i], val);
    }

    const chk = el("RIGHTARM");
    if (chk) chk.checked = false;

    applyCustomType();
  }

  // ---------------------------------------------------------------------------
  // Resolve parts & calculate
  // ---------------------------------------------------------------------------
  function resolveParts() {
    const p = [];
    p[0] = data.head[selectedIndex(SELECT_IDS.head)];
    p[1] = data.main[selectedIndex(SELECT_IDS.main)];
    p[2] = data.arm[selectedIndex(SELECT_IDS.armL)];
    p[3] = data.arm[selectedIndex(SELECT_IDS.armR)];
    p[4] = data.leg[selectedIndex(SELECT_IDS.leg)];
    p[5] = data.hundWeapon[selectedIndex(SELECT_IDS.weaponL)];
    p[6] = data.hundWeapon[selectedIndex(SELECT_IDS.weaponR)];
    p[7] = data.shoulderWeapon[selectedIndex(SELECT_IDS.shoulderL)];
    p[8] = data.shoulderWeapon[selectedIndex(SELECT_IDS.shoulderR)];
    p[9] = data.material[selectedIndex(SELECT_IDS.material)];
    p[10] = data.booster[selectedIndex(SELECT_IDS.booster)];
    p[11] = data.innerBox[selectedIndex(SELECT_IDS.innerBox)];
    p[12] = data.generator[selectedIndex(SELECT_IDS.generator)];
    p[13] = data.wcs[selectedIndex(SELECT_IDS.wcs1)];
    p[14] = data.wcs[selectedIndex(SELECT_IDS.wcs2)];
    p[15] = data.wcs[selectedIndex(SELECT_IDS.wcs3)];
    p[16] = data.heatGel[selectedIndex(SELECT_IDS.heatGel)];
    // inner weapons
    p[17] = data.innerWeapon[p[0][2]] || data.innerWeapon[0];
    p[18] = data.innerWeapon[p[1][2]] || data.innerWeapon[0];
    state.parts = p;
    return p;
  }


  function setDdValues(rootSelector, values) {
    const dds = $$(rootSelector + " dd");
    values.forEach((v, i) => {
      if (dds[i]) setText(dds[i], v);
    });
  }

  function weaponAttrName(code) {
    const n = Number(code) || 0;
    return ATTR[n] || "-";
  }

  function weaponAttrClass(code) {
    const n = Number(code) || 0;
    return ATTR_CLASS[n] || "";
  }

  function calculate() {
    const p = resolveParts();
    if (!p[0]) return;

    // Weight
    let w =
      (p[0][3] || 0) + (p[1][3] || 0) + (p[2][2] || 0) + (p[3][2] || 0) + (p[4][2] || 0);
    w *= p[9][2] || 1;
    w += (p[5][4] || 0) + (p[6][4] || 0) + (p[7][4] || 0) + (p[8][4] || 0);
    w += (p[10][2] || 0) + (p[11][2] || 0) + (p[16][2] || 0);
    if (p[5][0] === "真・双斬破" && p[6][0] === "真・双斬破") w = w >> 1;
    if (p[16][0] === "ウエイトG") w -= 1000;
    const maxW = p[4][6] || 0;

    // Energy
    let e =
      (p[0][4] || 0) + (p[1][4] || 0) + (p[2][3] || 0) + (p[3][3] || 0) + (p[4][3] || 0);
    e *= p[9][3] || 1;
    const maxE = p[11][3] || 0;

    // HP
    let outerHp =
      (p[0][5] || 0) + (p[1][5] || 0) + (p[2][4] || 0) + (p[3][4] || 0) + (p[4][4] || 0);
    outerHp *= p[9][4] || 1;

    let innerHp = (p[10][6] || 0) + (p[12][5] || 0);
    const typeIdx = selectedIndex(SELECT_IDS.type);
    innerHp += typeIdx === 1 ? (p[13][2] || 0) * 3 : (p[13][2] || 0);
    innerHp += (p[14][2] || 0) + (p[15][2] || 0);
    innerHp += Math.trunc(((p[11][4] || 0) + (p[1][7] || 0) - 2) * innerHp);

    const totalHp = outerHp + innerHp;
    const rateInner = totalHp ? Math.trunc((innerHp / totalHp) * 100) : 0;
    const rateOuter = 100 - rateInner;

    // Defense
    let def =
      (p[0][6] || 0) + (p[1][6] || 0) + (p[2][5] || 0) + (p[3][5] || 0) + (p[4][5] || 0);
    def *= p[9][5] || 1;

    let defAli = 7;
    const aliMap = [-5, 0, -1, 1];
    defAli += aliMap[p[0][8]] || 0;
    defAli += aliMap[p[1][9]] || 0;
    defAli += aliMap[p[2][9]] || 0;
    defAli += aliMap[p[3][9]] || 0;
    defAli += aliMap[p[4][10]] || 0;
    defAli += aliMap[p[10][8]] || 0;
    defAli += aliMap[p[12][2]] || 0;

    let defRateIm = 100 - (7 * defAli + 1);
    let defRateTh = 7 * defAli + 1;
    if (p[16][0] === "耐衝撃G") {
      defRateIm = Math.trunc((defRateIm + 100) / 2);
      defRateTh = 100 - defRateIm;
    } else if (p[16][0] === "耐熱G") {
      defRateTh = Math.trunc((defRateTh + 100) / 2);
      defRateIm = 100 - defRateTh;
    }

    const punchL = p[2][6] || 0;
    const punchR = p[3][6] || 0;
    const swingL = p[2][7] || 0;
    const swingR = p[3][7] || 0;

    // ---- INFORMATION / meters ----
    const spans = $$("#INFORMATION span");
    if (spans.length >= 4) {
      setText(spans[0], e);
      setText(spans[1], maxE);
      setText(spans[2], w);
      setText(spans[3], maxW);
    }
    const en = el("EN");
    const we = el("WE");
    if (en) {
      setText(en, e + "/" + maxE);
      en.style.color = e > maxE ? "red" : "";
    }
    if (we) {
      setText(we, w + "/" + maxW);
      we.style.color = w > maxW ? "red" : "";
    }
    const ep = el("EP");
    const weightEl = el("WEIGHT");
    if (ep) {
      ep.value = e;
      ep.max = maxE || 1;
      ep.style.outline = e > maxE ? "solid 1px red" : "none";
    }
    if (weightEl) {
      weightEl.value = w;
      weightEl.max = maxW || 1;
      weightEl.style.outline = w > maxW ? "solid 1px red" : "none";
    }


    // ---- EFFECT (ported from SLPM65343_.js / hp.js) ----
    // key[] mirrors original select index order
    const key = [
      selectedIndex(SELECT_IDS.type),
      selectedIndex(SELECT_IDS.head),
      selectedIndex(SELECT_IDS.main),
      selectedIndex(SELECT_IDS.armL),
      selectedIndex(SELECT_IDS.armR),
      selectedIndex(SELECT_IDS.leg),
      selectedIndex(SELECT_IDS.weaponL),
      selectedIndex(SELECT_IDS.weaponR),
      selectedIndex(SELECT_IDS.shoulderL),
      selectedIndex(SELECT_IDS.shoulderR),
      selectedIndex(SELECT_IDS.material),
      selectedIndex(SELECT_IDS.booster),
      selectedIndex(SELECT_IDS.innerBox),
      selectedIndex(SELECT_IDS.generator),
      selectedIndex(SELECT_IDS.wcs1),
      selectedIndex(SELECT_IDS.wcs2),
      selectedIndex(SELECT_IDS.wcs3),
      selectedIndex(SELECT_IDS.heatGel),
      selectedIndex(SELECT_IDS.purge),
      selectedIndex(SELECT_IDS.trans0),
      selectedIndex(SELECT_IDS.trans1),
      selectedIndex(SELECT_IDS.trans2),
      selectedIndex(SELECT_IDS.trans3)
    ];
    const asm = p; // resolved part rows

    // 規格仕様 (compo)
    let compo = 0;
    const a1 = key.slice(1, 6).join(",");
    if (key[0] !== 0 && data.format) {
      for (let i = 1; i < data.format.length; i++) {
        const a0head = data.format[i].slice(3, 8).join(",");
        if (a1 === a0head) {
          compo = 1;
          const a0 = data.format[i].slice(2, 25).map((v, idx) => {
            // transform slots may be wildcards when < 2 in original
            if (idx >= 17 && idx <= 20 && v < 2) return "\\d+";
            return String(v);
          });
          try {
            const re = new RegExp("^" + a0.join(",") + "$");
            if (re.test(key.join(","))) compo = 2;
          } catch (_) {
            /* ignore bad pattern */
          }
          break;
        }
      }
    }

    // 特殊装備 (special) — truthy flags on weapon/material rows
    let special = 0;
    special |= asm[5] && asm[5][17] ? 1 : 0;
    special |= asm[6] && asm[6][17] ? 1 : 0;
    special |= asm[7] && asm[7][17] ? 1 : 0;
    special |= asm[8] && asm[8][17] ? 1 : 0;
    special |= asm[9] && asm[9][6] ? 1 : 0;
    special |= asm[11] && asm[11][6] ? 1 : 0;
    special |= asm[12] && asm[12][7] ? 1 : 0;
    special = special ? 1 : 0;

    // 腕部無装 (efNon)
    // 肩無装備0x8 / 腕無装備0x1
    let efNonBits = 0;
    if (key[6] + key[7] === 0) efNonBits |= 1;
    if (key[8] + key[9] === 0) efNonBits |= 8;
    const efNon = (efNonBits & 9) === 9 ? 1 : (efNonBits & 1) === 1 ? 2 : 0;

    // 防御特化 (efDef)
    let efDef = 0;
    if (w <= maxW && e <= maxE && defRateIm === defRateTh && def < 2000 && totalHp < 9000) {
      efDef = 1;
    }

    // 機体重量 (efWei)
    let efWei = 0;
    if (key[0] !== 0) {
      efWei =
        w < 1154 ? 1 :
        w < 1539 ? 2 :
        w < 1924 ? 3 :
        w < 2463 ? 4 :
        w < 3081 ? 5 :
        w > 7230 ? 6 :
        w > 6769 ? 7 :
        w > 6307 ? 8 :
        w > 5769 ? 9 :
        w > 5459 ? 10 : 0;
      if (compo === 2 && efWei < 6) efWei = 0;
    }

    // 積載重量 (efCap) — use percentage (original ~~(w/maxw) cannot match >84 thresholds)
    let efCap = 0;
    const wRate = maxW ? Math.trunc((w * 100) / maxW) : 0;
    if (compo > 0) {
      efCap = 21;
    } else if (key[0] > 0 && efWei > 0) {
      if (efWei > 0 && efWei < 6) {
        // 軽量帯
        efCap =
          wRate > 84 ? 1 : wRate > 82 ? 2 : wRate > 80 ? 3 : wRate > 78 ? 4 : wRate > 75 ? 5 :
          wRate < 21 ? 6 : wRate < 23 ? 7 : wRate < 36 ? 8 : wRate < 41 ? 9 : wRate < 50 ? 10 : 0;
      } else if (efWei > 5 && efWei < 11) {
        // 重量帯
        efCap =
          wRate > 98 ? 11 : wRate > 96 ? 12 : wRate > 94 ? 13 : wRate > 90 ? 14 : wRate > 88 ? 15 :
          wRate < 71 ? 16 : wRate < 73 ? 17 : wRate < 75 ? 18 : wRate < 77 ? 19 : wRate < 79 ? 20 : 0;
      }
    }
    // 積載一致・前賞（元コードの拡張として）
    if (compo === 0 && key[0] > 0 && w === maxW) efCap = 22;
    else if (compo === 0 && key[0] > 0 && w + 1 === maxW) efCap = 23;

    // 左右対称 (symmetry)
    let symmetryBits = 0;
    if (key[8] !== 0 && key[9] !== 0) symmetryBits |= 1;
    if (key[8] === key[9]) symmetryBits |= 2;
    if (key[6] === key[7]) symmetryBits |= 4;
    if (asm[0] && asm[0][9] == 1) symmetryBits |= 8;
    const symmetry =
      (symmetryBits & 14) === 14 ? 3 :
      (symmetryBits & 6) === 6 ? 2 :
      (symmetryBits & 3) === 3 ? 1 : 0;

    const labelsCompo = ["-", "全規格外装", "完全規格"];
    const labelsCap = [
      "-", "積載軽量A", "積載軽量B", "積載軽量C", "積載軽量D", "積載軽量E",
      "積載重量A", "積載重量B", "積載重量C", "積載重量D", "積載重量E",
      "積載軽量A", "積載軽量B", "積載軽量C", "積載軽量D", "積載軽量E",
      "積載重量A", "積載重量B", "積載重量C", "積載重量D", "積載重量E",
      "積載量補正", "積載量一致", "積載量前賞"
    ];
    const labelsWei = [
      "-", "機体軽量A", "機体軽量B", "機体軽量C", "機体軽量D", "機体軽量E",
      "機体重量A", "機体重量B", "機体重量C", "機体重量D", "機体重量E"
    ];
    const labelsNon = ["-", "完全無装", "腕部無装"];
    const labelsSym = ["-", "肩装備対称", "兵器左右対", "完全左右対"];

    // HTML order: 0規格 1専用 2積載 3特殊 4無装 5攻属 6防御 7機体重量 8武装 9左右 10EP 11BMS
    setDdValues("#EFFECT", [
      labelsCompo[compo] || "-",
      "-", // 専用兵器（元もほぼ未設定）
      labelsCap[efCap] || "-",
      special ? "特殊装備" : "-",
      labelsNon[efNon] || "-",
      "-", // 攻属特化（元も空）
      efDef ? "防御無属性" : "-",
      labelsWei[efWei] || "-",
      "-", // 武装形態
      labelsSym[symmetry] || "-",
      e > maxE ? "EP不足" : "-",
      "-"  // BMS限界
    ]);

    // ---- GENERAL detailed dls ----
    // First block: 総合値 — 12 dd
    const genRoot = $("#GENERAL");
    if (genRoot) {
      const dls = genRoot.querySelectorAll("dl");
      // dl[0] 総合値
      if (dls[0]) {
        const dd = dls[0].querySelectorAll("dd");
        const vals = [
          rateOuter + ":" + rateInner,
          defRateIm + ":" + defRateTh,
          totalHp,
          outerHp,
          innerHp,
          w,
          e,
          def,
          Math.trunc(def * (defRateIm / 100)),
          Math.trunc(def * (defRateTh / 100)),
          punchL,
          punchR
        ];
        vals.forEach((v, i) => { if (dd[i]) setText(dd[i], v); });
      }
      // dl[1] インナーBOX 最大EP
      if (dls[1]) {
        const dd = dls[1].querySelectorAll("dd");
        if (dd[0]) setText(dd[0], maxE);
      }
      // dl[2] ジェネレーター
      if (dls[2]) {
        const dd = dls[2].querySelectorAll("dd");
        if (dd[0]) setText(dd[0], p[12][3] != null ? p[12][3] : "-");
        if (dd[1]) setText(dd[1], p[12][4] != null ? p[12][4] : "-");
      }
      // dl[3] メイン 空中旋回
      if (dls[3]) {
        const dd = dls[3].querySelectorAll("dd");
        if (dd[0]) setText(dd[0], p[1][8] != null ? p[1][8] : "-");
      }
      // dl[4] レッグ
      if (dls[4]) {
        const dd = dls[4].querySelectorAll("dd");
        if (dd[0]) setText(dd[0], maxW);
        if (dd[1]) setText(dd[1], p[4][7] != null ? p[4][7] : "-");
        if (dd[2]) setText(dd[2], p[4][8] != null ? p[4][8] : "-");
      }
      // dl[5] ブースター
      if (dls[5]) {
        const dd = dls[5].querySelectorAll("dd");
        if (dd[0]) setText(dd[0], p[10][7] != null ? p[10][7] : "-");
        if (dd[1]) setText(dd[1], p[10][3] != null ? p[10][3] : "-");
        if (dd[2]) setText(dd[2], p[10][4] != null ? p[10][4] : "-");
      }
    }

    // ---- CORRECTION (placeholder ratios from material / parts) ----
    const corrRoot = $("#CORRECTION");
    if (corrRoot) {
      const dls = corrRoot.querySelectorAll("dl");
      // Show material multipliers and key part stats as readable detail
      const mat = p[9];
      const pairs = [
        // フレーム: 空中旋回(point), 内部HP
        [dls[0], [p[1][8] != null ? p[1][8] : "-", mat[4] != null ? mat[4] : "-"]],
        // ブースター: 加速, 最高速
        [dls[1], [p[10][4] != null ? p[10][4] : "-", p[10][3] != null ? p[10][3] : "-"]],
        // ジェネレーター: 出力, 回復
        [dls[2], [p[12][3] != null ? p[12][3] : "-", p[12][4] != null ? p[12][4] : "-"]],
        // レッグ: 地上旋回, 歩行
        [dls[3], [p[4][7] != null ? p[4][7] : "-", p[4][8] != null ? p[4][8] : "-"]],
        // ジャンプ: 上昇, 反応 (leg fields if present)
        [dls[4], [p[4][9] != null ? p[4][9] : "-", p[4][10] != null ? p[4][10] : "-"]],
        // ロック
        [dls[5], [
          p[0][7] != null ? p[0][7] : "-",
          p[13][3] != null ? p[13][3] : "-",
          p[13][4] != null ? p[13][4] : "-"
        ]],
        // 装備兵器 summary
        [dls[6], [
          ((p[5][5] || 0) + (p[6][5] || 0)),
          ((p[7][5] || 0) + (p[8][5] || 0)),
          ((p[17] && p[17][5]) || 0) + ((p[18] && p[18][5]) || 0),
          ((p[5][15] || 0) + (p[6][15] || 0) + (p[7][15] || 0) + (p[8][15] || 0))
        ]],
        // アーム
        [dls[7], [punchL + "/" + punchR, swingL + "/" + swingR]],
        // その他
        [dls[8], [mat[0] || "-"]]
      ];
      pairs.forEach(([dl, vals]) => {
        if (!dl) return;
        const dd = dl.querySelectorAll("dd");
        vals.forEach((v, i) => { if (dd[i]) setText(dd[i], v); });
      });
    }

    // ---- WEAPON table (10 columns: Lhand Rhand Lsh Rsh head chest + 4 transform) ----
    // Weapon row layout from original data: name-heavy arrays
    // hundWeapon / shoulderWeapon typical indices used in display:
    // attack ~5, attr ~6 or similar — use safe fallbacks
    function wstat(row, keys, fallback) {
      if (!row) return fallback;
      for (const k of keys) {
        if (row[k] != null && row[k] !== "") return row[k];
      }
      return fallback;
    }

    const weapons = [
      p[5], p[6], p[7], p[8], p[17], p[18],
      // transform slots: show variable selection name only in attr row via separate
      null, null, null, null
    ];

    const wepBody = el("WEP");
    if (wepBody) {
      const rows = wepBody.querySelectorAll("tr");
      // row0 攻撃力, 1 属性, 2 消費, 3 爆発威力, 4 弾数, 5 弾速, 6 追尾, 7 爆発範囲
      const fieldMap = [
        [5, 4, 3],   // attack-ish
        [6, 7],      // attr code
        [15, 14, 13],
        [12, 11],
        [9, 8],
        [7, 6],
        [10],
        [11, 12]
      ];
      for (let r = 0; r < rows.length; r++) {
        const tds = rows[r].querySelectorAll("td");
        for (let c = 0; c < Math.min(6, tds.length); c++) {
          const row = weapons[c];
          if (!row) {
            setText(tds[c], "-");
            continue;
          }
          if (r === 1) {
            const code = wstat(row, fieldMap[r], 0);
            setText(tds[c], weaponAttrName(code));
            tds[c].className = weaponAttrClass(code);
          } else {
            setText(tds[c], wstat(row, fieldMap[r], "-"));
          }
        }
        // transform columns 6-9: show selected variable name on first row only
        for (let c = 6; c < Math.min(10, tds.length); c++) {
          if (r === 0) {
            const tid = SELECT_IDS["trans" + (c - 6)];
            const s = sel(tid);
            const name = s && s.selectedIndex > 0 ? s.options[s.selectedIndex].textContent : "-";
            setText(tds[c], name);
          } else {
            setText(tds[c], "-");
          }
        }
      }
    }

    // ---- WCS table ----
    const wcsBody = el("WCS");
    if (wcsBody) {
      const wcsParts = [p[13], p[14], p[15]];
      const rows = wcsBody.querySelectorAll("tr");
      // size, speed, lock, range — best-effort indices
      const fields = [[5, 4], [3, 2], [6, 7], [8, 9]];
      for (let r = 0; r < rows.length; r++) {
        const tds = rows[r].querySelectorAll("td");
        for (let c = 0; c < 3; c++) {
          const row = wcsParts[c];
          const disabled = sel(SELECT_IDS["wcs" + (c + 1)]) && sel(SELECT_IDS["wcs" + (c + 1)]).disabled;
          if (!row || disabled || selectedIndex(SELECT_IDS["wcs" + (c + 1)]) === 0) {
            setText(tds[c], "不可");
          } else {
            setText(tds[c], wstat(row, fields[r], "-"));
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------
  function onFormChange(event) {
    const t = event.target;
    if (!t) return;

    const id = t.id || "";

    if (id === SELECT_IDS.format) {
      applyFormat();
      calculate();
      return;
    }

    if (id === SELECT_IDS.type) {
      // reset format highlight
      setSelectedIndex(SELECT_IDS.format, 0);
      applyCustomType();
      calculate();
      return;
    }

    if (id === "RIGHTARM" || id === SELECT_IDS.armL) {
      applyArmSymmetry();
    }

    // weapon dual constraints (simplified)
    if (id === SELECT_IDS.weaponL || id === SELECT_IDS.weaponR) {
      // keep symmetry logic light; full dual-wield rules in original
    }

    if (id !== SELECT_IDS.format) {
      setSelectedIndex(SELECT_IDS.format, 0);
    }

    calculate();
  }

  function bindEvents() {
    const form = el("FORM");
    if (!form) {
      console.error("[PF65343] #FORM not found");
      return;
    }
    form.addEventListener("change", onFormChange);

    const chk = el("RIGHTARM");
    if (chk) chk.addEventListener("change", onFormChange);
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    data = window.PF65343_DATA;
    if (!data || !data.head) {
      console.error("[PF65343] PF65343_DATA missing. Load SLPM65343-data.js first.");
      return;
    }

    populateSelects();
    bindEvents();
    applyCustomType();
    calculate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
