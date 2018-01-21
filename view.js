var lookUp = {0: "opened.png",
				1: "1.png",
				2: "2.png",
				3: "3.png",
				4: "4.png",
				5: "5.png",
				6: "6.png",
				7: "7.png",
				8: "8.png",
				9: "Flag.png",
				10: "unClicked.png",
				11: "Q.png",
				12: "Mine.jpg"};

function startGame(){
	var difficulty = document.getElementById("select").value;
	var mineDisplay = document.getElementById("mineNum");
	setDifficulty(difficulty);
	mineDisplay.innerHTML = mineTotal;
	init(gridX, gridY);
}

function init(x, y){
	numFlags = 0;
	var flagDisplay = document.getElementById("flagNum");
	flagDisplay.innerHTML = numFlags;
	var checked = document.getElementById("cbox").checked;
	if(checked){
		parseJsonFile();
		x = gridX;
		y = gridY;
	}else{
		createGrid(x, y);
	}
	drawGrid(x, y);
}

function drawGrid(x, y){
	var div = document.getElementById("gridDiv");
	var html = "";
	var image;
	html += "<table id='grid'>";
	for(var i = 0; i < x; i++){
		html += "<tr>";
		for(var j = 0; j < y; j++){
			image = lookUp[grid[i][j].number];
			html += '<td><img src="' + image + '"width="20px" height="20px" alt="squares"></td>';
		}
		html += "</tr>";
	}
	html += "</table>";
	div.innerHTML = html;
	addOnClick();
}

function addOnClick(){
	var cells = document.getElementsByTagName("td");

	for(var i = 0; i < cells.length; i++){
		cells[i].onmousedown = unCover;
	}
}

function unCover(event){
	var flagDisplay = document.getElementById("flagNum");
	var mineDisplay = document.getElementById("mineNum");
	var image;
	var imgNum = 0;
	var col = this.cellIndex
	var row = this.parentNode.rowIndex;

	var cell = grid[row][col];
	document.getElementById('clickSound').play();

	if(cell.hasFlag && event.button == 2){
		imgNum = 10;
		image = lookUp[imgNum];
		cell.number = imgNum;
		this.innerHTML = '<img src="' + image + '"width="20px" height="20px" alt="squares">';
		cell.hasFlag = false;
		numFlags--;
		cell.clickAble = true;
	}else if(cell.clickAble){
		if(event.button == 2){
			imgNum = 9;
			cell.number = imgNum;
			cell.hasFlag = true;
			numFlags++;
		}else if(cell.hasMine){
			imgNum = 12;
			cell.number = imgNum;
			gameOver();
			document.getElementById('audio').play();
		}else{
			imgNum = calcNum(row, col);
			cell.number = imgNum;
			if(imgNum == 0){
				drawGrid(gridX, gridY);
			}
		}
		image = lookUp[imgNum];
		this.innerHTML = '<img src="' + image + '"width="20px" height="20px" alt="squares">';
		cell.clickAble = false;
	}
	flagDisplay.innerHTML = numFlags;
	mineDisplay.innerHTML = mineTotal - numFlags;

	checkForW();
}

function clearOut(row, col){
	var left = col - 1;
	var right = col + 1;
	var up = row - 1 ;
	var down = row + 1;
	if(up >= 0){
		if(grid[up][col].number == 10){
			grid[up][col].number = calcNum(up, col);
		}
		if( left >= 0){
			if(grid[up][left].number == 10){
				grid[up][left].number = calcNum(up, left);
			}
		}
		if(right < gridY){
			if (grid[up][right].number == 10) {
				grid[up][right].number = calcNum(up, right);
			}
		}
	}

	if(left >= 0){
		if (grid[row][left].number == 10) {
			grid[row][left].number = calcNum(row, left);
		}
	}

	if(right < gridY){
		if (grid[row][right].number == 10) {
			grid[row][right].number = calcNum(row, right);
		}
	}

	if(down < gridX){
		if (grid[down][col].number == 10) {
			grid[down][col].number = calcNum(down, col);
		}
		if(right < gridY){
			if (grid[down][right].number == 10) {
				grid[down][right].number = calcNum(down, right);
			}
		}

		if(left >= 0){
			if (grid[down][left].number == 10) {
				grid[down][left].number = calcNum(down, left);
			}
		}
	}

}

function parseJsonFile() {
    var request = new XMLHttpRequest();
    request.open("GET", "sampleData.json", false);
    request.send(null);

		var responseJson = JSON.parse(request.responseText);
		setDifficulty(responseJson.difficulty);
		numFlags = responseJson.flags;
		var count = 0;
		for(var i = 0; i < gridX; i++){
			grid[i] = [];
			for(var j = 0; j < gridY; j++){
				grid[i][j] = responseJson.sampleGrid[count];
				count++;
			}
		}
}
