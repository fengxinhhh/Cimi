import { exec } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import getVersion from './getVersion'

const { cyan, green, red } = chalk

export default async function(options:any) {
  const [type, branch = 'master'] = options.args
  console.info(type, branch, options.args)
  const { projectVersion, projectName } = await getVersion()
  console.info(green(`Start to ${type} version to ${projectName}...`))
  const newVersion = getNewVersion(projectVersion)
  writeNewVersion()
  console.info(green(`\nVersion: ${cyan(`${projectVersion} -> ${newVersion}`)}`))
  console.info(green(`${type} ${projectName} version to ${newVersion}`))
  await execShell()
  console.info(`\n${green('[ Cimi ]')} Release ${projectName} Success!\n`)

  //获取新的版本号
  function getNewVersion(oldVersion:string) {
    let [major, minor, patch] = oldVersion.split('.')
    if(patch.length > 2 && patch.includes('-beta')) {
      patch = patch.split('-')[0];
    }
    switch (type) {
      case 'patch':
        return `${major}.${minor}.${+patch + 1}`
      case 'minor':
        return `${major}.${+minor + 1}.${patch}`
      case 'major':
        return `${+major + 1}.${minor}.${patch}`
      case 'patchBeta':
        return `${major}.${minor}.${+patch + 1}-beta`
      case 'minorBeta':
        return `${major}.${+minor + 1}.${patch}-beta`
      case 'majorBeta':
        return `${+major + 1}.${minor}.${patch}-beta`
      default:
        console.error(
          red('\nPlease write correctly update type: patch、minor、major、patchBeta、minorBeta、majorBeta\n')
        )
        process.exit(1)
    }
  }
  //写入新版本号，更新项目文件
  function writeNewVersion() {
    const packageJson = readFileSync(
      resolve(process.cwd(), 'package.json'),
      'utf8'
    )
    const newPackageJson = packageJson.replace(
      `"version": "${projectVersion}"`,
      `"version": "${newVersion}"`
    )
    writeFileSync(
      resolve(process.cwd(), 'package.json'),
      newPackageJson
    )
    console.info(green('\nUpdate package.json success!'))
  }
  //执行整个流程的命令
  async function execShell() {
    const echo1 = `${green('[ 1 / 3 ]')} ${cyan(`Commit and push to ${branch} branch`)}`
    const part1 = [
      'git add .',
      `git commit -m "${type} version to ${newVersion}"`,
      `git push origin ${branch}`,
    ]
    const echo2 = `${green('[ 2 / 3 ]')} ${cyan(`Tag and push tag to ${branch}`)}`
    const part2 = [
      `git tag ${newVersion}`,
      `git push origin ${newVersion}`,
    ]
    const echo3 = `${green('[ 3 / 3 ]')} ${cyan('Publish to NPM')}`
    const part3 = [
      `npm publish ${options.accessPublic ? '--access=public' : ''}`,
    ]
    await step(echo1, part1)
    await step(echo2, part2)
    await step(echo3, part3)
  }

  async function step(desc: string, command: string[]) {
    console.log(desc)
    return new Promise((resolve, reject) => {
      const childExec = exec(
        command.join(' && '),
        { maxBuffer: 10000 * 10240 },
        (err, stdout, stderr) => {
          console.log(err, stdout, stderr)
          if (err) {
            reject(err)
            throw err
          } else {
            resolve('')
          }
        }
      )
      childExec.stdout?.pipe(process.stdout)
      childExec.stderr?.pipe(process.stderr)
    })
  }
}

