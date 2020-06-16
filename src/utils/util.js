export function getTradeOrderStatus(
  status,
  cancelStatus,
  completedStatus,
  stopLossStatus,
  takeProfitStatus
) {
  var response = { label: "Pending", icon: "warning", order: 5 };
  switch (status) {
    case 1:
      response = { label: "Active", icon: "success", order: 2 };
      break;
    case 2:
      response = { label: "Creation Failed", icon: "danger", order: 5 };
      break;
    case 3:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 4:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 5:
      break;
  }
  switch (cancelStatus) {
    case 1:
      response = { label: "Liquidated", icon: "info", order: 4 };
      break;
    case 2:
      response = { label: "Active", icon: "success", order: 2 };
      break;
    case 3:
      response = { label: "Liquidation Pending", icon: "warning", order: 3 };
      break;
    case 4:
      response = { label: "Liquidation Pending", icon: "warning", order: 3 };
      break;
    case 5:
      break;
  }
  switch (completedStatus) {
    case 1:
      response = {
        label: "Tenure Completed",
        icon: "info",
        order: 4
      };
      break;
  }
  switch (stopLossStatus) {
    case 1:
      response = { label: "Stop Loss Hit", icon: "danger", order: 4 };
      break;
  }
  switch (takeProfitStatus) {
    case 1:
      response = { label: "Profit Target Hit", icon: "info", order: 4 };
      break;
  }

  return response;
}
export function getLoanOrderStatus(
  status,
  cancelStatus,
  completedStatus,
  defaultedStatus
) {
  var response = { label: "Pending", icon: "warning", order: 5 };
  switch (status) {
    case 1:
      response = { label: "Active", icon: "success", order: 2 };
      break;
    case 2:
      response = { label: "Creation Failed", icon: "danger", order: 5 };
      break;
    case 3:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 4:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 5:
      break;
  }
  switch (cancelStatus) {
    case 1:
      response = { label: "Loan Completed", icon: "info", order: 4 };
      break;
    case 2:
      response = { label: "Active", icon: "success", order: 2 };
      break;
    case 3:
      response = { label: "Repayment Pending", icon: "warning", order: 3 };
      break;
    case 4:
      response = { label: "Repayment Pending", icon: "warning", order: 3 };
      break;
    case 5:
      break;
  }
  switch (completedStatus) {
    case 1:
      response = {
        label: "Defaulted (Collateral Devalued)",
        icon: "danger",
        order: 4
      };
      break;
  }
  switch (defaultedStatus) {
    case 1:
      response = { label: "Defaulted (Missed Repayment)", icon: "danger", order: 4 };
      break;
  }

  return response;
}
export function getReserveOrderStatus(
  status,
  cancelStatus,
  completedStatus
) {
  var response = { label: "Pending", icon: "warning", order: 5 };
  switch (status) {
    case 1:
      response = { label: "Active", icon: "success", order: 2 };
      break;
    case 2:
      response = { label: "Creation Failed", icon: "danger", order: 5 };
      break;
    case 3:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 4:
      response = { label: "Creation Pending", icon: "warning", order: 1 };
      break;
    case 5:
      break;
  }
  switch (cancelStatus) {
    case 1:
      response = { label: "Terminated", icon: "info", order: 4 };
      break;
    case 2:
      break;
    case 3:
      response = { label: "Stop Pending", icon: "warning", order: 3 };
      break;
    case 4:
      response = { label: "Stop Pending", icon: "warning", order: 3 };
      break;
    case 5:
      break;
  }
  switch (completedStatus) {
    case 1:
      response = {
        label: "Completed Successfully",
        icon: "info",
        order: 4
      };
      break;
  }

  return response;
}
export function generateMonthStatsFromDate(dateArray, countArray) {
  var monthMap = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var currentDate = new Date();
  var monthArray = new Array(12).fill(0);
  dateArray.forEach(
    (dateTime, index) => {
      var date = new Date(dateTime);
      if ((currentDate - date) / (1000 * 60 * 60 * 24 * 30) <= 6)
        monthArray[date.getMonth()] += countArray[index];
    }
  );
  var months = [];
  var monthsCount = [];
  var index = 0;
  while (index < 6) {
    months.unshift(monthMap[(currentDate.getMonth() - index) % 12]);
    monthsCount.unshift(monthArray[(currentDate.getMonth() - index) % 12]);
    index++;
  }
  return {
    Y: monthsCount,
    X: months
  }
}
export function getFrame(size, isDark) {
  let frameColor = "#ebebeb";
  if (isDark) {
    frameColor = "'#666464'";
  }
  if (size == 'large') {
    return "<svg width='465' height='300'><rect fill="+frameColor+" width='465' height='300' rx='0'/></svg>";
  } else if (size == 'medium') {
    return "<svg width='310' height='150'><rect fill="+frameColor+" width='310' height='150' rx='0'/></svg>";
  } else if (size == 'small') {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='230' height='140' rx='0'/></svg>";
  } else if (size == 'wide-short') {
    return "<svg width='480' height='190'><rect fill="+frameColor+" width='100%' height='100%' rx='0'/></svg>";
  } else if (size == 'small-short') {
    return "<svg width='200' height='130'><rect fill="+frameColor+" width='220' height='130' rx='0'/></svg>";
  } else if (size == 'row') {
    return "<svg width='100%' height='17%'><rect fill="+frameColor+" width='100%' height='100%' rx='0'/></svg>";
  } else if (size == 'row-item') {
    return "<svg width='50' height='10'><rect fill="+frameColor+" width='50' height='10' rx='0'/></svg>";
  } else if (size == 'row-thin') {
    return "<svg width='100%' height='10%'><rect fill="+frameColor+" width='100%' height='100%' rx='0'/></svg>";
  } else if (size == 'trade-page-row-1') {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='550' height='400' rx='0'/></svg>";
  } else if (size == 'trade-page-row-2') {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='550' height='400' rx='0'/></svg>";
  } else if (size == "loan-page-row-2") {
    return "<svg width='280' height='160'><rect fill="+frameColor+" width='100%' height='100%' rx='0'/></svg>";
  } else if (size == "loan-page-row-1") {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='550' height='400' rx='0'/></svg>";
  } else if (size == "reserve-page-row-1") {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='550' height='400' rx='0'/></svg>";
  } else if (size == 'home-page-row-1') {
    return "<svg width='100%' height='100%'><rect fill="+frameColor+" width='550' height='400' rx='0'/></svg>";
  } else if (size == "text-label") {
    return "<svg width='75' height='24' viewBox='0 0 75 24' xmlns='http://www.w3.org/2000/svg'><g><rect x='0' y='0' fill="+frameColor+" width='75' height='20' rx='2'/></g></svg>";
  } else if (size == "text-label-long") {
    return "<svg width='150' height='24' viewBox='0 0 150 24' xmlns='http://www.w3.org/2000/svg'><g><rect x='0' y='0' fill="+frameColor+" width='150' height='20' rx='2'/></g></svg>";
  }
}
export function getInitialExitPriceForTrades(ca, la, ta, ptype, ccp, lcp, tcp, buffer, leverage, stoploss, premium) {
  var resp = null
  if (!ccp || !lcp || !tcp) return resp
  if (!ca || !la || !ta) return resp
  if (!ptype || !buffer || !leverage || !stoploss || !premium) return resp

  var rtcp = (la * lcp * (100 + premium + (buffer / leverage)) - ca * ccp * stoploss) / (ta * 100)
  if (ptype === 'LONG') {
    resp = rtcp / lcp
  } else if (ptype === 'SHORT') {
    resp = lcp / rtcp
  }
  return resp
}
export function getMonthFromIndex(index) {
  var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthArray[index];
}
export function getHyphenSeparatedDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}
export function addZero(number) {
  if(number > 9) {
    return number
  } else {
    number = number.toLocaleString()
    number = "0"+ number
    return number
  }
}
export const HOME_URL = "/";
export const RESERVE_URL = "/reserve/overview";
export const LOAN_URL = "/loan/overview";
export const TRADE_URL = "/trade/overview";
