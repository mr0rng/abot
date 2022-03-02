#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require('fs');
const path = require('path');

const package = require(path.join(process.cwd(), 'package.json'));
const { version } = require(path.join(process.cwd(), '..', '..', 'package.json'));
const targetDockerDir = path.join(process.cwd(), 'target-docker');

(async () => {
  await exec([
    `rm -rf ${targetDockerDir}`, 
    `mkdir ${targetDockerDir}`, 
    `mkdir ${path.join(targetDockerDir, 'node_modules')}`,
    `mkdir ${path.join(targetDockerDir, 'node_modules', '@abot')}`
  ].join(' && '));
  await exec('rsync -rL --exclude=node_modules ./node_modules/@abot/ ./target-docker/node_modules/@abot/');
  
  fs.writeFileSync(
    path.join(targetDockerDir, 'package.json'), 
    JSON.stringify(
      { 
        name: package.name, 
        version, 
        dependencies: Object.keys(package.dependencies).reduce((agg, key) => {
          if (/^\@abot\//.test(key)) {
            return agg
          }

          agg[key] = package.dependencies[key]
          return agg
        }, {})
      }, 
      null, 
      2
    )
  );
  
  await exec(`docker build -f ${path.join(__dirname, '..', 'Dockerfile')} -t ${package.docker.imageName}:${version} .`);
  await exec(`docker tag ${package.docker.imageName}:${version} ${package.docker.imageName}:latest`);
  
  console.log(`${package.name} docker builded`)
})();