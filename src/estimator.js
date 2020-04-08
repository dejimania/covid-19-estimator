// Function to normalize months, weeks into days
const normalizeDays = (types) => {
  switch (types) {
    case "months":
      days = 30;
      break;
    case "weeks":
      days = 7;
      break;
    default:
      days = 1;
      break;
  }
  return days;
}

// Infection estimator
const estimator = (infection, pTypes, period) => {
  let extimatedInfection;
  let day = parseInt(period);
  if(day === 1 || day === 2) {
    extimatedInfection = infection;
  } else {
    day = normalizeDays(pTypes) * period;
    const factor = Math.pow(2, Math.trunc(day / 3));
    extimatedInfection = infection * factor;
  }
  return extimatedInfection;
}


const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  // if(input.reportedCases) {
    impact.currentlyInfected = input.reportedCases * 10;
    severeImpact.currentlyInfected = input.reportedCases * 50;

    impact.infectionsByRequestedTime = estimator(impact.currentlyInfected, input.periodType, input.timeToElapse);
    severeImpact.infectionsByRequestedTime = estimator(severeImpact.currentlyInfected, input.periodType, input.timeToElapse);


  // }
  return {
    input,
    impact,
    severeImpact,
  }
}

export default covid19ImpactEstimator;
