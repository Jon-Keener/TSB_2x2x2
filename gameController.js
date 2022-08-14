/* globals */
// "use strict";

let curBoard;
let curPlayer;

let curHeldPiece;
let curHeldPieceStartingPosition;

const starterPosition = [ // 6 levels of 5 rows of 11 columns, [Z,Y,X]: [0,0,0] - [5,4,10]
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 0
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 1
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 2
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 3
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 4
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
], // level 5
];

// Initialize the letter tiles, the player racks and scores.
var tiles = ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'd', 'd', 'd', 'd', 'e', 'e',
             'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'f', 'f', 'g', 'g', 'g', 'h', 'h', 'i', 'i', 'i', 'i', 
             'i', 'i', 'i', 'i', 'i', 'j', 'k', 'l', 'l', 'l', 'l', 'm', 'm', 'n', 'n', 'n', 'n', 'n', 'n', 'o', 
             'o', 'o', 'o', 'o', 'o', 'o', 'o', 'p', 'p', 'q', 'r', 'r', 'r', 'r', 'r', 'r', 's', 's', 's', 's', 
             't', 't', 't', 't', 't', 't', 'u', 'u', 'u', 'u', 'v', 'v', 'w', 'w', 'x', 'y', 'y', 'z', ' ', ' '];
var p1rack = ['.', '.', '.', '.', '.', '.'];
var p2rack = ['.', '.', '.', '.', '.', '.'];
var p1score = 0;
var p2score = 0;

/* game functions */

function startGame() {
    // Draw letter tiles for the player racks by alternating.
    for (let i = 0; i < p1rack.length; i++) {
        let j = Math.floor(Math.random() * tiles.length); // Random draw of the remaining tiles.
        p1rack[i] = tiles[j]; // Assign to the p1rack.
        p1rack[i].piece = getPieceImageSource(p1rack[i]);
        tiles.splice(j, 1); // Delete from tiles.
        j = Math.floor(Math.random() * tiles.length); // Random draw of the remaining tiles.
        p2rack[i] = tiles[j]; // Assign to the p2rack.
        p2rack[i].piece = getPieceImageSource(p2rack[i]);
        tiles.splice(j, 1); // Delete from tiles.
        // await sleep(500); // sleep half a second after each tile draw
    }
// console.log( 'p1rack:', p1rack.sort() ); A side-effect is that this sorts the racks.
// console.log( 'p2rack:', p2rack.sort() );
// console.log( 'tiles:', tiles.sort() );
    
    const starterPlayer = 'white';
    
    // Add p1rack to starterPosition, unless undefined.
    if (typeof p1rack[0] !== 'undefined') { starterPosition[0][0][0] = p1rack[0] } else { starterPosition[0][0][0] = '.' };
    if (typeof p1rack[1] !== 'undefined') { starterPosition[0][0][1] = p1rack[1] } else { starterPosition[0][0][1] = '.' };
    if (typeof p1rack[4] !== 'undefined') { starterPosition[0][0][2] = p1rack[2] } else { starterPosition[0][0][2] = '.' };
    if (typeof p1rack[5] !== 'undefined') { starterPosition[0][0][3] = p1rack[3] } else { starterPosition[0][0][3] = '.' };
    if (typeof p1rack[2] !== 'undefined') { starterPosition[0][1][0] = p1rack[4] } else { starterPosition[0][1][0] = '.' };
    if (typeof p1rack[3] !== 'undefined') { starterPosition[0][1][1] = p1rack[5] } else { starterPosition[0][1][1] = '.' };
    
    // Add p2rack to starterPosition, unless undefined.
    if (typeof p2rack[5] !== 'undefined') { starterPosition[0][3][10] = p2rack[0] } else { starterPosition[0][3][10] = '.' };
    if (typeof p2rack[4] !== 'undefined') { starterPosition[0][4][9] = p2rack[1] } else { starterPosition[0][4][9] = '.' };
    if (typeof p2rack[1] !== 'undefined') { starterPosition[0][3][8] = p2rack[2] } else { starterPosition[0][3][8] = '.' };
    if (typeof p2rack[0] !== 'undefined') { starterPosition[0][4][7] = p2rack[3] } else { starterPosition[0][4][7] = '.' };
    if (typeof p2rack[3] !== 'undefined') { starterPosition[0][2][10] = p2rack[4] } else { starterPosition[0][2][10] = '.' };
    if (typeof p2rack[2] !== 'undefined') { starterPosition[0][3][9] = p2rack[5] } else { starterPosition[0][3][9] = '.' };
    
    loadPosition(starterPosition, starterPlayer);
    
} // startGame()

function loadPosition(position, playerToMove) {
    curBoard = position;
    curPlayer = playerToMove;
    
    // level h, row i and column j
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                if (position[h][i][j] != '.') {
                    if ( ( inRack1([h,i,j]) ) || ( inRack2([h,i,j]) ) ) {
                        loadRack(position[h][i][j], [h + 1, i + 1, j + 1]);
                    } else {
                        loadPiece(position[h][i][j], [h + 1, i + 1, j + 1]);
                    }
                }
            }
        }
    }
} // loadPosition(position, playerToMove)

function loadRack(piece, position) {
    // piece and position, an array of ZYX ids, which concat to the Id
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = true;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);

console.log( '' );
console.log( 'loadRack(piece, position):' );
console.log( 'InRack1:', inRack1(position), 'InRack2:', inRack2(position), 'piece:', piece, 'position:', position );
// console.log( 'pieceElement:', pieceElement );

} // loadRack(piece, position)

function loadPiece(piece, position) { // position = array of ZYX ids, which concat to the Id
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);

console.log( '' );
console.log( 'loadPiece(piece, position):' );
console.log( 'piece:', piece, 'position:', position, 'pieceElement:', pieceElement );

} // loadPiece(piece, position)

/* test functions */

function inRack1(position) { // returns true if the position is within the p1rack
    let x = position[2];
    let y = position[1];
    let z = position[0];

    if ( (z===0 && y===0 && x===0) || (z===0 && y===0 && x===1) || (z===0 && y===0 && x===2) || (z===0 && y===0 && x===3) || (z===0 && y===1 && x===0) || (z===0 && y===1 && x===1) ) { // p1rack
        return true;
    } else {
        return false;
    }
} // inRack1(position)

// console.log( 'inRack1([0,0,0]):', inRack1([0,0,0]) );
// console.log( 'inRack1([0,0,1]):', inRack1([0,0,1]) );
// console.log( 'inRack1([0,0,2]):', inRack1([0,0,2]) );
// console.log( 'inRack1([0,0,3]):', inRack1([0,0,3]) );
// console.log( 'inRack1([0,1,0]):', inRack1([0,1,0]) );
// console.log( 'inRack1([0,1,1]):', inRack1([0,1,1]) );

function inRack2(position) { // true if the position's coordinates are within the p2rack
    let x = position[2];
    let y = position[1];
    let z = position[0];

    if ( (z===0 && y===3 && x===10) || (z===0 && y===4 && x===9) || (z===0 && y===3 && x===8) || (z===0 && y===4 && x===7) || (z===0 && y===2 && x===10) || (z===0 && y===3 && x===9) ) { // p2rack
        return true;
    } else {
        return false;
    }
} // inRack2(position)

// console.log( 'inRack2([0,3,10]):', inRack2([0,3,10]) );
// console.log( 'inRack2([0,4,9]):', inRack2([0,4,9]) );
// console.log( 'inRack2([0,3,8]):', inRack2([0,3,8]) );
// console.log( 'inRack2([0,4,7]):', inRack2([0,4,7]) );
// console.log( 'inRack2([0,2,10]):', inRack2([0,2,10]) );
// console.log( 'inRack2([0,3,9]):', inRack2([0,3,9]) );

function onBoard(position) { // returns false if the position is off the board
    let x = position[2];
    let y = position[1];
    let z = position[0];
    
    if ( (y===1 && x===4) || (y===1 && x===5) || (y===1 && x===6) || (y===2 && x===4) || (y===2 && x===5) || (y===2 && x===6) || (y===3 && x===5) ) { // board
        return true;
    } else {
        return false;
    }
} // onBoard(position)

// console.log( 'onBoard([0,0,0]):', onBoard([0,0,0] ) );
// console.log( 'onBoard([0,0,1]):', onBoard([0,0,1] ) );
// console.log( 'onBoard([0,0,2]):', onBoard([0,0,2] ) );
// console.log( 'onBoard([0,0,3]):', onBoard([0,0,3] ) );
// console.log( 'onBoard([0,0,4]):', onBoard([0,0,4] ) );
// console.log( 'onBoard([0,0,5]):', onBoard([0,0,5] ) );
// console.log( 'onBoard([0,0,6]):', onBoard([0,0,6] ) );
// console.log( 'onBoard([0,0,7]):', onBoard([0,0,7] ) );
// console.log( 'onBoard([0,0,8]):', onBoard([0,0,8] ) );
// console.log( 'onBoard([0,0,9]):', onBoard([0,0,9] ) );
// console.log( 'onBoard([0,0,10]):', onBoard([0,0,10] ) );
// console.log( 'onBoard([0,1,0]):', onBoard([0,1,0] ) );
// console.log( 'onBoard([0,1,1]):', onBoard([0,1,1] ) );
// console.log( 'onBoard([0,1,2]):', onBoard([0,1,2] ) );
// console.log( 'onBoard([0,1,3]):', onBoard([0,1,3] ) );
// console.log( 'onBoard([0,1,4]):', onBoard([0,1,4] ) );
// console.log( 'onBoard([0,1,5]):', onBoard([0,1,5] ) );
// console.log( 'onBoard([0,1,6]):', onBoard([0,1,6] ) );
// console.log( 'onBoard([0,1,7]):', onBoard([0,1,7] ) );
// console.log( 'onBoard([0,1,8]):', onBoard([0,1,8] ) );
// console.log( 'onBoard([0,1,9]):', onBoard([0,1,9] ) );
// console.log( 'onBoard([0,1,10]):', onBoard([0,1,10] ) );
// console.log( 'onBoard([0,2,0]):', onBoard([0,2,0] ) );
// console.log( 'onBoard([0,2,1]):', onBoard([0,2,1] ) );
// console.log( 'onBoard([0,2,2]):', onBoard([0,2,2] ) );
// console.log( 'onBoard([0,2,3]):', onBoard([0,2,3] ) );
// console.log( 'onBoard([0,2,4]):', onBoard([0,2,4] ) );
// console.log( 'onBoard([0,2,5]):', onBoard([0,2,5] ) );
// console.log( 'onBoard([0,2,6]):', onBoard([0,2,6] ) );
// console.log( 'onBoard([0,2,7]):', onBoard([0,2,7] ) );
// console.log( 'onBoard([0,2,8]):', onBoard([0,2,8] ) );
// console.log( 'onBoard([0,2,9]):', onBoard([0,2,9] ) );
// console.log( 'onBoard([0,2,10]):', onBoard([0,2,10] ) );
// console.log( 'onBoard([0,3,0]):', onBoard([0,3,0] ) );
// console.log( 'onBoard([0,3,1]):', onBoard([0,3,1] ) );
// console.log( 'onBoard([0,3,2]):', onBoard([0,3,2] ) );
// console.log( 'onBoard([0,3,3]):', onBoard([0,3,3] ) );
// console.log( 'onBoard([0,3,4]):', onBoard([0,3,4] ) );
// console.log( 'onBoard([0,3,5]):', onBoard([0,3,5] ) );
// console.log( 'onBoard([0,3,6]):', onBoard([0,3,6] ) );
// console.log( 'onBoard([0,3,7]):', onBoard([0,3,7] ) );
// console.log( 'onBoard([0,3,8]):', onBoard([0,3,8] ) );
// console.log( 'onBoard([0,3,9]):', onBoard([0,3,9] ) );
// console.log( 'onBoard([0,3,10]):', onBoard([0,3,10] ) );
// console.log( 'onBoard([0,4,0]):', onBoard([0,4,0] ) );
// console.log( 'onBoard([0,4,1]):', onBoard([0,4,1] ) );
// console.log( 'onBoard([0,4,2]):', onBoard([0,4,2] ) );
// console.log( 'onBoard([0,4,3]):', onBoard([0,4,3] ) );
// console.log( 'onBoard([0,4,4]):', onBoard([0,4,4] ) );
// console.log( 'onBoard([0,4,5]):', onBoard([0,4,5] ) );
// console.log( 'onBoard([0,4,6]):', onBoard([0,4,6] ) );
// console.log( 'onBoard([0,4,7]):', onBoard([0,4,7] ) );
// console.log( 'onBoard([0,4,8]):', onBoard([0,4,8] ) );
// console.log( 'onBoard([0,4,9]):', onBoard([0,4,9] ) );
// console.log( 'onBoard([0,4,10]):', onBoard([0,4,10]) );

function openStack(position) { // returns true if the top position is empty
    let x = position[2];
    let y = position[1];
    let z = position[0];
    
console.log( 'x:', x );
console.log( 'y:', y );
console.log( 'z:', z );
console.log( 'position:', position );

    if ( starterBoard[[5],[y],[x]] === '.' ) { // empty
    // if ( curBoard[5][position[1]][position[2]].includes(".") ) { // empty

    // if ( position[z][y][x] === '.' ) { // empty
        return true;
    } else {
        return false;
    }
} // openStack(position)

// console.log( 'openStack([0,4,8]):', openStack([0,4,8]) );
// console.log( 'openStack([0,4,9]):', openStack([0,4,9]) );
// console.log( 'openStack([0,4,10]):', openStack([0,4,10]) );

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

function getPieceImageSource(piece) {
    switch (piece) {
        case '.': return '';
        case 'null': return '';
        case 'a': return 'assets/A.png';
        case 'b': return 'assets/B.png';
        case 'c': return 'assets/C.png';
        case 'd': return 'assets/D.png';
        case 'e': return 'assets/E.png';
        case 'f': return 'assets/F.png';
        case 'g': return 'assets/G.png';
        case 'h': return 'assets/H.png';
        case 'i': return 'assets/I.png';
        case 'j': return 'assets/J.png';
        case 'k': return 'assets/K.png';
        case 'l': return 'assets/L.png';
        case 'm': return 'assets/M.png';
        case 'n': return 'assets/N.png';
        case 'o': return 'assets/O.png';
        case 'p': return 'assets/P.png';
        case 'q': return 'assets/Q.png';
        case 'r': return 'assets/R.png';
        case 's': return 'assets/S.png';
        case 't': return 'assets/T.png';
        case 'u': return 'assets/U.png';
        case 'v': return 'assets/V.png';
        case 'w': return 'assets/W.png';
        case 'x': return 'assets/X.png';
        case 'y': return 'assets/Y.png';
        case 'z': return 'assets/Z.png';
        case ' ': return 'assets/BLANK.png';
        case 'R': return 'assets/pink-rose.png';
    }
} // getPieceImageSource(piece)

/* movement functions */

function setPieceHoldEvents() {
    let mouseX, mouseY = 0;
    
    document.addEventListener('mousemove', function(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    let pieces = document.getElementsByClassName('piece');
    let movePieceInterval;
    let hasIntervalStarted = false;
    
    for (const piece of pieces) {
        piece.addEventListener('mousedown', function(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;
        
            if (hasIntervalStarted === false) {
                piece.style.position = 'absolute';
    
                curHeldPiece = piece;
                const curHeldPieceStringPosition = piece.parentElement.id.split('');
    
                if (isNaN(parseInt(curHeldPieceStringPosition[3],10))) { // If the 4th digit is NaN then don't use it.
                    curHeldPieceStartingPosition = [ parseInt(curHeldPieceStringPosition[0],10)-1,
			                             parseInt(curHeldPieceStringPosition[1],10)-1,
			                             parseInt(curHeldPieceStringPosition[2],10)-1 ];
                } else {
                    curHeldPieceStartingPosition = [ parseInt(curHeldPieceStringPosition[0],10)-1,
                                                     parseInt(curHeldPieceStringPosition[1],10)-1, 
                                                     Number("" + parseInt(curHeldPieceStringPosition[2],10) + parseInt(curHeldPieceStringPosition[3],10))-1 ]; // Concat the 3rd and 4th digits.
                }

// console.warn( 'curHeldPieceStringPosition:', curHeldPieceStringPosition );
// console.warn( '[parseInt(curHeldPieceStringPosition[0],10):', parseInt(curHeldPieceStringPosition[0],10) );
// console.warn( '[parseInt(curHeldPieceStringPosition[1],10):', parseInt(curHeldPieceStringPosition[1],10) );
// console.warn( '[parseInt(curHeldPieceStringPosition[2],10):', parseInt(curHeldPieceStringPosition[2],10) );
// console.warn( '[parseInt(curHeldPieceStringPosition[3],10):', parseInt(curHeldPieceStringPosition[3],10) );
// console.warn( '[parseInt(curHeldPieceStringPosition[2],10)+parseInt(curHeldPieceStrringPosition[3],10):', Number(""+parseInt(curHeldPieceStringPosition[2],10)+parseInt(curHeldPieceStringPosition[3],10)) );
// console.warn( 'curHeldPieceStartingPosition:', curHeldPieceStartingPosition );
    
                movePieceInterval = setInterval(function() {
                    piece.style.top = mouseY - piece.offsetHeight / 2 + window.scrollY + 'px';
                    piece.style.left = mouseX - piece.offsetWidth / 2 + window.scrollX + 'px';
                }, 1);
        
                hasIntervalStarted = true;
            }
        });
    }
        
    document.addEventListener('mouseup', function(event) {
        window.clearInterval(movePieceInterval);
    
        if (curHeldPiece != null) {
            const boardElement = document.querySelector('.board');
    
            if ((event.clientX > boardElement.offsetLeft - window.scrollX && event.clientX < boardElement.offsetLeft + boardElement.offsetWidth - window.scrollX) &&
                (event.clientY > boardElement.offsetTop - window.scrollY && event.clientY < boardElement.offsetTop + boardElement.offsetHeight - window.scrollY)) {
                    const mousePositionOnBoardX = event.clientX - boardElement.offsetLeft + window.scrollX;
                    const mousePositionOnBoardY = event.clientY - boardElement.offsetTop + window.scrollY;
    
                    const boardBorderSize = parseInt(getComputedStyle(document.querySelector('.board'), null)
                                                .getPropertyValue('border-left-width')
                                                .split('px')[0]);
    
                    const xPosition = Math.floor((mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth*1.0);
    
                    if ( xPosition % 2 === 0 ) { // An even indented column, subtract 0.5 before the floor.
                        // Made yPosition a variable.
                        var yPosition = Math.floor((mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77 - 0.5); // was 0.666, then 0.75
                    } else {
                        var yPosition = Math.floor((mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77); // was 0.666, then 0.75
		    }

		    var zPosition = 0;
                    const pieceReleasePosition = [zPosition, yPosition, xPosition];
    
                    if (!(pieceReleasePosition[0] === curHeldPieceStartingPosition[0] && pieceReleasePosition[1] === curHeldPieceStartingPosition[1] && pieceReleasePosition[2] === curHeldPieceStartingPosition[2])) {
                        if (curPlayer === 'white') {
                            if (validateWhiteMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
                        if (curPlayer === 'black') {
                            if (validateBlackMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
    
console.log( '' );
console.log( 'setPieceHoldEvents():' );
console.log( 'Even/odd column:', xPosition%2 );
console.log( 'X:', (mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth*1.0 );
console.log( 'Y:', (mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77 );
console.log( 'curPlayer:', curPlayer, 'yPosition:', yPosition, 'xPosition:', xPosition );
    
                    }
                }
            curHeldPiece.style.position = 'static';
            curHeldPiece = null;
            curHeldPieceStartingPosition = null;
        }
        hasIntervalStarted = false;
    });
} // setPieceHoldEvents()

function movePiece(piece, startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    
    // If the boardPiece is not empty AND the top rung is empty
    if ( (boardPiece !== '.') && ( curBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {

        // move the piece
        curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]] = '.'; // clear the startingPosition
    
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 0 ) { p1rack[0] = '.'; } // clear the tile from the p1rack
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 1 ) { p1rack[1] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 2 ) { p1rack[2] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 3 ) { p1rack[3] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 0 ) { p1rack[4] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 1 ) { p1rack[5] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 10 ) { p2rack[0] = '.'; } // clear the tile from the p2rack
        if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 9 ) { p2rack[1] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 8 ) { p2rack[2] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 7 ) { p2rack[3] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 2 && startingPosition[2] === 10 ) { p2rack[4] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 9 ) { p2rack[5] = '.'; }
    
        if (!( curBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	    // level 0 is not empty, check next level
            if (!( curBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	        // level 1 is not empty, check next level
                if (!( curBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	            // level 2 is not empty, check next level
                    if (!( curBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	                // level 3 is not empty, check next level
                        if (!( curBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	                    // level 4 is not empty, check next level
                            if (!( curBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
	                        // level 5 is not empty, no more levels, this needs to be prevented
    
console.error("No more levels");
    
	                    } else {
                                curBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 5
	                    }
	                } else {
                            curBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 4
	                }
	            } else {
                        curBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 3
	            }
	        } else {
                    curBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 2
	        }
	    } else {
                curBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 1
	    }
	} else {
            curBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 0
	}
    
        const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
        destinationSquare.textContent = '';
        destinationSquare.appendChild(piece);
    }
    
console.log( '' );
console.log( 'movePiece():' );
console.log( 'curPlayer:', curPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
	                                                         'to endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.log( 'p1rack:', p1rack, 'p1rack.dot_count:', p1rack.filter(x => x === '.').length );
console.log( 'p2rack:', p2rack, 'p2rack.dot_count:', p2rack.filter(x => x === '.').length );
    
    // artificially switch players after 3 white tile moves or 3 black tile moves
    if ( ( p1rack.filter(x => x === '.').length >= 3 ) || ( p2rack.filter(x => x === '.').length >= 3 ) ) {
        switchPlayer();
    }
    
} // movePiece(piece, startingPosition, endingPosition)

function switchPlayer() {
    // score, redraw and then switch players
    if (curPlayer == 'white') {
        p1score += 50;
        rePopRack1();
        curPlayer = 'black';
    } else {
        p2score += 50;
        rePopRack2();
        curPlayer = 'white';
    }
console.log( '' );
console.log( 'switchPlayer():' );
} // switchPlayer()

function rePopRack1() {
    // repopulate the p1rack
    let dotcnt = p1rack.filter(x => x === '.').length;
    for ( let i = 0; i < dotcnt; i++ ) {
        let j = Math.floor(Math.random() * tiles.length); // Random draw of the remaining tiles.
        let k = p1rack.indexOf('.');
        p1rack[k] = tiles[j]; // Assign to the p1rack.
        // Update p1rack[] and starterPosition[][][] based on the index of the empty.
        switch(k) { // p1rack order
            case 0: loadRack(p1rack[k], [1,1,1]); // returns [Z,Y,X] ids
                    starterPosition[0][0][0] = p1rack[0];
                    break;
            case 1: loadRack(p1rack[k], [1,1,2]);
                    starterPosition[0][0][1] = p1rack[1];
                    break;
            case 2: loadRack(p1rack[k], [1,1,3]);
                    starterPosition[0][0][2] = p1rack[2];
                    break;
            case 3: loadRack(p1rack[k], [1,1,4]);
                    starterPosition[0][0][3] = p1rack[3];
                    break;
            case 4: loadRack(p1rack[k], [1,2,1]);
                    starterPosition[0][1][0] = p1rack[4];
                    break;
            case 5: loadRack(p1rack[k], [1,2,2]);
                    starterPosition[0][1][1] = p1rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
console.log( '' );
console.log( 'rePopRack1():' );
console.log( 'curPlayer:', curPlayer, 'p1rack:', p1rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
        p1rack[i].piece = getPieceImageSource(p1rack[i]);
        // await sleep(500); // sleep half a second after each tile draw
    }
} // rePopRack1()

function rePopRack2() {
    // repopulate the p2rack
    let dotcnt = p2rack.filter(x => x === '.').length;
    for ( let i = 0; i < dotcnt; i++ ) {
        let j = Math.floor(Math.random() * tiles.length); // Random draw of the remaining tiles.
        let k = p2rack.indexOf('.');
        p2rack[k] = tiles[j]; // Assign to the p2rack.
        // Update p2rack[] and starterPosition[][][] based on the index of the empty.
        switch(k) { // p2rack order
            case 0: loadRack(p2rack[k], [1,4,11]); // [Z,Y,X] ids
                    starterPosition[0][3][10] = p2rack[0];
                    break;
            case 1: loadRack(p2rack[k], [1,5,10]);
                    starterPosition[0][4][9] = p2rack[1];
                    break;
            case 2: loadRack(p2rack[k], [1,4,9]);
                    starterPosition[0][3][8] = p2rack[2];
                    break;
            case 3: loadRack(p2rack[k], [1,5,8]);
                    starterPosition[0][4][7] = p2rack[3];
                    break;
            case 4: loadRack(p2rack[k], [1,3,11]);
                    starterPosition[0][2][10] = p2rack[4];
                    break;
            case 5: loadRack(p2rack[k], [1,4,10]);
                    starterPosition[0][3][9] = p2rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
console.log( '' );
console.log( 'rePopRack2():' );
console.log( 'curPlayer:', curPlayer, 'p2rack:', p2rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
        p2rack[i].piece = getPieceImageSource(p2rack[i]);
        // await sleep(500); // sleep half a second after each tile draw
    }
} // rePopRack2()

function validateWhiteMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    switch (boardPiece) {
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
        case ' ':
        case 'R':
                  // if ( inRack1(startingPosition) && onBoard(endingPosition) && openStack(endingPosition) ) {
                  if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                      // if the startingPosition is in p1rack and the endingPosition is on the board, and the endingPosition is open, return true 
console.log( 'validateWhiteMovement() success:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                 'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.log( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.log( 'onBoard(endingPosition):', onBoard(endingPosition) );
                      return true;
                  } else {
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                      return false;
                  }
    }
} // validateWhiteMovement(startingPosition, endingPosition)

function validateBlackMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    switch (boardPiece) {
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
        case 'f':
        case 'g':
        case 'h':
        case 'i':
        case 'j':
        case 'k':
        case 'l':
        case 'm':
        case 'n':
        case 'o':
        case 'p':
        case 'q':
        case 'r':
        case 's':
        case 't':
        case 'u':
        case 'v':
        case 'w':
        case 'x':
        case 'y':
        case 'z':
        case ' ':
        case 'R':
                  if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                      // if the startingPosition is in p2rack and the endingPosition is on the board, return true 
console.log( 'validateBlackMovement() success:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                 'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.log( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.log( 'onBoard(endingPosition):', onBoard(endingPosition) );
                      return true;
                  } else {
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                      return false;
                  }
    }
} // validateBlackMovement(startingPosition, endingPosition)

startGame();
setPieceHoldEvents();

