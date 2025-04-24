import moment from "moment";

export const gameTypes = {
  bullet: [
    { baseTime: 1, incrementTime: 0 },
    { baseTime: 1, incrementTime: 1 },
    { baseTime: 2, incrementTime: 1 },
  ],
  blitz: [
    { baseTime: 3, incrementTime: 0 },
    { baseTime: 3, incrementTime: 2 },
    { baseTime: 5, incrementTime: 0 },
  ],
  rapid: [
    { baseTime: 10, incrementTime: 0 },
    { baseTime: 15, incrementTime: 10 },
    { baseTime: 30, incrementTime: 0 },
  ],
};

// make sure to provie staring time on first moveTimes
export function calculateTimeLeft(config: { baseTime: number; incrementTime: number }, movesTimes: Date[]) {
  const movesTime = movesTimes.map((move) => moment(move).valueOf());

  let timeLeftw = config.baseTime;
  let timeLeftb = config.baseTime;
  for (let i = 1; i < movesTime.length; i += 2) {
    timeLeftw -= movesTime[i]! - movesTime[i - 1]!;
    // timeLeft += this.config.incrementTime;
  }
  for (let i = 2; i < movesTime.length; i += 2) {
    timeLeftb -= movesTime[i]! - movesTime[i - 1]!;
    // timeLeft += this.config.incrementTime;
  }
  const timeDetected = moment().valueOf() - movesTime[movesTime.length - 1]!;
  const isWhiteTurn = movesTimes.length % 2 === 1;
  const data = { w: isWhiteTurn ? timeLeftw - timeDetected : timeLeftw, b: isWhiteTurn ? timeLeftb : timeLeftb - timeDetected };
  return data;
}

export function getLastElement<T>(arr: T[]): T {
  return arr[arr.length - 1]!;
}
