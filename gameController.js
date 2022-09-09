/* globals */
// "use strict";
// coords use [z,y,x] and [y,x] notation

var words = [];
var score_words = [];

let curBoard;
let curPlayer;

let curHeldPiece;
let curHeldPieceStartingPosition;

const wordre = /[a-z]{2,}/; // A word is 2 or more consecutive lower-case letters, used to have A-Z
    
const gameBoard = [ // 6 levels of 5 rows of 11 columns, [Z,Y,X]: [0,0,0] - [5,4,10]
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', 'R', '.', '.', '.', '.', '.'],
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

var prevBoard = JSON.parse(JSON.stringify(gameBoard));

var flatBoard = [ // 5 rows of 11 columns, [Y,X]: [0,0] - [4,10]
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'] ];

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
var p1scoreText = '';
var p2scoreText = '';

/* game functions */

function startGame() {
    
    // Draw letter tiles for the players by alternating.
    for (let i = 0; i < p1rack.length; i++) {
              
        let j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        p1rack[i] = tiles[j]; // Assign to the p1rack.
        p1rack[i].piece = getPieceImageSource(p1rack[i]);
        tiles.splice(j, 1); // Delete from tiles.
    
        j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        p2rack[i] = tiles[j]; // Assign to the p2rack.
        p2rack[i].piece = getPieceImageSource(p2rack[i]);
        tiles.splice(j, 1); // Delete from tiles.
    }
    
// console.log( 'p1rack:', p1rack.sort() ); A side-effect is that this sorts the racks.
// console.log( 'p2rack:', p2rack.sort() );
// console.log( 'tiles:', tiles.sort() );
    
    const starterPlayer = 'white';
    
    // Add p1rack to the gameBoard, unless undefined.
    if (typeof p1rack[0] !== 'undefined') { gameBoard[0][0][0] = p1rack[0] } else { gameBoard[0][0][0] = '.' };
    if (typeof p1rack[1] !== 'undefined') { gameBoard[0][0][1] = p1rack[1] } else { gameBoard[0][0][1] = '.' };
    if (typeof p1rack[4] !== 'undefined') { gameBoard[0][0][2] = p1rack[2] } else { gameBoard[0][0][2] = '.' };
    if (typeof p1rack[5] !== 'undefined') { gameBoard[0][0][3] = p1rack[3] } else { gameBoard[0][0][3] = '.' };
    if (typeof p1rack[2] !== 'undefined') { gameBoard[0][1][0] = p1rack[4] } else { gameBoard[0][1][0] = '.' };
    if (typeof p1rack[3] !== 'undefined') { gameBoard[0][1][1] = p1rack[5] } else { gameBoard[0][1][1] = '.' };
    
    // Add p2rack to the gameBoard, unless undefined.
    if (typeof p2rack[5] !== 'undefined') { gameBoard[0][3][10] = p2rack[0] } else { gameBoard[0][3][10] = '.' };
    if (typeof p2rack[4] !== 'undefined') { gameBoard[0][4][9] = p2rack[1] } else { gameBoard[0][4][9] = '.' };
    if (typeof p2rack[1] !== 'undefined') { gameBoard[0][3][8] = p2rack[2] } else { gameBoard[0][3][8] = '.' };
    if (typeof p2rack[0] !== 'undefined') { gameBoard[0][4][7] = p2rack[3] } else { gameBoard[0][4][7] = '.' };
    if (typeof p2rack[3] !== 'undefined') { gameBoard[0][2][10] = p2rack[4] } else { gameBoard[0][2][10] = '.' };
    if (typeof p2rack[2] !== 'undefined') { gameBoard[0][3][9] = p2rack[5] } else { gameBoard[0][3][9] = '.' };

    loadPosition(gameBoard, starterPlayer);
    
} // startGame()

function loadPosition( position, playerToMove ) {
    curBoard = position;
    curPlayer = playerToMove;

    // level h, row i and column j
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                if ( position[h][i][j] !== '.' ) {
    
                    if ( inRack1([h,i,j]) || inRack2([h,i,j]) ) {
                        loadRack( position[h][i][j], [h+1,i+1,j+1] );
                    } else {
                        loadPiece( position[h][i][j], [h+1,i+1,j+1] );
                    }
                }
            }
        }
    }
} // loadPosition( position, playerToMove )

function loadRack(piece, position) {
    // piece and position, an array of ZYX ids, which concat into the Id
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = true;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);

// console.log( '' );
// console.log( 'loadRack(piece, position):' );
// console.log( 'InRack1:', inRack1( position ), 'InRack2:', inRack2( position ), 'piece:', piece, 'position:', position );
// console.log( 'pieceElement:', pieceElement );

} // loadRack(piece, position)

function loadPiece(piece, position) {
    // piece and position, an array of ZYX ids, which concat to the Id
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);

    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = false;
    pieceElement.src = getPieceImageSource(piece);

    squareElement.appendChild(pieceElement);

// console.log( '' );
// console.log( 'loadPiece(piece, position):' );
// console.log( 'InRack1:', inRack1( position ), 'InRack2:', inRack2( position ), 'piece:', piece, 'position:', position );
// console.log( 'pieceElement:', pieceElement );

} // loadPiece(piece, position)

function getPieceImageSource(piece) {
    switch (piece) {
        case '.': return '';
        case 'null': return '';
        case 'a': return 'assets/A0.png';
        case 'b': return 'assets/B0.png';
        case 'c': return 'assets/C0.png';
        case 'd': return 'assets/D0.png';
        case 'e': return 'assets/E0.png';
        case 'f': return 'assets/F0.png';
        case 'g': return 'assets/G0.png';
        case 'h': return 'assets/H0.png';
        case 'i': return 'assets/I0.png';
        case 'j': return 'assets/J0.png';
        case 'k': return 'assets/K0.png';
        case 'l': return 'assets/L0.png';
        case 'm': return 'assets/M0.png';
        case 'n': return 'assets/N0.png';
        case 'o': return 'assets/O0.png';
        case 'p': return 'assets/P0.png';
        case 'q': return 'assets/Q0.png';
        case 'r': return 'assets/R0.png';
        case 's': return 'assets/S0.png';
        case 't': return 'assets/T0.png';
        case 'u': return 'assets/U0.png';
        case 'v': return 'assets/V0.png';
        case 'w': return 'assets/W0.png';
        case 'x': return 'assets/X0.png';
        case 'y': return 'assets/Y0.png';
        case 'z': return 'assets/Z0.png';
        case ' ': return 'assets/BLANK0.png';
        case 'a1': return 'assets/A1.png';
        case 'b1': return 'assets/B1.png';
        case 'c1': return 'assets/C1.png';
        case 'd1': return 'assets/D1.png';
        case 'e1': return 'assets/E1.png';
        case 'f1': return 'assets/F1.png';
        case 'g1': return 'assets/G1.png';
        case 'h1': return 'assets/H1.png';
        case 'i1': return 'assets/I1.png';
        case 'j1': return 'assets/J1.png';
        case 'k1': return 'assets/K1.png';
        case 'l1': return 'assets/L1.png';
        case 'm1': return 'assets/M1.png';
        case 'n1': return 'assets/N1.png';
        case 'o1': return 'assets/O1.png';
        case 'p1': return 'assets/P1.png';
        case 'q1': return 'assets/Q1.png';
        case 'r1': return 'assets/R1.png';
        case 's1': return 'assets/S1.png';
        case 't1': return 'assets/T1.png';
        case 'u1': return 'assets/U1.png';
        case 'v1': return 'assets/V1.png';
        case 'w1': return 'assets/W1.png';
        case 'x1': return 'assets/X1.png';
        case 'y1': return 'assets/Y1.png';
        case 'z1': return 'assets/Z1.png';
        case ' 1': return 'assets/BLANK1.png';
        case 'a2': return 'assets/A2.png';
        case 'b2': return 'assets/B2.png';
        case 'c2': return 'assets/C2.png';
        case 'd2': return 'assets/D2.png';
        case 'e2': return 'assets/E2.png';
        case 'f2': return 'assets/F2.png';
        case 'g2': return 'assets/G2.png';
        case 'h2': return 'assets/H2.png';
        case 'i2': return 'assets/I2.png';
        case 'j2': return 'assets/J2.png';
        case 'k2': return 'assets/K2.png';
        case 'l2': return 'assets/L2.png';
        case 'm2': return 'assets/M2.png';
        case 'n2': return 'assets/N2.png';
        case 'o2': return 'assets/O2.png';
        case 'p2': return 'assets/P2.png';
        case 'q2': return 'assets/Q2.png';
        case 'r2': return 'assets/R2.png';
        case 's2': return 'assets/S2.png';
        case 't2': return 'assets/T2.png';
        case 'u2': return 'assets/U2.png';
        case 'v2': return 'assets/V2.png';
        case 'w2': return 'assets/W2.png';
        case 'x2': return 'assets/X2.png';
        case 'y2': return 'assets/Y2.png';
        case 'z2': return 'assets/Z2.png';
        case ' 2': return 'assets/BLANK2.png';
        case 'a3': return 'assets/A3.png';
        case 'b3': return 'assets/B3.png';
        case 'c3': return 'assets/C3.png';
        case 'd3': return 'assets/D3.png';
        case 'e3': return 'assets/E3.png';
        case 'f3': return 'assets/F3.png';
        case 'g3': return 'assets/G3.png';
        case 'h3': return 'assets/H3.png';
        case 'i3': return 'assets/I3.png';
        case 'j3': return 'assets/J3.png';
        case 'k3': return 'assets/K3.png';
        case 'l3': return 'assets/L3.png';
        case 'm3': return 'assets/M3.png';
        case 'n3': return 'assets/N3.png';
        case 'o3': return 'assets/O3.png';
        case 'p3': return 'assets/P3.png';
        case 'q3': return 'assets/Q3.png';
        case 'r3': return 'assets/R3.png';
        case 's3': return 'assets/S3.png';
        case 't3': return 'assets/T3.png';
        case 'u3': return 'assets/U3.png';
        case 'v3': return 'assets/V3.png';
        case 'w3': return 'assets/W3.png';
        case 'x3': return 'assets/X3.png';
        case 'y3': return 'assets/Y3.png';
        case 'z3': return 'assets/Z3.png';
        case ' 3': return 'assets/BLANK3.png';
        case 'a4': return 'assets/A4.png';
        case 'b4': return 'assets/B4.png';
        case 'c4': return 'assets/C4.png';
        case 'd4': return 'assets/D4.png';
        case 'e4': return 'assets/E4.png';
        case 'f4': return 'assets/F4.png';
        case 'g4': return 'assets/G4.png';
        case 'h4': return 'assets/H4.png';
        case 'i4': return 'assets/I4.png';
        case 'j4': return 'assets/J4.png';
        case 'k4': return 'assets/K4.png';
        case 'l4': return 'assets/L4.png';
        case 'm4': return 'assets/M4.png';
        case 'n4': return 'assets/N4.png';
        case 'o4': return 'assets/O4.png';
        case 'p4': return 'assets/P4.png';
        case 'q4': return 'assets/Q4.png';
        case 'r4': return 'assets/R4.png';
        case 's4': return 'assets/S4.png';
        case 't4': return 'assets/T4.png';
        case 'u4': return 'assets/U4.png';
        case 'v4': return 'assets/V4.png';
        case 'w4': return 'assets/W4.png';
        case 'x4': return 'assets/X4.png';
        case 'y4': return 'assets/Y4.png';
        case 'z4': return 'assets/Z4.png';
        case ' 4': return 'assets/BLANK4.png';
        case 'a5': return 'assets/A5.png';
        case 'b5': return 'assets/B5.png';
        case 'c5': return 'assets/C5.png';
        case 'd5': return 'assets/D5.png';
        case 'e5': return 'assets/E5.png';
        case 'f5': return 'assets/F5.png';
        case 'g5': return 'assets/G5.png';
        case 'h5': return 'assets/H5.png';
        case 'i5': return 'assets/I5.png';
        case 'j5': return 'assets/J5.png';
        case 'k5': return 'assets/K5.png';
        case 'l5': return 'assets/L5.png';
        case 'm5': return 'assets/M5.png';
        case 'n5': return 'assets/N5.png';
        case 'o5': return 'assets/O5.png';
        case 'p5': return 'assets/P5.png';
        case 'q5': return 'assets/Q5.png';
        case 'r5': return 'assets/R5.png';
        case 's5': return 'assets/S5.png';
        case 't5': return 'assets/T5.png';
        case 'u5': return 'assets/U5.png';
        case 'v5': return 'assets/V5.png';
        case 'w5': return 'assets/W5.png';
        case 'x5': return 'assets/X5.png';
        case 'y5': return 'assets/Y5.png';
        case 'z5': return 'assets/Z5.png';
        case ' 5': return 'assets/BLANK5.png';
        case 'R': return 'assets/pink-rose.png';
    }
} // getPieceImageSource(piece)

function rePopRack1() {
    // repopulate the p1rack
    let dotcnt = p1rack.filter(x => x === '.').length;
    
    for ( let i = 0; i < dotcnt; i++ ) {
        let j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        let k = p1rack.indexOf('.');
        p1rack[k] = tiles[j]; // Assign to the p1rack.
    
        // Update p1rack[] and gameBoard[][][] based on the index of the dot.
        switch(k) { // p1rack order
            case 0: loadRack(p1rack[k], [1,1,1]); // [Z,Y,X] ids
                    gameBoard[0][0][0] = p1rack[0];
                    break;
            case 1: loadRack(p1rack[k], [1,1,2]);
                    gameBoard[0][0][1] = p1rack[1];
                    break;
            case 2: loadRack(p1rack[k], [1,1,3]);
                    gameBoard[0][0][2] = p1rack[2];
                    break;
            case 3: loadRack(p1rack[k], [1,1,4]);
                    gameBoard[0][0][3] = p1rack[3];
                    break;
            case 4: loadRack(p1rack[k], [1,2,1]);
                    gameBoard[0][1][0] = p1rack[4];
                    break;
            case 5: loadRack(p1rack[k], [1,2,2]);
                    gameBoard[0][1][1] = p1rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
        p1rack[i].piece = getPieceImageSource(p1rack[i]);
    
// console.log( '' );
// console.log( 'rePopRack1():' );
// console.log( 'curPlayer:', curPlayer, 'p1rack:', p1rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
    
    }
} // rePopRack1()

function rePopRack2() {
    // repopulate the p2rack
    let dotcnt = p2rack.filter(x => x === '.').length;
    
    for ( let i = 0; i < dotcnt; i++ ) {
        let j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        let k = p2rack.indexOf('.');
        p2rack[k] = tiles[j]; // Assign to the p2rack.
    
        // Update p2rack[] and gameBoard[][][] based on the index of the dot.
        switch(k) { // p2rack order
            case 0: loadRack(p2rack[k], [1,4,11]); // [Z,Y,X] ids
                    gameBoard[0][3][10] = p2rack[0];
                    break;
            case 1: loadRack(p2rack[k], [1,5,10]);
                    gameBoard[0][4][9] = p2rack[1];
                    break;
            case 2: loadRack(p2rack[k], [1,4,9]);
                    gameBoard[0][3][8] = p2rack[2];
                    break;
            case 3: loadRack(p2rack[k], [1,5,8]);
                    gameBoard[0][4][7] = p2rack[3];
                    break;
            case 4: loadRack(p2rack[k], [1,3,11]);
                    gameBoard[0][2][10] = p2rack[4];
                    break;
            case 5: loadRack(p2rack[k], [1,4,10]);
                    gameBoard[0][3][9] = p2rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
        p2rack[i].piece = getPieceImageSource(p2rack[i]);
    
// console.log( '' );
// console.log( 'rePopRack2():' );
// console.log( 'curPlayer:', curPlayer, 'p2rack:', p2rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
    
    }
} // rePopRack2()

/* test functions */

function inRack1( position ) { // true if the position [z,y,x] is within the p1rack
    let z = position[0];
    let y = position[1];
    let x = position[2];
    
    if ( (z===0 && y===0 && x===0) || (z===0 && y===0 && x===1) || (z===0 && y===0 && x===2) || (z===0 && y===0 && x===3) || (z===0 && y===1 && x===0) || (z===0 && y===1 && x===1) ) { // p1rack
        return true;
    } else {
        return false;
    }
} // inRack1( position )

// console.log( 'inRack1([0,0,0]):', inRack1([0,0,0]) );
// console.log( 'inRack1([0,0,1]):', inRack1([0,0,1]) );
// console.log( 'inRack1([0,0,2]):', inRack1([0,0,2]) );
// console.log( 'inRack1([0,0,3]):', inRack1([0,0,3]) );
// console.log( 'inRack1([0,1,0]):', inRack1([0,1,0]) );
// console.log( 'inRack1([0,1,1]):', inRack1([0,1,1]) );

function inRack2( position ) { // true if the position [z,y,x] is within the p2rack
    let z = position[0];
    let y = position[1];
    let x = position[2];
    
    if ( (z===0 && y===3 && x===10) || (z===0 && y===4 && x===9) || (z===0 && y===3 && x===8) || (z===0 && y===4 && x===7) || (z===0 && y===2 && x===10) || (z===0 && y===3 && x===9) ) { // p2rack
        return true;
    } else {
        return false;
    }
} // inRack2( position )

// console.log( 'inRack2([0,3,10]):', inRack2([0,3,10]) );
// console.log( 'inRack2([0,4,9]):', inRack2([0,4,9]) );
// console.log( 'inRack2([0,3,8]):', inRack2([0,3,8]) );
// console.log( 'inRack2([0,4,7]):', inRack2([0,4,7]) );
// console.log( 'inRack2([0,2,10]):', inRack2([0,2,10]) );
// console.log( 'inRack2([0,3,9]):', inRack2([0,3,9]) );

function onBoard( position ) { // true if the position is on the board
    let z = position[0];
    let y = position[1];
    let x = position[2];
    
    if ( (y===1 && x===4) || (y===1 && x===5) || (y===1 && x===6) || (y===2 && x===4) || (y===2 && x===5) || (y===2 && x===6) || (y===3 && x===5) ) { // board
        return true;
    } else {
        return false;
    }
} // onBoard( position )

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
    
        if (curHeldPiece !== null) {
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
    
// console.log( '' );
// console.log( 'setPieceHoldEvents():' );
// console.log( 'Even/odd column:', xPosition%2 );
// console.log( 'X:', (mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth*1.0 );
// console.log( 'Y:', (mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77 );
// console.log( 'curPlayer:', curPlayer, 'yPosition:', yPosition, 'xPosition:', xPosition );
    
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
    
    // If the boardPiece is not empty 
    if ( boardPiece !== '.' ) {
    // If the boardPiece is not empty AND the top rung is empty
    // if ( (boardPiece !== '.') && ( curBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {

        // move the piece
        curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]] = '.'; // clear the startingPosition and remove the sourceSquare's child(piece)
        const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        sourceSquare.removeChild(piece);
    
        // const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        // sourceSquare.textContent = '';
        // sourceSquare.removeChild(piece);
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
    
        if ( !( curBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes(".") ) && !( curBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes("R") ) ) {
            // level 0 is not empty AND level 0 is not R, check next level
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
                                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                                destinationSquare.textContent = '';

                                // build a new pieceElement and append it to the destinationSquare
                                const pieceElement = document.createElement('img');
                                pieceElement.classList.add('piece');
                                pieceElement.id = boardPiece;
                                pieceElement.draggable = false;
                                pieceElement.src = getPieceImageSource(boardPiece+'5');
                                destinationSquare.appendChild(pieceElement);
                            }
                        } else {
                            curBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 4
                            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                            destinationSquare.textContent = '';

                            // build a new pieceElement and append it to the destinationSquare
                            const pieceElement = document.createElement('img');
                            pieceElement.classList.add('piece');
                            pieceElement.id = boardPiece;
                            pieceElement.draggable = false;
                            pieceElement.src = getPieceImageSource(boardPiece+'4');
                            destinationSquare.appendChild(pieceElement);
                        }
                    } else {
                        curBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 3
                        const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                        destinationSquare.textContent = '';

                        // build a new pieceElement and append it to the destinationSquare
                        const pieceElement = document.createElement('img');
                        pieceElement.classList.add('piece');
                        pieceElement.id = boardPiece;
                        pieceElement.draggable = false;
                        pieceElement.src = getPieceImageSource(boardPiece+'3');
                        destinationSquare.appendChild(pieceElement);
                    }
                } else {
                    curBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 2
                    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                    destinationSquare.textContent = '';

                    // build a new pieceElement and append it to the destinationSquare
                    const pieceElement = document.createElement('img');
                    pieceElement.classList.add('piece');
                    pieceElement.id = boardPiece;
                    pieceElement.draggable = false;
                    pieceElement.src = getPieceImageSource(boardPiece+'2');
                    destinationSquare.appendChild(pieceElement);
                }
            } else {
                curBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 1
                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                destinationSquare.textContent = '';

                // build a new pieceElement and append it to the destinationSquare
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = boardPiece;
                pieceElement.draggable = false;
                pieceElement.src = getPieceImageSource(boardPiece+'1');
                destinationSquare.appendChild(pieceElement);
            }
        } else {
            curBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 0
            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
            destinationSquare.textContent = '';
            destinationSquare.appendChild(piece);
        }
    }

// console.log( '' );
// console.log( 'movePiece():' );
// console.log( 'curPlayer:', curPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                                  'to endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'p1rack:', p1rack, 'p1rack.dot_count:', p1rack.filter(x => x === '.').length );
// console.log( 'p2rack:', p2rack, 'p2rack.dot_count:', p2rack.filter(x => x === '.').length );
    
} // movePiece(piece, startingPosition, endingPosition)

function validateWhiteMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    switch (boardPiece) {
        case 'a':
                    if ( getTopLetter( endingPosition ) !== 'a' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
    
// console.log( '' );
// console.log( 'validateWhiteMovement(startingPosition, endingPosition)' );
// console.log( 'validateWhiteMovement() success:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                  'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'inRack1(startingPosition):', inRack1(startingPosition) );
// console.log( 'onBoard(endingPosition):', onBoard(endingPosition) );
    
                            return true;
                        } else { // Error condition
        
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
    
                            return false;
                        }
                    } else { // Error condition
        
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself.' );
    
                    }
                    break;
        case 'b':
                    if ( getTopLetter( endingPosition ) !== 'b' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'c':
                    if ( getTopLetter( endingPosition ) !== 'c' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'd':
                    if ( getTopLetter( endingPosition ) !== 'd' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'e':
                    if ( getTopLetter( endingPosition ) !== 'e' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'f':
                    if ( getTopLetter( endingPosition ) !== 'f' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'g':
                    if ( getTopLetter( endingPosition ) !== 'g' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'h':
                    if ( getTopLetter( endingPosition ) !== 'h' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'i':
                    if ( getTopLetter( endingPosition ) !== 'i' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'j':
                    if ( getTopLetter( endingPosition ) !== 'j' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'k':
                    if ( getTopLetter( endingPosition ) !== 'k' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'l':
                    if ( getTopLetter( endingPosition ) !== 'l' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'm':
                    if ( getTopLetter( endingPosition ) !== 'm' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'n':
                    if ( getTopLetter( endingPosition ) !== 'n' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'o':
                    if ( getTopLetter( endingPosition ) !== 'o' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'p':
                    if ( getTopLetter( endingPosition ) !== 'p' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'q':
                    if ( getTopLetter( endingPosition ) !== 'q' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'r':
                    if ( getTopLetter( endingPosition ) !== 'r' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 's':
                    if ( getTopLetter( endingPosition ) !== 's' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 't':
                    if ( getTopLetter( endingPosition ) !== 't' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'u':
                    if ( getTopLetter( endingPosition ) !== 'u' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'v':
                    if ( getTopLetter( endingPosition ) !== 'v' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'w':
                    if ( getTopLetter( endingPosition ) !== 'w' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'x':
                    if ( getTopLetter( endingPosition ) !== 'x' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'y':
                    if ( getTopLetter( endingPosition ) !== 'y' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'z':
                    if ( getTopLetter( endingPosition ) !== 'z' ) {
                        if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateWhiteMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case ' ':
        case 'R':
                  if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                      // if the startingPosition is in p1rack and the endingPosition is on the board, and the endingPosition is open, return true 
    
// console.log( '' );
// console.log( 'validateWhiteMovement(startingPosition, endingPosition)' );
// console.log( 'validateWhiteMovement() success:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                  'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'inRack1(startingPosition):', inRack1(startingPosition) );
// console.log( 'onBoard(endingPosition):', onBoard(endingPosition) );
    
                      return true;
                  } else {
    
console.warn( 'validateWhiteMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack1(startingPosition):', inRack1(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
    
                      return false;
                  }
    } // switch
} // validateWhiteMovement(startingPosition, endingPosition)

function validateBlackMovement(startingPosition, endingPosition) {
    const boardPiece = curBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    switch (boardPiece) {
        case 'a':
        case 'b':
                    if ( getTopLetter( endingPosition ) !== 'b' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'c':
                    if ( getTopLetter( endingPosition ) !== 'c' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'd':
                    if ( getTopLetter( endingPosition ) !== 'd' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'e':
                    if ( getTopLetter( endingPosition ) !== 'e' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'f':
                    if ( getTopLetter( endingPosition ) !== 'f' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'g':
                    if ( getTopLetter( endingPosition ) !== 'g' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'h':
                    if ( getTopLetter( endingPosition ) !== 'h' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'i':
                    if ( getTopLetter( endingPosition ) !== 'i' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'j':
                    if ( getTopLetter( endingPosition ) !== 'j' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'k':
                    if ( getTopLetter( endingPosition ) !== 'k' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'l':
                    if ( getTopLetter( endingPosition ) !== 'l' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'm':
                    if ( getTopLetter( endingPosition ) !== 'm' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'n':
                    if ( getTopLetter( endingPosition ) !== 'n' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'o':
                    if ( getTopLetter( endingPosition ) !== '0' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'p':
                    if ( getTopLetter( endingPosition ) !== 'p' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'q':
                    if ( getTopLetter( endingPosition ) !== 'q' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'r':
                    if ( getTopLetter( endingPosition ) !== 'r' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 's':
                    if ( getTopLetter( endingPosition ) !== 's' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 't':
                    if ( getTopLetter( endingPosition ) !== 't' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'u':
                    if ( getTopLetter( endingPosition ) !== 'u' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'v':
                    if ( getTopLetter( endingPosition ) !== 'v' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'w':
                    if ( getTopLetter( endingPosition ) !== 'w' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'x':
                    if ( getTopLetter( endingPosition ) !== 'x' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'y':
                    if ( getTopLetter( endingPosition ) !== 'y' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case 'z':
                    if ( getTopLetter( endingPosition ) !== 'z' ) {
                        if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                            return true;
                        } else { // Error condition
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
                            return false;
                        }
                    } else { // Error condition
console.warn( 'validateBlackMovement() move denied:', 'Cannot stack the same letter on top of itself' );
                    }
                    break;
        case ' ':
        case 'R':
                  if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
// console.log( '' );
// console.log( 'validateBlackMovement(startingPosition, endingPosition)' );
// console.log( 'validateBlackMovement() success:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                  'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'inRack2(startingPosition):', inRack2(startingPosition) );
// console.log( 'onBoard(endingPosition):', onBoard(endingPosition) );
                      return true;
                  } else {
console.warn( 'validateBlackMovement() failure denied:', 'startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
                                                         'endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
console.warn( 'inRack2(startingPosition):', inRack2(startingPosition) );
console.warn( 'onBoard(endingPosition):', onBoard(endingPosition) );
    
                      return false;
                  }
    } // switch
} // validateBlackMovement(startingPosition, endingPosition)


function switchPlayer() {
    // called by the $ onclick button:
    //   calculate the score, 
    //   redraw tile(s), 
    //   update prevBoard and then switch players
    
    words.length = 0; // empty words[]
    score_words.length = 0; // empty score_words[]
    
    if (curPlayer === 'white') {
        // calculate the score    
        calcScore();
        // redraw
        rePopRack1();
        // backup curBoard to prevBoard
        prevBoard = JSON.parse(JSON.stringify(curBoard));
        // switch player
        curPlayer = 'black';
    } else {
        // calculate the score    
        calcScore();
        // redraw
        rePopRack2();
        // backup curBoard to prevBoard
        prevBoard = JSON.parse(JSON.stringify(curBoard));
        // switch player
        curPlayer = 'white';
    }
    
console.log( '' );
console.log( 'switchPlayer():' );
    
} // switchPlayer()



function calcScore() {
    let dwb = 0; // double word bonus

    // 1st: Find the tiles played last turn by diffing prevBoard[][][] and curBoard[][][] back into prevBoard[][][]:
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                if ( !onBoard([h,i,j]) ) {
                    // If not on the board, clear the prevBoard element
                    prevBoard[h][i][j] = '.';
                }
                if ( prevBoard[h][i][j] !== curBoard[h][i][j] && onBoard([h,i,j]) ) {
                    // if different, save the difference to prevBoard
                    prevBoard[h][i][j] = curBoard[h][i][j];
                } else {
                    // if the same, clear the element in prevBoard
                    prevBoard[h][i][j] = '.';
                }
            }
        }
    } // prevBoard now contains only the tile(s) played for the last turn

    // check for double-word bonuses
    if ( prevBoard[0][2][5] !== '.' ) { // Someone played on a double-word bonus
        dwb = 1;
    }
    
    // 2nd: Use the prevBoard[][][] position(s) to find any new word(s) in curBoard[][][]:
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
    
                // If the position is on the board
                if ( onBoard([h,i,j]) ) {

                    // If its a new tile on the board, use that position to check for any words
                    if ( prevBoard[h][i][j] !== '.' ) {

// console.log( 'new tile position:', '[' + h + '][' + i + '][' + j + ']' );

                        // the score_words[] array is reset by switchPlayer()
                        score_words = wordCheck([h,i,j]); // e.g. ['it, [2, 4], UP']

                        // wordCheck returns an array of unique words to score
                        // an element = the word, the word position, and the direction
                    }
                }
            }
        }
    }
    // score_words[] now contains the words to score, but needs to only keep the longest word per location and direction
    
// console.log( 'score_words:', score_words ); 

    // score score_words[]
    var word_score = 0;
    var turn_score = 0;
    var element_str = '';
    var word_str = '';
    var curWord_str = '';
    var turn_ledger = '';
    
console.log( 'score_words[]:', score_words );
// console.log( 'score_words_copy[]:', score_words_copy );

//     ////////////////////////////////////////////////////////////
//     // 1st, remove any dots in the word_strs of score_words[] //
//     ////////////////////////////////////////////////////////////
//     for ( let i = 0; i < score_words.length; ++i ) {
//         const element = score_words[i];
//     
//         // convert the array element to a string
//         element_str = element + '';
//         word_str = element_str.substring( 0, element_str.indexOf(',') ); 
//     
//         // convert the array element to a string
//         if ( word_str.indexOf('.') ) {
// // console.log( 'b_score_words[i]:', score_words[i] );
//             // remove all '.'s from score_words[i]
//             score_words[i] = score_words[i].replace(/\./g, '');
// // console.log( 'a_score_words[i]:', score_words[i] );
//         }
//     }

// console.log( 'score_words[]:', score_words );
// console.log( 'score_words_copy[]:', score_words_copy );

//     ///////////////////////////////////////////////////////////
//     // 2nd, make a copy of score_words[]                     //
//     ///////////////////////////////////////////////////////////
//     // make a copy of score_words[] to help remove everything but the longest word per location and direction
//     var score_words_copy = JSON.parse(JSON.stringify(score_words));


//     ///////////////////////////////////////////////////////////////////////
//     // 3rd, use only the longest scoring word per position and direction //
//     ///////////////////////////////////////////////////////////////////////
//     for ( let i = 0; i < score_words.length; ++i ) {
//         for ( let j = 0; j < score_words_copy.length; ++j ) {
//             const a_element = score_words[i];
//             const b_element = score_words_copy[j];
//     
//             // convert the array elements to strings
//             a_element_str = a_element + '';
//             b_element_str = b_element + '';
//     
//             // get the lead yxCoords from the element strings
//             a_yx_str = element_str.substring( a_element_str.indexOf(',')+3, a_element_str.indexOf(']') ); 
//             b_yx_str = element_str.substring( b_element_str.indexOf(',')+3, b_element_str.indexOf(']') ); 
//     
//             // get the word directions from the element strings
//             a_yx_dir = element_str.substring( element_str.length - 2, element_str.length ); 
//             b_yx_dir = element_str.substring( element_str.length - 2, element_str.length ); 
//     
//             // if the position and direction are the same, print it
//             if ( ( a_yx_str === b_yx_str ) && ( a_yx_dir === b_yx_dir ) ) {
// console.log( 'matching score_words[i]:', score_words[i] );
//             }
//         }
//     }

    //////////////////////////////////////////////////////////////////////////////
    // For every element (word, position, direction) in the score_words[] array, /
    // calculate the word score                                                  /
    //////////////////////////////////////////////////////////////////////////////
    for ( let index = 0; index < score_words.length; ++index ) {
        const element = score_words[index];

        word_score = 0;
    
        // convert the array element into a string
        element_str = element + '';

        // get the word from the element string
        word_str = element_str.substring( 0, element_str.indexOf(',') ); 

        // get the lead yxCoord from the element string
        yx_str = element_str.substring( element_str.indexOf(',')+3, element_str.indexOf(']') ); 
// console.log( 'yx_str:', yx_str  );
        y = yx_str.substring(0, yx_str.indexOf(',') );
        x = yx_str.substring(yx_str.indexOf(',')+1 );
        y = Number(y); // convert to a number
        x = Number(x); // convert to a number
// console.log( 'y:', y );
// console.log( 'x:', x );

        // get the word direction from the element string
        yx_dir = element_str.substring( element_str.length - 2, element_str.length ); 
// console.log( 'yx_dir:', yx_dir  );

        if ( curWord_str !== word_str ) { // a new word to score

            switch ( yx_dir ) {

                case 'UP': // Upwards Word
console.log( 'An Upwards Word Lookup:' );
                    // for every letter in word_str, sum the individual values 
                    for ( var i = 0; i < word_str.length; i++ ) {
                        // get the letter
                        var letter = word_str.charAt(i);
                        // get the letter value
                        letterVal = getLetterValue( letter );
                        // get the letter level using the position of the next character in the string
                        new_str = upwd_lookup( yx_str, i ); // lookup new yxCoords
                        letterLev = getTopLevel( new_str ); // use the yxCoords from the lookup

// console.log( 'yx_str:', yx_str, 'new_str:', new_str );
// console.log( 'letter:', letter, 'letterVal:', letterVal, 'letterLev:', letterLev );
    
                        // get the stacking multiplier
                        var sm = letterLev + 1;
            
                        word_score = word_score + sm * letterVal;
                    }
                    // word_score complete, check for a double word bonus 
                    if ( dwb === 1 ) {
                        word_score = word_score * 2;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    break;

                case 'DW': // Downwards Word
console.log( 'A Downwards Word Lookup:' );
                    // for every letter in word_str, sum the individual values 
                    for ( var i = 0; i < word_str.length; i++ ) {
                        // get the letter
                        var letter = word_str.charAt(i);
                        // get the letter value
                        letterVal = getLetterValue( letter );
                        // get the letter level using the position of the next character in the string
                        new_str = dnwd_lookup( yx_str, i ); // lookup new yxCoords
                        letterLev = getTopLevel( new_str ); // use the yxCoords from the lookup

// console.log( 'yx_str:', yx_str, 'new_str:', new_str );
// console.log( 'letter:', letter, 'letterVal:', letterVal, 'letterLev:', letterLev );
    
                        // get the stacking multiplier
                        var sm = letterLev + 1;
            
                        word_score = word_score + sm * letterVal;
                    }
                    // word_score complete, check for a double word bonus 
                    if ( dwb === 1 ) {
                        word_score = word_score * 2;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    break;

                case 'DO': // Straight-Down Word
console.log( 'A Down Word Lookup:' );
                    // for every letter in word_str, sum the individual values 
                    for ( var i = 0; i < word_str.length; i++ ) {
                        // get the letter
                        var letter = word_str.charAt(i);
                        // get the letter value
                        letterVal = getLetterValue( letter );
                        // get the letter level
                        new_str = (y + i)+','+x;
                        letterLev = getTopLevel( new_str ); // use the new_str yxCoords
    
// console.log( 'yx_str:', yx_str, 'new_str:', new_str );
// console.log( 'letter:', letter, 'letterVal:', letterVal, 'letterLev:', letterLev );
    
                        // get the stacking multiplier
                        var sm = letterLev + 1;
            
                        word_score = word_score + sm * letterVal;
                    }
                    // word_score complete, check for a double word bonus 
                    if ( dwb === 1 ) {
                        word_score = word_score * 2;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    break;

            }
        }
        curWord_str = word_str;

// console.log( 'Word:', element, 'Value:', word_score );
// console.log( 'Turn_Score:', turn_score );
    
    } // for every word in score_words[]

    // turn_ledger now has the individual word scores, and
    // turn_score now has the players total for the turn

    // remove trailing ', ' from turn_ledger
    turn_ledger = turn_ledger.replace(/, $/, '');

    if (curPlayer === 'white') {
        p1score = p1score + turn_score;
        const p1scoreDiv = document.getElementById('p1score');
        p1scoreText = p1scoreText + 'Player 1: ' + turn_ledger + ' = ' + p1score + '\n';
        p1scoreDiv.innerHTML = p1scoreText;

console.log( p1scoreDiv.innerHTML );
    
    } else {
        p2score = p2score + turn_score;
        const p2scoreDiv = document.getElementById('p2score');
        p2scoreText = p2scoreText + 'Player 2: ' + turn_ledger + ' = ' + p2score + '\n';
        p2scoreDiv.innerHTML = p2scoreText;

console.log( p2scoreDiv.innerHTML );
    
    }
} // calcScore()



function wordCheck( position ) { // position = an array of numbers
                                 // If a word is found, return a record: ['it, [2, 4], UP']
                                 // [ the word, its position, and its direction ]
    let z = position[0];
    let y = position[1];
    let x = position[2]; 
    // the [z] coordinate is unused, the source curBoard[][][] is flattened into flatBoard[][]

    var str = '';

    flattenBoard(); // flattens global curBoard[z][y][x] into the global flatBoard[y][x]

    if ( onBoard( position ) ) { // only process valid board positions

// console.log( '' );
// console.log( 'wordCheck( position ):' );
// console.log( 'position:', position );
// console.log( 'y:', y );
// console.log( 'x:', x );

        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Upward strings on flatBoard[][]      /
        ///////////////////////////////////////////////////////////////////////
        upwd_str0=flatBoard[1][4]+flatBoard[1][5];
        upwd_str1=flatBoard[2][4]+flatBoard[2][5]+flatBoard[1][6];
        upwd_str2=flatBoard[3][5]+flatBoard[2][6];

        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Downward strings on flatBoard[][]    /
        ///////////////////////////////////////////////////////////////////////
        dnwd_str0=flatBoard[1][5]+flatBoard[1][6];
        dnwd_str1=flatBoard[1][4]+flatBoard[2][5]+flatBoard[2][6];
        dnwd_str2=flatBoard[2][4]+flatBoard[3][5];

        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Down strings on flatBoard[][]        /
        ///////////////////////////////////////////////////////////////////////
        down_str0=flatBoard[1][4]+flatBoard[2][4];
        down_str1=flatBoard[1][5]+flatBoard[2][5]+flatBoard[3][5];
        down_str2=flatBoard[1][6]+flatBoard[2][6];

        yandx_str = '' + y + x;
// console.log( 'yandx_str:', yandx_str );
        switch ( yandx_str ) {

            case '14':
// console.log( 'in case 14' );
            check_upwd_str0();
            check_dnwd_str1();
            check_down_str0();
            break;

            case '15':
// console.log( 'in case 15' );
            check_upwd_str0();
            check_dnwd_str0();
            check_down_str1();
            break;

            case '24':
// console.log( 'in case 24' );
            check_upwd_str1();
            check_dnwd_str2();
            check_down_str0();
            break;

            case '25':
// console.log( 'in case 25' );
            check_upwd_str1();
            check_dnwd_str1();
            check_down_str1();
            break;

            case '16':
// console.log( 'in case 16' );
            check_upwd_str1();
            check_dnwd_str0();
            check_down_str2();
            break;

            case '35':
// console.log( 'in case 35' );
            check_upwd_str2();
            check_dnwd_str2();
            check_down_str1();
            break;

            case '26':
// console.log( 'in case 26' );
            check_upwd_str2();
            check_dnwd_str1();
            check_down_str2();
            break;
        } // end of switch
    } // only process valid board positions
    
    // a well-formed element in words[]: ['an, [1,4], UP']
    // an element = the word, the position, and the direction

// console.log( 'words[]:', words );
    
    let unique_words = [... new Set(words)]; // this makes unique_words[] unique
    
// console.log( 'unique_words[]:', unique_words );

    return unique_words; // e.g. ['it, [2, 4]', UP']

    // empty words
    while( words.length > 0 ) {
        words.pop();
    }

}; // wordCheck( position )

function flattenBoard() {
    // This function flattens the curBoard[][][] into flatBoard[][]
    // by using the highest level letter tile in curBoard
    
    // level h, row i and column j
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                // Iterate over every curBoard element
                if ( ( curBoard[h][i][j] !== '.' ) && ( curBoard[h][i][j] !== 'R' ) ) {
                    // flatBoard will contain the highest letter tile in curBoard
                    flatBoard[i][j] = curBoard[h][i][j];
                }
            }
        }
    }
}; // flattenBoard()

function getTopLevel( position ) { // position = string of yxCoords, returns the highest level
    // convert string position to an array
    const myArray = position.split(',');
    let y = Number(myArray[0]);
    let x = Number(myArray[1]); // position [y,x] is the source for finding the top z level in curBoard[][][]
    
console.log( '' );
console.log( 'getTopLevel(', position, '):' );
// console.log( 'position:', position );
// console.log( 'y:', y );
// console.log( 'x:', x );
    
    // use the yxCoords to get the top level from curBoard
    for (let level = 5; level >= 0 ; level--) { // 6 levels
        if ( curBoard[level][y][x] !== '.' ) {
            return level;
            break;
        }
    }
} // getTopLevel( position )

function getTopLetter( position ) { // return the piece that is on top of the current position
    let z = position[0]; // this z-coordinate is not accurate
    let y = position[1]; // use the yxCoords
    let x = position[2];
    let top_letter = '';

console.log( 'In getTopLetter:' );
console.log( 'position:', position, 'z:', z, 'y:', y, 'x:', x );

    // get the top letter from curBoard for yxCoord
    for (let level = 5; level >= 0 ; level--) { // 6 levels
        if ( curBoard[level][y][x] !== '.' ) {
            top_letter = curBoard[level][y][x];
            break;
        }
    }
    return top_letter;
} // getTopLetter( position )

function getLetterValue( boardPiece ) {
    // Return the value of the given boardPiece.
    switch (boardPiece) {
        case ' ':
                  return 0;
                  break;
        case 'a':
        case 'd':
        case 'e':
        case 'g':
        case 'i':
        case 'l':
        case 'n':
        case 'o':
        case 'r':
        case 's':
        case 't':
        case 'u':
                  return 1;
                  break;
        case 'b':
        case 'c':
        case 'f':
        case 'h':
        case 'm':
        case 'p':
        case 'v':
        case 'w':
        case 'y':
                  return 2;
                  break;
        case 'k':
                  return 3;
                  break;
        case 'j':
        case 'x':
                  return 4;
                  break;
        case 'q':
        case 'z':
                  return 5;
                  break;
    
    }
} // getLetterValue( boardPiece )

/*********************************/
/* check upward string functions */
/*********************************/

function check_upwd_str0() {
    result = upwd_str0.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = upwd_str0.indexOf( word );
        // get word yxCoords for upwd_str0
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,4]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', UP' );
    }
}

function check_upwd_str1() {
    result = upwd_str1.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = upwd_str1.indexOf( word );
        // get word yxCoords for upwd_str1
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[2,4]'; break;
                case 1: yxCoords = '[2,5]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', UP' );
    }
}

function check_upwd_str2() {
    result = upwd_str2.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = upwd_str2.indexOf( word );
        // get word yxCoords for upwd_str2
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[3,5]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', UP' );
    }
}

/***********************************/
/* check downward string functions */
/***********************************/

function check_dnwd_str0() {
    result = dnwd_str0.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = dnwd_str0.indexOf( word );
        // get word yxCoords for dnwd_str0
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,5]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DW' );
    }
}

function check_dnwd_str1() {
    result = dnwd_str1.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = dnwd_str1.indexOf( word );
        // get word yxCoords for dnwd_str1
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,4]'; break;
                case 1: yxCoords = '[2,5]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DW' );
    }
}

function check_dnwd_str2() {
    result = dnwd_str2.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = dnwd_str2.indexOf( word );
        // get word yxCoords for dnwd_str2
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[2,4]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DW' );
    }
}

/*******************************/
/* check down string functions */
/*******************************/

function check_down_str0() {
    result = down_str0.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = down_str0.indexOf( word );
        // get word yxCoords for down_str0
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,4]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DO' );
    }
}

function check_down_str1() {
    result = down_str1.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = down_str1.indexOf( word );
        // get word yxCoords for down_str1
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,5]'; break;
                case 1: yxCoords = '[2,5]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DO' );
    }
}

function check_down_str2() {
    result = down_str2.match( wordre );
    if ( result ) {
        // get word 
        word = result[0];
        len = word.length;
        idx = down_str2.indexOf( word );
        // get word yxCoords for down_str2
        for ( let i = 0; i < word.length; i++ ) {
            switch (idx) {
                case 0: yxCoords = '[1,6]'; break;
            }
        }
        words.push( word + ', ' + yxCoords + ', DO' );
    }
}

/*******************/
/* array functions */
/*******************/

function upwd_lookup( position, idx ) { // string and a number, returns yx_str
    if ( idx === 0 ) return position;
    if ( idx === 1 ) {
        if ( position === '1,4' ) return '1,5'; 
        if ( position === '2,4' ) return '2,5'; 
        if ( position === '2,5' ) return '1,6'; 
        if ( position === '3,5' ) return '2,6'; 
    }
    if ( idx === 2 ) return '1,6';
}

function dnwd_lookup( position, idx ) { // string and a number, returns yx_str
    if ( idx === 0 ) return position;
    if ( idx === 1 ) {
        if ( position === '1,4' ) return '2,5'; 
        if ( position === '1,5' ) return '1,6'; 
        if ( position === '2,4' ) return '3,5'; 
        if ( position === '2,5' ) return '2,6'; 
    }
    if ( idx === 2 ) return '2,6';
}

startGame();
setPieceHoldEvents();

