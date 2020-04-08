// Function to normalize months, weeks into days
const normalizeDays = (types) => {
  let days;
  switch (types) {
    case 'months':
      days = 30;
      break;
    case 'weeks':
      days = 7;
      break;
    default:
      days = 1;
      break;
  }
  return days;
};

// Infection estimator
const estimator = (infection, pTypes, period) => {
  let estimatedInfection;
  let factor;
  let day = period;
  if (day === 1 || day === 2) {
    if (pTypes === 'months' || pTypes === 'weeks') {
      day *= normalizeDays(pTypes);
      factor = 2 ** Math.trunc(day / 3);
      estimatedInfection = infection * factor;
    } else {
      estimatedInfection = infection * day;
    }
  } else {
    day *= normalizeDays(pTypes);
    factor = 2 ** Math.trunc(day / 3);
    estimatedInfection = infection * factor;
  }
  return estimatedInfection;
};


const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  impact.currentlyInfected = input.reportedCases * 10;
  severeImpact.currentlyInfected = input.reportedCases * 50;

  impact.infectionsByRequestedTime = estimator(impact.currentlyInfected,
    input.periodType, input.timeToElapse);
  severeImpact.infectionsByRequestedTime = estimator(severeImpact.currentlyInfected,
    input.periodType, input.timeToElapse);

  return {
    input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
