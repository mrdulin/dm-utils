/**
 * 可被布局算法原地修改的标签矩形。
 *
 * @property {number} x 标签当前的 X 坐标。
 * @property {number} y 标签当前的 Y 坐标。
 * @property {number} height 标签高度，用于计算矩形碰撞。
 * @property {number} width 标签宽度，用于计算矩形碰撞。
 */
export interface Label {
  x: number;
  y: number;
  height: number;
  width: number;
  [key: string]: any;
}

/**
 * 与标签一一对应的锚点信息。
 *
 * @property {number} x 锚点的 X 坐标。
 * @property {number} y 锚点的 Y 坐标。
 * @property {number} r 锚点半径，用于计算标签与锚点的碰撞面积。
 */
export interface Anchor {
  x: number;
  y: number;
  r: number;
  [key: string]: any;
}

/**
 * 自定义能量函数。
 *
 * @param {number} i 当前参与评估的标签索引。
 * @param {Label[]} lab 当前标签数组。
 * @param {Anchor[]} anc 当前锚点数组。
 * @returns {number} 当前布局状态下的能量值。
 */
export type D3LeanLabelerEnergy = (i: number, lab: Label[], anc: Anchor[]) => number;

/**
 * 自定义降温函数。
 *
 * @param {number} currT 当前温度。
 * @param {number} initialT 初始温度。
 * @param {number} nsweeps 总迭代轮数。
 * @returns {number} 下一轮 sweep 使用的温度。
 */
export type D3LeanLabelerSchedule = (currT: number, initialT: number, nsweeps: number) => number;

/**
 * `d3LeanLabeler()` 返回的链式 API。
 */
export interface D3LeanLabeler {
  /**
   * 启动模拟退火布局。
   *
   * 会直接修改 `label()` 传入数组中各标签的 `x`、`y` 坐标。
   *
   * @param {number} nsweeps 退火 sweep 次数，值越大通常布局越稳定，但耗时也越长。
   * @returns {void}
   */
  start(nsweeps: number): void;
  /**
   * 设置布局区域宽度。
   *
   * 标签移动或旋转后超出该边界时，会回退到上一个位置。
   *
   * @param {number} x 布局区域宽度。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  width(x: number): D3LeanLabeler;
  /**
   * 设置布局区域高度。
   *
   * 标签移动或旋转后超出该边界时，会回退到上一个位置。
   *
   * @param {number} x 布局区域高度。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  height(x: number): D3LeanLabeler;
  /**
   * 设置待布局标签数组。
   *
   * `Label` 与 `Anchor` 需要按相同索引一一对应。
   *
   * @param {Label[]} x 待布局标签数组。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  label(x: Label[]): D3LeanLabeler;
  /**
   * 设置锚点数组。
   *
   * `Anchor` 与 `Label` 需要按相同索引一一对应。
   *
   * @param {Anchor[]} x 锚点数组。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  anchor(x: Anchor[]): D3LeanLabeler;
  /**
   * 覆盖默认能量函数。
   *
   * @param {D3LeanLabelerEnergy} x 自定义能量函数。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  alt_energy(x: D3LeanLabelerEnergy): D3LeanLabeler;
  /**
   * 保留原始 D3-Labeler 的兼容接口。
   *
   * 当前实现不会真正使用传入的降温函数，仍固定采用内部的线性降温策略。
   *
   * @param {D3LeanLabelerSchedule} x 自定义降温函数。
   * @returns {D3LeanLabeler} 返回当前实例，便于链式调用。
   */
  alt_schedule(x: D3LeanLabelerSchedule): D3LeanLabeler;
}
/**
 * 轻量版 `D3-Labeler` 的 TypeScript 重构实现。
 *
 * @see {@link https://github.com/tinker10/D3-Labeler | D3-Labeler}
 * @remarks
 * 相比原版，这个实现主要做了 3 点收敛：
 *
 * - 注释了 `acc`、`rej` 这类仅用于统计 Monte Carlo move 接受/拒绝次数的调试变量；它们不参与能量计算、降温策略或最终布局结果，因此当前版本将其视为非核心状态并移除。
 * - 保留 `alt_schedule()` 兼容签名，但内部固定使用 `cooling_schedule()`。
 * - 精简配置入口，聚焦 `width()`、`height()`、`label()`、`anchor()`、`start()` 与 `alt_energy()`。
 */
/**
 * 创建一个轻量版标签避让器。
 *
 * @remarks
 * 该实现基于模拟退火（Simulated Annealing）逐步调整标签位置，用于减少：
 *
 * - 引导线长度
 * - 引导线相交
 * - 标签之间的重叠
 * - 标签与锚点的重叠
 *
 * 使用约束：
 *
 * - `label()` 与 `anchor()` 传入的数组需要等长，且按索引一一对应。
 * - `start()` 会原地修改标签坐标，不会返回新数组。
 * - `alt_schedule()` 仅为兼容接口，当前版本不会应用传入的降温函数。
 *
 * @returns {D3LeanLabeler} 支持链式配置的标签避让器实例。
 *
 * @example
 * ```ts
 * const labeler = d3LeanLabeler().width(800).height(600).label(labels).anchor(anchors);
 *
 * labeler.start(200);
 * ```
 */
export default function d3LeanLabeler(): D3LeanLabeler {
  let lab: Label[] = [];
  let anc: Anchor[] = [];
  let w = 1; // box width
  let h = 1; // box width

  const maxMove = 5.0;
  const maxAngle = 0.5;
  // let acc = 0;
  // let rej = 0;

  // weights
  const wLen = 0.2; // leader line length
  const wInter = 1.0; // leader line intersection
  const wLab2 = 30.0; // label-label overlap
  const wLabAnc = 30.0; // label-anchor overlap
  const wOrient = 3.0; // orientation bias

  // booleans for user defined functions
  let userEnergy = false;
  // let userSchedule = false;

  let userDefinedEnergy: D3LeanLabelerEnergy;
  // let userDefinedSchedule;

  const labeler = {
    start(nsweeps: number) {
      // main simulated annealing function
      const m = lab.length;
      let currT = 1.0;
      const initialT = 1.0;

      for (let i = 0; i < nsweeps; i++) {
        for (let j = 0; j < m; j++) {
          if (Math.random() < 0.5) {
            mcmove(currT);
          } else {
            mcrotate(currT);
          }
        }
        currT = cooling_schedule(currT, initialT, nsweeps);
      }
    },
    width(x: number) {
      w = x;
      return labeler;
    },
    height(x: number) {
      h = x;
      return labeler;
    },
    label(x: Label[]) {
      // users insert label positions
      lab = x;
      return labeler;
    },
    anchor(x: Anchor[]) {
      // users insert anchor positions
      anc = x;
      return labeler;
    },
    alt_energy(x: D3LeanLabelerEnergy) {
      // user defined energy
      userDefinedEnergy = x;
      userEnergy = true;
      return labeler;
    },
    alt_schedule(x: D3LeanLabelerSchedule) {
      // user defined cooling_schedule
      // userDefinedSchedule = x;
      // userSchedule = true;
      return labeler;
    },
  };

  function energy(index: number): number {
    // energy function, tailored for label placement

    const m = lab.length;
    let ener = 0;
    let dx = lab[index].x - anc[index].x;
    let dy = anc[index].y - lab[index].y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let overlap = true;

    // penalty for length of leader line
    if (dist > 0) {
      ener += dist * wLen;
    }

    // label orientation bias
    dx /= dist;
    dy /= dist;
    if (dx > 0 && dy > 0) {
      ener += 0 * wOrient;
    } else if (dx < 0 && dy > 0) {
      ener += 1 * wOrient;
    } else if (dx < 0 && dy < 0) {
      ener += 2 * wOrient;
    } else {
      ener += 3 * wOrient;
    }

    const x21 = lab[index].x;
    const y21 = lab[index].y - lab[index].height + 2.0;
    const x22 = lab[index].x + lab[index].width;
    const y22 = lab[index].y + 2.0;
    let x11;
    let x12;
    let y11;
    let y12;
    let xOverlap;
    let yOverlap;
    let overlapArea;

    for (let i = 0; i < m; i++) {
      if (i !== index) {
        // penalty for intersection of leader lines
        overlap = intersect(anc[index].x, lab[index].x, anc[i].x, lab[i].x, anc[index].y, lab[index].y, anc[i].y, lab[i].y);
        if (overlap) {
          ener += wInter;
        }

        // penalty for label-label overlap
        x11 = lab[i].x;
        y11 = lab[i].y - lab[i].height + 2.0;
        x12 = lab[i].x + lab[i].width;
        y12 = lab[i].y + 2.0;
        xOverlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
        yOverlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
        overlapArea = xOverlap * yOverlap;
        ener += overlapArea * wLab2;
      }

      // penalty for label-anchor overlap
      x11 = anc[i].x - anc[i].r;
      y11 = anc[i].y - anc[i].r;
      x12 = anc[i].x + anc[i].r;
      y12 = anc[i].y + anc[i].r;
      xOverlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
      yOverlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
      overlapArea = xOverlap * yOverlap;
      ener += overlapArea * wLabAnc;
    }
    return ener;
  }

  function mcmove(currT: number) {
    // Monte Carlo translation move

    // select a random label
    const i = Math.floor(Math.random() * lab.length);

    // save old coordinates
    const xOld = lab[i].x;
    const yOld = lab[i].y;

    // old energy
    let oldEnergy;
    if (userEnergy) {
      oldEnergy = userDefinedEnergy(i, lab, anc);
    } else {
      oldEnergy = energy(i);
    }

    // random translation
    lab[i].x += (Math.random() - 0.5) * maxMove;
    lab[i].y += (Math.random() - 0.5) * maxMove;

    // hard wall boundaries
    if (lab[i].x > w) {
      lab[i].x = xOld;
    }
    if (lab[i].x < 0) {
      lab[i].x = xOld;
    }
    if (lab[i].y > h) {
      lab[i].y = yOld;
    }
    if (lab[i].y < 0) {
      lab[i].y = yOld;
    }

    // new energy
    let newEnergy;
    if (userEnergy) {
      newEnergy = userDefinedEnergy(i, lab, anc);
    } else {
      newEnergy = energy(i);
    }

    // delta E
    const deltaEnergy = newEnergy - oldEnergy;

    if (Math.random() < Math.exp(-deltaEnergy / currT)) {
      // acc += 1;
    } else {
      // move back to old coordinates
      lab[i].x = xOld;
      lab[i].y = yOld;
      // rej += 1;
    }
  }

  function mcrotate(currT: number) {
    // Monte Carlo rotation move

    // select a random label
    const i = Math.floor(Math.random() * lab.length);

    // save old coordinates
    const xOld = lab[i].x;
    const yOld = lab[i].y;

    // old energy
    let oldEnergy;
    if (userEnergy) {
      oldEnergy = userDefinedEnergy(i, lab, anc);
    } else {
      oldEnergy = energy(i);
    }

    // random angle
    const angle = (Math.random() - 0.5) * maxAngle;

    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // translate label (relative to anchor at origin):
    lab[i].x -= anc[i].x;
    lab[i].y -= anc[i].y;

    // rotate label
    const xNew = lab[i].x * c - lab[i].y * s;
    const yNew = lab[i].x * s + lab[i].y * c;

    // translate label back
    lab[i].x = xNew + anc[i].x;
    lab[i].y = yNew + anc[i].y;

    // hard wall boundaries
    if (lab[i].x > w) {
      lab[i].x = xOld;
    }
    if (lab[i].x < 0) {
      lab[i].x = xOld;
    }
    if (lab[i].y > h) {
      lab[i].y = yOld;
    }
    if (lab[i].y < 0) {
      lab[i].y = yOld;
    }

    // new energy
    let newEnergy;
    if (userEnergy) {
      newEnergy = userDefinedEnergy(i, lab, anc);
    } else {
      newEnergy = energy(i);
    }

    // delta E
    const deltaEnergy = newEnergy - oldEnergy;

    if (Math.random() < Math.exp(-deltaEnergy / currT)) {
      // acc += 1;
    } else {
      // move back to old coordinates
      lab[i].x = xOld;
      lab[i].y = yOld;
      // rej += 1;
    }
  }

  function intersect(x1: number, x2: number, x3: number, x4: number, y1: number, y2: number, y3: number, y4: number) {
    // returns true if two lines intersect, else false
    // from http://paulbourke.net/geometry/lineline2d/

    let mua;
    let mub;
    let denom;
    let numera;
    let numerb;

    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

    /* Is the intersection along the the segments */
    mua = numera / denom;
    mub = numerb / denom;
    if (!(mua < 0 || mua > 1 || mub < 0 || mub > 1)) {
      return true;
    }
    return false;
  }

  function cooling_schedule(currT: number, initialT: number, nsweeps: number): number {
    // linear cooling
    return currT - initialT / nsweeps;
  }

  return labeler;
}
