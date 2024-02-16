const dayjs = require('dayjs')
const fs = require('fs')

const globalConfig = {
    VERBOSE: false
}
const { VERBOSE } = globalConfig

const daerahcodesplitter = (c) => {
    c = c.toString()
    const provinsi = c.substring(0, 2)
    const kabkot = `${provinsi}${c.substring(2).substring(0, 2)}`
    const kecamatan = `${kabkot}${c.substring(4).substring(0, 2)}`
    const kelurahan = `${kecamatan}${c.substring(6).substring(0, 4)}`
    const tps = `${kelurahan}${c.substring(10).substring(0, 3) ?? null}`
    return [provinsi, kabkot, kecamatan, kelurahan, tps]
}
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const createFolder = (config, date = dayjs()) => {
    const fulldate = date.format("DD-MM-YYYY hh:mm:ss")
    const [tgl, wkt] = fulldate.split(" ")
    const [d, m, y] = tgl.split("-")
    const [hh, mm, ss] = wkt.split(":")
    const dir = `${config.MAIN_DIR}/${y}/${m}/${d}/${hh}_${mm}_${ss}/${config.SUB_DIR}`
    let temp = '.'
    for (const d of dir.split("/")) {
        temp = `${temp}/${d}`
        if (!fs.existsSync(temp)) {
            fs.mkdirSync(temp);
            if (VERBOSE) console.log("gada", temp)
        } else {
            if (VERBOSE) console.log("gada", temp)
        }
    }
    return dir
}

module.exports = { createFolder, sleep,daerahcodesplitter, globalConfig }