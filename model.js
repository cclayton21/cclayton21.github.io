
var grid = [];

//global size and width determined by difficulty selected.
var gridX = 0;
var gridY = 0;
var mineTotal = 0;
var numFlags = 0;

//creates the objects for each tile, and randomly places mines.
function createGrid(x, y){
	for(var i = 0; i < x; i++){
		grid[i] = [];
		for(var j = 0; j < y; j++){
			grid[i][j] = {"number": 10, "hasMine": false, "hasFlag": false, "clickAble": true};
		}
	}
	placeMines(x, y);
}

function placeMines(x, y){
	var mineCount = mineTotal;
	var rand = 0;
	for(var i = 0; i < x; i++){
		for(var j = 0; j < y; j++){
			rand = Math.floor(Math.random() * 100);
			if(rand % 7 == 0){
				if(mineCount == 0){
					break;
				}
				else{
					grid[i][j].hasMine = true;
					mineCount--;
				}
			}
		}
	}
	//if not enough mines were placed, try doing it again.
	if(mineCount > 0){
		createGrid(x, y);
	}
}


function getContent(row, col){
	return grid[row][col];
}

function setDifficulty(val){
	if(val == "easy"){
		gridX = 9;
		gridY = 9;
		mineTotal = 10;
	}else if(val == "medium"){
		gridX = 16;
		gridY = 16;
		mineTotal = 40;
	}else if(val == "hard"){
		gridX = 16;
		gridY = 30;
		mineTotal = 99;
	}
}

function calcNum(row, col){
	var num = 0;
	var left = col - 1;
	var right = col + 1;
	var up = row - 1 ;
	var down = row + 1;

	if(up >= 0){
		if(grid[up][col].hasMine){
			num++;
		}
		if(left >= 0){
			if(grid[up][left].hasMine){
				num++;
			}
		}
		if(right < gridY){
			if(grid[up][right].hasMine){
				num++;
			}
		}
	}

	if(down < gridX){
		if(grid[down][col].hasMine){
			num++;
		}
		if(right < gridY){
			if(grid[down][right].hasMine){
				num++;
			}
		}
		if(left >= 0){
			if(grid[down][left].hasMine){
				num++;
			}
		}
	}

	if(left >= 0){
		if(grid[row][left].hasMine){
			num++;
		}
	}

	if(right < gridY){
		if(grid[row][right].hasMine){
			num++;
		}
	}
	if(num == 0){
		grid[row][col].number = 0;
		clearOut(row, col);
	}

	return num;
}

function checkForW(){
	if(numFlags >= mineTotal){
		var count = 0;
		for(var i = 0; i < gridX; i++){
			for(var j = 0; j < gridY; j++){
				if(grid[i][j].hasMine && grid[i][j].hasFlag){
					count++;
				}
			}
		}
		if(count == mineTotal){
			alert("Congrats, you won!");
		}
		else{
			alert("Not quite! Keep trying!!");
		}
	}
}

function gameOver(){
	for(var i = 0; i < gridX; i++){
		for(var j = 0; j < gridY; j++){
			grid[i][j].clickAble = false;
		}
	}
}
