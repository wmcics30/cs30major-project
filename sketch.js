// CS30 Final Project
// Amy Lu
// February 28, 2021
//
// Extra for Experts:
// - Backtracking algorithm is able to solve sudokus
// - Multiple difficulty levels with three options per difficulty, never repeating the same level twice in a row
// - Allows you to keep track of possible numbers before commiting to one
//
// NOTE: Sudoku 1-3: EASY
//       Sudoku 4-6: MEDIUM
//       Sudoku 7-9: HARD
//
// Background music is made by syncopika

let rows, cols, cellWidth, cellHeight;
let addNum = false;
let highlightNum = false;
let selectNum = "";
let x, y;
let click, complete, error, buttonSound; //sounds
let answer, playerGrid, original; //grids
let pencil;
let mistakes = 0;
let sidePadding, topPadding, gridSize;
let sideEdge, vertEdge, bottomEdge;
let cellX, cellY;
let gamePlay = false;
let backgroundMusic;
let numArray = [];
let isComplete = false;
let easy = false;
let medium = false; 
let hard = false;
let options;
let choice = "";
let pencilMode = false;
let possibilities = [];

let sudoku1answer, sudoku1original, sudoku1player, 
  sudoku2answer, sudoku2original, sudoku2player, 
  sudoku3answer, sudoku3original, sudoku3player, 
  sudoku4answer, sudoku4original, sudoku4player, 
  sudoku5answer, sudoku5original, sudoku5player, 
  sudoku6answer, sudoku6original, sudoku6player, 
  sudoku7answer, sudoku7original, sudoku7player, 
  sudoku8answer, sudoku8original, sudoku8player, 
  sudoku9answer, sudoku9original, sudoku9player;

function preload(){
  click = loadSound("assets/click1.wav");
  complete = loadSound("assets/complete.mp3");
  error = loadSound("assets/error.wav");
  buttonSound = loadSound("assets/button.flac");
  backgroundMusic = loadSound("assets/music.ogg"); 
  pencil = loadImage("assets/pencil.png");

  sudoku1answer = loadJSON("assets/sudoku1-answer.json");
  sudoku1original = loadJSON("assets/sudoku1-original.json");
  sudoku1player = loadJSON("assets/sudoku1-player.json");

  sudoku2answer = loadJSON("assets/sudoku2-answer.json");
  sudoku2original = loadJSON("assets/sudoku2-original.json");
  sudoku2player = loadJSON("assets/sudoku2-player.json");

  sudoku3answer = loadJSON("assets/sudoku3-answer.json");
  sudoku3original = loadJSON("assets/sudoku3-original.json");
  sudoku3player = loadJSON("assets/sudoku3-player.json");

  sudoku4answer = loadJSON("assets/sudoku4-answer.json");
  sudoku4original = loadJSON("assets/sudoku4-original.json");
  sudoku4player = loadJSON("assets/sudoku4-player.json");

  sudoku5answer = loadJSON("assets/sudoku5-answer.json");
  sudoku5original = loadJSON("assets/sudoku5-original.json");
  sudoku5player = loadJSON("assets/sudoku5-player.json");

  sudoku6answer = loadJSON("assets/sudoku6-answer.json");
  sudoku6original = loadJSON("assets/sudoku6-original.json");
  sudoku6player = loadJSON("assets/sudoku6-player.json");

  sudoku7answer = loadJSON("assets/sudoku7-answer.json");
  sudoku7original = loadJSON("assets/sudoku7-original.json");
  sudoku7player = loadJSON("assets/sudoku7-player.json");

  sudoku8answer = loadJSON("assets/sudoku8-answer.json");
  sudoku8original = loadJSON("assets/sudoku8-original.json");
  sudoku8player = loadJSON("assets/sudoku8-player.json");

  sudoku9answer = loadJSON("assets/sudoku9-answer.json");
  sudoku9original = loadJSON("assets/sudoku9-original.json");
  sudoku9player = loadJSON("assets/sudoku9-player.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundMusic.loop();

  //center the grid
  gridSize = windowWidth*0.38;
  sidePadding = (windowWidth - gridSize)/2;
  topPadding = (windowHeight - gridSize)/2;

  //These commonly used variables make the rest of the code more concise
  sideEdge = sidePadding + gridSize;
  vertEdge = topPadding + gridSize;

  rows = 9; 
  cols = 9;
  cellWidth = gridSize/cols;
  cellHeight = gridSize/rows;

  //make 3D grid to store possibilities
  for (let i=0; i<9; i++){
    possibilities.push([]);
    for (let j=0; j<9; j++){
      possibilities[i].push([]);
    }
  }
}

function draw() {
  background(195, 217, 197);

  //game screen
  if (gamePlay === true){
    chooseLevel();
    drawGrid();
    displayMistakes();
    displayRules();
    displayClearButton();
    displayHomeButton();
    displayRevealButton();
    image(pencil, sidePadding, topPadding - 60, 55, 55);
    displayPencilText();
    if (isComplete){
      displayComplete();
      pencilMode = false;
    }

    //check if complete and play sound once
    if (checkCompletion() && isComplete === false){ 
      complete.play();
      isComplete = true;
    }
  }

  //home screen
  else {
    displayTitle();
    displayEasyButton();
    displayMediumButton();
    displayHardButton();
    numberBounce();
  }
}

function drawGrid(){
  for (let y=0; y<rows; y++){
    for (let x=0; x<cols; x++){
      strokeWeight(0.5);
      fill(242, 239, 216);

      //highlights square
      if (addNum && x === cellX && y === cellY || highlightNum && int(playerGrid[y][x]) === selectNum){
        fill(219, 218, 191);
      }
      rect(x*cellWidth + sidePadding, y*cellHeight + topPadding, cellWidth, cellHeight);

      //displays wrong numbers red and correct numbers black
      if (playerGrid[y][x] !== 0){
        if (int(playerGrid[y][x]) !== answer[y][x]){
          fill("red");
        }
        else{
          fill("black");
        }

        //places number in box
        textSize(35);
        textFont("DIDOT");
        textAlign(CENTER, CENTER);
        text(playerGrid[y][x], x*cellWidth + sidePadding + (cellWidth/2), y*cellHeight + topPadding + (cellHeight/2));
        possibilities[y][x] = [];
      }

      //place possibilities in empty square
      else{
        let subCellWidth = cellWidth/3;
        let subCellHeight = cellHeight/3;

        for (let i = 0; i < 3; i++){
          for (let j = 0; j < 3; j++){
            let num = 3 * i + j + 1;
            if (possibilities[y][x].includes(str(num))){
              fill("black");
              textSize(20);
              text(num, j*subCellWidth + subCellWidth/3 + sidePadding + x*cellWidth, 
                i*subCellHeight + subCellHeight/2 + topPadding + y*cellHeight);
            }
          }
        }
      }
    }
  }
  drawGridOutline();
}

function drawGridOutline(){
  //draw border 
  strokeWeight(2.5);
  line(sidePadding, topPadding, sideEdge, topPadding); //top
  line(sidePadding, topPadding + gridSize, sideEdge, vertEdge); //bottom
  line(sideEdge, topPadding, sideEdge, vertEdge); //right
  line(sidePadding, topPadding, sidePadding, vertEdge); //left

  //draw 3x3 outlines
  strokeWeight(2.5);
  line(sidePadding, topPadding + (gridSize * 1/3), sideEdge, topPadding + (gridSize * 1/3)); // horiz. top
  line(sidePadding, topPadding + (gridSize * 2/3), sideEdge, topPadding + (gridSize * 2/3)); //horiz. bottom
  line(sidePadding + (gridSize * 1/3), topPadding, sidePadding + (gridSize * 1/3), vertEdge); //vert. left
  line(sidePadding + (gridSize * 2/3), topPadding, sidePadding + (gridSize * 2/3), vertEdge); //vert. right
}

function mousePressed(){
  if (gamePlay === true){
    highlightNum = false;
    addNum = false;
    x = Math.floor((mouseX - sidePadding)/cellWidth);
    y = Math.floor((mouseY - topPadding)/cellHeight);

    if (x >= 0 && x <= 8 && y >= 0 && y <= 8){ //sanity check
      
      //if there is a number there, highlight all occurances
      if (int(playerGrid[y][x]) !== 0){ 
        highlightNum = true; 
    
        if (original[y][x] !== 0){
          selectNum = original[y][x];
        }
        else{
          selectNum = int(playerGrid[y][x]);
        }
      }
    
      //check if square selected is able to be changed
      if (original[y][x] === 0) { 
        addNum = true;
        cellX = x;
        cellY = y;
      }
    }
  }

  //numbers bouncing on home screen
  else if (gamePlay === false && mouseX < windowWidth/2 - 175/2 || mouseX > windowWidth/2 + 175/2 || mouseY < windowHeight/2 + 25 || mouseY > windowHeight/2 + 225){
    let theNum = new Num(mouseX, mouseY);
    numArray.push(theNum);
    buttonSound.play();
  }
}

function keyPressed(){
  if (addNum === true && pencilMode === false){ 

    //user can only enter numbers 1-9
    if (keyCode >= 49 && keyCode <= 57){ 
      playerGrid[y][x] = key;
      click.play();
      addNum = false;

      //checks to see if correct
      if (int(playerGrid[y][x]) !== answer[y][x]){ 
        mistakes++;
        error.play();
      }
    }

    //deletes number (except in pencil mode)
    if (keyCode === BACKSPACE){ 
      click.play();
      playerGrid[y][x] = 0;
      addNum = false;
    }

    //after you click off a square, it un-highlights those numbers
    highlightNum = false; 
  }

  else if (pencilMode){
    if (keyCode >= 49 && keyCode <= 57){
      //enter a new possibility
      if (!possibilities[y][x].includes(key)){
        possibilities[y][x].push(key); 
      }
      //remove a possibility
      else{
        let index = possibilities[y][x].indexOf(key);
        possibilities[y][x].splice(index, 1);
      }
    }
  }
}

//separate from mousePressed() to ensure that the buttons don't interfere with the gameplay
function mouseClicked(){
  if (gamePlay === true){
    //clear button
    if (mouseX > sidePadding && mouseX < sidePadding + 100 && 
      mouseY > vertEdge + 10 && mouseY < vertEdge + 10 + 35) {
      mistakes = 0;
      isComplete = false;
      for (let y = 0; y<rows; y++){
        for (let x = 0; x<cols; x++){
          playerGrid[y][x] = original[y][x];
          possibilities[y][x] = [];
        }
      }
      buttonSound.play();
    }
  
    //home button
    if (mouseX > sidePadding + gridSize - 100 && mouseX < sidePadding + gridSize && 
      mouseY > vertEdge + 10 && mouseY < vertEdge + 45) { 
      for (let y = 0; y<rows; y++){
        for (let x = 0; x<cols; x++){
          playerGrid[y][x] = original[y][x];
          possibilities[y][x] = [];
        }
      }
      gamePlay = false;
      isComplete = false;
      pencilMode = false;
      mistakes = 0;
      buttonSound.play();
    }

    //reveal answer button
    if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 - 175/2 + 175 && mouseY > vertEdge + 10 && mouseY < vertEdge + 45){
      revealAnswer();
      pencilMode = false;
    }

    //pencil button
    if (mouseX > sidePadding && mouseX < sidePadding + 55 && mouseY > topPadding - 60 && mouseY < topPadding - 5){
      pencilMode = !pencilMode;
      buttonSound.play();
    }
  }

  else {
    //easy button
    if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 + 175/2 &&
      mouseY > windowHeight/2 + 25 && mouseY < windowHeight/2 + 75){
      gamePlay = true;
      easy = true;
      numArray = [];
      buttonSound.play();
    }

    //medium button
    else if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 + 175/2 &&
      mouseY > windowHeight/2 + 100 && mouseY < windowHeight/2 + 150){
      gamePlay = true;
      medium = true;
      numArray = [];
      buttonSound.play();
    }

    //hard button
    else if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 + 175/2 &&
      mouseY > windowHeight/2 + 175 && mouseY < windowHeight/2 + 225){
      gamePlay = true;
      hard = true;
      numArray = [];
      buttonSound.play();
    }
  }
}

function chooseLevel(){
  if (easy || medium || hard){
    if (easy){
      options = [[sudoku1answer, sudoku1original, sudoku1player],
                [sudoku2answer, sudoku2original, sudoku2player],
                [sudoku3answer, sudoku3original, sudoku3player]];
  
    }
  
    else if (medium){
      options = [[sudoku4answer, sudoku4original, sudoku4player],
                [sudoku5answer, sudoku5original, sudoku5player],
                [sudoku6answer, sudoku6original, sudoku6player]];
  
    }
  
    else if (hard){
      options = [[sudoku7answer, sudoku7original, sudoku7player],
                [sudoku8answer, sudoku8original, sudoku8player],
                [sudoku9answer, sudoku9original, sudoku9player]];
  
    }

    easy = false;
    medium = false;
    hard = false;

    let pick = Math.floor(random(3));
    
    //prevents a level from appearing twice in a row
    while (pick === choice){
      pick = Math.floor(random(3));
    }
  
    choice = pick;
    answer = options[choice][0];
    original = options[choice][1]; 
    playerGrid = options[choice][2];
    //solves sudoku using backtracking
    solveGrid(0, 0, answer);
  }
}

function checkCompletion(){
  for (let y = 0; y<rows; y++){
    for (let x = 0; x<cols; x++){
      if (int(playerGrid[y][x]) !== answer[y][x]){
        return false;
      }
    }
  }
  return true;
}

function displayPencilText(){
  if (pencilMode){
    let pencilText = "Pencil Mode";
    fill("black");
    textSize(25);
    textFont("DIDOT");
    text(pencilText, sidePadding + 70, topPadding - 20);
  }
}

function displayMistakes(){
  let mistakesText = "Mistakes: " + mistakes;
  fill("black");
  textSize(25);
  textFont("DIDOT");
  textAlign(RIGHT, CENTER);
  text(mistakesText, sideEdge, topPadding - 20);
}

function displayComplete(){
  let completeText = "LEVEL COMPLETE";
  fill("black");
  textSize(25);
  textFont("DIDOT");
  textAlign(CENTER, CENTER);
  text(completeText, windowWidth/2, topPadding - 20);
}

function displayRules(){
  let letterSize = 20;
  let spaceInBetween = 30;
  let textBox = sidePadding - sidePadding*0.2;
  let startLine1 = 70, startLine2, startLine3, startLine4;

  let rulesTitle = "HOW TO PLAY:";
  fill("black");
  textSize(25);
  textFont("DIDOT");
  textAlign(LEFT);
  text(rulesTitle, 20, 30);

  let point1 = ["- Fill ", "in ", "the ", "numbers ", "1 ", "to ", "9 ", "exactly ", "once ", "in ", "every ", "row, ", "column, ", "and ", "3x3 ", "square ", "outlined ", "in ", "the ", "grid."];
  textSize(letterSize);
  let point1Spaced = textLengthCheck(point1);
  text(point1Spaced, 20, startLine1, textBox);
  let point1Lines = point1Spaced.match(/\n/g).length +1;
  let point1Height = point1Lines * letterSize + 70;
  startLine2 = point1Height + spaceInBetween;

  let point2 = ["- Click ", "on ", "an ", "empty ", "sqaure ", "and ", "use ", "your ", "keyboard ", "to ", "fill ", "in ", "the ", "number. "];
  let point2Spaced = textLengthCheck(point2);
  text(point2Spaced, 20, startLine2, textBox);
  let point2Lines = point2Spaced.match(/\n/g).length +1;
  let point2Height = point2Lines * letterSize;
  startLine3 = startLine2 + point2Height + spaceInBetween;


  let point3 = ["- Click ", "on ", "the ", "pencil ", "icon ", "to ", "toggle ", "PENCIL ", "MODE ", "which ", "will ", "allow ", "you ", "to ", "keep ", "track ", "of ", "possible ", "numbers. " ];
  let point3Spaced = textLengthCheck(point3);
  text(point3Spaced, 20, startLine3, textBox);
  let point3Lines = point3Spaced.match(/\n/g).length +1;
  let point3Height = point3Lines * letterSize;
  startLine4 = startLine3 + point3Height + spaceInBetween;

  let point4 = ["- Hit ", "BACKSPACE ", "to ", "erase ", "a ", "selected ", "number. ", "To ", "erase ", "one ", "of ", "the ", "possible", "numbers ", "while ", "in ", "PENCIL ", "MODE, ", "enter ", "that ", "number ", "again. "];
  let point4Spaced = textLengthCheck(point4);
  text(point4Spaced, 20, startLine4, textBox);
}

//Puts in 'enter' where necessary
function textLengthCheck(theText){
  let textStr = "";
  let totalLength = 0;
  for (let i = 0; i<theText.length; i++){
    totalLength += textWidth(theText[i]);
    if (totalLength > sidePadding - sidePadding*0.2){
      textStr = textStr.concat("\n");
      textStr = textStr.concat(theText[i]);
      totalLength = textWidth(theText[i]);
    }
    else {
      textStr = textStr.concat(theText[i]);
    }
  }
  return textStr;
}

function displayClearButton(){
  fill(219, 218, 191);
  rect(sidePadding, vertEdge + 10, 100, 35, 10);
  let clearText = "Clear";
  fill("black");
  textSize(25);
  text(clearText, sidePadding + 20, vertEdge + 27);
}

function displayHomeButton(){
  fill(219, 218, 191);
  rect(sidePadding + gridSize - 100, vertEdge + 10, 100, 35, 10);
  let homeText = "Home";
  fill("black");
  textSize(25);
  text(homeText, sidePadding + gridSize - 80, vertEdge + 27);
}

function displayRevealButton(){
  fill(219, 218, 191);
  rect(windowWidth/2 - 175/2, vertEdge + 10, 175, 35, 10);
  let revealText = "Reveal Answer";
  fill("black");
  textSize(25);
  text(revealText, windowWidth/2 - 155/2, vertEdge + 27);
}

function revealAnswer(){
  for (let y = 0; y<rows; y++){
    for (let x = 0; x<cols; x++){
      playerGrid[y][x] = answer[y][x];
    }
  }
}

function displayTitle(){
  let title = "SUDOKU";
  textAlign(CENTER, CENTER);
  textSize(75);
  textFont("DIDOT");
  fill("black");
  text(title, windowWidth/2, windowHeight/2 - 100);

  let boringScreen = "(this home screen is looking a little plain...)";
  textSize(20);
  text(boringScreen, windowWidth/2, windowHeight/2.2);
}

function displayEasyButton(){
  strokeWeight(2);
  fill(219, 218, 191);
  rect(windowWidth/2 - 175/2, windowHeight/2 + 25, 175, 50, 20);
  let easyText = "Easy";
  fill("black");
  textSize(35);
  textAlign(CENTER, CENTER);
  text(easyText, windowWidth/2, windowHeight/2 + 50);
}

function displayMediumButton(){
  strokeWeight(2);
  fill(219, 218, 191);
  rect(windowWidth/2 - 175/2, windowHeight/2 + 100, 175, 50, 20);
  let medText = "Medium";
  fill("black");
  textSize(35);
  textAlign(CENTER, CENTER);
  text(medText, windowWidth/2, windowHeight/2 + 125);
}

function displayHardButton(){
  strokeWeight(2);
  fill(219, 218, 191);
  rect(windowWidth/2 - 175/2, windowHeight/2 + 175, 175, 50, 20);
  let hardText = "Hard";
  fill("black");
  textSize(35);
  textAlign(CENTER, CENTER);
  text(hardText, windowWidth/2, windowHeight/2 + 200);
}

function numberBounce(){
  for (let i=0; i<numArray.length; i++) {     
    numArray[i].move();
    numArray[i].display();
  }
}

class Num {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-4, 4);
    this.dy = random(-4, 4);
    this.chosenNum = Math.round(random(1, 9));
    this.fontSize = random(35, 60);
    this.width = textWidth(this.chosenNum);
  }

  display() {
    textSize(this.fontSize);
    textAlign(LEFT, TOP);
    text(this.chosenNum, this.x, this.y);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    //bounce on walls
    if (this.x < 0 || this.x + this.width > windowWidth) {
      this.dx *= -1;
    }

    //without "-10" after this.fontSize, it will bounce before it hits the bottom edge
    if (this.y < 0 || this.y + this.fontSize - 10 >= windowHeight) { 
      this.dy *= -1;
    }
  }
}

//backtracking algorithm to solve empty sudoku
function solveGrid(row, col){

  if (col === 9 && row === 8){
    return true;
  }

  //move onto next row
  if (col === 9 && row < 8){
    row++;
    col = 0;
  }

  //solve
  if (answer[row][col] === 0){
    for (let num = 1; num<=9; num++){  
      if (checkNum(row, col, num) === true){
        answer[row][col] = num;

        //recursive call
        if (solveGrid(row, col + 1)){
          return true;
        }
      }
    }
    //backtrack
    answer[row][col] = 0;
  }

  //if cell is already filled, move on to next cell
  else {
    if (solveGrid(row, col + 1)){
      return true;
    }
  }
}

function checkNum(row, col, num){
  let rowRange;
  let colRange;

  //check row
  if (answer[row].includes(num)){
    return false;
  }

  //check column
  for (let i = 0; i<9; i++){
    if (num === answer[i][col]){
      return false;
    }
  }

  //check 3x3 square
  if (row <= 2){ //top row
    rowRange = 2;
  }
  else if (row <= 5){ //middle row
    rowRange = 5;
  }
  else if (row <= 8){ //bottom row
    rowRange = 8;
  }

  if (col <= 2){ //left column
    colRange = 2;
  }
  else if (col <= 5){ //middle column
    colRange = 5;
  }
  else if (col <= 8){ //right column
    colRange = 8;
  }

  for (let i = rowRange - 2; i <= rowRange; i++){
    for (let j = colRange - 2; j <= colRange; j++){
      if (num === answer[i][j]){
        return false;
      }
    }
  }
  //current num is a possibility 
  return true;
}