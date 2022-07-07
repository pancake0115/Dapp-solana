import chalk from "chalk";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

import {
    defaultUiFramework,
    defaultProgramFramework
} from './helpers/constants';
import { 
    downloadFiles, 
    validateFramework
} from './helpers/framework';
import {
    tryGitInit
} from './helpers/git';
// import { 
//     renderTemplates
// } from './helpers/template';
import { 
    installDeps, 
    shouldUseYarn, 
    shouldUseYarnWorkspaces 
} from './helpers/yarn';


export async function createSolanaDapp({
    dappPath,
    framework,
    program,
}: {
    dappPath: string;
    framework?: string;
    program?: string;
}): Promise<void> {

    console.log();
    console.log(`Creating Solana dApp: ${dappPath}`);
    console.log();

    const root: string = path.resolve(dappPath);
    const dappName: string = path.basename(root);
    const originalDirectory: string = process.cwd();

    if (framework) {
        await validateFramework(framework, "UI");
    } else {
        framework = defaultUiFramework;
    };
    if (program) {
        await validateFramework(program, "program");
    } else {
        program = defaultProgramFramework;
    };

    console.log(`${chalk.magentaBright("    UI Framework      : ")} ${framework}`);
    console.log(`${chalk.magentaBright("    Program Framework : ")} ${program}`);
    console.log();

    if (fs.existsSync(root)) {
        console.log();
        console.error(`${chalk.redBright("Error:")} directory exists: ${root}`);
        console.log();
        process.exit(1);
    }

    console.log("Building...");
    console.log();
    await fsExtra.ensureDir(root);
    await fsExtra.ensureDir(root + "/app");
    // await fsExtra.ensureDir(root + "/program");
    await fsExtra.ensureDir(root + "/temp");
    shouldUseYarn();
    shouldUseYarnWorkspaces();

    console.log("Downloading templates...");
    console.log();
    await downloadFiles(framework, program, root);

    console.log("Extracting...");
    console.log();
    // await renderTemplates(dappName);

    console.log("Installing dependencies for UI...");
    console.log();
    // await installDeps(root + "/app");

    console.log("Installing dependencies for program...");
    console.log();
    // await installDeps(root + "/program");

    console.log("Initializing git...");
    console.log();
    if (tryGitInit(root)) {
        console.log("Initialized a git repository.");
        console.log();
    };

    console.log(`${chalk.greenBright("  Done!")}`);
    console.log();
    console.log(`Successfully created Solana dApp: ${chalk.greenBright(dappName)}!`);
    console.log();
    console.log(`${chalk.magentaBright("  Happy dApp Hacking!")}`);
}