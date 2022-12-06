// 특이 케이스 하나로 공통화 하기
// 특이 케이스 패턴 : 특수한 경우의 공통 동작을 요소 하나에 모아서 사용


// 예시에서 class 로 하나... 리터럴로 하나... 별 차이를 모르겠음.. 그냥 취향 차이인가?


class Site {
  constructor(_customer) {
    this._customer = customer;
  }

  get customer() {
    return this._customer === "unknown"
      ? new UnknownCustomer()
      : this._customer;
  }
}

class Customer {
  constructor(name, billingPlan, paymentHistory) {
    this._name = name;
    this._billingPlan = billingPlan;
    this._paymentHistory = paymentHistory;
  }

  get name() {
    return this._name;
  }

  get billingPlan() {
    return this._billingPlan;
  }

  set billingPlan(arg) {
    this._billingPlan = arg;
  }

  get paymentHistory() {
    return this._paymentHistory;
  }

  get isUnknown() {
    return false;
  }
}

class UnknownCustomer {
  get isUnknown() {
    return true;
  }
  get name() {
    return "거주자";
  }
  get billingPlan() {
    return registry.billingPlans.basic;
  }
  set billingPlan(arg) {}

}



// arg 에 Customer만 온다고 가정하는듯..?
function isUnknown(arg) {
  if (!(arg instanceof Customer || arg === "미확인 고객")) {
    throw new Error("잘못된 값과 비교");
  }
  return arg.isUnknown;
}

// client 1…

export function customerName(site) {
  return site.customer.name;
}

//client 2

const registry = {
  billingPlans: {
    basic: "basic",
  },
};

export function billingPlan(site) {
  return site.customer.billingPlan;
}

//client 3
export function changeBillingPlan(site, newPlan) {
  site.customer.billingPlan = newPlan;
  return site.customer;
}

//client 4
export function weeksDelinquent(site) {
  return site.customer.paymentHistory.weeksDelinquentInLastYear;
}
