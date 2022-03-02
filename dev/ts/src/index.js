#!/usr/bin/env node
const exec = require("child_process").exec;
const path = require('path');

const package = require(path.join(process.cwd(), "package.json"));
const tsc_path = path.join(process.cwd(), "node_modules", "@abot", "ts", "node_modules", ".bin", "tsc");
const config_path = path.join(process.cwd(), "node_modules", "@abot", "ts", "tsconfig.json");
const target_path = path.join(process.cwd(), "target");

let stdout = "";
let params = [
  process.env.NODE_ENV === "lib" ? "--declaration" : ""
];
new Promise((resolve, reject) => exec(
  `rm -rf ${target_path} && ${tsc_path} --project ${config_path} --outDir ${target_path} ${params.join(' ')}`, 
  (error, stdoutLocal, stderr) => {
    stdout = stdoutLocal || stdout;
    if (error || stderr) {
      reject(error || stderr);
      return;
    }

    resolve(stdout);
  }
)).then((stdout) => 
  console.log(`${package.name} builded\n${stdout.split('\n').map((i) => `  ${i}`).join('\n')}`)
).catch(() => 
  console.error(`${package.name}:`, stdout)
);