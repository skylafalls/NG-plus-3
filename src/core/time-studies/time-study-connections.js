import { TimeStudy } from "./normal-time-study";
import { MasteryStudy } from "./mastery-studies.js";

export class TimeStudyConnection {
  constructor(from, to, override) {
    this._from = from;
    this._to = to;
    this._override = override;
  }

  get from() {
    return this._from;
  }

  get to() {
    return this._to;
  }

  get isOverridden() {
    return this._override !== undefined && this._override();
  }

  get isSatisfied() {
    return this.isOverridden || this._from.isBought;
  }
}

/**
 * @type {TimeStudyConnection[]}
 */
TimeStudy.allConnections = (function () {
  const TS = id => TimeStudy(id);
  const MS = id => MasteryStudy(id);
  const EC = id => TimeStudy.eternityChallenge(id);
  const connections = [
    [TS(11), TS(21)],
    [TS(11), TS(22)],

    [TS(21), TS(31)],
    [TS(22), TS(33)],
    [TS(22), TS(32)],

    [TS(31), TS(41)],
    [TS(32), TS(42)],

    [TS(41), TS(51)],
    [TS(42), TS(51)],
    [TS(42), EC(5)],

    [TS(42), TS(62), () => !Perk.bypassEC5Lock.isBought],

    [TS(51), TS(61)],
    [EC(5), TS(62), () => Perk.bypassEC5Lock.isBought],

    [TS(61), TS(71)],
    [TS(61), TS(72)],
    [TS(61), TS(73)],

    [TS(71), TS(81)],
    [TS(72), TS(82)],
    [TS(73), TS(83)],

    [TS(81), TS(91)],
    [TS(82), TS(92)],
    [TS(83), TS(93)],

    [TS(91), TS(101)],
    [TS(92), TS(102)],
    [TS(93), TS(103)],

    [TS(101), TS(111)],
    [TS(102), TS(111)],
    [TS(103), TS(111)],

    [TS(111), EC(7)],

    [TS(111), TS(121)],
    [TS(111), TS(122)],
    [TS(111), TS(123)],

    [TS(121), TS(131)],
    [TS(122), TS(132)],
    [TS(123), TS(133)],
    [TS(121), EC(6)],
    [TS(123), EC(8)],

    [TS(131), TS(141)],
    [TS(132), TS(142)],
    [TS(133), TS(143)],

    [TS(141), TS(151)],
    [TS(142), TS(151)],
    [TS(143), TS(151)],
    [TS(143), EC(4)],

    [TS(151), EC(9)],

    [TS(151), TS(161)],
    [TS(151), TS(162)],

    [TS(161), TS(171)],
    [TS(162), TS(171)],

    [TS(171), EC(1)],
    [TS(171), EC(2)],
    [TS(171), EC(3)],

    [
      TS(171),
      TS(181),
      () =>
        !Perk.bypassEC1Lock.isBought || !Perk.bypassEC2Lock.isBought
        || !Perk.bypassEC3Lock.isBought,
    ],

    [EC(1), TS(181), () => Perk.bypassEC1Lock.isBought],
    [EC(2), TS(181), () => Perk.bypassEC2Lock.isBought],
    [EC(3), TS(181), () => Perk.bypassEC3Lock.isBought],

    [TS(181), EC(10)],

    [EC(10), TS(191)],
    [EC(10), TS(192)],
    [EC(10), TS(193)],

    [TS(192), TS(201)],

    [TS(191), TS(211)],
    [TS(191), TS(212)],
    [TS(193), TS(213)],
    [TS(193), TS(214)],

    [TS(211), TS(221)],
    [TS(211), TS(222)],
    [TS(212), TS(223)],
    [TS(212), TS(224)],
    [TS(213), TS(225)],
    [TS(213), TS(226)],
    [TS(214), TS(227)],
    [TS(214), TS(228)],

    [TS(221), TS(231)],
    [TS(222), TS(231)],
    [TS(223), TS(232)],
    [TS(224), TS(232)],
    [TS(225), TS(233)],
    [TS(226), TS(233)],
    [TS(227), TS(234)],
    [TS(228), TS(234)],

    [TS(231), EC(11)],
    [TS(232), EC(11)],
    [TS(233), EC(12)],
    [TS(234), EC(12)],

    [EC(11), TimeStudy.dilation],
    [EC(12), TimeStudy.dilation],

    [TimeStudy.dilation, TimeStudy.timeDimension(5)],
    [TimeStudy.timeDimension(5), TimeStudy.timeDimension(6)],
    [TimeStudy.timeDimension(6), TimeStudy.timeDimension(7)],
    [TimeStudy.timeDimension(7), TimeStudy.timeDimension(8)],
    [TimeStudy.timeDimension(8), TimeStudy.metaDimensions],
    [TimeStudy.metaDimensions, TimeStudy.masteryStudies],
  ].map(props => new TimeStudyConnection(props[0], props[1], props[2]));

  return connections;
}());

/**
 * @type {TimeStudyConnection[]}
 */
MasteryStudy.allConnections = (function () {
  const MS = id => MasteryStudy(id);
  const EC = id => TimeStudy.eternityChallenge(id);
  const connections = [
    [MS(11), MS(21)],
    [MS(11), MS(22)],
    [MS(11), MS(23)],

    [MS(21), MS(31)],
    [MS(21), MS(32)],
    [MS(22), MS(33)],
    [MS(22), MS(34)],
    [MS(23), MS(35)],
    [MS(23), MS(36)],

    [EC(13), MS(31)],
    [EC(13), MS(32)],
    [EC(13), MS(33)],
    [EC(14), MS(34)],
    [EC(14), MS(35)],
    [EC(14), MS(36)],

    [TimeStudy.pairProduction, EC(13)],
    [TimeStudy.pairProduction, EC(14)],

    [MS(42), TimeStudy.pairProduction],
    [MS(41), MS(42)],
    [MS(43), MS(42)],
    [MS(51), MS(41)],
    [MS(52), MS(43)],

    [TimeStudy.quantumChallenges, MS(42)],
    [TimeStudy.pairedChallenges, TimeStudy.quantumChallenges],

    [MS(61), TimeStudy.pairedChallenges],
    [MS(62), TimeStudy.pairedChallenges],
    [MS(71), MS(61)],
    [MS(72), TimeStudy.pairedChallenges],
    [MS(73), MS(62)],
    [MS(81), MS(71)],
    [MS(82), MS(73)],
    [MS(91), MS(81)],
    [MS(92), MS(82)],
  ].map(props => new TimeStudyConnection(props[0], props[1], props[2]));

  return connections;
})();
