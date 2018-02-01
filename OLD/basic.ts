import * as https from 'https';
import * as fs from 'fs-extra';
import * as readline from 'readline';
import { app, remote, shell } from 'electron';
import * as storage from 'electron-json-storage';
import Word from './Entities/Word';
import * as pdfkit from 'pdfkit';
import { File, Filter } from './Utilities/File';
import { triggerId } from 'async_hooks';
export class Basic {

    getAllWords() {

        let words = new Promise<Array<Word>>((resolve, reject) => {
            storage.get('words', function (error, data) {
                if (error) throw error;
                resolve(data as Array<Word>);
            });
        });

        return words;
    }

    miniMize() {
        remote.BrowserWindow.getFocusedWindow().minimize();
    }

    async exportWords(target: string = 'memrise') {

        let fileName = await File.openFile('SaveWords', 'WordList', Filter.txt);
        if (fileName == false) {
            return false;
        }
        let words = await this.getAllWords();
        switch (target) {
            case "memrise":
                let folderName = fileName.split('.')[0] + "audio";
                let checkFolder = await fs.ensureDir(folderName);
                for (let index = 0; index < words.length; index++) {
                    const element = words[index];
                    if (element.hasContent == false || element.isPhrase) continue;
                    let line = `${element.word},${element.type},${element.define},[${element.translation}]${element.pronunciation},${element.example}`; element.word + ',' + element.define;
                    fs.appendFileSync(fileName, line + '\r\n');
                    await this.saveMp3File(element.soundUrl, folderName + "\\" + element.word + ".mp3");
                }
                return "Words have saved in " + fileName + "\n\t Audios have saved in " + folderName;
            case "momo":
                for (let index = 0; index < words.length; index++) {
                    const element = words[index];
                    if (element.hasContent == false || element.isPhrase) continue;
                    fs.appendFileSync(fileName, element.word + '\r\n');
                }
                return "Words have saved in " + fileName;
        }
    }
    saveMp3File(url: string, fileName: string) {
        return new Promise((resolve, reject) => {
            var file = fs.createWriteStream(fileName, { autoClose: true });
            var request = https.get(url, res => {
                res.pipe(file);
            });
            request.on("error", error => {
                console.log(error);
                reject(error);
            });
            request.on("finish", () => {
                resolve('ok');
            });
        });
    }

    openLink(url: string) {
        shell.openExternal(url);
    }

    async exportBlankTest() {
        let fileName = await File.openFile('BlankTest', 'Blank', Filter.pdf)
        if (fileName == false) {
            return false;
        }
        let pdf = new pdfkit();
        pdf.pipe(fs.createWriteStream(fileName));
        let words = await this.getAllWords();
        let wordsHasContent = words.filter((value, index, array) => {
            if (value.hasContent && value.example.length) {
                return value;
            }
        })
        //write the title
        pdf.fontSize(20).text('Blank Filling Questions', { align: 'center' });
        //write blank words
        pdf.fontSize(15).text('Words you can fill:', { underline: true });
        let wordsHasContentSort = wordsHasContent.map((value, index, array) => {
            return value.word
        }).sort();
        let wordsBlanks = wordsHasContentSort.join(',   ');
        pdf.fontSize(15).text(wordsBlanks).moveDown();
        //write the questions
        pdf.fontSize(15).text('Questions:', { underline: true });
        for (let index = 0; index < wordsHasContent.length; index++) {
            const element = wordsHasContent[index];
            let words = element.example.split(' ').filter((value, index, array) => {
                if (value.includes('[xxx]')) {
                    return value;
                }
            });
            let word = words.length == 1 ? words[0] : '[xxx]';
            let textContent = (index + 1) + '. ' + element.example.replace(word, '______');
            pdf.fontSize(15).text(textContent);
            //pdf.fontSize(8).text(element.define);
        }
        //draw the line
        pdf.fontSize(15).moveDown()
            .moveTo(0, pdf.y)
            .lineTo(pdf.page.width, pdf.y)
            .fillAndStroke().moveDown();
        //write the answers 
        pdf.fontSize(15).text('Answers:');
        let wordsWithAnswers = wordsHasContent.map((word, index, array) => {
            let words = word.example.split(' ').filter((value, index, array) => {
                if (value.includes('[xxx]')) {
                    return value;
                }
            })
            return (index + 1) + ':' +
                (words.length === 1 ?
                    words[0].replace('[xxx]', word.word) :
                    word.word);
        })
        let answers = wordsWithAnswers.join(',   ');
        pdf.fontSize(15).text(answers);
        pdf.end();

    }
    async exportMutiChoiceTest() {
        let fileName = await File.openFile('MutipleChoice', 'Choice', Filter.pdf)
        if (fileName == false) {
            return false;
        }
        let pdf = new pdfkit();
        pdf.pipe(fs.createWriteStream(fileName));
        let words = await this.getAllWords();
        let wordsHasContent = words.filter((value, index, array) => {
            if (value.hasContent && value.example.length) {
                return value;
            }
        })
        //write the title
        pdf.fontSize(20).text('Mutiple Choice Questions', { align: 'center' });
        //write the questions
        let answersNumToLetter = new Array('A', 'B', 'C', 'D');
        let answersArray = new Array<{ answer: number }>();
        for (let index = 0; index < wordsHasContent.length; index++) {
            let randomInt = Math.floor(Math.random() * 3.9);
            answersArray[index] = { answer: randomInt };
        }
        let answers = answersArray.map((value, index, array) => {
            return index + 1 + "," + answersNumToLetter[value.answer];
        }).join(';    ');
        pdf.fontSize(12).text('Questions:', { underline: true });
        for (let index = 0; index < wordsHasContent.length; index++) {
            const element = wordsHasContent[index];
            pdf.text((index + 1) + "." + element.word + ":", { stroke: true });
            let choices = new Array();
            choices.push(index);
            let randomInt = index;
            for (let i = 0; i < 4; i++) {
                if (i === answersArray[index].answer) {
                    pdf.fontSize(12).text(answersNumToLetter[i] + "." + element.define);
                } else {
                    while (choices.includes(randomInt)) {
                        randomInt = Math.floor(Math.random() * (wordsHasContent.length - 0.1));
                        if (choices.includes(randomInt) == false) {
                            choices.push(randomInt);
                            break;
                        }
                    }
                    pdf.fontSize(12).text(answersNumToLetter[i] + "." + wordsHasContent[randomInt].define);
                }
            }
        }
        //draw the line
        pdf.fontSize(15).moveDown()
            .moveTo(0, pdf.y)
            .lineTo(pdf.page.width, pdf.y)
            .fillAndStroke().moveDown();
        //write the answers 
        pdf.fontSize(12).text('Answers:');
        pdf.fontSize(12).text(answers);
        pdf.end();

    }
}