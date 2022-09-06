"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var exec = require('child_process').exec;
var _a = require('chalk'), cyan = _a.cyan, green = _a.green, red = _a.red;
var getVersion = require('./getVersion');
var fs = require('fs');
var path = require('path');
module.exports = function (options) {
    return __awaiter(this, void 0, void 0, function () {
        function getNewVersion(oldVersion) {
            var _a = oldVersion.split('.'), major = _a[0], minor = _a[1], patch = _a[2];
            if (patch.length > 2 && patch.includes('-beta')) {
                patch = Number(patch.split('-')[0]);
            }
            switch (type) {
                case 'patch':
                    return "".concat(major, ".").concat(minor, ".").concat(+patch + 1);
                case 'minor':
                    return "".concat(major, ".").concat(+minor + 1, ".").concat(patch);
                case 'major':
                    return "".concat(+major + 1, ".").concat(minor, ".").concat(patch);
                case 'patchBeta':
                    return "".concat(major, ".").concat(minor, ".").concat(+patch + 1, "-beta");
                case 'minorBeta':
                    return "".concat(major, ".").concat(+minor + 1, ".").concat(patch, "-beta");
                case 'majorBeta':
                    return "".concat(+major + 1, ".").concat(minor, ".").concat(patch, "-beta");
                default:
                    console.error(red('\nPlease write correctly update type: patch、minor、major'));
                    process.exit(1);
            }
        }
        function writeNewVersion() {
            var packageJson = fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8');
            var newPackageJson = packageJson.replace("\"version\": \"".concat(projectVersion, "\""), "\"version\": \"".concat(newVersion, "\""));
            fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), newPackageJson);
            console.log(green('\nUpdate package.json success!'));
        }
        function execShell() {
            var shellList = [
                "echo \"\n".concat(green('[ 1 / 3 ]'), " ").concat(cyan("Commit and push to ".concat(branch, " branch")), "\n\""),
                'git add .',
                "git commit -m \"".concat(type, " version to ").concat(newVersion, "\""),
                "git push origin ".concat(branch),
                "echo \"\n".concat(green('[ 2 / 3 ]'), " ").concat(cyan("Tag and push tag to ".concat(branch)), "\n\""),
                "git tag ".concat(newVersion),
                "git push origin ".concat(newVersion),
                "echo \"\n".concat(green('[ 3 / 3 ]'), " ").concat(cyan('Publish to NPM'), "\n\""),
                "npm publish ".concat(options.accessPublic ? '--access=public' : ''),
            ].join(' && ');
            return new Promise(function (resolve) {
                var childExec = exec(shellList, { maxBuffer: 10000 * 10240 }, function (err, stdout) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    else {
                        resolve('');
                    }
                });
                childExec.stdout.pipe(process.stdout);
                childExec.stderr.pipe(process.stderr);
            });
        }
        var _a, type, _b, branch, _c, projectVersion, projectName, newVersion;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = options.args, type = _a[0], _b = _a[1], branch = _b === void 0 ? 'master' : _b;
                    return [4, getVersion()];
                case 1:
                    _c = _d.sent(), projectVersion = _c.projectVersion, projectName = _c.projectName;
                    console.log(green("Start to ".concat(type, " version to ").concat(projectName, "...")));
                    newVersion = getNewVersion(projectVersion);
                    writeNewVersion();
                    console.log(green("\nVersion: ".concat(cyan("".concat(projectVersion, " -> ").concat(newVersion)))));
                    console.log(green("".concat(type, " ").concat(projectName, " version to ").concat(newVersion)));
                    return [4, execShell()];
                case 2:
                    _d.sent();
                    console.log("\n".concat(green('[ Cimi ]'), " Release ").concat(projectName, " Success!\n"));
                    return [2];
            }
        });
    });
};
