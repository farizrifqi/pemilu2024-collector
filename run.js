const dayjs = require('dayjs');
const { daerahcodesplitter, sleep } = require('./utils');
const { mainData } = require('./take-data');
const { mainWilayah } = require('./take-wilayah');

const run = async () => {
    let d = dayjs()
    await Promise.all([mainData(d), mainWilayah(d)])
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