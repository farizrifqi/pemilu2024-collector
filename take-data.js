const dayjs = require('dayjs');
const { daerahcodesplitter, createFolder, globalConfig } = require('./utils');
const tps = require("./tps.json")
const path = require("path");
const fs = require('fs')

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const config = {
    MAIN_DIR: "snapshots",
    SUB_DIR: "data"
}
const { VERBOSE } = globalConfig

const requestRoute = [
    {
        "name": "pemilu2024.kpu.go.id",
        "endpoint": "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/"
    },
    {
        "name": "kawalpemilu.org",
        "endpoint": "https://kp24-fd486.et.r.appspot.com/h?id="
    }
]
const mainData = async (date = dayjs()) => {

    for (const r of requestRoute) {
        let tempConfig = config
        tempConfig.SUB_DIR = `${config.SUB_DIR}/${r.name}`
        const dir = createFolder(tempConfig, date)
        for (const t of Object.keys(tps.tps)) {

            await downloadFile(dir, `${t}.json`, r.endpoint, t)
        }

    }
}
const downloadFile = async (save_dir, filename, endpoint, tps) => {
    try {
        const ppppaaattth = daerahcodesplitter(tps)
        ppppaaattth.pop()
        const fullurl = endpoint.includes("sirekap-obj-data.kpu.go.id") ? endpoint + ppppaaattth.join("/") + ".json" : endpoint + tps
        if (VERBOSE) console.log("Download", fullurl)
        const res = await fetch(fullurl);
        const destination = path.resolve(save_dir, filename)
        if (VERBOSE) console.log("Save", save_dir, filename)
        let data = await res.json();
        fs.writeFileSync(destination, JSON.stringify(data));
        logging(save_dir, filename, endpoint)
        console.log("success", fullurl)
        return
    } catch (err) {
        logging(save_dir, filename, endpoint, false)
        console.log(err)
        console.log("Err Download", save_dir, filename, endpoint)
        return await downloadFile(save_dir, filename, endpoint, tps)
    }
}
const logging = (save_dir, filename, endpoint, status = true) => {
    const destination = path.resolve(save_dir, "dl.log")
    fs.appendFileSync(destination, `[${new Date().toISOString()}] [${status.toString()}] dir:${save_dir} file:${filename} request:${endpoint}\n`)
}

module.exports = {mainData}