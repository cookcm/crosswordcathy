#!/bin/bash
#set -x

initFile(){
  FILE="crosswordsData.txt"
  echo "import React from 'react';" | tee $FILE
  echo "import ReactDOM from 'react-dom';" | tee -a $FILE
  echo "import Crossword from 'crosswords/crossword';" | tee -a $FILE
  echo "" | tee -a $FILE
  echo "ReactDOM.render(<Crossword data={" | tee -a $FILE
  echo " {" | tee -a $FILE
  echo "  id: 'cathy/1'," | tee -a $FILE
  echo "  number: 1," | tee -a $FILE
  echo "  name: 'Cathy Crossword 1'," | tee -a $FILE
  echo "  date: 1542326400000 ," | tee -a $FILE
  echo " entries: [ "| tee -a $FILE
}

endFile(){
 echo " entries: ], " | tee -a $FILE
 echo " solutionAvailable: true," | tee -a $FILE
 echo " dateSolutionAvailable: 1542326400000," | tee -a $FILE
 echo " dimensions: {" | tee -a $FILE
 echo "   cols: 20," | tee -a $FILE
 echo "   rows: 20," | tee -a $FILE
 echo " }," | tee -a $FILE
 echo "crosswordType: 'cathy'," | tee -a $FILE
 echo "}" | tee -a $FILE
 echo "}" | tee -a $FILE
 echo ">, document.getElementById('root'));" | tee -a $FILE
}

initSession(){
  lineNumber=1 # row or column
  maxSize=2 #maxRows or maxColumns
  definitionCount=1 # count of definitions Across or countDown
  
}
printArrays(){
  echo ""
  echo "*******"
  for i in "${!positionArray[@]}"; do 
    echo " position word $i = ${positionArray[$i]}"
    echo " size of black cases $i = ${sizeBlackCasesArray[$i]}"
  done

  for i in "${!lengthArray[@]}"; do
    next=$((i + 1))
    echo " length of  word $next = ${lengthArray[$i]}"
  done

  echo ""
  echo "*******"
}

generateData() {
  type=$1
  number=$2 #definitionCount
  count=$3 # lineNumber

  lineIndex=$((count -1))

  if [ $type = 'across' ];then
    lineSuffix='a'
  else
    lineSuffix='d'
  fi

  for i in "${!lengthArray[@]}"; do
    next=$((i + 1))
    positionIndex=$i

    
    echo "{" | tee -a $FILE
    echo "  id:'$count-0$next-$lineSuffix'," |tee -a $FILE
    echo "  number: $number, " | tee -a $FILE
    echo "  humanNumber: '$number', " |tee -a $FILE
    echo "  clue: ''," |tee -a $FILE
    echo "  direction: '$type' ," |tee -a $FILE
    echo "  length: '${lengthArray[$i]}," | tee -a $FILE
    echo "  group: ['$count-0$next-$lineSuffix'], " |tee -a $FILE
    if [ $type = 'across' ];then 
      echo "  position: { x: ${positionArray[$positionIndex]}, y:$lineIndex }," | tee -a $FILE
    else
      echo "  position: { x: $lineIndex, y: ${positionArray[$positionIndex]} }," | tee -a $FILE
    fi
    echo "  separatorLocations: {}," |tee -a $FILE
    echo "  solution: ''," |tee -a $FILE
    echo "}," |tee -a $FILE

    positionIndex=$((i + 1))
  done
}

promptInfo(){
  if [ ${#positionArray[@]} -eq 0 ] && [ ${#sizeBlackCasesArray[@]} -eq 0 ]; then
    #echo "promptInfo"
    lineWordCount=0
    if [ $type = 'across' ];then
      line='row'
    else
      line='column'
    fi
    read -p "$line $lineNumber , how many words ?" totalLineWord
    until [ $lineWordCount -gt $totalLineWord ]
      do 
        if [ $lineWordCount -eq $totalLineWord ];then
          sizeBlackCases=0
          position=20
        elif [ $lineWordCount -eq 0 ];then
          sizeBlackCases=0
          position=0
        else 
          read -p "position  word $lineWordCount : " position
          read -p "size of black case: " sizeBlackCases
        fi 
        sizeBlackCasesArray+=("$sizeBlackCases")
        positionArray+=("$position")

      ((lineWordCount=lineWordCount+1))
    done
  else
    echo "no prompt, arrays exist"
  fi
}

findWordLengths(){
  for i in "${!positionArray[@]}"; do
      totalLineWord = 
      if [ $i -lt $totalLineWord ];then
        next=$((i + 1))
    #    echo "next=$next"
        var1=${positionArray[$next]}
    #    echo "var1=$var1"
        var2=${positionArray[$i]}
    #    echo "var2=$var2"
        var3=${sizeBlackCasesArray[$next]}
    #    echo "var3=$var3"
        length=$((var1 - var2 - var3))

    #    echo "length $i = $length"
        lengthArray+=("$length")
      fi
  done
}

init(){
  position="junk"
  #positionArray=()
  positionArray=(0 15 20 
                 0 15 20)
  TotalPositionArray= ( ${positionArray[@]:1:3}  ${AnApositionArrayrray[@]:4:3} ) 
  #sizeBlackCasesArray=()
  sizeBlackCasesArray=(0 1 0)
  TotalSizeBlackCasesArray= ( ${sizeBlackCasesArray[@]:1:3}  ${sizeBlackCasesArray[@]:4:3} ) 
  lengthArray=()
  count=0
  size=0
}

getData(){
  type=$1
  until [ $lineNumber -gt $maxSize ]; do
    
    init
    promptInfo $type
    findWordLengths
    printArrays
    generateData $type $definitionCount $lineNumber
    definitionCount=$((definitionCount+1))
    lineNumber=$((lineNumber + 1))
  done
}

initFile
initSession
getData 'across'
initSession
getData 'down'
endFile