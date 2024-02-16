const dayjs = require('dayjs');
const { daerahcodesplitter, createFolder, globalConfig } = require('./utils');
const path = require("path");
const fs = require('fs')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config = {
    MAIN_DIR: "snapshots",
    SUB_DIR: "data"
}
let total = 0
let proses = 0
const { VERBOSE } = globalConfig
const requestRoute = [
    {
        "name": "pemilu2024.kpu.go.id",
        "endpoint": "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/"
    },
    {
        "name": "kawalpemilu.org",
        "endpoint": "https://kp24-fd486.et.r.appspot.com/h?id="
    },

]
const mainData = async (tps, date = dayjs()) => {
    proses = 0
    total = Object.keys(tps.tps).length * 2

    await Promise.all(requestRoute.map((r, i) => {
        let tempConfig = { ...config }
        tempConfig.SUB_DIR = `${config.SUB_DIR}/${r.name}`
        const dir = createFolder(tempConfig, date)
        return Object.keys(tps.tps).map(t => downloadFile(dir, t.replaceAll(" ", "") + ".json", r.endpoint, t.replaceAll(" ", ""), r.name))
    }).reduce((prev, next) => prev.concat(next)))
}
const downloadFile = async (save_dir, filename, endpoint, tps, name) => {
    try {
        const ppppaaattth = daerahcodesplitter(tps)
        ppppaaattth.pop()
        const fullurl = endpoint.includes("sirekap-obj-data.kpu.go.id") ? endpoint + ppppaaattth.join("/") + ".json" : endpoint + tps
        if (VERBOSE) console.log("Download", fullurl)
        const res = await fetch(fullurl);
        if (VERBOSE) console.log("Save", save_dir, filename)
        let data = await res.text();
        const destination = path.resolve(save_dir, filename)
        fs.writeFileSync(destination, data.toString());
        logging(save_dir, filename, endpoint)
        proses++
        console.log(`[${proses}/${total}]`, `[${tps}]`, name, save_dir)
        return;
    } catch (err) {
        logging(save_dir, filename, endpoint, false)
        console.log("Err Download", save_dir, filename, endpoint)
        return await downloadFile(save_dir, filename, endpoint, tps)
    }
}
const logging = (save_dir, filename, endpoint, status = true) => {
    const destination = path.resolve(save_dir, "dl.log")
    fs.appendFileSync(destination, `[${new Date().toISOString()}] [${status.toString()}] dir:${save_dir} file:${filename} request:${endpoint}\n`)
}

module.exports = { mainData }