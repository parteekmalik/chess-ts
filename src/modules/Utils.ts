import moment from "moment";

// arrayUtils.ts
export function getLastElement<T>(arr: T[]): T {
    return arr[arr.length - 1];
}
export const getTimeTillMove = (index: number, moveTime: (number | string)[], gameType: { baseTime: number; incrementTime: number }) => {
    // console.log("getTimeTillMove", moveTime);
    if (typeof moveTime[0] === "string") moveTime = moveTime.map((d) => moment(d).toDate().getTime()) as number[];
    let whiteTime = gameType.baseTime;
    let blackTime = gameType.baseTime;
    for (let i = 1; i <= index; i += 2) {
        whiteTime -= (moveTime[i] as number) - (moveTime[i - 1] as number);
    }
    for (let i = 2; i <= index; i += 2) {
        blackTime -= (moveTime[i] as number) - (moveTime[i - 1] as number);
    }
    const res = { whiteTime, blackTime };
    // console.log(res);
    return res;
};
export const buttonStyle = "m-3 bg-green-500 text-white font-bold py-2 px-4 rounded cursor-pointer" ;