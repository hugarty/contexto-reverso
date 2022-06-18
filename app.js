const fs = require('fs');
const Reverso = require('reverso-api');
const reverso = new Reverso();
const INPUT_FILE_NAME = 'input';

function createNewEmptyFile(fileName){
  fs.writeFileSync(fileName, "");
}

function readDataFromInputFileAsArray () {
  const inputData = fs.readFileSync(INPUT_FILE_NAME, 'utf8');
  let arrayWords = inputData.split("\n");
  return arrayWords.map(e => e.trim()).filter(e => e.length !== 0);
}

const outputFileName = `output_${new Date().toISOString()}.md`;
createNewEmptyFile(outputFileName);
const wordsArray = readDataFromInputFileAsArray();

function appendResponseOutputFile(textToSave) {
  fs.appendFileSync(outputFileName, textToSave, function(err) {
    if (!err) {
      console.log("Error Occurred");
      throw err;
    }
  });
}

const responseHandler = (response) => {
  const textBody = response.examples
    .map(element => {
      const sentenceBoldedWord = element.from.replace(response.text, `**${response.text}**`);
      return `${sentenceBoldedWord}\n*${element.to}*`;
    })
    .join('\n\n');

  let textToSave = `\n\n---\n# ${response.text}\n\n${textBody}`;
  appendResponseOutputFile(textToSave);
  console.log(`Terminou: ${response.text}`);
};

for (const word of wordsArray){
  reverso.getContext(word, 'English', 'Portuguese', responseHandler)
    .catch((err) => {throw err});
}



