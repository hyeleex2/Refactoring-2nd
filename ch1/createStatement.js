export default function createStatementData (invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.volumnCredits = totalVolumnCredits(statementData)
  return statementData

  function enrichPerformance(aPerformances) {
    const result = Object.assign({}, aPerformances);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumnCredits = volumnCreditsFor(result);
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playId];
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch(aPerformance.play.type) {
      case "tragedy": 
      result = 4000;
      if(aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
  
      case "comedy": 
      result = 3000;
      if(aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
      
      default: 
      throw new Error(`알수없는 장로 ${aPerformance.play.type}`)
    }
    return result;
  }

  function volumnCreditsFor(perf) {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if('comedy' === perf.play.type) result += Math.floor(perf.audience / 5);
    return result;
  }
  function totalAmount(data) {
    return data.performances
      .reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumnCredits(data) {
    return data.performances
      .reduce((total, p) => total + p.volumnCredits, 0);
  }
}