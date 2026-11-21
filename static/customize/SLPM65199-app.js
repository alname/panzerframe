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

    // Reset flags
    state.burmRate = 0;
    state.flags.formatFrame = 0;
    state.flags.formatPerfect = 0;
    state.flags.irregular = 0;

    // Format check
    const f1 = [arr[0], arr[1], arr[2], arr[3]].join(",");
    if (formatarr) {
      for (let i = 1; i < Math.min(33, formatarr.length); i++) {
        const head = formatarr[i].slice(0, 4).join(",");
        if (f1 === head) {
          state.flags.formatFrame = i;
          state.flags.formatPerfect = arr.join(",") === formatarr[i].join(",") ? i : 0;
          break;
        }
      }
    }

    // Base corr
    let corr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, false, false, 1, 1, 1, 1, 1, 1];
    state.corr = corr;

    // Part multipliers from power unit / head etc.
    corr[1] *= Number(parr[13][7]) || 1;
    corr[4] *= Number(parr[0][7]) || 1;
    corr[17] *= Number(parr[13][8]) || 1;
    corr[26] *= Number(parr[0][8]) || 1;
    corr[27] *= Number(parr[0][9]) || 1;

    // Totals
    let weight = 0;
    let energy = 0;
    for (let i = 0; i < PART_COUNT; i++) {
      weight += parr[i][1] || 0;
    }
    energy =
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

    const wt = weightTotal(true);
    const wc = weightCapacity();
    const et = energyTotal(true);
    const ec = energyCapacity();

    state.flags.weightAgreement = wt === wc;
    state.flags.weightNearmiss = wt + 1 === wc;
    state.flags.irregular |= parr[8][9] ? 0x4 : 0;
    state.flags.irregular |= et > ec ? 0x2 : 0;
    state.flags.irregular |= wt > wc ? 0x1 : 0;

    // Weight rank / BURM effects
    const weightUsage = weight / (wc || 1);
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
        weightUsage < 0.2 ? 0 : weightUsage < 0.22 ? 1 : weightUsage < 0.35 ? 2 :
        weightUsage < 0.4 ? 3 : weightUsage < 0.49 ? 4 : weightUsage < 0.84 ? 5 :
        weightUsage < 0.9 ? 6 : weightUsage < 0.94 ? 7 : weightUsage < 0.96 ? 8 :
        weightUsage < 0.98 ? 9 : 10;
    } else if (wrank > 5) {
      crank =
        weightUsage < 0.2 ? 0 : weightUsage < 0.32 ? 1 : weightUsage < 0.44 ? 2 :
        weightUsage < 0.5 ? 3 : weightUsage < 0.6 ? 4 : weightUsage < 0.8 ? 5 :
        weightUsage < 0.9 ? 6 : weightUsage < 0.94 ? 7 : weightUsage < 0.96 ? 8 :
        weightUsage < 0.98 ? 9 : 10;
    }

    const burmarr = new Array(12).fill(0);
    const Bbox = $$("#EFFECT [data-cell]");

    function setBurm(bn, index) {
      burmarr[bn] = index;
      if (BURMcorr[bn] && BURMcorr[bn][index]) {
        if (Bbox[bn]) setText(Bbox[bn], BURMcorr[bn][index][1]);
        applyBurm(corr, BURMcorr[bn][index]);
        state.burmRate += BURMcorr[bn][index][3] || 0;
      }
    }

    // 機体重量 bn=9
    setBurm(9, state.flags.formatFrame ? 0 : wrank < 5 ? wrank + 1 : wrank > 5 ? 16 - wrank : 0);

    // 積載量 bn=4
    let loadIdx = 0;
    if (state.flags.formatPerfect) loadIdx = 23;
    else if (state.flags.weightNearmiss) loadIdx = 22;
    else if (burmarr[9] === 0 && state.flags.weightAgreement && wrank === 5) loadIdx = 21;
    else if (wrank < 5) loadIdx = crank < 5 ? crank + 1 : crank > 5 ? 16 - crank : 0;
    else if (wrank > 5) loadIdx = crank < 5 ? crank + 11 : crank > 5 ? 26 - crank : 0;
    setBurm(4, loadIdx);

    // Remaining BURM slots: use index 0 as safe default when complex conditions omitted
    // (Full original has many special cases; core load/weight are applied above)
    for (const bn of [0, 1, 3, 5, 6, 7, 8, 11]) {
      if (!burmarr[bn]) setBurm(bn, 0);
    }

    // Derived stats
    const hpFrame = (parr[0][3] || 0) + (parr[1][3] || 0) + (parr[2][3] || 0) + (parr[3][3] || 0);
    const hpInner = Math.trunc(
      ((parr[8][5] || 0) + (parr[9][5] || 0) + (parr[11][5] || 0) + (parr[12][3] || 0) + (parr[13][4] || 0) + (parr[14][3] || 0)) *
        (parr[1][7] || 1)
    );
    const hpTotal = hpFrame + hpInner;
    const hpRatioInner = hpTotal ? Math.trunc((hpInner / hpTotal) * 100) : 0;
    const hpRatioFrame = 100 - hpRatioInner;

    const defImp =
      (parr[0][5] || 0) + (parr[1][5] || 0) + (parr[2][5] || 0) + (parr[3][5] || 0) +
      (parr[8][6] || 0) + (parr[9][6] || 0) + (parr[11][6] || 0) + (parr[12][4] || 0) +
      (parr[13][5] || 0) + (parr[14][4] || 0);
    const defTh =
      (parr[0][6] || 0) + (parr[1][6] || 0) + (parr[2][6] || 0) + (parr[3][6] || 0) +
      (parr[8][7] || 0) + (parr[9][7] || 0) + (parr[11][7] || 0) + (parr[13][6] || 0) +
      (parr[14][5] || 0);
    const defSize = defImp + defTh || 1;
    const defRatioImp = Math.trunc((defImp / defSize) * 100);
    const defRatioTh = 100 - defRatioImp;

    const defBase = (parr[0][4] || 0) + (parr[1][4] || 0) + (parr[2][4] || 0) + (parr[3][4] || 0);
    const punch = Math.trunc((parr[2][7] || 0) * (corr[1] || 1));

    const lastWalk = ((parr[3][8] || 0) * (parr[14][7] || 1) * (corr[10] || 1)).toFixed(2);
    const lastTurnG = ((parr[3][10] || 0) * (corr[12] || 1)).toFixed?.(2) || String(parr[3][10] || 0);
    const lastTurnA = ((parr[3][11] || 0) * (corr[13] || 1)).toFixed?.(2) || String(parr[3][11] || 0);

    const genGain = ((parr[8][4] || 0) * (corr[3] || 1)).toFixed(1);
    const genRed = parr[8][8] || 0;
    const genRec = ((parr[8][4] || 0) * (corr[2] || 1)).toFixed(1);

    const boostWaste = ((parr[9][2] || 0) * (corr[9] || 1)).toFixed(1);
    const boostSpeed = ((parr[9][3] || 0) * (corr[8] || 1) + (arr[15] === 7 ? 10 : 0)).toFixed(1);
    const boostGrav = (parr[9][8] != null ? Number(parr[9][8]) : 0).toFixed(2);
    const boostAccel = ((parr[9][4] || 0) * (corr[7] || 1) + (arr[15] === 7 ? 10 : 0)).toFixed(1);

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

    const burmEl = $("#BURM ");
    if (burmEl) setText(burmEl, `${state.burmRate}%`);

    // --- Render GENERAL tables ---
    const tables = $$("#GENERAL table");
    
        setHtmlTrusted($cell('防御比'), `<span class="impulse">${defRatioImp}</span>:<span class="thermal">${defRatioTh}</span>`);
        setHtmlTrusted($cell('HP比'), `<span class="framehp">${hpRatioFrame}</span>:<span class="innerhp">${hpRatioInner}</span>`);
        setText($cell('総HP'), hpTotal);
        setText($cell('外装HP'), hpFrame);
        setText($cell('内部HP'), hpInner);
        setText($cell('総EP'), energyTotal(true));
        setText($cell('基本防御'), defBase);
        setText($cell('耐熱防御'), Math.trunc(defBase * (defRatioTh / 100)));
        setText($cell('耐衝撃防御'), Math.trunc(defBase * (defRatioImp / 100)));
        setText($cell('パンチ力'), punch);
        
        setText($cell('最大積載'), weightCapacity());
        setText($cell('歩行速度'), lastWalk);
        setText($cell('地上旋回'), lastTurnG);
        setText($cell('空中旋回'), lastTurnA);
        
        setText($cell('出力'), genGain);
        setText($cell('最大EP'), energyCapacity());
        setText($cell('限界域'), genRed);
        setText($cell('回復力'), genRec);
        
        setText($cell('消費出力'), boostWaste);
        setText($cell('最高速度'), boostSpeed);
        setText($cell('重力補正'), boostGrav);
        setText($cell('加速力'), boostAccel);
        
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
