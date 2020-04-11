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
const estimateInfected = (infection, pTypes, period) => {
  let estimatedInfection;
  let factor;
  let day = period;
  if (day === 1 || day === 2) {
    if (pTypes === 'months' || pTypes === 'weeks') {
      day *= normalizeDays(pTypes);
      // console.log(day);
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

// Challenge 2: total number of available bed spaces
const estimateAvailableBeds = (totalHospBeds, severeCasesReqByTime) => {
  const bedAvailable = 0.35 * totalHospBeds;
  const hospBedsByReqTime = bedAvailable - severeCasesReqByTime;
  return Math.trunc(hospBedsByReqTime);
};

//  challenge 3: Loss to economy
const estimateLossToEconomy = (infectedByReqTime, data) => {
  const {
    region: { avgDailyIncomeInUSD: income, avgDailyIncomePopulation: population },
    periodType,
    timeToElapse: time
  } = data;
  const period = normalizeDays(periodType) * time;
  // const dollarsInFlight = Math.trunc(infectedByReqTime * income * period * population);
  let dollarsInFlight;
  if(population < 1 && population > 0) {
    dollarsInFlight = Math.trunc(infectedByReqTime * income * period * population);
  } else {
    population /= 100;
    dollarsInFlight = Math.trunc(infectedByReqTime * income * period * population);
  }
  return dollarsInFlight;
};


const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};
  impact.currentlyInfected = input.reportedCases * 10;
  severeImpact.currentlyInfected = input.reportedCases * 50;

  impact.infectionsByRequestedTime = estimateInfected(impact.currentlyInfected,
    input.periodType, input.timeToElapse);
  severeImpact.infectionsByRequestedTime = estimateInfected(severeImpact.currentlyInfected,
    input.periodType, input.timeToElapse);
  // challenge 2
  impact.severeCasesByRequestedTime = 0.15 * impact.infectionsByRequestedTime;
  severeImpact.severeCasesByRequestedTime = 0.15 * severeImpact.infectionsByRequestedTime;
  // estimate Beds space available
  impact.hospitalBedsByRequestedTime = estimateAvailableBeds(
    input.totalHospitalBeds, impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = estimateAvailableBeds(
    input.totalHospitalBeds, severeImpact.severeCasesByRequestedTime
  );

  // challenge 3
  // ICU
  impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );

  // Ventilator
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  // Lose to economy
  impact.dollarsInFlight = estimateLossToEconomy(
    impact.infectionsByRequestedTime, input
  );
  severeImpact.dollarsInFlight = estimateLossToEconomy(
    severeImpact.infectionsByRequestedTime, input
  );

  return {
    input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
