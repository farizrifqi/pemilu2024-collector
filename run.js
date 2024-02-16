const dayjs = require('dayjs');
const { sleep } = require('./utils');
const { mainData } = require('./take-data');
const { mainWilayah } = require('./take-wilayah');
const tps = require("./tps.json")
const timezone = "Asia/Jakarta";

const consoleLog = console.log;
console.log = function () {
    const currentTime = () => {
        let date_ob = new Date(
            new Date().toLocaleString("en", { timeZone: timezone })
        );
        let hours = zeroPad(date_ob.getHours());
        let minutes = zeroPad(date_ob.getMinutes());
        let seconds = zeroPad(date_ob.getSeconds());
        let milsec = zeroPad(date_ob.getMilliseconds(), true);

        return hours + ":" + minutes + ":" + seconds + ":" + milsec;
    };

    const zeroPad = (str, s = false) => {
        str = str.toString();
        if (s) {
            str = str.length > 2 ? str.substring(0, 2) : str;
        }
        return str.length >= 2 ? str : "0" + str;
    };

    consoleLog(`${currentTime()}`, ...arguments);
};
const run = async () => {
    let d = dayjs()
    await Promise.all([mainData(tps, d), mainWilayah(d)])
}
const main = async () => {
    const asec = 1000
    const amin = 60 * asec
    const halfh = 30 * amin
    while (true) {
        await run()
        await sleep(halfh)
    }

}


main()