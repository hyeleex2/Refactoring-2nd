import invoice from './invoice.json'assert{ type: "json" }
import plays from './play.json'assert{ type: "json" }
import createStatementData from './createStatementData.js';


function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명 : ${data.customer})</h1> \n`;
  for(let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} ${perf.audience} 석 /n`;
  }
  result += `총액 : ${usd(data.totalAmount)} \n`
  result += `적립 포인트 : ${data.volumnCredits}점 \n`
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber/100);
}

function statement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays))
}


const result = statement(invoice, plays);
console.log(result);