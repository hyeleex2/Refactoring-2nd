import invoice from './invoice.json'assert{ type: "json" }
import plays from './play.json'assert{ type: "json" }



function renderPlainText (data) {
  let result = `청구 내역 (고객명 : ${data.customer})\n`;
  for(let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} ${perf.audience} 석 /n`;
  }
  result += `총액 : ${usd(data.totalAmount)} \n`
  result += `적립 포인트 : ${data.volumnCredits}점 \n`
  return result;
  
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(aNumber/100);
  }
}

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  // 얕은 복사
  statementData.performances = invoice.performances.map(enrichPerformance)
  statementData.totalAmount = totalAmount(statementData)
  statementData.volumnCredits = totalVolumnCredits(statementData)

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
    let result = 0;
    for(let perf of data.performances) {
      result += perf.amount;
    }
    return result;
  }

  function totalVolumnCredits(data) {
    let result = 0;
    // 값 누적 로직 분리
    for(let perf of data.performances) {
      result += perf.volumnCredits;
    }
    return result;
  }
  

  return renderPlainText(statementData, plays)
}


const result = statement(invoice, plays);
console.log(result);