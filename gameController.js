/* globals */

let curBoard;
let curPlayer;

let curHeldPiece;
let curHeldPieceStartingPosition;

const starterPosition = [ // 11 columns of 5 rows: (0,0) - (4,10)
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
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

        let j = Math.floor(Math.random() * tiles.length);
        p1rack[i] = tiles[j]; // Assign to P1 rack.
        p1rack[i].piece = getPieceImageSource(p1rack[i]);
        tiles.splice(j, 1); // Delete from tiles.

        j = Math.floor(Math.random() * tiles.length);
        p2rack[i] = tiles[j]; // Assign to P2 rack.
        p2rack[i].piece = getPieceImageSource(p2rack[i]);
        tiles.splice(j, 1); // Delete from tiles.
    }

// console.log( 'p1rack:', p1rack.sort() ); A side-effect is that this sorts the racks.
// console.log( 'p2rack:', p2rack.sort() );
// console.log( 'tiles:', tiles.sort() );

    const starterPlayer = 'white';

    // Add P1 rack to starterPosition, unless undefined.
    if (typeof p1rack[0] !== 'undefined') { starterPosition[0][0] = p1rack[0] } else { starterPosition[0][0] = '.' };
    if (typeof p1rack[1] !== 'undefined') { starterPosition[0][1] = p1rack[1] } else { starterPosition[0][1] = '.' };
    if (typeof p1rack[4] !== 'undefined') { starterPosition[0][2] = p1rack[2] } else { starterPosition[0][2] = '.' };
    if (typeof p1rack[5] !== 'undefined') { starterPosition[0][3] = p1rack[3] } else { starterPosition[0][3] = '.' };
    if (typeof p1rack[2] !== 'undefined') { starterPosition[1][0] = p1rack[4] } else { starterPosition[1][0] = '.' };
    if (typeof p1rack[3] !== 'undefined') { starterPosition[1][1] = p1rack[5] } else { starterPosition[1][1] = '.' };

    // Add P2 rack to starterPosition, unless undefined.
    if (typeof p2rack[5] !== 'undefined') { starterPosition[3][10] = p2rack[0] } else { starterPosition[3][10] = '.' };
    if (typeof p2rack[4] !== 'undefined') { starterPosition[4][9] = p2rack[1] } else { starterPosition[4][9] = '.' };
    if (typeof p2rack[1] !== 'undefined') { starterPosition[3][8] = p2rack[2] } else { starterPosition[3][8] = '.' };
    if (typeof p2rack[0] !== 'undefined') { starterPosition[4][7] = p2rack[3] } else { starterPosition[4][7] = '.' };
    if (typeof p2rack[3] !== 'undefined') { starterPosition[2][10] = p2rack[4] } else { starterPosition[2][10] = '.' };
    if (typeof p2rack[2] !== 'undefined') { starterPosition[3][9] = p2rack[5] } else { starterPosition[3][9] = '.' };
    
    loadPosition(starterPosition, starterPlayer);

}

function loadPosition(position, playerToMove) {
    curBoard = position;
    curPlayer = playerToMove;

    // row i and column j
    for (let i = 0; i < 5 ; i++) { // 5 rows
        for (let j = 0; j < 11; j++) { // 11 columns
            if (position[i][j] != '.') {
    
                if ( inRack1( [i, j] ) ) {
                    loadRack(position[i][j], [i + 1, j + 1]);
                } else
                if ( inRack2( [i, j] ) ) {
                    loadRack(position[i][j], [i + 1, j + 1]);
                } else {
                    loadPiece(position[i][j], [i + 1, j + 1]);
                }
            }
        }
    }
}

function inRack1(position) { // returns true if the position is within the p1rack
    let x = position[1];
    let y = position[0];

    if ( (x==0 && y==0) || (x==1 && y==0) || (x==2 && y==0) || (x==3 && y==0) || (x==0 && y==1) || (x==1 && y==1) ) { // p1rack
        return true;
    } else {
        return false;
    }
}

// console.log( 'inRack1(0,0):', inRack1( [0, 0] ) );
// console.log( 'inRack1(0,1):', inRack1( [0, 1] ) );
// console.log( 'inRack1(0,2):', inRack1( [0, 2] ) );
// console.log( 'inRack1(0,3):', inRack1( [0, 3] ) );
// console.log( 'inRack1(1,0):', inRack1( [1, 0] ) );
// console.log( 'inRack1(1,1):', inRack1( [1, 1] ) );

function inRack2(position) { // true if the position's coordinates are ithin the p2rack
    let x = position[1];
    let y = position[0]; // change position into x/y coordinates

    if ( (x==10 && y==3) || (x==9 && y==4) || (x==8 && y==3) || (x==7 && y==4) || (x==10 && y==2) || (x==9 && y==3) ) { // p2rack
        return true;
    } else {
        return false;
    }
}

// console.log( 'inRack2(3,10):', inRack2( [3, 10] ) );
// console.log( 'inRack2(4,9):', inRack2( [4, 9] ) );
// console.log( 'inRack2(3,8):', inRack2( [3, 8] ) );
// console.log( 'inRack2(4,7):', inRack2( [4, 7] ) );
// console.log( 'inRack2(2,10):', inRack2( [2, 10] ) );
// console.log( 'inRack2(3,9):', inRack2( [3, 9] ) );

function onBoard(position) { // returns false if the position is off the board
    let x = position[1];
    let y = position[0];

    if ( (y==0 && x==0) || (y==0 && x==1) || (y==0 && x==2) || (y==0 && x==3) || 
         (y==1 && x==0) || (y==1 && x==1) || (y==1 && x==4) || (y==1 && x==5) || (y==1 && x==6) ||
         (y==2 && x==4) || (y==2 && x==5) || (y==2 && x==6) || (y==2 && x==10) || 
         (y==3 && x==5) || (y==3 && x==8) || (y==3 && x==9) || (y==3 && x==10) || 
         (y==4 && x==7) || (y==4 && x==9) ) {
        return true;
    } else {
        return false;
    }
}

// console.log( 'onBoard(0,0):', onBoard( [0, 0] ) );
// console.log( 'onBoard(0,1):', onBoard( [0, 1] ) );
// console.log( 'onBoard(0,2):', onBoard( [0, 2] ) );
// console.log( 'onBoard(0,3):', onBoard( [0, 3] ) );
// console.log( 'onBoard(0,4):', onBoard( [0, 4] ) );
// console.log( 'onBoard(0,5):', onBoard( [0, 5] ) );
// console.log( 'onBoard(0,6):', onBoard( [0, 6] ) );
// console.log( 'onBoard(0,7):', onBoard( [0, 7] ) );
// console.log( 'onBoard(0,8):', onBoard( [0, 8] ) );
// console.log( 'onBoard(0,9):', onBoard( [0, 9] ) );
// console.log( 'onBoard(0,10):', onBoard( [0, 10] ) );
// console.log( 'onBoard(1,0):', onBoard( [1, 0] ) );
// console.log( 'onBoard(1,1):', onBoard( [1, 1] ) );
// console.log( 'onBoard(1,2):', onBoard( [1, 2] ) );
// console.log( 'onBoard(1,3):', onBoard( [1, 3] ) );
// console.log( 'onBoard(1,4):', onBoard( [1, 4] ) );
// console.log( 'onBoard(1,5):', onBoard( [1, 5] ) );
// console.log( 'onBoard(1,6):', onBoard( [1, 6] ) );
// console.log( 'onBoard(1,7):', onBoard( [1, 7] ) );
// console.log( 'onBoard(1,8):', onBoard( [1, 8] ) );
// console.log( 'onBoard(1,9):', onBoard( [1, 9] ) );
// console.log( 'onBoard(1,10):', onBoard( [1, 10] ) );
// console.log( 'onBoard(2,0):', onBoard( [2, 0] ) );
// console.log( 'onBoard(2,1):', onBoard( [2, 1] ) );
// console.log( 'onBoard(2,2):', onBoard( [2, 2] ) );
// console.log( 'onBoard(2,3):', onBoard( [2, 3] ) );
// console.log( 'onBoard(2,4):', onBoard( [2, 4] ) );
// console.log( 'onBoard(2,5):', onBoard( [2, 5] ) );
// console.log( 'onBoard(2,6):', onBoard( [2, 6] ) );
// console.log( 'onBoard(2,7):', onBoard( [2, 7] ) );
// console.log( 'onBoard(2,8):', onBoard( [2, 8] ) );
// console.log( 'onBoard(2,9):', onBoard( [2, 9] ) );
// console.log( 'onBoard(2,10):', onBoard( [2, 10] ) );
// console.log( 'onBoard(3,0):', onBoard( [3, 0] ) );
// console.log( 'onBoard(3,1):', onBoard( [3, 1] ) );
// console.log( 'onBoard(3,2):', onBoard( [3, 2] ) );
// console.log( 'onBoard(3,3):', onBoard( [3, 3] ) );
// console.log( 'onBoard(3,4):', onBoard( [3, 4] ) );
// console.log( 'onBoard(3,5):', onBoard( [3, 5] ) );
// console.log( 'onBoard(3,6):', onBoard( [3, 6] ) );
// console.log( 'onBoard(3,7):', onBoard( [3, 7] ) );
// console.log( 'onBoard(3,8):', onBoard( [3, 8] ) );
// console.log( 'onBoard(3,9):', onBoard( [3, 9] ) );
// console.log( 'onBoard(3,10):', onBoard( [3, 10] ) );
// console.log( 'onBoard(4,0):', onBoard( [4, 0] ) );
// console.log( 'onBoard(4,1):', onBoard( [4, 1] ) );
// console.log( 'onBoard(4,2):', onBoard( [4, 2] ) );
// console.log( 'onBoard(4,3):', onBoard( [4, 3] ) );
// console.log( 'onBoard(4,4):', onBoard( [4, 4] ) );
// console.log( 'onBoard(4,5):', onBoard( [4, 5] ) );
// console.log( 'onBoard(4,6):', onBoard( [4, 6] ) );
// console.log( 'onBoard(4,7):', onBoard( [4, 7] ) );
// console.log( 'onBoard(4,8):', onBoard( [4, 8] ) );
// console.log( 'onBoard(4,9):', onBoard( [4, 9] ) );
// console.log( 'onBoard(4,10):', onBoard( [4, 10] ) );

function rePopRack1() { // repopulate the p1rack

    let dotcnt = p1rack.filter(x => x === '.').length;

    for ( let i = 0; i < dotcnt; i++ ) {
        
        let j = Math.floor(Math.random() * tiles.length);
        let k = p1rack.indexOf('.');

        p1rack[k] = tiles[j]; // Assign to P1 rack.
        // replaced p1rack[k].piece = getPieceImageSource(p1rack[k]);
        // with the following switch statement to get rePopRack1 to display within the rack
        switch(k) { // p1rack order
            case 0: loadRack(p1rack[k], [1, 1]); // [Y, X] ids
                    break;
            case 1: loadRack(p1rack[k], [1, 2]);
                    break;
            case 2: loadRack(p1rack[k], [1, 3]);
                    break;
            case 3: loadRack(p1rack[k], [1, 4]);
                    break;
            case 4: loadRack(p1rack[k], [2, 1]);
                    break;
            case 5: loadRack(p1rack[k], [2, 2]);
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.

console.log( '' );
console.log( 'rePopRack1():' );
console.log( 'curPlayer:', curPlayer, 'p1rack:', p1rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );

        p1rack[i].piece = getPieceImageSource(p1rack[i]);

    }
}

function rePopRack2() { // repopulate the p2rack

    let dotcnt = p2rack.filter(x => x === '.').length;

    for ( let i = 0; i < dotcnt; i++ ) {
        
        let j = Math.floor(Math.random() * tiles.length);
        let k = p2rack.indexOf('.');

        p2rack[k] = tiles[j]; // Assign to P2 rack.
        // p2rack[k].piece = getPieceImageSource(p2rack[k]);
        // hope to replace p2rack[k].piece = getPieceImageSource(p2rack[k]);
        // with the following switch statement to get rePopRack2 to display within the rack
        switch(k) { // p2rack order
            case 0: loadRack(p2rack[k], ...[4, 11]); // [Y, X] ids
                    break;
            case 1: loadRack(p2rack[k], ...[5, 10]);
                    break;
            case 2: loadRack(p2rack[k], ...[4, 9]);
                    break;
            case 3: loadRack(p2rack[k], ...[5, 8]);
                    break;
            case 4: loadRack(p2rack[k], ...[3, 11]);
                    break;
            case 5: loadRack(p2rack[k], ...[5, 10]);
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.

console.log( '' );
console.log( 'rePopRack2():' );
console.log( 'curPlayer:', curPlayer, 'p2rack:', p2rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );

    }
}

function loadPiece(piece, position) {
    const squareElement = document.getElementById(`${position[0]}${position[1]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);
}

function loadRack(piece, position) { // position = coordinates
    const squareElement = document.getElementById(`${position[0]}${position[1]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = true;
    pieceElement.src = getPieceImageSource(piece);

console.log( '' );
console.log( 'loadRack(piece, position):' );
console.log( 'InRack1:', inRack1(position), 'InRack2:', inRack2(position), 'piece:', piece, 'position:', position );
console.log( 'pieceElement:', pieceElement );

    squareElement.appendChild(pieceElement);

}

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
}

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

                curHeldPieceStartingPosition = [parseInt(curHeldPieceStringPosition[0]) - 1, parseInt(curHeldPieceStringPosition[1]) - 1];

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
                    const yPosition = Math.floor((mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77); // was 0.666, then 0.75
    
// console.log( 'X:', (mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth*1.0 );
// console.log( 'Y:', (mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77 );

                    const pieceReleasePosition = [yPosition, xPosition];

                    if (!(pieceReleasePosition[0] == curHeldPieceStartingPosition[0] && pieceReleasePosition[1] == curHeldPieceStartingPosition[1])) {
                        if (curPlayer === 'white') {
                            if (validateWhiteMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece_white(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
                        if (curPlayer === 'black') {
                            if (validateBlackMovement(curHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece_black(curHeldPiece, curHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
                    }
                }

            curHeldPiece.style.position = 'static';
            curHeldPiece = null;
            curHeldPieceStartingPosition = null;
        }
    
        hasIntervalStarted = false;
    });
} // setPieceHoldEvents()

function movePiece_white(piece, startingPosition, endingPosition) {
    if (curPlayer == 'white') {
        const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
        if (boardPiece != '.') {
            curBoard[startingPosition[0]][startingPosition[1]] = '.'; // clear the startingPosition
            p1rack[ startingPosition[0]*4 + startingPosition[1] ] = '.'; // clear the tile from the rack, this formula only works for the p1rack
            curBoard[endingPosition[0]][endingPosition[1]] = boardPiece; // move the boardPiece to the endingPosition

            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);
            destinationSquare.textContent = '';
            destinationSquare.appendChild(piece);
        }
    }

console.log( '' );
console.log( 'movePiece_white():' );
console.log( 'curPlayer:', curPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], '], endingPosition[', endingPosition[0], ',', endingPosition[1], ']' );
console.log( 'p1rack:', p1rack );

    // artificially switch players after 3 tile moves
    if ( p1rack.filter(x => x === '.').length >= 3 ) {
        switchPlayer();
    }
    // if ( p2rack.filter(x => x === '.').length >= 3 ) {
    //     switchPlayer();
    // }
}

function movePiece_black(piece, startingPosition, endingPosition) {
    if (curPlayer == 'black') {
        const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
        if (boardPiece != '.') {
            curBoard[startingPosition[0]][startingPosition[1]] = '.'; // clear the startingPosition
            p1rack[ startingPosition[0]*4 + startingPosition[1] ] = '.'; // clear the tile from the rack, this formula only works for the p1rack
            curBoard[endingPosition[0]][endingPosition[1]] = boardPiece; // move the boardPiece to the endingPosition

            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}`);
            destinationSquare.textContent = '';
            destinationSquare.appendChild(piece);
        }
        }

console.log( '' );
console.log( 'movePiece_black():' );
console.log( 'curPlayer:', curPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], '], endingPosition[', endingPosition[0], ',', endingPosition[1], ']' );
console.log( 'p2rack:', p2rack );

    // artificially switch players after 3 tile moves
    // if ( p1rack.filter(x => x === '.').length >= 3 ) {
    //     switchPlayer();
    // }
    if ( p2rack.filter(x => x === '.').length >= 3 ) {
        switchPlayer();
    }
}

function switchPlayer() { // score, redraw and then switch players
    
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

}

function validateWhiteMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
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
                  if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                      // if the startingPosition is in p1rack and the endingPosition is on the board, return true 
                      return true;
                  } else {

console.warn( 'validateWhiteMovement() failure:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], '], endingPosition[', endingPosition[0], ',', endingPosition[1], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );

                      return false;
                  }
    }
}

function validateBlackMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]];
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
                  // if ( onBoard(endingPosition) ) {
                      // if the startingPosition is in p2rack and the endingPosition is on the board, return true 
                      return true;
                  } else {

console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], '], endingPosition[', endingPosition[0], ',', endingPosition[1], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );

                      return false;
                  }

    }
}

startGame();
setPieceHoldEvents();

// while the p1rack is not empty:
// while ( p1rack.filter(x => x === '.').length < 3 ) {
//     setPieceHoldEvents();
// }
// switchPlayer();
// while the p2rack is not empty:
// while ( p2rack.filter(x => x === '.').length < 3 ) {
//     setPieceHoldEvents();
// }
// do setPieceHoldEvents();
// while ( p1rack.filter(x => x=='.').length < 3 );
// switchPlayer();
//
