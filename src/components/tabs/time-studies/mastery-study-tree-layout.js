import { TimeStudyConnectionSetup } from "./TimeStudyConnection.vue";
import { TimeStudySetup } from "./TimeStudyButton.vue";

class TimeStudyRow {
  constructor(layout, items, isWide) {
    this.layout = layout;
    this.items = items;
    this.isWide = isWide;
  }

  get width() {
    const itemCount = this.items.length;
    const layout = this.layout;
    return itemCount * layout.itemWidth + (itemCount - 1) * layout.spacing;
  }

  itemPosition(column, treeLayout) {
    const layout = this.layout;
    const treeWidth = treeLayout.width;
    const rowLeft = (treeWidth - this.width) / 2;
    return rowLeft + column * layout.itemWidth + column * layout.spacing;
  }
}

class TimeStudyRowLayout {
  constructor(props) {
    this.itemWidth = props.itemWidth;
    this.itemHeight = props.itemHeight;
    this.spacing = props.spacing;
  }
}

export class MasteryStudyTreeLayout {
  constructor(type, scaling = 1) {
    this.spacing = 4 * scaling;
    this.rows = [];

    const normalRowLayout = new TimeStudyRowLayout({
      itemWidth: 18 * scaling,
      itemHeight: 10 * scaling,
      spacing: 3 * scaling,
    });

    const wideRowLayout = new TimeStudyRowLayout({
      itemWidth: 12 * scaling,
      itemHeight: 10 * scaling,
      spacing: 0.6 * scaling,
    });
    const normalRow = (...items) => new TimeStudyRow(normalRowLayout, items);
    const wideRow = (...items) => new TimeStudyRow(wideRowLayout, items, true);

    const MS = id => (MasteryStudy(id).isUnlocked ? MasteryStudy(id) : null);
    const EC = id => TimeStudy.eternityChallenge(id);

    /**
     * @type {TimeStudyRow[]}
     */

    // Mastery Studies
    this.rows.push(
      normalRow(MS(11)),
      normalRow(MS(21), MS(22), MS(23)),
      wideRow(MS(31), MS(32), MS(33), MS(34), MS(35), MS(36)),
      normalRow(EC(13), EC(14)),
      normalRow(TimeStudy.pairProduction),
      normalRow(MS(41), MS(42), MS(43)),
      normalRow(MS(51), TimeStudy.quantumChallenges, MS(52)),
      normalRow(TimeStudy.pairedChallenges),
      normalRow(MS(61), MS(62)),
      normalRow(MS(71), MS(72), MS(73)),
      normalRow(MS(81), TimeStudy.duplicants, MS(82)),
      normalRow(MS(91), null, null, MS(92)),
    );

    /**
     * @type {TimeStudySetup[]}
     */
    this.studies = [];
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const row = this.rows[rowIndex];
      for (let columnIndex = 0; columnIndex < row.items.length; columnIndex++) {
        const study = row.items[columnIndex];
        if (study === null) {
          continue;
        }
        const setup = new TimeStudySetup({
          study,
          row: rowIndex,
          column: columnIndex,
        });
        if (row.isWide) {
          setup.isSmall = true;
        }
        this.studies.push(setup);
      }
    }

    /**
     * @type {TimeStudyConnectionSetup[]}
     */
    this.connections = MasteryStudy.allConnections
      .map(c => new TimeStudyConnectionSetup(c));

    this.width = this.rows.map(row => row.width).nMax();
    const heightNoSpacing = this.rows.map(r => r.layout.itemHeight).nSum();
    this.height = heightNoSpacing + (this.rows.length - 1) * this.spacing;

    for (const study of this.studies) {
      study.setPosition(this);
    }

    for (const connection of this.connections) {
      connection.setPosition(this.studies, this.width, this.height);
    }
  }

  itemPosition(row) {
    const rows = this.rows.slice(0, row);
    const heightNoSpacing = rows.map(r => r.layout.itemHeight).nSum();
    return heightNoSpacing + rows.length * this.spacing;
  }

  static create(type, scaling = 1) {
    if (this._instances === undefined) {
      this._instances = [];
    }
    const layout = new MasteryStudyTreeLayout(type, scaling);
    this._instances[`${type}__${scaling}`] = layout;
    return layout;
  }
}

export const STUDY_TREE_LAYOUT_TYPE = {
  NORMAL: 0,
  get current() {
    return this.NORMAL;
  },
};
