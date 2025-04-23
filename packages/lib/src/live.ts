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
