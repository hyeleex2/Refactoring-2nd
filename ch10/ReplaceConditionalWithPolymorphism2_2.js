// 기본 동작 - 변형 동작 상속..
// 근데 이걸 굳이 상속으로 빼는 이유는 뭐지..
// 뭔가 그냥 기본 클래스에서... 중국 항해 경험에 대한 분기 처리를.. 하나로 모으면 안되는지..
// 근데 다시 생각해보니 어떤 국가의 항해 경험이 중국일 수도 있고 n개일 수도 있으니깐.. 서브 클래스로 빼는 게 나아보임

class Rating {
  constructor(voyage, history) {
    this._voyage = voyage;
    this._history = history;
  }

  get value() {
    const vpf = this.voyageProfitFactor;
    const vr = this.voyageRisk;
    const chr = this.captainHistoryRisk;
    if (vpf * 3 > vr + chr * 2) return "A";
    else return "B";
  }

  get voyageRisk() {
    let result = 1;
    if (this._voyage.length > 4) result += 2;
    if (this._voyage.length > 8) result += this._voyage.length - 8;
    if (["중국", "동인도"].includes(this._voyage.zone)) result += 4;
    return Math.max(result, 0);
  }

  get voyageProfitFactor() {
    let result = 2;
    if (this._voyage.zone === "중국") result += 1;
    if (this._voyage.zone === "동인도") result += 1;
    result += this.historyLengthFactor;
    result += this.voyageLengthFactor;
    return result;
  }

  get voyageLengthFactor() {
    return this._voyage.length > 14 ? -1 : 0;
  }

  get historyLengthFactor() {
    return this._history.length > 8 ? 1 : 0;
  }

  get captainHistoryRisk() {
    let result = 1;
    if (this._history.length < 5) result += 4;
    result += this._history.filter((v) => v.profit < 0).length;
    return Math.max(result, 0);
  }

  get hasChina() {
    return this._history.some((v) => "중국" === v.zone);
  }
}

// 서브 클래스
class ExperiencedChinaRating extends Rating {
  get captainHistoryRisk() {
    const result = super.captainHistoryRisk - 2;
    return Math.max(result, 0);
  }

  get voyageProfitFactor() {
    return super.voyageProfitFactor + 3;
  }

  get voyageLengthFactor() {
    let result = 0;
    if (this._voyage.length > 12) result += 1;
    if (this._voyage.length > 18) result -= 1;
    return result;
  }

  get historyLengthFactor() {
    return this._history.length > 10 ? 1 : 0;
  }
}

function createRating(voyage, history) {
  if (voyage.zone === "중국" && history.some((v) => "중국" === v.zone))
    return new ExperiencedChinaRating(voyage, history);
  else return new Rating(voyage, history);
}

function rating(voyage, history) {
  return createRating(voyage, history).value;
}

// 호출부
const voyage = { zone: "서인도", length: 10 };
const history = [
  {
    zone: "동인도",
    profit: 5,
  },
  {
    zone: "서인도",
    profit: 15,
  },
  {
    zone: "중국",
    profit: -2,
  },
  {
    zone: "서아프리카",
    profit: 7,
  },
];
const myRating = rating(voyage, history);
console.log(myRating);
