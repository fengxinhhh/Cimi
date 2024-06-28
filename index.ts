const { exec } = require('child_process');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { green, red, cyan } = require('chalk');
const getVersion = require('./getVersion.ts');
const inquirer = require('inquirer');

module.exports = async function (options) {
  const type = options.rawArgs[2];
  const branch = options.rawArgs[3] || 'master';
  // console.log(options)
  console.info(`Cimi type: ${green(type)}, Cimi push branch: ${green(branch)}`);
  const { projectVersion, projectName } = await getVersion();
  if (type) {
    console.info(green(`Start to ${type} version to ${projectName}...`));
  } else {
    console.info(green(`Start to manual select new version to ${projectName}...`));
  }
  const newVersion = await getNewVersion(projectVersion);
  
  // 确保在获取新版本后立即写入新版本号
  await writeNewVersion(newVersion);

  console.info(green(`\nVersion: ${cyan(`${projectVersion} -> ${newVersion}`)}`));
  console.info(green(`${type} ${projectName} version to ${newVersion}`));
  await execShell();
  console.info(`\n${green('[ Cimi ]')} Release ${projectName} Success!\n`);

  // 获取新的版本号
  async function getNewVersion(oldVersion) {
    let [major, minor, patch] = oldVersion.split('.');
    const betaVersion = oldVersion?.split('beta')[1] || 1;
    if (patch.length > 2 && patch.includes('-beta')) {
      patch = patch.split('-')[0];
    }
    switch (type) {
      case 'patch':
        return `${major}.${minor}.${+patch + 1}`;
      case 'minor':
        return `${major}.${+minor + 1}.${0}`;
      case 'major':
        return `${+major + 1}.${0}.${0}`;
      case 'beta':
        return `${major}.${minor}.${patch}-beta`;
      case 'upgradeBeta':
        return `${major}.${minor}.${patch}-beta${+betaVersion + 1}`;
      case 'manual': {
        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'cimiType',
              message: 'please select new version',
              choices: [
                `patch ${major}.${minor}.${+patch + 1}`,
                `minor ${major}.${+minor + 1}.${patch}`,
                `major ${+major + 1}.${minor}.${patch}`,
                `${major}.${minor}.${patch}-beta`,
                `${major}.${minor}.${patch}-beta${+betaVersion + 1}`,
              ],
            },
          ])
          .then(async answers => {
            try {
              const selectedVersion = answers['cimiType'].match(/(?<=\w+\s+)(\w|\.|\-)+/)[0];
              // 在选择版本后立即写入新版本号
              await writeNewVersion(selectedVersion);
              return selectedVersion;
            } catch (err) {
              return answers['cimiType'];
            }
          })
          .catch(error => {
            if (error.isTtyError) {
              console.log(red(`Prompt couldn't be rendered in the current environment`));
            } else {
              console.log(red(`error:${error}`));
            }
          });
      }
      default:
        console.error(red('\nPlease write correctly update type: patch、minor、major、beta、upgradeBeta\n'));
        process.exit(1);
    }
  }

  // 写入新版本号，更新项目文件
  async function writeNewVersion(newVersion) {
    const packageJson = readFileSync(resolve(process.cwd(), 'package.json'), 'utf8');
    const newPackageJson = packageJson.replace(
      `"version": "${projectVersion}"`,
      `"version": "${newVersion}"`
    );
    writeFileSync(resolve(process.cwd(), 'package.json'), newPackageJson);
    console.info(green('\nUpdate package.json success!'));
  }

  // 执行整个流程的命令
  async function execShell() {
    const echo1 = `${green('[ 1 / 3 ]')} ${cyan(`Commit and push to ${branch} branch`)}`;
    const part1 = [
      'git add .',
      `git commit -m "${type} version to ${newVersion}"`,
      `git push origin ${branch}`,
    ];
    const echo2 = `${green('[ 2 / 3 ]')} ${cyan(`Tag and push tag to ${branch}`)}`;
    const part2 = [`git tag ${newVersion}`, `git push origin ${newVersion}`];
    const echo3 = `${green('[ 3 / 3 ]')} ${cyan('Publish to NPM')}`;
    const part3 = [`npm publish ${options.accessPublic ? '--access=public' : ''}`];
    await step(echo1, part1);
    await step(echo2, part2);
    await step(echo3, part3);
  }

  async function step(desc, command) {
    // console.log(desc)
    return new Promise((resolve, reject) => {
      const childExec = exec(
        command.join(' && '),
        { maxBuffer: 10000 * 10240 },
        (err, stdout, stderr) => {
          console.log(err, stdout, stderr);
          if (err) {
            reject(err);
            throw err;
          } else {
            resolve('');
          }
        }
      );
      childExec.stdout?.pipe(process.stdout);
      childExec.stderr?.pipe(process.stderr);
    });
  }
};

// export {};
