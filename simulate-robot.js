import glob from 'glob'
import fsx from 'fs-extra'
import { exec } from 'child_process'
import util from 'util'

const execpromise = util.promisify(exec)

fsx.ensureDir('/tmp/comp')
const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time))
async function main () {
  glob('./mockin/*.zip', async (err, files) => {
    files = files.sort((a, b) => {
      let an = parseInt(a.match(/\d+/g)[0])
      let bn = parseInt(b.match(/\d+/g)[0])
      console.log(an, bn)
      if (an === bn) {
        return 0
      }
      if (an > bn) {
        return 1
      }
      return -1
    })
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      console.log(`Movendo arquivo >>>> ${file.replace(/(\D+)\//g, '')}`)
      await fsx.copyFile(file, `/tmp/comp/${file.replace(/(\D+)\//g, '')}`)
      if (i === 3) {
        await fsx.ensureFile('/tmp/comp/end.txt')
        break
      }
      await sleep(5000)
    }

    // await execpromise('rm -rf /tmp/comp/*')
  })
}

main().then().catch(err => {
  console.log(err)
  process.exit()
})

