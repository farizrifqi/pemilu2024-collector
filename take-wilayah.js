const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require("path");
const fs = require('fs')
const { createFolder, globalConfig } = require('./utils');
const dayjs = require('dayjs');
const config = {
    MAIN_DIR: "snapshots",
    SUB_DIR: "wilayah"
}
const { VERBOSE } = globalConfig
const requestRoute = [
    {
        "name": "pemilu2024.kpu.go.id",
        "endpoint": "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json"
    },
    {
        "name": "kawalpemilu.org",
        "endpoint": "https://kawalpemilu.org/assets/tps2.json"
    }
]

const logging = (save_dir, filename, endpoint, status = true) => {
    const destination = path.resolve(save_dir, "dl.log")
    fs.appendFileSync(destination, `[${new Date().toISOString()}] [${status.toString()}] dir:${save_dir} file:${filename} request:${endpoint}\n`)
}

const downloadFile = async (save_dir, filename, endpoint) => {
    try {
        if (VERBOSE) console.log("Download", endpoint)
        const res = await fetch(endpoint);
        const destination = path.resolve(save_dir, filename)
        if (VERBOSE) console.log("Save", save_dir, filename)
        let data = await res.json();
        fs.writeFileSync(destination, JSON.stringify(data));
        logging(save_dir, filename, endpoint)
        return
    } catch (err) {
        logging(save_dir, filename, endpoint, false)
        console.log("Err Download", save_dir, filename, endpoint)
        return await downloadFile(save_dir, filename, endpoint)
    }
}

const mainWilayah = async (date = dayjs()) => {
    const dir = createFolder(config, date)
    for (const r of requestRoute) {
        console.log(r)
        await downloadFile(dir, `${r.name}.json`, r.endpoint)
    }
}

module.exports = {mainWilayah}