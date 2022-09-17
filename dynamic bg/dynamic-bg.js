// Initiate variables
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var columnCount = 0;
var rowCount = 0;
var variance = 0;
var iteration = 0;
const multiplier = 10;
var showValues = false;
var autoPlay = false;
var valuesMatrix = [[]];
var neighborsSizeX = 1;
var neighborsSizeY = 1;
// add more styles 'stripe', 'color', , 'frame', , 'brick'
var styles = ['rectangle', 'circle'];
var colorArr1 = ["white", "black", "#ffc700", "#ff4040", "#40a3ff", "orange", "purple", "pink", "grey", "red"];
var styleIndex = 0;

// Repeating function
var intervalId = window.setInterval(function () {
    let gridContainerElement = document.querySelector('.grid-container');
    if (autoPlay && !isOutOfViewport(gridContainerElement)) {
            randomize(); 
        }
    }, 3000);

window.onresize = () => {resizeCanvasToDisplaySize(c); reset()};

let testMatrix = [
    [0, 1, 0, 3, 5],
    [1, 1, 0, 3, 4],
    [0, 0, 2, 3, 0],
    [0, 1, 0, 3, 5],
]

// Refer to shape-style.css
var shapeList = [
    '<div class ="shape">0</div>',
    '<div class ="shape">1</div>',
    '<div class ="shape">2</div>',
    '<div class ="shape">3</div>',
    '<div class ="shape">4</div>',
    '<div class ="shape">5</div>',
    '<div class ="shape">6</div>',
    '<div class ="shape">7</div>',
    '<div class ="shape">8</div>',
    '<div class ="shape">9</div>'
    ]

// Make sure the canvas is 1:1
function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    
    return false;
}

resizeCanvasToDisplaySize(c);


// Draw circle on canvas
function drawFullCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}



function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function varianceArrToColors(arr) {
    
}




// Reset the variables to default
function reset() {
    columnCount = 11; //51
    rowCount = 11; //81
    variance = 4;
    iteration = 0;
    neighborsSizeX = 1;
    neighborsSizeY = 1;
    
    refreshGrid()
}

// Change the graphic representation of the matrix
function changeStyle() {
    pausePlay();
    if (styleIndex === styles.length-1 ) {
        styleIndex = 0
    }
    
    else {
        styleIndex += 1
    }
    
    matrixToGrid (valuesMatrix);
}


// Generates a random integer between 0 and max
function getRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

function generateDirections (m, n) {
    let directions = [];
    let rowCount = m*2+1;
    let columnCount = n*2+1;

    for (let i = 0; i < rowCount; i++) {
        let matrixRow = [];
        for (let j = 0; j < columnCount; j++) {
            newI = i - m;
            newJ = j - n;
            
            directions.push([newI, newJ]);
        }
    }
    return directions;

}

// Generates a matrix with random color values assigned to each point.
function generateRandomMatrix (rowCount, columnCount, maxValue) {
    // Initiate variables
    let matrix = []

    // Generate a matrix and fill it with random numbers between 0 and maxValue.
    for (let i = 0; i < rowCount; i++) {
        let matrixRow = [];
        for (let j = 0; j < columnCount; j++) {
            matrixRow[j] = getRandomInt(0, maxValue);
        }
        matrix[i] = matrixRow;
    }
    return matrix;
}


 
 // Get the values for the neighboring cells for a given cell in a matrix
 function getNeighbors(i, j, matrix, directions) {
     let rowCount = matrix.length;
     let columnCount = matrix[0].length;
     // Note that in a matrix [1,0] translates into 1 down, and 0 right. 
     let neighbors = [];
     
     for (d = 0; d < directions.length; d++) {
             
        // Wrapping around the matrix in case of edge members
        let tempI = directions[d][0] + i;
        let tempJ = directions[d][1] + j;
        if (tempI >= 0 && tempJ >= 0 && tempI < rowCount && tempJ < columnCount) {
            neighbors.push( matrix[tempI][tempJ])
        }
         	         
     }

     // Return results
     return neighbors;
 }
 
// Return the most common item in a list
function mostCommon(list) {
    let map = {};
    let mostCommonElement = list[0];
    
    for(var i = 0; i<list.length; i++){
        if(!map[list[i]]){
            map[list[i]]=1;
        }else{
            ++map[list[i]];
            if(map[list[i]]>map[mostCommonElement]){
                mostCommonElement = list[i];
            }
        }
    }

    // Return results
    return mostCommonElement;
}
 
// Create the next generation based on an initial matrix of values
function nextGeneration (matrix, neighborsSizeX, neighborsSizeY){
    let rowCount = matrix.length;
    let columnCount = matrix[0].length;
    let newMatrix = [...matrix];
    let mostCommonElement = 0;
    let neighbors = [];
    let directions = generateDirections(neighborsSizeY, neighborsSizeX)

    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < columnCount; j++) {
            neighbors = getNeighbors (i, j, matrix, directions);
            mostCommonElement = mostCommon (neighbors);
            newMatrix[i][j] = mostCommonElement;  
        }
    }
    return newMatrix;
}
 
// Convert a matrix to a list
function matrixToList (matrix) {
    let rowCount = matrix.length;
    let columnCount = matrix[0].length;
    let list = [];
    let itemIndex = 0;
    for (i = 0; i < rowCount; i++) {
        for (j = 0; j < columnCount; j++) {
            itemIndex = j + i*columnCount;
            list[itemIndex] = matrix[i][j];
        }
        }
    return list;
}
 // Draw a grid based on the input matrix of colors 
function matrixToGrid(matrix) {
    
    let rowCount = matrix.length;
    let columnCount = matrix[0].length;
    let gridCount = columnCount*rowCount;
    let canvasWidth = c.width;
    let canvasHeight = c.height;
    let pixelWidth = canvasWidth/columnCount;
    let pixelHeight = canvasHeight/rowCount;
    let marginTop = 2.5;
    let marginLeft = 2.5;
    let valueList = matrixToList (matrix);
    let style = styles[styleIndex];
    let color = '';
    console.log(style);
    console.log(canvasWidth, canvasHeight);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw new shapes
    for (let j = 0; j < rowCount; j++) {
        for (let i = 0; i < columnCount; i++) {
            
            switch(style) {
                case 'rectangle':
                    color = colorArr1[valueList[i + rowCount*j]];    
                    drawRect(marginLeft + i * pixelWidth, marginTop + j * pixelHeight, pixelWidth-5, pixelHeight-5, color);
                    break;
                case 'circle':
                    color = colorArr1[valueList[i + rowCount*j]];      
                    let radius = Math.min(pixelHeight, pixelWidth)/2;
                    drawFullCircle(radius + i * pixelWidth, radius + j * pixelHeight, radius, color);
                    break;
                case 'stripe':
                    break;
            }
                                    
        } 

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        var x = 0;
        var y = 0;
        var width = 40;
        var height = 40;
        var count = 5;
        var offset = width/count;
        ctx.strokeStyle = "#black";
        ctx.lineWidth=2;
        ctx.beginPath();

        for (let i = 0; i < count; i++) {
            
            ctx.moveTo(x+i*offset+1,y);
            ctx.lineTo(x+i*offset+1,y+height);

        }
        
        ctx.stroke();
    }
    

}

// Draw a grid based on the input matrix of colors 
function matrixToGrid_obsolete(matrix) {
    let rowCount = matrix.length;
    let columnCount = matrix[0].length;
    let gridCount = columnCount*rowCount;
    let gridHTML = "";
    let gridCSSColumns = "";
    let gridCSSRows = "";
    let value = 0;
    let valueList = matrixToList (matrix);
    
    // Generate the HTML code
    for (let i = 0; i < gridCount; i++) {
        value = valueList[i] ;
        gridHTML += `<div id = pixel-${i} class = "grid-item ${styles[styleIndex]}-${value}"> ${shapeList[value]} </div>`;
    }
        
    // Generate the CSS code | Column style
    for (let i = 0; i < columnCount; i++) {
        gridCSSColumns += "auto ";
    }

    // Generate the CSS code | Row style
    for (let i = 0; i < rowCount; i++) {
        gridCSSRows += "auto ";
    }
        
    // Insert the HTML and CSS codes
    document.getElementById("my-grid").innerHTML = gridHTML;
    document.getElementById("my-grid").style.gridTemplateColumns = gridCSSColumns;
    document.getElementById("my-grid").style.gridTemplateRows = gridCSSRows;

}
 
 // FUNCTIONS TO USE AS BUTTON ON THE PAGE 
 
 function addColumn() {
    pausePlay(); 
    columnCount += multiplier;
     refreshGrid() 
 }
 
 function removeColumn() {
    pausePlay(); 
    if (columnCount > 1) {
         columnCount -= multiplier;
         refreshGrid() 
     }
 }
     
 function addRow() {
    pausePlay(); 
    rowCount += multiplier;
     refreshGrid() 
 }
 
 function removeRow() {
    pausePlay();
    if (rowCount > 1) {
        rowCount -= multiplier;
        refreshGrid() 
    }
 }
 
function addVariance() {
    pausePlay();
    if (variance <9) {
        variance += 1;
        refreshGrid()
    }
}
 
function removeVariance() {
    pausePlay();
    if (variance > 1) {
        variance -= 1;
        refreshGrid()
    }
}

function increaseNeighborX() {
    pausePlay();
    if (neighborsSizeX < 10) {
        neighborsSizeX += 1;
    }
}

function decreaseNeighborX() {
    pausePlay();
    if (neighborsSizeX > 0) {
        neighborsSizeX -= 1;
    }
}

function increaseNeighborY() {
    pausePlay();
    if (neighborsSizeY < 10) {
        neighborsSizeY += 1;
    }
}

function decreaseNeighborY() {
    pausePlay();
    if (neighborsSizeY > 0) {
        neighborsSizeY -= 1;
    }
}


function nextIteration() {
    pausePlay();
    iteration += 1;
    valuesMatrix = nextGeneration (valuesMatrix, neighborsSizeX, neighborsSizeY);
    matrixToGrid (valuesMatrix);
}

function toggleValues() {
    
    let elements = document.getElementsByClassName('shape');
    
    if (showValues) {
        for (let i=0; i <elements.length; i++) {
            elements[i].classList.remove("visible-text");
            showValues = false;
        }
    }
    
    else {
        for (let i=0; i <elements.length; i++) {
            elements[i].classList.add("visible-text");
            showValues = true;
        }
    }
    
}

function pausePlay() {
    if (autoPlay) {
        document.getElementById('play-button').innerHTML = 'Play <span class="tooltiptext">Randomize the dynamic background every 3 seconds</span>';
        autoPlay = false;
    }
}

function resumePlay() {
    if (!autoPlay) {
        document.getElementById('play-button').innerHTML = 'Pause <span class="tooltiptext">Stop the dynamic background auto-randomization</span>';
        autoPlay = true;
    }
}

function togglePlay() {
    autoPlay ? pausePlay(): resumePlay();
}


async function randomize(mutate = true) {
    
    columnCount = getRandomInt(20, 200);
    rowCount = getRandomInt(20, 200);
    variance = getRandomInt(1, 9);
    iteration = 0;
    neighborsSizeX = getRandomInt(0, 4);
    neighborsSizeY = getRandomInt(0, 4);
    styleIndex = getRandomInt(0, styles.length-1);
    // console.log('before generateRandomMatrix');
    valuesMatrix = await generateRandomMatrix (rowCount, columnCount, variance);

    if (getRandomInt(0,1) && mutate) {
        valuesMatrix = nextGeneration (valuesMatrix, neighborsSizeX, neighborsSizeY);
    }   

    // console.log('before matrixToGrid');
    matrixToGrid (valuesMatrix);
    // console.log('End');
}

// Check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        // rect.top >= 0 &&  Enable for fully visible element
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Check if an element is completely out of the viewport
function isOutOfViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.bottom < 0 
    );
}

// Generate a new matrix and reload
function refreshGrid() {
    valuesMatrix = generateRandomMatrix (rowCount, columnCount, variance);
    matrixToGrid (valuesMatrix);
}

reset(); 
 