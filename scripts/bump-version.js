const simpleGit = require('simple-git')
const minimist = require('minimist')
const child_process = require('child_process')
const path = require('path')

const defaultArgv = {
  mode: 'patch',
}

const argv = {
  ...defaultArgv,
  ...minimist(process.argv.slice(2)),
}

function getPkgVersion() {
  return require(path.join(__dirname, '../package.json')).version
}

function checkWorkspace() {
  return new Promise((resolve, reject) => {
    simpleGit().status((err, res) => {
      if (err) {
        reject(err)
      }
      resolve(res.files.length === 0)
    })
  })
}

async function main() {
  if (!await checkWorkspace()) {
    console.log('Make sure your git workspace is clean.')
    return
  }

  child_process.spawnSync('pnpm', ['version', argv.mode, '--no-git-tag-version'])
  child_process.spawnSync('pnpm', ['conventional-changelog', '-p', 'angular', '-i', 'CHANGELOG.md', '-s'])
  child_process.spawnSync('git', ['add', '.'])
  child_process.spawnSync('git', ['commit', '-m', `chore(release): v${getPkgVersion()}`])
}

main()
