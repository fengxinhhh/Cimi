import fs from 'fs'
import path from 'path'

export default async function() {
  const packageJson = fs.readFileSync(
    path.resolve(process.cwd(), 'package.json'),
    'utf8'
  )
  return {
    projectVersion: JSON.parse(packageJson).version,
    projectName: JSON.parse(packageJson).name,
  }
}
