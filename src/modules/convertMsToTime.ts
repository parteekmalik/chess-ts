function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
}

function convertMsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return milliseconds >= 20000
        ? `${padTo2Digits(hours) === "00" ? "" : padTo2Digits(hours) + ":"}${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
        : milliseconds >= 0
        ? `00:${padTo2Digits(seconds)}:${padTo2Digits(Math.floor((milliseconds % 1000) / 10))}`
        : "00:00:00";
}
export { convertMsToTime };
export default convertMsToTime;
