'use strict';
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
    console.log("Terminals: " + (<any>vscode.window).terminals.length);
    context.subscriptions.push(vscode.window.registerTerminalProfileProvider('nushell_default', {
        provideTerminalProfile(token: vscode.CancellationToken): vscode.ProviderResult<vscode.TerminalProfile> {
            const path = require('path');
            const fs = require('fs');
            const glob = require('glob');
            const os = require('os');

            const pathsToCheck = [
                // cargo install location
                '~/.cargo/bin/nu',
                '~/.cargo/bin/nu.exe',

                // winget on Windows install location
                'c:\\program files\\nu\\bin\\nu.exe',
                // just add a few other drives for fun
                'd:\\program files\\nu\\bin\\nu.exe',
                'e:\\program files\\nu\\bin\\nu.exe',
                'f:\\program files\\nu\\bin\\nu.exe',

                // SCOOP:TODO
                // all user installed programs and scoop itself install to
                // c:\users\<user>\scoop\ unless SCOOP env var is set
                // globally installed programs go in
                // c:\programdata\scoop unless SCOOP_GLOBAL env var is set
                // scoop install location
                '~/scoop/apps/nu/*/nu.exe',
                '~/scoop/shims/nu.exe',

                // chocolatey install location - same as winget
                // 'c:\\program files\\nu\\bin\\nu.exe',

                // macos dmg install
                // we currentl don't have a dmg install

                // linux and mac zips can be put anywhere so it's hard to guess

                // brew install location mac
                // intel
                '/usr/local/bin/nu',
                // arm
                '/opt/homebrew/bin/nu',
                
                 // native package manager install location
                '/usr/bin/nu',
            ];

            let found_nushell_path = "";
            const home = os.homedir();

            for (const cur_val of pathsToCheck) {
                // console.log("Inspecting location: " + cur_val);
                let constructed_file = "";
                if (cur_val.startsWith('~/scoop')) {
                    // console.log("Found scoop: " + cur_val);
                    const p = path.join(home, cur_val.slice(1));
                    // console.log("Expanded ~: " + p);
                    const file = glob.sync(p, "debug").toString();
                    // console.log("Glob for files: " + file);

                    if (file) {
                        // console.log("Found some file: " + file);
                        // if there are slashes, reverse them to back slashes
                        constructed_file = file.replace(/\//g, '\\');
                    }
                }
                else if (cur_val.startsWith('~')) {
                    constructed_file = path.join(home, cur_val.slice(1));
                    // console.log("Found ~, constructing path: " + constructed_file);
                } else {
                    constructed_file = cur_val;
                }

                if (fs.existsSync(constructed_file)) {
                    // console.log("File exists, returning: " + constructed_file);
                    found_nushell_path = constructed_file;
                    break;
                } else {
                    // console.log("File not found: " + constructed_file);
                }
            }

            if (found_nushell_path.length > 0) {
                return {
                    options: {
                        name: 'Nushell',
                        shellPath: found_nushell_path
                    }
                };
            }
            else {
                console.log("Nushell not found, returning undefined");
                return undefined;
            }
        }
    }));
}
// import * as vscode from "vscode";
// export function activate(context: vscode.ExtensionContext) {
//     const keywordsWithSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider("nushell", {
//             provideCompletionItems(
//                 document: vscode.TextDocument,
//                 position: vscode.Position,
//                 token: vscode.CancellationToken,
//                 context: vscode.CompletionContext
//             ) {
//                 const aliasCompletion = new vscode.CompletionItem("alias");
//                 aliasCompletion.commitCharacters = ["."];

//                 const allCompletion = new vscode.CompletionItem("all?");
//                 allCompletion.commitCharacters = ["."];

//                 const ansiCompletion = new vscode.CompletionItem("ansi");
//                 ansiCompletion.commitCharacters = ["."];

//                 const anyCompletion = new vscode.CompletionItem("any?");
//                 anyCompletion.commitCharacters = ["."];

//                 const appendCompletion = new vscode.CompletionItem("append");
//                 appendCompletion.commitCharacters = ["."];

//                 const autoenvCompletion = new vscode.CompletionItem("autoenv");
//                 autoenvCompletion.commitCharacters = ["."];

//                 const autoviewCompletion = new vscode.CompletionItem("autoview");
//                 autoviewCompletion.commitCharacters = ["."];

//                 const benchmarkCompletion = new vscode.CompletionItem("benchmark");
//                 benchmarkCompletion.commitCharacters = ["."];

//                 const binaryviewCompletion = new vscode.CompletionItem("binaryview");
//                 binaryviewCompletion.commitCharacters = ["."];

//                 const buildStringCompletion = new vscode.CompletionItem("build-string");
//                 buildStringCompletion.commitCharacters = ["."];

//                 const calCompletion = new vscode.CompletionItem("cal");
//                 calCompletion.commitCharacters = ["."];

//                 const cdCompletion = new vscode.CompletionItem("cd");
//                 cdCompletion.commitCharacters = ["."];

//                 const charCompletion = new vscode.CompletionItem("char");
//                 charCompletion.commitCharacters = ["."];

//                 const chartCompletion = new vscode.CompletionItem("chart");
//                 chartCompletion.commitCharacters = ["."];

//                 const clearCompletion = new vscode.CompletionItem("clear");
//                 clearCompletion.commitCharacters = ["."];

//                 const clipCompletion = new vscode.CompletionItem("clip");
//                 clipCompletion.commitCharacters = ["."];

//                 const collectCompletion = new vscode.CompletionItem("collect");
//                 collectCompletion.commitCharacters = ["."];

//                 const compactCompletion = new vscode.CompletionItem("compact");
//                 compactCompletion.commitCharacters = ["."];

//                 const configCompletion = new vscode.CompletionItem("config");
//                 configCompletion.commitCharacters = ["."];

//                 const cpCompletion = new vscode.CompletionItem("cp");
//                 cpCompletion.commitCharacters = ["."];

//                 const dataframeCompletion = new vscode.CompletionItem("dataframe");
//                 dataframeCompletion.commitCharacters = ["."];

//                 const dateCompletion = new vscode.CompletionItem("date");
//                 dateCompletion.commitCharacters = ["."];

//                 const debugCompletion = new vscode.CompletionItem("debug");
//                 debugCompletion.commitCharacters = ["."];

//                 const defCompletion = new vscode.CompletionItem("def");
//                 defCompletion.commitCharacters = ["."];

//                 const defaultCompletion = new vscode.CompletionItem("default");
//                 defaultCompletion.commitCharacters = ["."];

//                 const describeCompletion = new vscode.CompletionItem("describe");
//                 describeCompletion.commitCharacters = ["."];

//                 const doCompletion = new vscode.CompletionItem("do");
//                 doCompletion.commitCharacters = ["."];

//                 const dropCompletion = new vscode.CompletionItem("drop");
//                 dropCompletion.commitCharacters = ["."];

//                 const duCompletion = new vscode.CompletionItem("du");
//                 duCompletion.commitCharacters = ["."];

//                 const eachCompletion = new vscode.CompletionItem("each");
//                 eachCompletion.commitCharacters = ["."];

//                 const echoCompletion = new vscode.CompletionItem("echo");
//                 echoCompletion.commitCharacters = ["."];

//                 const emptyCompletion = new vscode.CompletionItem("empty?");
//                 emptyCompletion.commitCharacters = ["."];

//                 const enterCompletion = new vscode.CompletionItem("enter");
//                 enterCompletion.commitCharacters = ["."];

//                 const everyCompletion = new vscode.CompletionItem("every");
//                 everyCompletion.commitCharacters = ["."];

//                 const execCompletion = new vscode.CompletionItem("exec");
//                 execCompletion.commitCharacters = ["."];

//                 const exitCompletion = new vscode.CompletionItem("exit");
//                 exitCompletion.commitCharacters = ["."];

//                 const fetchCompletion = new vscode.CompletionItem("fetch");
//                 fetchCompletion.commitCharacters = ["."];

//                 const firstCompletion = new vscode.CompletionItem("first");
//                 firstCompletion.commitCharacters = ["."];

//                 const flattenCompletion = new vscode.CompletionItem("flatten");
//                 flattenCompletion.commitCharacters = ["."];

//                 const forCompletion = new vscode.CompletionItem("for");
//                 forCompletion.commitCharacters = ["."];

//                 const formatCompletion = new vscode.CompletionItem("format");
//                 formatCompletion.commitCharacters = ["."];

//                 const fromCompletion = new vscode.CompletionItem("from");
//                 fromCompletion.commitCharacters = ["."];

//                 const genTsCmdsCompletion = new vscode.CompletionItem("gen-ts-cmds");
//                 genTsCmdsCompletion.commitCharacters = ["."];

//                 const genTsSubsCompletion = new vscode.CompletionItem("gen-ts-subs");
//                 genTsSubsCompletion.commitCharacters = ["."];

//                 const getCompletion = new vscode.CompletionItem("get");
//                 getCompletion.commitCharacters = ["."];

//                 const groupByCompletion = new vscode.CompletionItem("group-by");
//                 groupByCompletion.commitCharacters = ["."];

//                 const hashCompletion = new vscode.CompletionItem("hash");
//                 hashCompletion.commitCharacters = ["."];

//                 const headersCompletion = new vscode.CompletionItem("headers");
//                 headersCompletion.commitCharacters = ["."];

//                 const helpCompletion = new vscode.CompletionItem("help");
//                 helpCompletion.commitCharacters = ["."];

//                 const histogramCompletion = new vscode.CompletionItem("histogram");
//                 histogramCompletion.commitCharacters = ["."];

//                 const historyCompletion = new vscode.CompletionItem("history");
//                 historyCompletion.commitCharacters = ["."];

//                 const ifCompletion = new vscode.CompletionItem("if");
//                 ifCompletion.commitCharacters = ["."];

//                 const ignoreCompletion = new vscode.CompletionItem("ignore");
//                 ignoreCompletion.commitCharacters = ["."];

//                 const incCompletion = new vscode.CompletionItem("inc");
//                 incCompletion.commitCharacters = ["."];

//                 const insertCompletion = new vscode.CompletionItem("insert");
//                 insertCompletion.commitCharacters = ["."];

//                 const intoCompletion = new vscode.CompletionItem("into");
//                 intoCompletion.commitCharacters = ["."];

//                 const keepCompletion = new vscode.CompletionItem("keep");
//                 keepCompletion.commitCharacters = ["."];

//                 const killCompletion = new vscode.CompletionItem("kill");
//                 killCompletion.commitCharacters = ["."];

//                 const lastCompletion = new vscode.CompletionItem("last");
//                 lastCompletion.commitCharacters = ["."];

//                 const lengthCompletion = new vscode.CompletionItem("length");
//                 lengthCompletion.commitCharacters = ["."];

//                 const letCompletion = new vscode.CompletionItem("let");
//                 letCompletion.commitCharacters = ["."];

//                 const letEnvCompletion = new vscode.CompletionItem("let-env");
//                 letEnvCompletion.commitCharacters = ["."];

//                 const linesCompletion = new vscode.CompletionItem("lines");
//                 linesCompletion.commitCharacters = ["."];

//                 const loadEnvCompletion = new vscode.CompletionItem("load-env");
//                 loadEnvCompletion.commitCharacters = ["."];

//                 const lsCompletion = new vscode.CompletionItem("ls");
//                 lsCompletion.commitCharacters = ["."];

//                 const matchCompletion = new vscode.CompletionItem("match");
//                 matchCompletion.commitCharacters = ["."];

//                 const mathCompletion = new vscode.CompletionItem("math");
//                 mathCompletion.commitCharacters = ["."];

//                 const mergeCompletion = new vscode.CompletionItem("merge");
//                 mergeCompletion.commitCharacters = ["."];

//                 const mkdirCompletion = new vscode.CompletionItem("mkdir");
//                 mkdirCompletion.commitCharacters = ["."];

//                 const moveCompletion = new vscode.CompletionItem("move");
//                 moveCompletion.commitCharacters = ["."];

//                 const mvCompletion = new vscode.CompletionItem("mv");
//                 mvCompletion.commitCharacters = ["."];

//                 const nCompletion = new vscode.CompletionItem("n");
//                 nCompletion.commitCharacters = ["."];

//                 const nthCompletion = new vscode.CompletionItem("nth");
//                 nthCompletion.commitCharacters = ["."];

//                 const openCompletion = new vscode.CompletionItem("open");
//                 openCompletion.commitCharacters = ["."];

//                 const pCompletion = new vscode.CompletionItem("p");
//                 pCompletion.commitCharacters = ["."];

//                 const parseCompletion = new vscode.CompletionItem("parse");
//                 parseCompletion.commitCharacters = ["."];

//                 const pasteCompletion = new vscode.CompletionItem("paste");
//                 pasteCompletion.commitCharacters = ["."];

//                 const pathCompletion = new vscode.CompletionItem("path");
//                 pathCompletion.commitCharacters = ["."];

//                 const pathvarCompletion = new vscode.CompletionItem("pathvar");
//                 pathvarCompletion.commitCharacters = ["."];

//                 const pivotCompletion = new vscode.CompletionItem("pivot");
//                 pivotCompletion.commitCharacters = ["."];

//                 const postCompletion = new vscode.CompletionItem("post");
//                 postCompletion.commitCharacters = ["."];

//                 const prependCompletion = new vscode.CompletionItem("prepend");
//                 prependCompletion.commitCharacters = ["."];

//                 const psCompletion = new vscode.CompletionItem("ps");
//                 psCompletion.commitCharacters = ["."];

//                 const pwdCompletion = new vscode.CompletionItem("pwd");
//                 pwdCompletion.commitCharacters = ["."];

//                 const randomCompletion = new vscode.CompletionItem("random");
//                 randomCompletion.commitCharacters = ["."];

//                 const rangeCompletion = new vscode.CompletionItem("range");
//                 rangeCompletion.commitCharacters = ["."];

//                 const reduceCompletion = new vscode.CompletionItem("reduce");
//                 reduceCompletion.commitCharacters = ["."];

//                 const rejectCompletion = new vscode.CompletionItem("reject");
//                 rejectCompletion.commitCharacters = ["."];

//                 const renameCompletion = new vscode.CompletionItem("rename");
//                 renameCompletion.commitCharacters = ["."];

//                 const reverseCompletion = new vscode.CompletionItem("reverse");
//                 reverseCompletion.commitCharacters = ["."];

//                 const rmCompletion = new vscode.CompletionItem("rm");
//                 rmCompletion.commitCharacters = ["."];

//                 const rollCompletion = new vscode.CompletionItem("roll");
//                 rollCompletion.commitCharacters = ["."];

//                 const rotateCompletion = new vscode.CompletionItem("rotate");
//                 rotateCompletion.commitCharacters = ["."];

//                 const s3Completion = new vscode.CompletionItem("s3");
//                 s3Completion.commitCharacters = ["."];

//                 const saveCompletion = new vscode.CompletionItem("save");
//                 saveCompletion.commitCharacters = ["."];

//                 const selectCompletion = new vscode.CompletionItem("select");
//                 selectCompletion.commitCharacters = ["."];

//                 const selectorCompletion = new vscode.CompletionItem("selector");
//                 selectorCompletion.commitCharacters = ["."];

//                 const seqCompletion = new vscode.CompletionItem("seq");
//                 seqCompletion.commitCharacters = ["."];

//                 const shellsCompletion = new vscode.CompletionItem("shells");
//                 shellsCompletion.commitCharacters = ["."];

//                 const shuffleCompletion = new vscode.CompletionItem("shuffle");
//                 shuffleCompletion.commitCharacters = ["."];

//                 const sizeCompletion = new vscode.CompletionItem("size");
//                 sizeCompletion.commitCharacters = ["."];

//                 const skipCompletion = new vscode.CompletionItem("skip");
//                 skipCompletion.commitCharacters = ["."];

//                 const sleepCompletion = new vscode.CompletionItem("sleep");
//                 sleepCompletion.commitCharacters = ["."];

//                 const sortByCompletion = new vscode.CompletionItem("sort-by");
//                 sortByCompletion.commitCharacters = ["."];

//                 const sourceCompletion = new vscode.CompletionItem("source");
//                 sourceCompletion.commitCharacters = ["."];

//                 const splitCompletion = new vscode.CompletionItem("split");
//                 splitCompletion.commitCharacters = ["."];

//                 const splitByCompletion = new vscode.CompletionItem("split-by");
//                 splitByCompletion.commitCharacters = ["."];

//                 const startCompletion = new vscode.CompletionItem("start");
//                 startCompletion.commitCharacters = ["."];

//                 const strCompletion = new vscode.CompletionItem("str");
//                 strCompletion.commitCharacters = ["."];

//                 const sysCompletion = new vscode.CompletionItem("sys");
//                 sysCompletion.commitCharacters = ["."];

//                 const tableCompletion = new vscode.CompletionItem("table");
//                 tableCompletion.commitCharacters = ["."];

//                 const tagsCompletion = new vscode.CompletionItem("tags");
//                 tagsCompletion.commitCharacters = ["."];

//                 const textviewCompletion = new vscode.CompletionItem("textview");
//                 textviewCompletion.commitCharacters = ["."];

//                 const toCompletion = new vscode.CompletionItem("to");
//                 toCompletion.commitCharacters = ["."];

//                 const touchCompletion = new vscode.CompletionItem("touch");
//                 touchCompletion.commitCharacters = ["."];

//                 const treeCompletion = new vscode.CompletionItem("tree");
//                 treeCompletion.commitCharacters = ["."];

//                 const uniqCompletion = new vscode.CompletionItem("uniq");
//                 uniqCompletion.commitCharacters = ["."];

//                 const unletEnvCompletion = new vscode.CompletionItem("unlet-env");
//                 unletEnvCompletion.commitCharacters = ["."];

//                 const updateCompletion = new vscode.CompletionItem("update");
//                 updateCompletion.commitCharacters = ["."];

//                 const urlCompletion = new vscode.CompletionItem("url");
//                 urlCompletion.commitCharacters = ["."];

//                 const versionCompletion = new vscode.CompletionItem("version");
//                 versionCompletion.commitCharacters = ["."];

//                 const whereCompletion = new vscode.CompletionItem("where");
//                 whereCompletion.commitCharacters = ["."];

//                 const whichCompletion = new vscode.CompletionItem("which");
//                 whichCompletion.commitCharacters = ["."];

//                 const withEnvCompletion = new vscode.CompletionItem("with-env");
//                 withEnvCompletion.commitCharacters = ["."];

//                 const wrapCompletion = new vscode.CompletionItem("wrap");
//                 wrapCompletion.commitCharacters = ["."];

//                 const xpathCompletion = new vscode.CompletionItem("xpath");
//                 xpathCompletion.commitCharacters = ["."];

//                 return [
//                     aliasCompletion,
//                     allCompletion,
//                     ansiCompletion,
//                     anyCompletion,
//                     appendCompletion,
//                     autoenvCompletion,
//                     autoviewCompletion,
//                     benchmarkCompletion,
//                     binaryviewCompletion,
//                     buildStringCompletion,
//                     calCompletion,
//                     cdCompletion,
//                     charCompletion,
//                     chartCompletion,
//                     clearCompletion,
//                     clipCompletion,
//                     collectCompletion,
//                     compactCompletion,
//                     configCompletion,
//                     cpCompletion,
//                     dataframeCompletion,
//                     dateCompletion,
//                     debugCompletion,
//                     defCompletion,
//                     defaultCompletion,
//                     describeCompletion,
//                     doCompletion,
//                     dropCompletion,
//                     duCompletion,
//                     eachCompletion,
//                     echoCompletion,
//                     emptyCompletion,
//                     enterCompletion,
//                     everyCompletion,
//                     execCompletion,
//                     exitCompletion,
//                     fetchCompletion,
//                     firstCompletion,
//                     flattenCompletion,
//                     forCompletion,
//                     formatCompletion,
//                     fromCompletion,
//                     genTsCmdsCompletion,
//                     genTsSubsCompletion,
//                     getCompletion,
//                     groupByCompletion,
//                     hashCompletion,
//                     headersCompletion,
//                     helpCompletion,
//                     histogramCompletion,
//                     historyCompletion,
//                     ifCompletion,
//                     ignoreCompletion,
//                     incCompletion,
//                     insertCompletion,
//                     intoCompletion,
//                     keepCompletion,
//                     killCompletion,
//                     lastCompletion,
//                     lengthCompletion,
//                     letCompletion,
//                     letEnvCompletion,
//                     linesCompletion,
//                     loadEnvCompletion,
//                     lsCompletion,
//                     matchCompletion,
//                     mathCompletion,
//                     mergeCompletion,
//                     mkdirCompletion,
//                     moveCompletion,
//                     mvCompletion,
//                     nCompletion,
//                     nthCompletion,
//                     openCompletion,
//                     pCompletion,
//                     parseCompletion,
//                     pasteCompletion,
//                     pathCompletion,
//                     pathvarCompletion,
//                     pivotCompletion,
//                     postCompletion,
//                     prependCompletion,
//                     psCompletion,
//                     pwdCompletion,
//                     randomCompletion,
//                     rangeCompletion,
//                     reduceCompletion,
//                     rejectCompletion,
//                     renameCompletion,
//                     reverseCompletion,
//                     rmCompletion,
//                     rollCompletion,
//                     rotateCompletion,
//                     s3Completion,
//                     saveCompletion,
//                     selectCompletion,
//                     selectorCompletion,
//                     seqCompletion,
//                     shellsCompletion,
//                     shuffleCompletion,
//                     sizeCompletion,
//                     skipCompletion,
//                     sleepCompletion,
//                     sortByCompletion,
//                     sourceCompletion,
//                     splitCompletion,
//                     splitByCompletion,
//                     startCompletion,
//                     strCompletion,
//                     sysCompletion,
//                     tableCompletion,
//                     tagsCompletion,
//                     textviewCompletion,
//                     toCompletion,
//                     touchCompletion,
//                     treeCompletion,
//                     uniqCompletion,
//                     unletEnvCompletion,
//                     updateCompletion,
//                     urlCompletion,
//                     versionCompletion,
//                     whereCompletion,
//                     whichCompletion,
//                     withEnvCompletion,
//                     wrapCompletion,
//                     xpathCompletion,
//                 ];
//             },
//         });

//     const ansiSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("ansi ")) {
//                         const ansiGradient = new vscode.CompletionItem(
//                             "gradient",
//                             vscode.CompletionItemKind.Method
//                         );
//                         ansiGradient.detail =
//                             "draw text with a provided start and end code making a gradient";

//                         const ansiStrip = new vscode.CompletionItem(
//                             "strip",
//                             vscode.CompletionItemKind.Method
//                         );
//                         ansiStrip.detail = "strip ansi escape sequences from string";

//                         return [ansiGradient, ansiStrip];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const autoenvSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("autoenv ")) {
//                         const autoenvTrust = new vscode.CompletionItem(
//                             "trust",
//                             vscode.CompletionItemKind.Method
//                         );
//                         autoenvTrust.detail =
//                             "Trust a .nu-env file in the current or given directory";

//                         const autoenvUntrust = new vscode.CompletionItem(
//                             "untrust",
//                             vscode.CompletionItemKind.Method
//                         );
//                         autoenvUntrust.detail =
//                             "Untrust a .nu-env file in the current or given directory";

//                         return [autoenvTrust, autoenvUntrust];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const chartSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("chart ")) {
//                         const chartBar = new vscode.CompletionItem(
//                             "bar",
//                             vscode.CompletionItemKind.Method
//                         );
//                         chartBar.detail = "Bar charts";

//                         const chartLine = new vscode.CompletionItem(
//                             "line",
//                             vscode.CompletionItemKind.Method
//                         );
//                         chartLine.detail = "Line charts";

//                         return [chartBar, chartLine];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const configSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("config ")) {
//                         const configClear = new vscode.CompletionItem(
//                             "clear",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configClear.detail = "clear the config";

//                         const configGet = new vscode.CompletionItem(
//                             "get",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configGet.detail = "Gets a value from the config";

//                         const configPath = new vscode.CompletionItem(
//                             "path",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configPath.detail = "return the path to the config file";

//                         const configRemove = new vscode.CompletionItem(
//                             "remove",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configRemove.detail = "Removes a value from the config";

//                         const configSet = new vscode.CompletionItem(
//                             "set",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configSet.detail = "Sets a value in the config";

//                         const configSetInto = new vscode.CompletionItem(
//                             "set_into",
//                             vscode.CompletionItemKind.Method
//                         );
//                         configSetInto.detail = "Sets a value in the config";

//                         return [
//                             configClear,
//                             configGet,
//                             configPath,
//                             configRemove,
//                             configSet,
//                             configSetInto,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const dataframeSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("dataframe ")) {
//                         const dataframeAggregate = new vscode.CompletionItem(
//                             "aggregate",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeAggregate.detail =
//                             "[DataFrame, GroupBy, Series] Performs an aggregation operation on a dataframe, groupby or series object";

//                         const dataframeAllFalse = new vscode.CompletionItem(
//                             "all-false",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeAllFalse.detail =
//                             "[Series] Returns true if all values are false";

//                         const dataframeAllTrue = new vscode.CompletionItem(
//                             "all-true",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeAllTrue.detail =
//                             "[Series] Returns true if all values are true";

//                         const dataframeAppend = new vscode.CompletionItem(
//                             "append",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeAppend.detail = "[DataFrame] Appends a new dataframe";

//                         const dataframeArgMax = new vscode.CompletionItem(
//                             "arg-max",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeArgMax.detail =
//                             "[Series] Return index for max value in series";

//                         const dataframeArgMin = new vscode.CompletionItem(
//                             "arg-min",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeArgMin.detail =
//                             "[Series] Return index for min value in series";

//                         const dataframeArgSort = new vscode.CompletionItem(
//                             "arg-sort",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeArgSort.detail =
//                             "[Series] Returns indexes for a sorted series";

//                         const dataframeArgTrue = new vscode.CompletionItem(
//                             "arg-true",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeArgTrue.detail =
//                             "[Series] Returns indexes where values are true";

//                         const dataframeArgUnique = new vscode.CompletionItem(
//                             "arg-unique",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeArgUnique.detail =
//                             "[Series] Returns indexes for unique values";

//                         const dataframeColumn = new vscode.CompletionItem(
//                             "column",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeColumn.detail =
//                             "[DataFrame] Returns the selected column as Series";

//                         const dataframeConcatenate = new vscode.CompletionItem(
//                             "concatenate",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeConcatenate.detail =
//                             "[Series] Concatenates strings with other array";

//                         const dataframeContains = new vscode.CompletionItem(
//                             "contains",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeContains.detail =
//                             "[Series] Checks if a patter is contained in a string";

//                         const dataframeCountNull = new vscode.CompletionItem(
//                             "count-null",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeCountNull.detail = "[Series] Counts null values";

//                         const dataframeCountUnique = new vscode.CompletionItem(
//                             "count-unique",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeCountUnique.detail = "[Series] Counts unique value";

//                         const dataframeDrop = new vscode.CompletionItem(
//                             "drop",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeDrop.detail =
//                             "[DataFrame] Creates a new dataframe by dropping the selected columns";

//                         const dataframeDropDuplicates = new vscode.CompletionItem(
//                             "drop-duplicates",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeDropDuplicates.detail =
//                             "[DataFrame] Drops duplicate values in dataframe";

//                         const dataframeDropNulls = new vscode.CompletionItem(
//                             "drop-nulls",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeDropNulls.detail =
//                             "[DataFrame, Series] Drops null values in dataframe";

//                         const dataframeDtypes = new vscode.CompletionItem(
//                             "dtypes",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeDtypes.detail = "[DataFrame] Show dataframe data types";

//                         const dataframeFilterWith = new vscode.CompletionItem(
//                             "filter-with",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeFilterWith.detail =
//                             "[DataFrame] Filters dataframe using a mask as reference";

//                         const dataframeFirst = new vscode.CompletionItem(
//                             "first",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeFirst.detail =
//                             "[DataFrame] Creates new dataframe with first rows";

//                         const dataframeGet = new vscode.CompletionItem(
//                             "get",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeGet.detail =
//                             "[DataFrame] Creates dataframe with the selected columns";

//                         const dataframeGroupBy = new vscode.CompletionItem(
//                             "group-by",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeGroupBy.detail =
//                             "[DataFrame] Creates a groupby object that can be used for other aggregations";

//                         const dataframeIsDuplicated = new vscode.CompletionItem(
//                             "is-duplicated",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeIsDuplicated.detail =
//                             "[Series] Creates mask indicating duplicated values";

//                         const dataframeIsIn = new vscode.CompletionItem(
//                             "is-in",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeIsIn.detail =
//                             "[Series] Checks if elements from a series are contained in right series";

//                         const dataframeIsNotNull = new vscode.CompletionItem(
//                             "is-not-null",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeIsNotNull.detail =
//                             "[Series] Creates mask where value is not null";

//                         const dataframeIsNull = new vscode.CompletionItem(
//                             "is-null",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeIsNull.detail =
//                             "[Series] Creates mask where value is null";

//                         const dataframeIsUnique = new vscode.CompletionItem(
//                             "is-unique",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeIsUnique.detail =
//                             "[Series] Creates mask indicating unique values";

//                         const dataframeJoin = new vscode.CompletionItem(
//                             "join",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeJoin.detail =
//                             "[DataFrame] Joins a dataframe using columns as reference";

//                         const dataframeLast = new vscode.CompletionItem(
//                             "last",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeLast.detail =
//                             "[DataFrame] Creates new dataframe with tail rows";

//                         const dataframeList = new vscode.CompletionItem(
//                             "list",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeList.detail = "Lists stored dataframes";

//                         const dataframeMelt = new vscode.CompletionItem(
//                             "melt",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeMelt.detail =
//                             "[DataFrame] Unpivot a DataFrame from wide to long format";

//                         const dataframeNot = new vscode.CompletionItem(
//                             "not",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeNot.detail = "[Series] Inverts boolean mask";

//                         const dataframeOpen = new vscode.CompletionItem(
//                             "open",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeOpen.detail =
//                             "Opens csv, json or parquet file to create dataframe";

//                         const dataframePivot = new vscode.CompletionItem(
//                             "pivot",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframePivot.detail =
//                             "[GroupBy] Performs a pivot operation on a groupby object";

//                         const dataframeRename = new vscode.CompletionItem(
//                             "rename",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeRename.detail = "[Series] Renames a series";

//                         const dataframeReplace = new vscode.CompletionItem(
//                             "replace",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeReplace.detail =
//                             "[Series] Replace the leftmost (sub)string by a regex pattern";

//                         const dataframeReplaceAll = new vscode.CompletionItem(
//                             "replace-all",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeReplaceAll.detail =
//                             "[Series] Replace all (sub)strings by a regex pattern";

//                         const dataframeSample = new vscode.CompletionItem(
//                             "sample",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSample.detail = "[DataFrame] Create sample dataframe";

//                         const dataframeSelect = new vscode.CompletionItem(
//                             "select",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSelect.detail =
//                             "[DataFrame] Creates a new dataframe with the selected columns";

//                         const dataframeSet = new vscode.CompletionItem(
//                             "set",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSet.detail =
//                             "[Series] Sets value where given mask is true";

//                         const dataframeSetWithIdx = new vscode.CompletionItem(
//                             "set-with-idx",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSetWithIdx.detail =
//                             "[Series] Sets value in the given index";

//                         const dataframeShape = new vscode.CompletionItem(
//                             "shape",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeShape.detail =
//                             "[DataFrame] Shows column and row size for a dataframe";

//                         const dataframeShift = new vscode.CompletionItem(
//                             "shift",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeShift.detail =
//                             "[Series] Shifts the values by a given period";

//                         const dataframeShow = new vscode.CompletionItem(
//                             "show",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeShow.detail =
//                             "[DataFrame] Converts a section of the dataframe to a Table or List value";

//                         const dataframeSlice = new vscode.CompletionItem(
//                             "slice",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSlice.detail =
//                             "[DataFrame] Creates new dataframe from a slice of rows";

//                         const dataframeSort = new vscode.CompletionItem(
//                             "sort",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeSort.detail =
//                             "[DataFrame, Series] Creates new sorted dataframe or series";

//                         const dataframeStrLengths = new vscode.CompletionItem(
//                             "str-lengths",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeStrLengths.detail = "[Series] Get lengths of all strings";

//                         const dataframeStrSlice = new vscode.CompletionItem(
//                             "str-slice",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeStrSlice.detail =
//                             "[Series] Slices the string from the start position until the selected length";

//                         const dataframeTake = new vscode.CompletionItem(
//                             "take",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeTake.detail =
//                             "[DataFrame, Series] Creates new dataframe using the given indices";

//                         const dataframeToCsv = new vscode.CompletionItem(
//                             "to-csv",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToCsv.detail = "[DataFrame] Saves dataframe to csv file";

//                         const dataframeToDf = new vscode.CompletionItem(
//                             "to-df",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToDf.detail =
//                             "Converts a List, Table or Dictionary into a polars dataframe";

//                         const dataframeToDummies = new vscode.CompletionItem(
//                             "to-dummies",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToDummies.detail =
//                             "[DataFrame] Creates a new dataframe with dummy variables";

//                         const dataframeToLowercase = new vscode.CompletionItem(
//                             "to-lowercase",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToLowercase.detail =
//                             "[Series] Lowercase the strings in the column";

//                         const dataframeToParquet = new vscode.CompletionItem(
//                             "to-parquet",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToParquet.detail =
//                             "[DataFrame] Saves dataframe to parquet file";

//                         const dataframeToUppercase = new vscode.CompletionItem(
//                             "to-uppercase",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeToUppercase.detail =
//                             "[Series] Uppercase the strings in the column";

//                         const dataframeUnique = new vscode.CompletionItem(
//                             "unique",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeUnique.detail =
//                             "[Series] Returns unique values from a series";

//                         const dataframeValueCounts = new vscode.CompletionItem(
//                             "value-counts",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeValueCounts.detail =
//                             "[Series] Returns a dataframe with the counts for unique values in series";

//                         const dataframeWhere = new vscode.CompletionItem(
//                             "where",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeWhere.detail =
//                             "[DataFrame] Filter dataframe to match the condition";

//                         const dataframeWithColumn = new vscode.CompletionItem(
//                             "with-column",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dataframeWithColumn.detail =
//                             "[DataFrame] Adds a series to the dataframe";

//                         return [
//                             dataframeAggregate,
//                             dataframeAllFalse,
//                             dataframeAllTrue,
//                             dataframeAppend,
//                             dataframeArgMax,
//                             dataframeArgMin,
//                             dataframeArgSort,
//                             dataframeArgTrue,
//                             dataframeArgUnique,
//                             dataframeColumn,
//                             dataframeConcatenate,
//                             dataframeContains,
//                             dataframeCountNull,
//                             dataframeCountUnique,
//                             dataframeDrop,
//                             dataframeDropDuplicates,
//                             dataframeDropNulls,
//                             dataframeDtypes,
//                             dataframeFilterWith,
//                             dataframeFirst,
//                             dataframeGet,
//                             dataframeGroupBy,
//                             dataframeIsDuplicated,
//                             dataframeIsIn,
//                             dataframeIsNotNull,
//                             dataframeIsNull,
//                             dataframeIsUnique,
//                             dataframeJoin,
//                             dataframeLast,
//                             dataframeList,
//                             dataframeMelt,
//                             dataframeNot,
//                             dataframeOpen,
//                             dataframePivot,
//                             dataframeRename,
//                             dataframeReplace,
//                             dataframeReplaceAll,
//                             dataframeSample,
//                             dataframeSelect,
//                             dataframeSet,
//                             dataframeSetWithIdx,
//                             dataframeShape,
//                             dataframeShift,
//                             dataframeShow,
//                             dataframeSlice,
//                             dataframeSort,
//                             dataframeStrLengths,
//                             dataframeStrSlice,
//                             dataframeTake,
//                             dataframeToCsv,
//                             dataframeToDf,
//                             dataframeToDummies,
//                             dataframeToLowercase,
//                             dataframeToParquet,
//                             dataframeToUppercase,
//                             dataframeUnique,
//                             dataframeValueCounts,
//                             dataframeWhere,
//                             dataframeWithColumn,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const dateSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("date ")) {
//                         const dateFormat = new vscode.CompletionItem(
//                             "format",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateFormat.detail =
//                             "Format a given date using the given format string.";

//                         const dateHumanize = new vscode.CompletionItem(
//                             "humanize",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateHumanize.detail =
//                             "Print a 'humanized' format for the date, relative to now.";

//                         const dateListTimezone = new vscode.CompletionItem(
//                             "list-timezone",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateListTimezone.detail = "List supported time zones.";

//                         const dateNow = new vscode.CompletionItem(
//                             "now",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateNow.detail = "Get the current date.";

//                         const dateToTable = new vscode.CompletionItem(
//                             "to-table",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateToTable.detail = "Print the date in a structured table.";

//                         const dateToTimezone = new vscode.CompletionItem(
//                             "to-timezone",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dateToTimezone.detail = "Convert a date to a given time zone.";

//                         return [
//                             dateFormat,
//                             dateHumanize,
//                             dateListTimezone,
//                             dateNow,
//                             dateToTable,
//                             dateToTimezone,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const dropSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("drop ")) {
//                         const dropColumn = new vscode.CompletionItem(
//                             "column",
//                             vscode.CompletionItemKind.Method
//                         );
//                         dropColumn.detail =
//                             "Remove the last number of columns. If you want to remove columns by name, try 'reject'.";

//                         return [dropColumn];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const eachSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("each ")) {
//                         const eachGroup = new vscode.CompletionItem(
//                             "group",
//                             vscode.CompletionItemKind.Method
//                         );
//                         eachGroup.detail =
//                             "Runs a block on groups of `group_size` rows of a table at a time.";

//                         const eachWindow = new vscode.CompletionItem(
//                             "window",
//                             vscode.CompletionItemKind.Method
//                         );
//                         eachWindow.detail =
//                             "Runs a block on sliding windows of `window_size` rows of a table at a time.";

//                         return [eachGroup, eachWindow];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const formatSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("format ")) {
//                         const formatFilesize = new vscode.CompletionItem(
//                             "filesize",
//                             vscode.CompletionItemKind.Method
//                         );
//                         formatFilesize.detail =
//                             "Converts a column of filesizes to some specified format";

//                         return [formatFilesize];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const fromSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("from ")) {
//                         const fromBson = new vscode.CompletionItem(
//                             "bson",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromBson.detail = "Convert from .bson binary into table";

//                         const fromCsv = new vscode.CompletionItem(
//                             "csv",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromCsv.detail = "Parse text as .csv and create table.";

//                         const fromEml = new vscode.CompletionItem(
//                             "eml",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromEml.detail = "Parse text as .eml and create table.";

//                         const fromIcs = new vscode.CompletionItem(
//                             "ics",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromIcs.detail = "Parse text as .ics and create table.";

//                         const fromIni = new vscode.CompletionItem(
//                             "ini",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromIni.detail = "Parse text as .ini and create table";

//                         const fromJson = new vscode.CompletionItem(
//                             "json",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromJson.detail = "Parse text as .json and create table.";

//                         const fromOds = new vscode.CompletionItem(
//                             "ods",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromOds.detail =
//                             "Parse OpenDocument Spreadsheet(.ods) data and create table.";

//                         const fromSqlite = new vscode.CompletionItem(
//                             "sqlite",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromSqlite.detail = "Convert from sqlite binary into table";

//                         const fromSsv = new vscode.CompletionItem(
//                             "ssv",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromSsv.detail =
//                             "Parse text as space-separated values and create a table. The default minimum number of spaces counted as a separator is 2.";

//                         const fromToml = new vscode.CompletionItem(
//                             "toml",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromToml.detail = "Parse text as .toml and create table.";

//                         const fromTsv = new vscode.CompletionItem(
//                             "tsv",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromTsv.detail = "Parse text as .tsv and create table.";

//                         const fromUrl = new vscode.CompletionItem(
//                             "url",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromUrl.detail = "Parse url-encoded string as a table.";

//                         const fromVcf = new vscode.CompletionItem(
//                             "vcf",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromVcf.detail = "Parse text as .vcf and create table.";

//                         const fromXlsx = new vscode.CompletionItem(
//                             "xlsx",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromXlsx.detail =
//                             "Parse binary Excel(.xlsx) data and create table.";

//                         const fromXml = new vscode.CompletionItem(
//                             "xml",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromXml.detail = "Parse text as .xml and create table.";

//                         const fromYaml = new vscode.CompletionItem(
//                             "yaml",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromYaml.detail = "Parse text as .yaml/.yml and create table.";

//                         const fromYml = new vscode.CompletionItem(
//                             "yml",
//                             vscode.CompletionItemKind.Method
//                         );
//                         fromYml.detail = "Parse text as .yaml/.yml and create table.";

//                         return [
//                             fromBson,
//                             fromCsv,
//                             fromEml,
//                             fromIcs,
//                             fromIni,
//                             fromJson,
//                             fromOds,
//                             fromSqlite,
//                             fromSsv,
//                             fromToml,
//                             fromTsv,
//                             fromUrl,
//                             fromVcf,
//                             fromXlsx,
//                             fromXml,
//                             fromYaml,
//                             fromYml,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const groupBySubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("group-by ")) {
//                         const groupByDate = new vscode.CompletionItem(
//                             "date",
//                             vscode.CompletionItemKind.Method
//                         );
//                         groupByDate.detail = "creates a table grouped by date.";

//                         return [groupByDate];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const hashSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("hash ")) {
//                         const hashBase64 = new vscode.CompletionItem(
//                             "base64",
//                             vscode.CompletionItemKind.Method
//                         );
//                         hashBase64.detail = "base64 encode or decode a value";

//                         const hashMd5 = new vscode.CompletionItem(
//                             "md5",
//                             vscode.CompletionItemKind.Method
//                         );
//                         hashMd5.detail = "md5 encode a value";

//                         const hashSha256 = new vscode.CompletionItem(
//                             "sha256",
//                             vscode.CompletionItemKind.Method
//                         );
//                         hashSha256.detail = "sha256 encode a value";

//                         return [hashBase64, hashMd5, hashSha256];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const intoSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("into ")) {
//                         const intoBinary = new vscode.CompletionItem(
//                             "binary",
//                             vscode.CompletionItemKind.Method
//                         );
//                         intoBinary.detail = "Convert value to a binary primitive";

//                         const intoInt = new vscode.CompletionItem(
//                             "int",
//                             vscode.CompletionItemKind.Method
//                         );
//                         intoInt.detail = "Convert value to integer";

//                         const intoPath = new vscode.CompletionItem(
//                             "path",
//                             vscode.CompletionItemKind.Method
//                         );
//                         intoPath.detail = "Convert value to filepath";

//                         const intoString = new vscode.CompletionItem(
//                             "string",
//                             vscode.CompletionItemKind.Method
//                         );
//                         intoString.detail = "Convert value to string";

//                         return [intoBinary, intoInt, intoPath, intoString];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const keepSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("keep ")) {
//                         const keepUntil = new vscode.CompletionItem(
//                             "until",
//                             vscode.CompletionItemKind.Method
//                         );
//                         keepUntil.detail = "Keeps rows until the condition matches.";

//                         const keepWhile = new vscode.CompletionItem(
//                             "while",
//                             vscode.CompletionItemKind.Method
//                         );
//                         keepWhile.detail = "Keeps rows while the condition matches.";

//                         return [keepUntil, keepWhile];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const mathSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("math ")) {
//                         const mathAbs = new vscode.CompletionItem(
//                             "abs",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathAbs.detail = "Returns absolute values of a list of numbers";

//                         const mathAvg = new vscode.CompletionItem(
//                             "avg",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathAvg.detail = "Finds the average of a list of numbers or tables";

//                         const mathCeil = new vscode.CompletionItem(
//                             "ceil",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathCeil.detail = "Applies the ceil function to a list of numbers";

//                         const mathEval = new vscode.CompletionItem(
//                             "eval",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathEval.detail = "Evaluate a math expression into a number";

//                         const mathFloor = new vscode.CompletionItem(
//                             "floor",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathFloor.detail =
//                             "Applies the floor function to a list of numbers";

//                         const mathMax = new vscode.CompletionItem(
//                             "max",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathMax.detail =
//                             "Finds the maximum within a list of numbers or tables";

//                         const mathMedian = new vscode.CompletionItem(
//                             "median",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathMedian.detail = "Gets the median of a list of numbers";

//                         const mathMin = new vscode.CompletionItem(
//                             "min",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathMin.detail =
//                             "Finds the minimum within a list of numbers or tables";

//                         const mathMode = new vscode.CompletionItem(
//                             "mode",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathMode.detail =
//                             "Gets the most frequent element(s) from a list of numbers or tables";

//                         const mathProduct = new vscode.CompletionItem(
//                             "product",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathProduct.detail =
//                             "Finds the product of a list of numbers or tables";

//                         const mathRound = new vscode.CompletionItem(
//                             "round",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathRound.detail =
//                             "Applies the round function to a list of numbers";

//                         const mathSqrt = new vscode.CompletionItem(
//                             "sqrt",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathSqrt.detail =
//                             "Applies the square root function to a list of numbers";

//                         const mathStddev = new vscode.CompletionItem(
//                             "stddev",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathStddev.detail =
//                             "Finds the stddev of a list of numbers or tables";

//                         const mathSum = new vscode.CompletionItem(
//                             "sum",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathSum.detail = "Finds the sum of a list of numbers or tables";

//                         const mathVariance = new vscode.CompletionItem(
//                             "variance",
//                             vscode.CompletionItemKind.Method
//                         );
//                         mathVariance.detail =
//                             "Finds the variance of a list of numbers or tables";

//                         return [
//                             mathAbs,
//                             mathAvg,
//                             mathCeil,
//                             mathEval,
//                             mathFloor,
//                             mathMax,
//                             mathMedian,
//                             mathMin,
//                             mathMode,
//                             mathProduct,
//                             mathRound,
//                             mathSqrt,
//                             mathStddev,
//                             mathSum,
//                             mathVariance,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const pathSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("path ")) {
//                         const pathBasename = new vscode.CompletionItem(
//                             "basename",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathBasename.detail = "Get the final component of a path";

//                         const pathDirname = new vscode.CompletionItem(
//                             "dirname",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathDirname.detail = "Get the parent directory of a path";

//                         const pathExists = new vscode.CompletionItem(
//                             "exists",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathExists.detail = "Check whether a path exists";

//                         const pathExpand = new vscode.CompletionItem(
//                             "expand",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathExpand.detail = "Try to expand a path to its absolute form";

//                         const pathJoin = new vscode.CompletionItem(
//                             "join",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathJoin.detail = "Join a structured path or a list of path parts.";

//                         const pathParse = new vscode.CompletionItem(
//                             "parse",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathParse.detail = "Convert a path into structured data.";

//                         const pathRelativeTo = new vscode.CompletionItem(
//                             "relative-to",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathRelativeTo.detail = "Get a path as relative to another path.";

//                         const pathSplit = new vscode.CompletionItem(
//                             "split",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathSplit.detail = "Split a path into parts by a separator.";

//                         const pathType = new vscode.CompletionItem(
//                             "type",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathType.detail =
//                             "Get the type of the object a path refers to (e.g., file, dir, symlink)";

//                         return [
//                             pathBasename,
//                             pathDirname,
//                             pathExists,
//                             pathExpand,
//                             pathJoin,
//                             pathParse,
//                             pathRelativeTo,
//                             pathSplit,
//                             pathType,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const pathvarSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("pathvar ")) {
//                         const pathvarAdd = new vscode.CompletionItem(
//                             "add",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathvarAdd.detail = "Add a filepath to the start of the pathvar";

//                         const pathvarAppend = new vscode.CompletionItem(
//                             "append",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathvarAppend.detail = "Add a path to the end of the pathvar";

//                         const pathvarRemove = new vscode.CompletionItem(
//                             "remove",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathvarRemove.detail = "Remove a path from the pathvar";

//                         const pathvarReset = new vscode.CompletionItem(
//                             "reset",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathvarReset.detail =
//                             "Reset the pathvar to the one specified in the config";

//                         const pathvarSave = new vscode.CompletionItem(
//                             "save",
//                             vscode.CompletionItemKind.Method
//                         );
//                         pathvarSave.detail = "Save the current pathvar to the config file";

//                         return [
//                             pathvarAdd,
//                             pathvarAppend,
//                             pathvarRemove,
//                             pathvarReset,
//                             pathvarSave,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const randomSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("random ")) {
//                         const randomBool = new vscode.CompletionItem(
//                             "bool",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomBool.detail = "Generate a random boolean value";

//                         const randomChars = new vscode.CompletionItem(
//                             "chars",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomChars.detail = "Generate random chars";

//                         const randomDecimal = new vscode.CompletionItem(
//                             "decimal",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomDecimal.detail =
//                             "Generate a random decimal within a range [min..max]";

//                         const randomDice = new vscode.CompletionItem(
//                             "dice",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomDice.detail = "Generate a random dice roll";

//                         const randomInteger = new vscode.CompletionItem(
//                             "integer",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomInteger.detail = "Generate a random integer [min..max]";

//                         const randomUuid = new vscode.CompletionItem(
//                             "uuid",
//                             vscode.CompletionItemKind.Method
//                         );
//                         randomUuid.detail = "Generate a random uuid4 string";

//                         return [
//                             randomBool,
//                             randomChars,
//                             randomDecimal,
//                             randomDice,
//                             randomInteger,
//                             randomUuid,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const rollSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("roll ")) {
//                         const rollColumn = new vscode.CompletionItem(
//                             "column",
//                             vscode.CompletionItemKind.Method
//                         );
//                         rollColumn.detail = "Rolls the table columns";

//                         const rollUp = new vscode.CompletionItem(
//                             "up",
//                             vscode.CompletionItemKind.Method
//                         );
//                         rollUp.detail = "Rolls the table rows";

//                         return [rollColumn, rollUp];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const rotateSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("rotate ")) {
//                         const rotateCounterClockwise = new vscode.CompletionItem(
//                             "counter-clockwise",
//                             vscode.CompletionItemKind.Method
//                         );
//                         rotateCounterClockwise.detail =
//                             "Rotates the table by 90 degrees counter clockwise.";

//                         return [rotateCounterClockwise];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const seqSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("seq ")) {
//                         const seqDate = new vscode.CompletionItem(
//                             "date",
//                             vscode.CompletionItemKind.Method
//                         );
//                         seqDate.detail = "print sequences of dates";

//                         return [seqDate];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const skipSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("skip ")) {
//                         const skipUntil = new vscode.CompletionItem(
//                             "until",
//                             vscode.CompletionItemKind.Method
//                         );
//                         skipUntil.detail = "Skips rows until the condition matches.";

//                         const skipWhile = new vscode.CompletionItem(
//                             "while",
//                             vscode.CompletionItemKind.Method
//                         );
//                         skipWhile.detail = "Skips rows while the condition matches.";

//                         return [skipUntil, skipWhile];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const splitSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("split ")) {
//                         const splitChars = new vscode.CompletionItem(
//                             "chars",
//                             vscode.CompletionItemKind.Method
//                         );
//                         splitChars.detail =
//                             "splits a string's characters into separate rows";

//                         const splitColumn = new vscode.CompletionItem(
//                             "column",
//                             vscode.CompletionItemKind.Method
//                         );
//                         splitColumn.detail =
//                             "splits contents across multiple columns via the separator.";

//                         const splitRow = new vscode.CompletionItem(
//                             "row",
//                             vscode.CompletionItemKind.Method
//                         );
//                         splitRow.detail =
//                             "splits contents over multiple rows via the separator.";

//                         return [splitChars, splitColumn, splitRow];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const strSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("str ")) {
//                         const strCamelCase = new vscode.CompletionItem(
//                             "camel-case",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strCamelCase.detail = "converts a string to camelCase";

//                         const strCapitalize = new vscode.CompletionItem(
//                             "capitalize",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strCapitalize.detail = "capitalizes text";

//                         const strCollect = new vscode.CompletionItem(
//                             "collect",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strCollect.detail = "collects a list of strings into a string";

//                         const strContains = new vscode.CompletionItem(
//                             "contains",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strContains.detail = "Checks if string contains pattern";

//                         const strDowncase = new vscode.CompletionItem(
//                             "downcase",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strDowncase.detail = "downcases text";

//                         const strEndsWith = new vscode.CompletionItem(
//                             "ends-with",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strEndsWith.detail = "checks if string ends with pattern";

//                         const strFindReplace = new vscode.CompletionItem(
//                             "find-replace",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strFindReplace.detail = "finds and replaces text";

//                         const strIndexOf = new vscode.CompletionItem(
//                             "index-of",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strIndexOf.detail =
//                             "Returns starting index of given pattern in string counting from 0. Returns -1 when there are no results.";

//                         const strKebabCase = new vscode.CompletionItem(
//                             "kebab-case",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strKebabCase.detail = "converts a string to kebab-case";

//                         const strLength = new vscode.CompletionItem(
//                             "length",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strLength.detail =
//                             "outputs the lengths of the strings in the pipeline";

//                         const strLpad = new vscode.CompletionItem(
//                             "lpad",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strLpad.detail = "pad a string with a character a certain length";

//                         const strPascalCase = new vscode.CompletionItem(
//                             "pascal-case",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strPascalCase.detail = "converts a string to PascalCase";

//                         const strReverse = new vscode.CompletionItem(
//                             "reverse",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strReverse.detail =
//                             "outputs the reversals of the strings in the pipeline";

//                         const strRpad = new vscode.CompletionItem(
//                             "rpad",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strRpad.detail = "pad a string with a character a certain length";

//                         const strScreamingSnakeCase = new vscode.CompletionItem(
//                             "screaming-snake-case",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strScreamingSnakeCase.detail =
//                             "converts a string to SCREAMING_SNAKE_CASE";

//                         const strSnakeCase = new vscode.CompletionItem(
//                             "snake-case",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strSnakeCase.detail = "converts a string to snake_case";

//                         const strStartsWith = new vscode.CompletionItem(
//                             "starts-with",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strStartsWith.detail = "checks if string starts with pattern";

//                         const strSubstring = new vscode.CompletionItem(
//                             "substring",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strSubstring.detail = "substrings text";

//                         const strToDatetime = new vscode.CompletionItem(
//                             "to-datetime",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strToDatetime.detail = "converts text into datetime";

//                         const strToDecimal = new vscode.CompletionItem(
//                             "to-decimal",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strToDecimal.detail = "converts text into decimal";

//                         const strToInt = new vscode.CompletionItem(
//                             "to-int",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strToInt.detail = "converts text into integer";

//                         const strTrim = new vscode.CompletionItem(
//                             "trim",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strTrim.detail = "trims text";

//                         const strUpcase = new vscode.CompletionItem(
//                             "upcase",
//                             vscode.CompletionItemKind.Method
//                         );
//                         strUpcase.detail = "upcases text";

//                         return [
//                             strCamelCase,
//                             strCapitalize,
//                             strCollect,
//                             strContains,
//                             strDowncase,
//                             strEndsWith,
//                             strFindReplace,
//                             strIndexOf,
//                             strKebabCase,
//                             strLength,
//                             strLpad,
//                             strPascalCase,
//                             strReverse,
//                             strRpad,
//                             strScreamingSnakeCase,
//                             strSnakeCase,
//                             strStartsWith,
//                             strSubstring,
//                             strToDatetime,
//                             strToDecimal,
//                             strToInt,
//                             strTrim,
//                             strUpcase,
//                         ];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     const toSubCommandsProvider = vscode.languages.registerCompletionItemProvider(
//         "nushell",
//         {
//             provideCompletionItems(
//                 document: vscode.TextDocument,
//                 position: vscode.Position
//             ) {
//                 const linePrefix = document
//                     .lineAt(position)
//                     .text.substr(0, position.character);
//                 if (linePrefix.endsWith("to ")) {
//                     const toBson = new vscode.CompletionItem(
//                         "bson",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toBson.detail = "Convert table into .bson binary";

//                     const toCsv = new vscode.CompletionItem(
//                         "csv",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toCsv.detail = "Convert table into .csv text ";

//                     const toHtml = new vscode.CompletionItem(
//                         "html",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toHtml.detail = "Convert table into simple HTML";

//                     const toJson = new vscode.CompletionItem(
//                         "json",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toJson.detail = "Converts table data into JSON text.";

//                     const toMd = new vscode.CompletionItem(
//                         "md",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toMd.detail = "Convert table into simple Markdown";

//                     const toSqlite = new vscode.CompletionItem(
//                         "sqlite",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toSqlite.detail = "Convert table into sqlite binary";

//                     const toToml = new vscode.CompletionItem(
//                         "toml",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toToml.detail = "Convert table into .toml text";

//                     const toTsv = new vscode.CompletionItem(
//                         "tsv",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toTsv.detail = "Convert table into .tsv text";

//                     const toUrl = new vscode.CompletionItem(
//                         "url",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toUrl.detail = "Convert table into url-encoded text";

//                     const toXml = new vscode.CompletionItem(
//                         "xml",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toXml.detail = "Convert table into .xml text";

//                     const toYaml = new vscode.CompletionItem(
//                         "yaml",
//                         vscode.CompletionItemKind.Method
//                     );
//                     toYaml.detail = "Convert table into .yaml/.yml text";

//                     return [
//                         toBson,
//                         toCsv,
//                         toHtml,
//                         toJson,
//                         toMd,
//                         toSqlite,
//                         toToml,
//                         toTsv,
//                         toUrl,
//                         toXml,
//                         toYaml,
//                     ];
//                 } else {
//                     return undefined;
//                 }
//             },
//         },
//         "."
//     );
//     const urlSubCommandsProvider =
//         vscode.languages.registerCompletionItemProvider(
//             "nushell",
//             {
//                 provideCompletionItems(
//                     document: vscode.TextDocument,
//                     position: vscode.Position
//                 ) {
//                     const linePrefix = document
//                         .lineAt(position)
//                         .text.substr(0, position.character);
//                     if (linePrefix.endsWith("url ")) {
//                         const urlHost = new vscode.CompletionItem(
//                             "host",
//                             vscode.CompletionItemKind.Method
//                         );
//                         urlHost.detail = "gets the host of a url";

//                         const urlPath = new vscode.CompletionItem(
//                             "path",
//                             vscode.CompletionItemKind.Method
//                         );
//                         urlPath.detail = "gets the path of a url";

//                         const urlQuery = new vscode.CompletionItem(
//                             "query",
//                             vscode.CompletionItemKind.Method
//                         );
//                         urlQuery.detail = "gets the query of a url";

//                         const urlScheme = new vscode.CompletionItem(
//                             "scheme",
//                             vscode.CompletionItemKind.Method
//                         );
//                         urlScheme.detail = "gets the scheme (eg http, file) of a url";

//                         return [urlHost, urlPath, urlQuery, urlScheme];
//                     } else {
//                         return undefined;
//                     }
//                 },
//             },
//             "."
//         );
//     context.subscriptions.push(
//         ansiSubCommandsProvider,
//         autoenvSubCommandsProvider,
//         chartSubCommandsProvider,
//         configSubCommandsProvider,
//         dataframeSubCommandsProvider,
//         dateSubCommandsProvider,
//         dropSubCommandsProvider,
//         eachSubCommandsProvider,
//         formatSubCommandsProvider,
//         fromSubCommandsProvider,
//         groupBySubCommandsProvider,
//         hashSubCommandsProvider,
//         intoSubCommandsProvider,
//         keepSubCommandsProvider,
//         mathSubCommandsProvider,
//         pathSubCommandsProvider,
//         pathvarSubCommandsProvider,
//         randomSubCommandsProvider,
//         rollSubCommandsProvider,
//         rotateSubCommandsProvider,
//         seqSubCommandsProvider,
//         skipSubCommandsProvider,
//         splitSubCommandsProvider,
//         strSubCommandsProvider,
//         toSubCommandsProvider,
//         urlSubCommandsProvider
//     );
// }
