/* eslint-disable no-plusplus */
const fs = require('fs');
const constants = require('./grids/Laclos-1758');


const fileName = 'examples/exampleCrossword-cathy.js';

function StartWriteToFile(strArr) {
  strArr.push('import React from \'react\';');
  strArr.push('import ReactDOM from \'react-dom\';');
  strArr.push('import Crossword from \'crosswords/crossword\';');
  strArr.push('');
  strArr.push('ReactDOM.render(<Crossword data={');
  strArr.push('    {');
  strArr.push('         id: \'cathy/1\',');
  strArr.push('         number: 1, ');
  strArr.push('         name: \'Cathy Crossword 1\',');
  strArr.push('         date: 1542326400000 ,');
  strArr.push('         entries: [ ');
}


function EndWriteToFile(strArr) {
  strArr.push('');
  strArr.push('         ], ');
  strArr.push('     solutionAvailable: true,');
  strArr.push('     dateSolutionAvailable: 1542326400000,');
  strArr.push('     dimensions: {');
  strArr.push('         cols: 20,');
  strArr.push('         rows: 20,');
  strArr.push('      },');
  strArr.push('      crosswordType: \'cathy\',');
  strArr.push('     }');
  strArr.push('}');
  strArr.push('/>, document.getElementById(\'root\'));');
}


function findWordLengths(lineNumber, lineIndex, positionArray, sizeBlackCasesArray, lengthArray) {
  const lengthSubArray = [];
  for (let index = 0; index < positionArray[lineIndex].length - 1; index++) {
    const next = index + 1;
    const length = positionArray[lineIndex][next] - positionArray[lineIndex][index] - sizeBlackCasesArray[lineIndex][next];
    lengthSubArray.push(length);
  }
  lengthArray.push(lengthSubArray);
}

function printArrays(type, lineNumber, lineIndex, positionArray, sizeBlackCasesArray, lengthArray) {
  console.log('************');

  console.log(`for Line ${lineNumber} ${type}`);
  for (let index = 0; index < positionArray[lineIndex].length; index++) {
    console.log(`position word${index} = ${positionArray[lineIndex][index]}`);
    console.log(`size of black cases${index} = ${sizeBlackCasesArray[lineIndex][index]}`);
  }
  for (let index = 0; index < lengthArray[lineIndex].length; index++) {
    const next = index + 1;
    console.log(`length of  word${next} = ${lengthArray[lineIndex][index]}`);
  }
  console.log('************');
}

function generateData(type, definitionCount, lineNumber, lineIndex, positionArray, lengthArray, strArr) {
  let lineSuffix = 'a';

  if (type !== 'across') {
    lineSuffix = 'd';
  }


  for (let index = 0; index < lengthArray[lineIndex].length; index++) {
    const next = index + 1;
    const count = definitionCount + index + 1;
    // strArr.push('');
    strArr.push('           {');
    strArr.push(`             id:'${lineNumber}-0${next}-${lineSuffix}', `);
    strArr.push(`             number: ${count},`);
    strArr.push(`             humanNumber: '${count}',`);
    strArr.push(`             clue: ' ${lengthArray[lineIndex][index]} lettres ' ,`);
    strArr.push(`             direction: '${type}',`);
    strArr.push(`             length: ${lengthArray[lineIndex][index]},`);
    strArr.push(`             group: ['${lineNumber}-0${next}-${lineSuffix}'],`);
    if (type === 'across') {
      strArr.push(`             position: { x:${positionArray[lineIndex][index]}, y:${lineIndex}}, `);
    } else {
      strArr.push(`             position: { x:${lineIndex}, y:${positionArray[lineIndex][index]}}, `);
    }
    strArr.push('             separatorLocations: {},');
    strArr.push('             solution: \'\' ');
    strArr.push('           }, ');
  }
}


function getData(type, lineNumber, maxSize, definitionCount, positionArray, sizeBlackCasesArray, lengthArray, strArr) {
  while (lineNumber <= maxSize) {
    const lineIndex = lineNumber - 1;
    findWordLengths(lineNumber, lineIndex, positionArray, sizeBlackCasesArray, lengthArray);
    lineNumber++;
  }
  let line = 1;
  while (line <= maxSize) {
    const lineIndex = line - 1;
    printArrays(type, line, lineIndex, positionArray, sizeBlackCasesArray, lengthArray);
    generateData(type, definitionCount, line, lineIndex, positionArray, lengthArray, strArr);
    definitionCount += lengthArray[lineIndex].length;
    line++;
  }
}

function main() {
  const lineNumber = 1; // row or column
  const maxSize = 20; // maxRows or maxColumns
  const definitionCount = 0; // count of definitions Across or countDown
  const strArr = [];
  const stream = fs.createWriteStream(fileName);
  let positionArray = constants.positionArrayAcross;
  let sizeBlackCasesArray = constants.sizeBlackCasesArrayAcross;
  const lengthArrayAcross = [];
  const lengthArrayDown = [];
  StartWriteToFile(strArr);
  getData('across', lineNumber, maxSize, definitionCount, positionArray, sizeBlackCasesArray, lengthArrayAcross, strArr);

  positionArray = constants.positionArrayDown;
  sizeBlackCasesArray = constants.sizeBlackCasesArrayDown;
  if (positionArray.length > 0 && sizeBlackCasesArray.length > 0) {
    getData('down', lineNumber, maxSize, definitionCount, positionArray, sizeBlackCasesArray, lengthArrayDown, strArr);
  }

  EndWriteToFile(strArr);
  stream.once('open', () => {
    strArr.forEach((str) => {
      stream.write(`${str}\n`);
    });
    stream.end();
  });
}

main();
