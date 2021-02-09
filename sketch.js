//CS30 Final Project
// Amy Lu
// January 26, 2021
//
// Extra for Experts:
// - Selecting a number would highlight all occurances of that number
// - The lines of text in the rules wil start a new line if the next word does not fit
// - The rules will not overlap with each other even if the screen is narrow
//
// Background music is made by syncopika
//
// Plans for Final Project:
// - Solves sudoku (recursion)
// - Button size and placement remains consistent with screen size (right now all the values are "magic numbers")
// - More than one difficulty

let rows, cols, cellWidth, cellHeight;
let addNum = false;
let highlightNum = false;
let selectNum = "";
let x, y;
let click, complete, error, buttonSound; //sounds
let answer, playerGrid, original; //grids
let mistakes = 0;
let sidePadding, topPadding, gridSize;
let sideEdge, vertEdge, bottomEdge;
let cellX, cellY;
let gamePlay = false;
let backgroundMusic;
let numArray = [];
let isComplete = false;

function preload(){
  click = loadSound("assets/click1.wav");
  complete = loadSound("assets/complete.mp3");
  error = loadSound("assets/error.wav");
  buttonSound = loadSound("assets/button.flac");
  backgroundMusic = loadSound("assets/music.ogg"); 
  original = loadJSON("assets/sudoku1-original.json");
  answer = loadJSON("assets/sudoku1-answer.json"); 
  playerGrid = loadJSON("assets/sudoku1-player.json");
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
}

function draw() {
  background(195, 217, 197);

  //game screen
  if (gamePlay === true){
    drawGrid();
    displayMistakes();
    displayRules();
    displayClearButton();
    displayHomeButton();
    displayRevealButton();

    //check if complete and play sound once
    if (checkCompletion() && isComplete === false){ 
      complete.play();
      isComplete = true;
    }
  }

  //home screen
  else {
    displayTitle();
    displayPlayButton();
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
        textSize(30);
        textFont("DIDOT");
        textAlign(CENTER, CENTER);
        text(playerGrid[y][x], x*cellWidth + sidePadding + (cellWidth/2), y*cellHeight + topPadding + (cellHeight/2));
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

  //numbers bouncing on home screen
  else if (gamePlay === false && mouseX < windowWidth/2 - 175/2 || mouseX > windowWidth/2 + 175/2 || mouseY < windowHeight/2 + 75 || mouseY > windowHeight/2 + 125){
    let theNum = new Num(mouseX, mouseY);
    numArray.push(theNum);
    buttonSound.play();
  }
}

function keyPressed(){
  if (addNum === true){ 

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

    //deletes number
    if (keyCode === BACKSPACE){ 
      click.play();
      playerGrid[y][x] = 0;
      addNum = false;
    }

    //after you click off a square, it un-highlights those numbers
    highlightNum = false; 
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
        }
      }
      gamePlay = false;
      isComplete = false;
      mistakes = 0;
      buttonSound.play();
    }

    //reveal answer button
    if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 - 175/2 + 175 && mouseY > vertEdge + 10 && mouseY < vertEdge + 45){
      revealAnswer();
    }
  }

  else {
    //play button
    if (mouseX > windowWidth/2 - 175/2 && mouseX < windowWidth/2 + 175/2 &&
      mouseY > windowHeight/2 + 75 && mouseY < windowHeight/2 + 125){
      gamePlay = true;
      numArray = [];
      buttonSound.play();
    }
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

function displayMistakes(){
  let mistakesText = "Mistakes: " + mistakes;
  fill("black");
  textSize(30);
  textFont("DIDOT");
  textAlign(RIGHT, CENTER);
  text(mistakesText, sideEdge, topPadding - 20);
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


  let point3 = ["- Click ", "on ", "a ", "number ", "to ", "highlight ", "all ", "occurances ", "of ", "that ", "number ", "in ", "the ", "grid. "];
  let point3Spaced = textLengthCheck(point3);
  text(point3Spaced, 20, startLine3, textBox);
  let point3Lines = point3Spaced.match(/\n/g).length +1;
  let point3Height = point3Lines * letterSize;
  startLine4 = startLine3 + point3Height + spaceInBetween;

  let point4 = ["- Click ", "on ", "an ", "number ", "you ", "wish ", "to ", "erase ", "and ", "hit ", "BACKSPACE. "];
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
  text(boringScreen, windowWidth/2, windowHeight/2);
}

function displayPlayButton(){
  strokeWeight(2);
  fill(219, 218, 191);
  rect(windowWidth/2 - 175/2, windowHeight/2 + 75, 175, 50, 20);
  let playText = "PLAY";
  fill("black");
  textSize(35);
  textAlign(CENTER, CENTER);
  text(playText, windowWidth/2, windowHeight/2 + 100);
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
    //I will try to work out the logistics of this issue for my final project
    if (this.y < 0 || this.y + this.fontSize - 10> windowHeight) { 
      this.dy *= -1;
    }
  }
}
