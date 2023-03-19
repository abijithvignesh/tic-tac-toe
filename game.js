//global variables

let player1 = true,
  player2 = false,
  gameOver = false,
  moves = 0,
  winner = "",
  score = {
    ties: 0,
    player1: 0,
    player2: 0,
  };

// Grid constructor
//=================
function Grid() {
  this.cells = new Array(9);
}

// Get free cells in an array.
// Returns an array of indices in the original Grid.cells array, not the values
// of the array elements.
// Their values can be accessed as Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
  var i = 0,
    resultArray = [];
  for (i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }
  // console.log("resultArray: " + resultArray.toString());
  // debugger;
  return resultArray;
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.
Grid.prototype.getRowValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowValues!");
    return undefined;
  }
  var i = index * 3;
  return this.cells.slice(i, i + 3);
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns an array with the indices, not their values.
Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowIndices!");
    return undefined;
  }
  var row = [];
  index = index * 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
};

// get a column (values)
Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnValues!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }
  return column;
};

// get a column (indices)
Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnIndices!");
    return undefined;
  }
  var i,
    column = [];
  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }
  return column;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagValues = function (arg) {
  var cells = [];
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagValues!");
    return undefined;
  } else if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }
  return cells;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagIndices!");
    return undefined;
  } else if (arg === 0) {
    return [0, 4, 8];
  } else {
    return [2, 4, 6];
  }
};

Grid.prototype.reset = function () {
  for (var i = 0; i < this.cells.length; i++) {
    this.cells[i] = 0;
  }
  return true;
};

function init() {
  myGrid = new Grid();
  for (var i = 0; i <= myGrid.cells.length - 1; i++) {
    myGrid.cells[i] = 0;
  }
  console.log("mygrid", myGrid);
}

function cellClicked(id) {
  var idName = id.toString();
  var cell = parseInt(idName[idName.length - 1]);
  if (myGrid.cells[cell] > 0 || gameOver) {
    // cell is already occupied or something else is wrong
    return false;
  }
  if (player1) {
    document.getElementById(id).innerHTML = "x";
    myGrid.cells[cell] = 1;
  }
  if (player2) {
    document.getElementById(id).innerHTML = "o";
    myGrid.cells[cell] = 2;
  }

  document.getElementById(id).style.cursor = "default";
  player1 = !player1;
  player2 = !player2;
  console.log("grid", myGrid.cells);
  moves += 1;
  if (moves >= 5) {
    winner = checkWinner();
    if (winner === "Player 1") {
      announceWinner("Congratulations, Player 1 won!");
    }
    if (winner === "Player 2") {
      announceWinner("Congratulations, Player 2 won!");
    }
    if (winner === "Draw") {
      announceWinner("It is a Draw!");
    }
  }
  console.log("moves", moves);
}

function checkWinner() {
  // rows
  for (var i = 0; i <= 2; i++) {
    var row = myGrid.getRowValues(i);
    if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
      if (row[0] == 1) {
        winner = "Player 1";
        score.player1++;
      } else {
        winner = "Player 2";
        score.player2++;
      }
      // Give the winning row/column/diagonal a different bg-color
      var tmpAr = myGrid.getRowIndices(i);
      console.log("tmpAr", tmpAr);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("winning-color");
      }
      gameOver = true;
      return winner;
    }
  }

  // columns
  for (i = 0; i <= 2; i++) {
    var col = myGrid.getColumnValues(i);
    if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
      if (col[0] == 1) {
        winner = "Player 1";
        score.player1++;
      } else {
        winner = "Player 2";
        score.player2++;
      }
      // Give the winning row/column/diagonal a different bg-color
      var tmpAr = myGrid.getColumnIndices(i);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("winning-color");
      }
      gameOver = true;
      return winner;
    }
  }

  // diagonals
  for (i = 0; i <= 1; i++) {
    var diagonal = myGrid.getDiagValues(i);
    if (
      diagonal[0] > 0 &&
      diagonal[0] == diagonal[1] &&
      diagonal[0] == diagonal[2]
    ) {
      if (diagonal[0] == 1) {
        winner = "Player 1";
        score.player1++;
      } else {
        winner = "Player 2";
        score.player2++;
      }
      // Give the winning row/column/diagonal a different bg-color
      var tmpAr = myGrid.getDiagIndices(i);
      for (var j = 0; j < tmpAr.length; j++) {
        var str = "cell" + tmpAr[j];
        document.getElementById(str).classList.add("winning-color");
      }
      gameOver = true;
      return winner;
    }
  }

  // If we haven't returned a winner by now, if the board is full, it's a tie
  var myArr = myGrid.getFreeCellIndices();
  if (myArr.length === 0) {
    winner = "Draw";
    score.ties++;
    gameOver = true;
    return winner;
  }
}

function announceWinner(text) {
  document.getElementById("winText").innerHTML = text;
  document.getElementById("winAnnounce").style.display = "block";
  document.getElementById("player1_score").innerHTML = score.player1;
  document.getElementById("tie_score").innerHTML = score.ties;
  document.getElementById("player2_score").innerHTML = score.player2;
  setTimeout(closeModal, 1400, "winAnnounce");
  setTimeout(restart, 800);
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function restart() {
  myGrid.reset();
  for (var i = 0; i <= 8; i++) {
    var id = "cell" + i.toString();
    document.getElementById(id).innerHTML = "";
    document.getElementById(id).style.cursor = "pointer";
    document.getElementById(id).classList.remove("winning-color");
  }
  player1 = true;
  player2 = false;
  gameOver = false;
  moves = 0;
  winner = "";
}
