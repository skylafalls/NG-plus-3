export interface TimeStudyObject {
  id: number
  cost: Decimal
  STcost?: Decimal
  requirement: (number | (() => boolean))[]
  reqType: TS_REQUIREMENT_TYPE
  effect?: () => (Decimal | number) | (Decimal | number)
  description: string | (() => string)
  cap?: Decimal | (() => Decimal)
  formatEffect?: (value: Decimal | string) => string
}

export interface MasteryStudyObject {
  id: string
  cost: Decimal
  requirement: (number | (() => boolean))[]
  reqType: TS_REQUIREMENT_TYPE
  effect?: () => (Decimal | number) | (Decimal | number)
  description: string | (() => string)
  cap?: Decimal | (() => Decimal)
  formatEffect?: (value: Decimal | string) => string
}
