/**
 * PANZERFRAME - Cobalt Squadron (SLPM65199) Customize App
 * Modern rewrite: strict mode, no inline handlers, safe DOM updates
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const PART_COUNT = 16;
  const SELECT_IDS = Array.from({ length: PART_COUNT }, (_, i) => `select${i}`);
  const FORMAT_SELECT_ID = "select16";
  const PURGE_SELECT_ID = "select_purge";

  const DATA_MAP = [0, 1, 2, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  const WEAPON_ALIGN = ["-", "無属性", "衝撃系", "熱系", "内部破壊系", "兵器破壊系", "電波系", "防御系", "飛行補助系", "戦闘補助系"];
  const WEAPON_CLASS = ["variable", "neutral", "impulse", "thermal", "inner", "destraction", "jammer", "guard", "support", "regenerate"];
  const RADAR_TYPES = ["固定型A", "固定型B", "固定型C", "可変型A", "可変型B", "可変型C"];

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const state = {
    arr: new Array(PART_COUNT).fill(0),
    parr: [],
    corr: [],
    burmRate: 0,
    flags: {
      formatFrame: 0,
      formatPerfect: 0,
      weightAgreement: false,
      weightNearmiss: false,
      irregular: 0,
    },
    totals: {
      weight: 0,
      weightCap: 0,
      energy: 0,
      energyCap: 0,
    },
  };

  let dataPack = null; // { framearr, data, formatarr, BURMcorr }

  // ---------------------------------------------------------------------------
  // DOM helpers (XSS-safe)
  // ---------------------------------------------------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $cell = (sel, root = document) => root.querySelector('[data-cell="'+sel+'"]');

  function el(id) {
    return document.getElementById(id);
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value == null ? "-" : String(value);
  }

  function setHtmlTrusted(el, html) {
    // Only for known static class spans we generate ourselves
    if (!el) return;
    el.innerHTML = html;
  }

  function getSelect(id) {
    return document.getElementById(id);
  }

  function readSelections() {
    for (let i = 0; i < PART_COUNT; i++) {
      const el = getSelect(SELECT_IDS[i]);
      state.arr[i] = el ? el.selectedIndex : 0;
      if (state.arr[i] < 0) state.arr[i] = 0;
    }
  }

  function applySelectionsToDom() {
    for (let i = 0; i < PART_COUNT; i++) {
      const el = getSelect(SELECT_IDS[i]);
      if (el && state.arr[i] < el.options.length) {
        el.selectedIndex = state.arr[i];
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Option population
  // ---------------------------------------------------------------------------
  function populateSelects() {
    const { framearr } = dataPack;
    if (!framearr) return;

    // 0-15 parts, 16 purge, 17 format (framearr length 18)
    for (let i = 0; i < framearr.length; i++) {
      let selectEl = null;
      if (i < PART_COUNT) selectEl = getSelect(SELECT_IDS[i]);
      else if (i === 16) selectEl = getSelect(PURGE_SELECT_ID);
      else if (i === 17) selectEl = getSelect(FORMAT_SELECT_ID);

      if (!selectEl) continue;
      selectEl.innerHTML = ""; // clear

      const groups = new Map();
      const rows = framearr[i];
      for (let n = 0; n < rows.length; n++) {
        const row = rows[n];
        const opt = document.createElement("option");
        opt.textContent = row[0] || "";
        if (row[1] === "invisible") {
          opt.hidden = true;
          opt.disabled = true;
        } else if (row[1] === "disabled") {
          opt.disabled = true;
        } else if (row[1] != null && row[1] !== "") {
          opt.value = String(row[1]);
        }
        if (row[2]) opt.title = String(row[2]);

        const groupLabel = row[3];
        if (groupLabel) {
          let group = groups.get(groupLabel);
          if (!group) {
            group = document.createElement("optgroup");
            group.label = groupLabel;
            groups.set(groupLabel, group);
            selectEl.appendChild(group);
          }
          group.appendChild(opt);
        } else {
          selectEl.appendChild(opt);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Weapon constraint helpers (arm / shoulder)
  // ---------------------------------------------------------------------------
  function enforceArmConstraint(isLeft) {
    const pos = isLeft ? 4 : 5;
    const other = isLeft ? 5 : 4;
    const a = state.arr;
    const posSel = getSelect(SELECT_IDS[pos]);
    const otherSel = getSelect(SELECT_IDS[other]);
    if (!posSel || !otherSel) return;

    const p = posSel.selectedIndex;
    const o = otherSel.selectedIndex;

    if ([56, 62].includes(p)) {
      otherSel.selectedIndex = 0;
    }
    if ([26, 27, 28, 61].includes(p) && ![22, 40, 57].includes(o)) {
      otherSel.selectedIndex = 0;
    } else if ([26, 27, 28, 61].includes(o) && ![22, 40, 57].includes(p)) {
      otherSel.selectedIndex = 0;
    }
    if ([66].includes(p)) {
      otherSel.selectedIndex = p;
    } else if ([66].includes(o)) {
      otherSel.selectedIndex = 0;
    }
  }

  function enforceShoulderConstraint(isLeft) {
    const pos = isLeft ? 6 : 7;
    const other = isLeft ? 7 : 6;
    const posSel = getSelect(SELECT_IDS[pos]);
    const otherSel = getSelect(SELECT_IDS[other]);
    if (!posSel || !otherSel) return;

    const p = posSel.selectedIndex;
    const o = otherSel.selectedIndex;

    if ([8, 25, 26, 34].includes(p)) {
      otherSel.selectedIndex = p;
    } else if ([8, 25, 26, 34].includes(o)) {
      otherSel.selectedIndex = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // Format preset
  // ---------------------------------------------------------------------------
  function applyFormatPreset() {
    const formatEl = getSelect(FORMAT_SELECT_ID);
    if (!formatEl) return;
    const sel = formatEl.selectedIndex;
    const { formatarr } = dataPack;
    if (!formatarr || sel < 0 || sel >= formatarr.length) return;

    for (let i = 0; i < PART_COUNT; i++) {
      state.arr[i] = formatarr[sel][i];
    }
    applySelectionsToDom();
  }

  // ---------------------------------------------------------------------------
  // Calculation core (ported & structured from original)
  // ---------------------------------------------------------------------------
  function weightTotal(final) {
    const w = state.totals.weight;
    if (final && state.arr[15] === 1) return w - 1000;
    return w;
  }

  function weightCapacity() {
    const base = state.totals.weightCap;
    return Math.trunc(base * (state.flags.formatPerfect ? 1.015 : 1));
  }

  function energyTotal(final) {
    const e = state.totals.energy;
    if (final && state.arr[15] === 4) return e - 1000;
    return e;
  }

  function energyCapacity() {
    return state.parr[8] ? state.parr[8][3] : 0;
  }

  function applyBurm(target, coeff) {
    try {
      for (let i = 0; i < 26; i++) {
        if (i === 12 || i === 13) {
          target[i] += coeff[i + 5];
        } else if (i === 20 || i === 21) {
          target[i] = target[i] || coeff[i + 5];
        } else {
          target[i] = Math.trunc(target[i] * coeff[i + 5] * 1000) * 0.001;
        }
      }
    } catch (_) {
      /* ignore malformed coeff rows */
    }
  }

  function calculate() {
    const { data, formatarr, BURMcorr } = dataPack;
    const arr = state.arr;

    // Resolve part rows
    const parr = state.parr;
    for (let i = 0; i < PART_COUNT; i++) {
      const cat = DATA_MAP[i];
      const idx = arr[i];
      parr[i] = data[cat] && data[cat][idx] ? data[cat][idx] : null;
      if (!parr[i]) {
        console.warn("Missing data for slot", i, "cat", cat, "idx", idx);
        return;
      }
    }
    // Built-in weapons from head/main
    parr[16] = data[14][parr[0][10]] || data[14][0];
    parr[17] = data[14][parr[1][8]] || data[14][0];


    // Reset flags / BURM state
    state.burmRate = 0;
    state.flags.formatFrame = 0;
    state.flags.formatPerfect = 0;
    state.flags.irregular = 0;
    state.flags.weightAgreement = false;
    state.flags.weightNearmiss = false;

    let symmetry = 0;
    let special = 0;
    let noweapon = 0;
    let weaponpower = 0;
    let atsyncro = 0;
    let personal = 0;
    let flgEnergyAgreement = false;

    // Format check (外装4スロット + 完全一致)
    const f1 = [arr[0], arr[1], arr[2], arr[3]].join(",");
    if (formatarr) {
      for (let i = 1; i < Math.min(33, formatarr.length); i++) {
        const head = formatarr[i].slice(0, 4).join(",");
        if (f1 === head) {
          state.flags.formatFrame = i;
          state.flags.formatPerfect =
            arr.join(",") === formatarr[i].join(",") ? i : 0;
          break;
        }
      }
    }

    // symmetry // ヘッドフレーム0x8 / 腕兵器0x4 / 肩兵器0x2 / 肩装備0x1
    if (parr[0][12]) symmetry |= 0x8;
    if (arr[4] === arr[5]) symmetry |= 0x4;
    if (arr[6] === arr[7]) symmetry |= 0x2;
    if (arr[6] + arr[7] > 0) symmetry |= 0x1;

    // personal (専用兵器)
    personal =
      state.flags.formatPerfect === 23 ? 1 : // アシュラ
      state.flags.formatPerfect === 9 ? 2 : // アルサレアGS
      state.flags.formatPerfect === 29 ? 3 : // アリス
      state.flags.formatPerfect === 25 ? 4 : // ラセツ
      state.flags.formatPerfect === 30 ? 5 : // リリス
      state.flags.formatPerfect === 31 ? 6 : // マリア
      arr[14] === 10 && (arr[4] === 33 || arr[5] === 33) ? 7 :
      parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && (arr[4] === 34 || arr[5] === 34) ? 8 :
      parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && arr[4] === 35 && arr[5] === 35 ? 9 :
      parr[0][11] && parr[1][9] && parr[2][10] && parr[3][13] && (arr[4] === 35 || arr[5] === 35) ? 10 :
      0;

    // special flags
    if ((arr[6] === 8 && arr[7] === 8) || (arr[6] === 25 && arr[7] === 25)) special |= 0x0001;
    if (arr[6] === 34 && arr[7] === 34) special |= 0x0002;
    if ((special & 0x1 || special & 0x2) && (arr[3] === 2 || arr[3] === 28)) special |= 0x0004;
    if (arr[0] === 23) special |= 0x0008;
    if (arr[0] === 13) special |= 0x0010;
    if (arr[0] === 12) special |= 0x0020;
    if (arr[4] === 36 && arr[5] === 36) special |= 0x0040;
    if (arr[4] === 65 || arr[5] === 65) special |= 0x0080;
    if (arr[6] === 16 || arr[7] === 16) special |= 0x0100;
    if (arr[6] === 42 || arr[7] === 42) special |= 0x0200;
    if (special & 0x200 && parr[4][15] > 0 && parr[5][15] > 0) special |= 0x0400;
    if (arr[6] === 20 || arr[7] === 20) special |= 0x0800;
    if (arr[12] === 9) special |= 0x1000;
    if (arr[12] === 8) special |= 0x2000;
    if (arr[1] === 24) special |= 0x4000;
    if (special > 0) special |= 0x8000;

    // noweapon // 肩無装0x8 / ウィング等0x4 / ミサイルショット0x2 / 腕無装0x1
    if (arr[6] + arr[7] === 0) noweapon |= 0x8;
    if (
      (arr[6] === 8 && arr[7] === 8) ||
      (arr[6] === 25 && arr[7] === 25) ||
      (arr[6] === 34 && arr[7] === 34) ||
      arr[6] === 16 ||
      arr[7] === 16
    ) {
      noweapon |= 0x4;
    }
    if (arr[6] === 20 || arr[7] === 20) noweapon |= 0x2;
    if (arr[4] + arr[5] === 0) noweapon |= 0x1;

    // atsyncro // 左腕0x8 右腕0x4 左肩0x2 右肩0x1
    const armAttr = parr[2][8];
    const lim = armAttr === 2 ? 6 : 7;
    if (parr[4][5] === 0 || parr[4][5] === armAttr || parr[4][5] > lim) atsyncro |= 0x8;
    if (parr[5][5] === 0 || parr[5][5] === armAttr || parr[5][5] > lim) atsyncro |= 0x4;
    if (parr[6][5] === 0 || parr[6][5] === armAttr || parr[6][5] > lim) atsyncro |= 0x2;
    if (parr[7][5] === 0 || parr[7][5] === armAttr || parr[7][5] > lim) atsyncro |= 0x1;

    // Base corr
    let corr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, false, false, 1, 1, 1, 1, 1, 1];
    state.corr = corr;

    // Totals
    let weight = 0;
    for (let i = 0; i < PART_COUNT; i++) weight += parr[i][1] || 0;
    console.log(weight)
    console.log(parr)
    let energy =
      (parr[0][2] || 0) +
      (parr[1][2] || 0) +
      (parr[2][2] || 0) +
      (parr[3][2] || 0) +
      (parr[10][2] || 0) +
      (parr[11][2] || 0) +
      (parr[12][2] || 0) +
      (parr[13][2] || 0) +
      (parr[14][2] || 0) +
      (parr[15][2] || 0);

    state.totals.weight = weight;
    state.totals.energy = energy;
    state.totals.weightCap = Math.trunc((parr[3][7] || 0) * (parr[14][9] || 1));
    state.totals.energyCap = parr[8][3] || 0;

    const HP_frame = (parr[0][3] || 0) + (parr[1][3] || 0) + (parr[2][3] || 0) + (parr[3][3] || 0);
    let HP_inner = Math.trunc(
      ((parr[8][5] || 0) +
        (parr[9][5] || 0) +
        (parr[11][5] || 0) +
        (parr[12][3] || 0) +
        (parr[13][4] || 0) +
        (parr[14][3] || 0)) *
        (parr[1][7] || 1)
    );
    const HP_total = HP_frame + HP_inner;

    const def_size_impulse =
      (parr[0][5] || 0) + (parr[1][5] || 0) + (parr[2][5] || 0) + (parr[3][5] || 0) +
      (parr[8][6] || 0) + (parr[9][6] || 0) + (parr[11][6] || 0) + (parr[12][4] || 0) +
      (parr[13][5] || 0) + (parr[14][4] || 0);
    const def_size_thermal =
      (parr[0][6] || 0) + (parr[1][6] || 0) + (parr[2][6] || 0) + (parr[3][6] || 0) +
      (parr[8][7] || 0) + (parr[9][7] || 0) + (parr[11][7] || 0) + (parr[13][6] || 0) +
      (parr[14][5] || 0);
    const def_size_total = def_size_impulse + def_size_thermal || 1;
    const def_ratio_impulse = Math.trunc((def_size_impulse / def_size_total) * 100);
    const def_ratio_thermal = 100 - def_ratio_impulse;
    const def_total = (parr[0][4] || 0) + (parr[1][4] || 0) + (parr[2][4] || 0) + (parr[3][4] || 0);

    const wt = weightTotal(true);
    const wc = weightCapacity();
    const et = energyTotal(true);
    const ec = energyCapacity();

    state.flags.weightAgreement = wt === wc;
    state.flags.weightNearmiss = wt + 1 === wc;
    flgEnergyAgreement = et === ec;

    let iregurar = 0;
    if (parr[8][9]) iregurar |= 0x4;
    if (et > ec) iregurar |= 0x2;
    if (wt > wc) iregurar |= 0x1;
    state.flags.irregular = iregurar;

    const energy_usage = energy / (ec || 1);
    const weight_usage = weight / (wc || 1);

    const wrank =
      weight < 924 ? 0 :
      weight < 1231 ? 1 :
      weight < 1847 ? 2 :
      weight < 3078 ? 3 :
      weight < 3847 ? 4 :
      weight < 5463 ? 5 :
      weight < 5770 ? 6 :
      weight < 6309 ? 7 :
      weight < 6770 ? 8 :
      weight < 7232 ? 9 : 10;

    let crank = 5;
    if (wrank < 5) {
      crank =
        weight_usage < 0.2 ? 0 : weight_usage < 0.22 ? 1 : weight_usage < 0.35 ? 2 :
        weight_usage < 0.4 ? 3 : weight_usage < 0.49 ? 4 : weight_usage < 0.84 ? 5 :
        weight_usage < 0.9 ? 6 : weight_usage < 0.94 ? 7 : weight_usage < 0.96 ? 8 :
        weight_usage < 0.98 ? 9 : 10;
    } else if (wrank > 5) {
      crank =
        weight_usage < 0.2 ? 0 : weight_usage < 0.32 ? 1 : weight_usage < 0.44 ? 2 :
        weight_usage < 0.5 ? 3 : weight_usage < 0.6 ? 4 : weight_usage < 0.8 ? 5 :
        weight_usage < 0.9 ? 6 : weight_usage < 0.94 ? 7 : weight_usage < 0.96 ? 8 :
        weight_usage < 0.98 ? 9 : 10;
    }

    // EFFECT cells in document order = bn 0..11
    const burmarr = new Array(12).fill(0);
    const Bbox = $$("#EFFECT [data-cell]");
    // fallback: plain dd if data-cell missing
    const BboxAlt = Bbox.length >= 12 ? Bbox : $$("#EFFECT dd");

    function setBurm(bn, index, options) {
      burmarr[bn] = index;
      const row = BURMcorr[bn] && BURMcorr[bn][index];
      if (!row) return;
      if (!(options && options.skipDisplay) && BboxAlt[bn]) {
        setText(BboxAlt[bn], row[1]);
      }
      if (!(options && options.skipApply)) {
        applyBurm(corr, row);
        state.burmRate += row[3] || 0;
      }
    }

    // Pre-multipliers (power unit / head) — same as original before b9
    corr[1] *= Number(parr[13][7]) || 1;
    corr[4] *= Number(parr[0][7]) || 1;
    corr[17] *= Number(parr[13][8]) || 1;
    corr[26] *= Number(parr[0][8]) || 1;
    corr[27] *= Number(parr[0][9]) || 1;

    // ---- b9 機体重量 ----
    burmarr[9] = state.flags.formatFrame
      ? 0
      : wrank < 5
        ? wrank + 1
        : wrank > 5
          ? 16 - wrank
          : 0;
    setBurm(9, burmarr[9]);
    if ((parr[3][8] || 0) * (parr[14][7] || 1) * (corr[10] || 1) >= 30) {
      const mul = [1, 0.77, 0.82, 0.9, 0.95, 0.98, 2.1, 1.92, 1.8, 1.35, 1.25][burmarr[9]];
      if (mul != null) corr[10] *= mul;
    }

    // ---- b4 積載量 ----
    if (state.flags.formatPerfect) {
      burmarr[4] = 23;
    } else if (state.flags.weightNearmiss) {
      burmarr[4] = 22;
    } else if (burmarr[9] === 0 && state.flags.weightAgreement && wrank === 5) {
      burmarr[4] = 21;
    } else if (wrank < 5) {
      burmarr[4] = crank < 5 ? crank + 1 : crank > 5 ? 16 - crank : 0;
    } else if (wrank > 5) {
      burmarr[4] = crank < 5 ? crank + 11 : crank > 5 ? 26 - crank : 0;
    } else {
      burmarr[4] = 0;
    }
    setBurm(4, burmarr[4]);
    {
      const bn4 = burmarr[4];
      if (bn4 === 23) {
        const punchBase = Math.trunc((parr[2][7] || 0) * corr[1]);
        corr[1] *= punchBase < 300 ? 8.15 : punchBase < 1000 ? 3 : punchBase < 2000 ? 1.5 : 1.15;
        corr[7] *= (parr[9][4] || 0) * corr[7] <= 1 ? 3 : (parr[9][4] || 0) * corr[7] <= 3 ? 2 : (parr[9][4] || 0) * corr[7] <= 10 ? 1.5 : 1;
        corr[10] *= (parr[3][8] || 0) * (parr[14][7] || 1) * corr[10] < 9 ? 2.1 : 1.3;
        if (Math.trunc(HP_frame * corr[19]) + HP_inner < 9000) {
          const d = Math.trunc(def_total * corr[18]);
          corr[18] *= d < 1500 ? 2 : d < 2000 ? 1.5 : d < 2500 ? 1.3 : 1.03;
        }
      } else if (bn4 === 22) {
        const punchBase = Math.trunc((parr[2][7] || 0) * corr[1]);
        corr[1] *= punchBase < 300 ? 4.1 : punchBase < 1000 ? 1.5 : punchBase < 2000 ? 1.1 : 1.01;
        corr[10] *= (parr[3][8] || 0) * (parr[14][7] || 1) * corr[10] < 9 ? 1.7 : 1.05;
      } else if (bn4 > 5 && bn4 <= 10) {
        if (Math.trunc((parr[8][2] || 0) * corr[3]) >= 1000) {
          corr[3] *= [0.8, 0.85, 0.9, 0.94, 0.98][bn4 - 6];
        }
        if ((parr[3][8] || 0) * (parr[14][7] || 1) * corr[10] <= 20) {
          corr[10] *= [1.28, 1.14, 1.1, 1.08, 1.02][bn4 - 6];
        }
      } else if (bn4 > 15 && bn4 <= 20) {
        if (Math.trunc((parr[8][2] || 0) * corr[3]) >= 6000) {
          corr[3] *= [0.1, 0.2, 0.3, 0.4, 0.5][bn4 - 16];
        }
        if ((parr[3][8] || 0) * (parr[14][7] || 1) * corr[10] <= 10) {
          corr[10] *= [1.2, 1.19, 1.17, 1.17, 1.12][bn4 - 16];
        }
      }
    }

    // ---- b0 規格仕様 ----
    {
      let idx = 0;
      if (state.flags.formatPerfect) idx = 3;
      else if (state.flags.formatFrame) idx = 5;
      else if (Math.trunc(HP_frame * corr[19]) + HP_inner >= 15000 && def_total >= 5500) idx = 4;
      else if (Math.trunc(HP_frame * corr[19]) + HP_inner >= 15000) idx = 1;
      else if (def_total >= 5500) idx = 2;
      setBurm(0, idx);
    }

    // ---- b2 BMS限界 (表示は index0、補正のみ) ----
    setBurm(2, 0);

    // ---- b3 専用兵器 ----
    setBurm(3, personal);

    // ---- b5 特殊装備 ----
    burmarr[5] = special > 0 ? 1 : 0;
    if (BboxAlt[5] && BURMcorr[5] && BURMcorr[5][burmarr[5]]) {
      setText(BboxAlt[5], BURMcorr[5][burmarr[5]][1]);
    }
    for (let n = 1; n < 17; n++) {
      if (special & (1 << (n - 1))) {
        if (BURMcorr[5] && BURMcorr[5][n]) {
          applyBurm(corr, BURMcorr[5][n]);
          state.burmRate += BURMcorr[5][n][3] || 0;
        }
      }
    }

    // ---- b6 無装備 ----
    burmarr[6] = 0;
    if (!state.flags.formatFrame && (noweapon & 1) && noweapon > 1) {
      burmarr[6] =
        (wrank < 5 ? 0 : wrank > 5 ? 6 : 3) +
        ((noweapon & 9) === 9 ? 1 : (noweapon & 5) === 5 ? 2 : (noweapon & 3) === 3 ? 3 : 0);
    }
    setBurm(6, burmarr[6]);
    if (burmarr[6] > 0 && burmarr[6] <= 3) {
      const punchNow = Math.trunc((parr[2][7] || 0) * corr[1]);
      corr[1] *=
        punchNow < 101
          ? (1.25 * (Math.trunc(HP_frame * corr[19]) + HP_inner)) / (punchNow || 1)
          : wrank < 5
            ? 2.45
            : wrank > 5
              ? 1.2
              : 1.5;
    }
    if (burmarr[6] === 1) {
      const hpNow = Math.trunc(HP_frame * corr[19]) + Math.trunc(HP_inner * corr[19]);
      corr[19] *= hpNow < 5000 ? (1.25 * (Math.trunc(HP_frame * corr[19]) + HP_inner)) / (weight || 1) : 1.4;
    }

    // ---- b7 攻属特化 ----
    weaponpower =
      Math.trunc((parr[2][7] || 0) * (parr[13][7] || 1)) +
      ((parr[4][15] === 0 ? (parr[4][4] || 0) * (parr[13][8] || 1) : parr[4][4] || 0) * (parr[13][8] || 1)) +
      ((parr[5][15] === 0 ? (parr[5][4] || 0) * (parr[13][8] || 1) : parr[5][4] || 0) * (parr[13][8] || 1)) +
      (parr[6][4] || 0) * (parr[13][8] || 1) +
      (parr[7][4] || 0) * (parr[13][8] || 1);
    burmarr[7] = 0;
    if (weaponpower >= 1000) {
      if (parr[2][8] === 2) {
        burmarr[7] =
          (parr[4][5] === 2 || parr[4][5] === 7) &&
          (parr[5][5] === 2 || parr[5][5] === 7) &&
          parr[6][5] === 2 &&
          parr[7][5] === 2
            ? 1
            : atsyncro === 0xf
              ? 5
              : 0;
      } else if (parr[2][8] === 3) {
        burmarr[7] =
          parr[4][5] === 3 && parr[5][5] === 3 && parr[6][5] === 3 && parr[7][5] === 3
            ? 2
            : atsyncro === 0xf
              ? 6
              : 0;
      } else if (parr[2][8] === 4) {
        burmarr[7] =
          parr[4][5] === 4 && parr[5][5] === 4 && parr[6][5] === 4 && parr[7][5] === 4
            ? 3
            : atsyncro === 0xf
              ? 7
              : 0;
      } else if (parr[2][8] === 5) {
        burmarr[7] =
          parr[4][5] === 5 && parr[5][5] === 5 && parr[6][5] === 5 && parr[7][5] === 5
            ? 4
            : atsyncro === 0xf
              ? 8
              : 0;
      }
    }
    setBurm(7, burmarr[7]);

    // ---- b10 武装形態 ----
    setBurm(10, 0);

    // ---- b11 左右対称 ----
    burmarr[11] =
      (symmetry & 14) === 14 ? 1 : (symmetry & 6) === 6 ? 2 : (symmetry & 3) === 3 ? 3 : 0;
    setBurm(11, burmarr[11]);

    // ---- b1 EP削減 (burm_rate 参照のため後段) ----
    burmarr[1] = 0;
    if (state.flags.formatFrame) {
      burmarr[1] = 0;
    } else if (flgEnergyAgreement && (iregurar & 3) === 0) {
      burmarr[1] = 11;
    } else if (wrank === 5) {
      if (energy_usage < 0.69) burmarr[1] = 12;
      else if (state.burmRate === 0) burmarr[1] = def_ratio_thermal === def_ratio_impulse ? 14 : 13;
    } else if ((iregurar & 3) === 0 && wrank < 5) {
      burmarr[1] =
        energy_usage < 0.51 ? 1 :
        energy_usage < 0.61 ? 2 :
        energy_usage < 0.68 ? 3 :
        energy_usage < 0.71 ? 4 :
        energy_usage < 0.78 ? 5 : 0;
    } else if ((iregurar & 3) === 0 && wrank > 5) {
      burmarr[1] =
        energy_usage < 0.31 ? 6 :
        energy_usage < 0.45 ? 7 :
        energy_usage < 0.55 ? 8 :
        energy_usage < 0.66 ? 9 :
        energy_usage < 0.78 ? 10 : 0;
    }
    setBurm(1, burmarr[1]);
    if (burmarr[1] === 13) {
      const hpN = Math.trunc(HP_frame * corr[19]) + HP_inner;
      const dN = Math.trunc(def_total * corr[18]);
      corr[18] *= dN < 2000 && hpN < 9000 ? 1.7 : hpN < 9000 ? 1.05 : 1;
    } else if (burmarr[1] === 14) {
      const hpN = Math.trunc(HP_frame * corr[19]) + HP_inner;
      const dN = Math.trunc(def_total * corr[18]);
      corr[18] *= dN < 2000 && hpN < 9000 ? 2.3 : dN < 3000 && hpN < 9000 ? 1.5 : hpN < 9000 ? 1.07 : 1;
    }

    // ---- b8 防御特化 ----
    burmarr[8] = 0;
    if (
      (iregurar & 3) === 0 &&
      def_ratio_thermal === def_ratio_impulse &&
      Math.trunc(HP_frame * corr[19]) + HP_inner < 9000 &&
      Math.trunc(def_total * corr[18]) < 2000
    ) {
      burmarr[8] = 9;
    } else if (wrank < 5) {
      burmarr[8] =
        def_size_impulse >= def_size_thermal * 5 ? 1 :
        def_size_impulse >= def_size_thermal * 3 ? 2 :
        def_size_impulse * 5 <= def_size_thermal ? 3 :
        def_size_impulse * 3 <= def_size_thermal ? 4 : 0;
    } else if (wrank > 5) {
      burmarr[8] =
        def_size_impulse >= def_size_thermal * 8 ? 5 :
        def_size_impulse >= def_size_thermal * 6 ? 6 :
        def_size_impulse >= def_size_thermal * 8 ? 7 :
        def_size_impulse >= def_size_thermal * 6 ? 8 : 0;
    }
    setBurm(8, burmarr[8]);

    // expose for later display helpers
    const hpFrame = HP_frame;
    const hpInner = HP_inner;
    const hpTotal = HP_total;
    const defImp = def_size_impulse;
    const defTh = def_size_thermal;

    // =========================================================================
    // num: final stats after BURM corr + heat-gel bonuses (from SLPM65199.js)
    // gel indices (select15): 2内HP 3外HP 5歩行 6GN回復 7ブースト 8ジャンプ 9防御 10旋回
    // (1重量-1000 / 4EP-1000 are applied in weightTotal/energyTotal)
    // =========================================================================
    const def_ratio_result =
      def_ratio_impulse > def_ratio_thermal ? 0.5 :
      def_ratio_impulse < def_ratio_thermal ? -0.5 : 0;

    const gel = arr[15];

    const last_HP_frame =
      Math.trunc(HP_frame * corr[19]) + (gel === 3 ? 1000 : 0);
    const last_HP_inner = HP_inner + (gel === 2 ? 1000 : 0);
    const last_HP_total = last_HP_frame + last_HP_inner;

    const last_def_total =
      Math.trunc(def_total * corr[18]) + (gel === 9 ? 1000 : 0);
    const last_def_total_impulse = Math.trunc(
      (last_def_total * (2 + def_ratio_result) * def_ratio_impulse) / 100
    );
    const last_def_total_thermal = Math.trunc(
      (last_def_total * (2 - def_ratio_result) * def_ratio_thermal) / 100
    );

    const last_st_walk = (
      (parr[3][8] || 0) * (parr[14][7] || 1) * (corr[10] || 1) +
      (gel === 5 ? 10 : 0)
    ).toFixed(1);
    const last_st_jump = gel === 8 ? 10 : 0;
    const last_st_turn_rand =
      (parr[3][10] || 0) + (corr[12] || 0) + (gel === 10 ? 10 : 0);
    const last_st_turn_air =
      (parr[3][11] || 0) + (corr[13] || 0) + (gel === 10 ? 10 : 0);
    const last_st_grip = (parr[3][12] || 0) * (corr[11] || 1);

    const last_st_genererater =
      Math.trunc((parr[8][4] || 0) * (corr[2] || 1)) + (gel === 6 ? 10 : 0);
    const last_st_genererater_gain = Math.trunc(
      (parr[8][2] || 0) * (corr[3] || 1)
    );
    const last_st_genererater_redzone = Math.trunc(
      (parr[8][8] || 0) * (corr[23] || 1)
    );

    const last_st_booster_waste = (
      (parr[9][2] || 0) * (corr[9] || 1)
    ).toFixed(1);
    const last_st_booster_speed = (
      (parr[9][3] || 0) * (corr[8] || 1) + (gel === 7 ? 10 : 0)
    ).toFixed(1);
    const last_st_booster_accel = (
      (parr[9][4] || 0) * (corr[7] || 1) + (gel === 7 ? 10 : 0)
    ).toFixed(1);

    const last_punch = Math.trunc((parr[2][7] || 0) * (corr[1] || 1));

    // ratios from post-gel HP
    const hpRatioInner = last_HP_total
      ? Math.trunc((last_HP_inner / last_HP_total) * 100)
      : 0;
    const hpRatioFrame = 100 - hpRatioInner;

    const boostGrav =
      parr[9][8] != null ? Number(parr[9][8]).toFixed(2) : "-";

    // --- Render INFORMATION ---
    const spans = $$("#INFORMATION [data-cell]");
    if (spans.length >= 4) {
      setText($cell('EP'), energyTotal(true));
      setText($cell('最大EP'), energyCapacity());
      setText($cell('重量'), weightTotal(true));
      setText($cell('最大重量'), weightCapacity());
    }
    // ---- INFORMATION / meters ----
      $cell('EP').style.color = et > ec ? "red" : "";
      $cell('最大EP').style.color = et > ec ? "red" : "";
      $cell('重量').style.color = wt > wc ? "red" : "";
      $cell('最大重量').style.color = wt > wc ? "red" : "";
      
    const ep = el("EP");
    const weightEl = el("WEIGHT");
    if (ep) {
      ep.value = et;
      ep.max = ec || 1;
      ep.style.outline = et > ec ? "solid 1px red" : "none";
    }
    if (weightEl) {
      weightEl.value = wt;
      weightEl.max = wc || 1;
      weightEl.style.outline = wt > wc ? "solid 1px red" : "none";
    }

    const burmEl = $("#BURM");
    if (burmEl) setText(burmEl, `${state.burmRate}%`);

    // --- Render GENERAL tables ---
    const tables = $$("#GENERAL table");
    
        setHtmlTrusted($cell('防御比'), `<span class="impulse">${def_ratio_impulse}</span>:<span class="thermal">${def_ratio_thermal}</span>`);
        setHtmlTrusted($cell('HP比'), `<span class="framehp">${hpRatioFrame}</span>:<span class="innerhp">${hpRatioInner}</span>`);
        setText($cell('総HP'), last_HP_total);
        setText($cell('外装HP'), last_HP_frame);
        setText($cell('内部HP'), last_HP_inner);
        setText($cell('総EP'), energyTotal(true));
        setText($cell('基本防御'), last_def_total);
        setText($cell('耐熱防御'), last_def_total_thermal);
        setText($cell('耐衝撃防御'), last_def_total_impulse);
        setText($cell('パンチ力'), last_punch);
        
        setText($cell('最大積載'), weightCapacity());
        setText($cell('歩行速度'), last_st_walk);
        setText($cell('地上旋回'), last_st_turn_rand);
        setText($cell('空中旋回'), last_st_turn_air);
        
        setText($cell('出力'), last_st_genererater_gain);
        setText($cell('最大EP'), energyCapacity());
        setText($cell('限界域'), last_st_genererater_redzone);
        setText($cell('回復力'), last_st_genererater);
        
        setText($cell('消費出力'), last_st_booster_waste);
        setText($cell('最高速度'), last_st_booster_speed);
        setText($cell('重力補正'), boostGrav);
        setText($cell('加速力'), last_st_booster_accel);
        
        setText($cell('索敵範囲'), parr[11][3]);
        setText($cell('タイプ'), RADAR_TYPES[parr[11][4]] || "-");

        
    // --- Render CORRECTION ---
    const corrTd = $$("#CORRECTION [data-cell]");
    for (let i = 0; i < Math.min(28, corrTd.length); i++) {
      let s = 0;
      if (i === 4 || i === 9) s = corr[i] > 1 ? -1 : corr[i] < 1 ? 1 : 0;
      else if (i === 12 || i === 13) s = corr[i] > 0 ? 1 : corr[i] < 0 ? -1 : 0;
      else if (i === 20 || i === 21) s = corr[i] ? 1 : 0;
      else s = corr[i] > 1 ? 1 : corr[i] < 1 ? -1 : 0;

      corrTd[i].className = ["minus", "variable", "plus"][s + 1];
      if (i === 12 || i === 13) setText(corrTd[i], `${corr[i]}P`);
      else if (i === 20 || i === 21) setText(corrTd[i], "-");
      else setText(corrTd[i], `${Math.round((corr[i] - 1) * 100)}%`);
    }
  }

  // ---------------------------------------------------------------------------
  // Event handling
  // ---------------------------------------------------------------------------
  function onPartChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;

    const id = target.id || "";
    if (id === FORMAT_SELECT_ID) {
      applyFormatPreset();
      calculate();
      return;
    }

    if (id === "select4" || id === "select5") {
      readSelections();
      enforceArmConstraint(id === "select4");
    } else if (id === "select6" || id === "select7") {
      readSelections();
      enforceShoulderConstraint(id === "select6");
    }

    readSelections();
    calculate();
  }

  function bindEvents() {
    const form = document.getElementById("FORM");
    if (!form) {
      console.error("[PF65199] #FORM not found");
      return;
    }
    form.addEventListener("change", onPartChange);
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    dataPack = window.PF65199_DATA;
    if (!dataPack || !dataPack.framearr || !dataPack.data) {
      console.error("[PF65199] PF65199_DATA missing. Load SLPM65199-data.js first.");
      return;
    }

    populateSelects();
    bindEvents();
    readSelections();
    calculate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
