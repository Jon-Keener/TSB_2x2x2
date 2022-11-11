/* globals */
// "use strict";
// coords use [z,y,x] and [y,x] notation

var words = [];
var score_words = [];
var game_record = [];
var turn_no = 0;
var blank_no = 0;

// vars for storing the style of the rack pieces
var rack1style = [];
var rack2style = [];

let currBoard;
let currPlayer;

let unPiece;
let unFrom;
let unTo;

let currHeldPiece;
let currHeldPieceStartingPosition;

const wordre = /[A-Za-z]{2,}/; // A word is 2 or more consecutive letters
    
const gameBoard = [ // 6 levels of 5 rows of 11 columns, [Z,Y,X]: [0,0,0] - [5,4,10]
[ ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '^0', '.', '^1', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '^2', '.', '.', '.', '.', '.'],
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

var flatBoard = [ // 1 level of 5 rows of 11 columns, [Z,Y,X]: [0,0,0] - [0,4,10]
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'] ];

// Initialize the letter tiles, the player racks and scores.
var tiles = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b0', 'b1', 'b2', 'c0', 'c1', 'd0', 'd1', 'd2', 'd3', 'e0', 'e1',
             'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'f0', 'f1', 'g0', 'g1', 'g2', 'h0', 'h1', 'i0', 'i1', 'i2', 'i3', 
             'i4', 'i5', 'i6', 'i7', 'i8', 'j0', 'k0', 'l0', 'l1', 'l2', 'l3', 'm0', 'm1', 'n0', 'n1', 'n2', 'n3', 'n4', 'n5', 'o0', 
             'o1', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'p0', 'p1', 'q0', 'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 's0', 's1', 's2', 's3', 
             't0', 't1', 't2', 't3', 't4', 't5', 'u0', 'u1', 'u2', 'u3', 'v0', 'v1', 'w0', 'w1', 'x0', 'y0', 'y1', 'z0', ' 0', ' 1'];
var p1rack = ['.', '.', '.', '.', '.', '.'];
var p2rack = ['.', '.', '.', '.', '.', '.'];
var p1score = 0;
var p2score = 0;
var p1scoreText = '';
var p2scoreText = '';

/* game functions */

function startGame() {
    // Draw tiles for the players' racks by alternating draws.
    
    for (let i = 0; i < p1rack.length; i++) {
              
        let j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        p1rack[i] = tiles[j]; // Assign the tile, level to the p1rack.
        let tileandtier = p1rack[i].replace(/\d/g, '') + '0'; // Tile and tier
    
// console.log( 'tileandtier', tileandtier );
        // p1rack[i].piece = getPieceImageSource(p1rack[i]);
        // p1rack[i].piece = getPieceImageSource( p1rack[i].replace(/\d,/g, '') ); // Replace tile number with level number.
        p1rack[i].piece = getPieceImageSource( tileandtier ); // Replace tile id with the tile and tier.
        tiles.splice(j, 1); // Delete from tiles.
    
        j = Math.floor(Math.random() * tiles.length); // Random draw from the remaining tiles.
        p2rack[i] = tiles[j]; // Assign the tile, level to the p2rack.
        tileandtier = p2rack[i].replace(/\d/g, '') + '0'; // Tile and tier
    
// console.log( 'tileandtier', tileandtier );
        // p2rack[i].piece = getPieceImageSource(p2rack[i]);
        // p2rack[i].piece = getPieceImageSource( p2rack[i].replace(/\d,/g, '') ); // Replace tile number with level number.
        p2rack[i].piece = getPieceImageSource( tileandtier ); // Replace tile id with the tile and tier.
        tiles.splice(j, 1); // Delete from tiles.
    }
    
// console.log( 'p1rack:', p1rack.sort() ); A side-effect is that this sorts the racks.
// console.log( 'p2rack:', p2rack.sort() );
// console.log( 'tiles:', tiles.sort() );
    
    const starterPlayer = 'white';
    
    updateGameBoard();
    
    loadPosition(gameBoard, starterPlayer);
    
} // startGame()


function loadPosition( position, playerToMove ) {
    currBoard = position;
    currPlayer = playerToMove;
    
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


function loadRack( piece, position ) {
    // piece and position, an array of ZYX ids, which concat into the Id
    
    // Get the squareElement
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);
    
    // Create the pieceElement
    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = true;
    pieceElement.style = "position: static;"; // top: 245px; left: 672px;"; // new code, this seemed to be required but it didn't help
    
    let tileandtier = piece.replace(/\d/g, '') + '0'; // Tile and tier
    pieceElement.src = getPieceImageSource( tileandtier );
    
    // Append the pieceElement to the squareElement
    squareElement.appendChild(pieceElement);
    
    updateGameBoard();
    
// console.log( '' );
// console.log( 'loadRack( piece, position ):' );
// console.log( 'piece:', piece, 'position:', position, 'squareElement:', squareElement, 'pieceElement:', pieceElement );
    
} // loadRack( piece, position )


function loadPiece( piece, position ) {
    // piece and position, an array of ZYX ids, which concat to the Id
    
    // Get the squareElement
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);
    
    // Create the pieceElement
    const pieceElement = document.createElement('img');
    pieceElement.classList.add('piece');
    pieceElement.id = piece;
    pieceElement.draggable = true; // was false
    
    let tileandtier = piece.replace(/\d/g, '') + '0'; // Tile and tier
    pieceElement.src = getPieceImageSource( tileandtier );
    
    // Append the pieceElement to the squareElement
    squareElement.appendChild(pieceElement);
    
    updateGameBoard();
    
console.log( '' );
console.log( 'loadPiece( piece, position ):' );
console.log( 'piece:', piece, 'position:', position, 'squareElement:', squareElement, 'pieceElement:', pieceElement );
    
} // loadPiece( piece, position )


function removeRack( piece, position ) {
    let z = position[0]; // piece and position, an array of ZYX ids, which concat into the Id
    let y = position[1];
    let x = position[2];
    
    // Get the squareElement
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);
    
    // Get the pieceElement
    // const pieceElement = document.squareElement.getElementsByClassName('piece');
    const pieceElement = document.getElementById( piece ); // This now works for every tile on the board due to unique tiles.

    // Before removing the rack tile, capture its style so it can be reapplied with the next tile drawn
    if ( inRack1( position ) ) {
        if ( ( y === 0 ) && ( x === 0 ) ) {
            // rack1style[0] = pieceElement.getPropertyValue('style');
            rack1style[0] = pieceElement.style;
console.log( 'rack1style[0]:', rack1style[0] );
        }
        if ( ( y === 0 ) && ( x === 1 ) ) {
            // rack1style[1] = pieceElement.getPropertyValue('style');
            rack1style[1] = pieceElement.style;
console.log( 'rack1style[1]:', rack1style[1] );
        }
        if ( ( y === 0 ) && ( x === 2 ) ) {
            // rack1style[2] = pieceElement.getPropertyValue('style');
            rack1style[2] = pieceElement.style;
console.log( 'rack1style[2]:', rack1style[2] );
        }
        if ( ( y === 0 ) && ( x === 3 ) ) {
            // rack1style[3] = pieceElement.getPropertyValue('style');
            rack1style[3] = pieceElement.style;
console.log( 'rack1style[3]:', rack1style[3] );
        }
        if ( ( y === 1 ) && ( x === 0 ) ) {
            // rack1style[4] = pieceElement.getPropertyValue('style');
            rack1style[4] = pieceElement.style;
console.log( 'rack1style[4]:', rack1style[4] );
        }
        if ( ( y === 1 ) && ( x === 1 ) ) {
            // rack1style[5] = pieceElement.getPropertyValue('style');
            rack1style[5] = pieceElement.style;
console.log( 'rack1style[5]:', rack1style[5] );
        }
    }
    if ( inRack2( position ) ) {
        if ( ( y === 3 ) && ( x === 10 ) ) {
            // rack2style[0] = pieceElement.getPropertyValue('style');
            rack2style[0] = pieceElement.style;
console.log( 'rack2style[0]:', rack2style[0] );
        }
        if ( ( y === 4 ) && ( x === 9 ) ) {
            // rack2style[1] = pieceElement.getPropertyValue('style');
            rack2style[1] = pieceElement.style;
console.log( 'rack2style[1]:', rack2style[1] );
        }
        if ( ( y === 3 ) && ( x === 8 ) ) {
            // rack2style[2] = pieceElement.getPropertyValue('style');
            rack2style[2] = pieceElement.style;
console.log( 'rack2style[2]:', rack2style[2] );
        }
        if ( ( y === 4 ) && ( x === 7 ) ) {
            // rack2style[3] = pieceElement.getPropertyValue('style');
            rack2style[3] = pieceElement.style;
console.log( 'rack2style[3]:', rack2style[3] );
        }
        if ( ( y === 2 ) && ( x === 10 ) ) {
            // rack2style[4] = pieceElement.getPropertyValue('style');
            rack2style[4] = pieceElement.style;
console.log( 'rack2style[4]:', rack2style[4] );
        }
        if ( ( y === 3 ) && ( x === 9 ) ) {
            // rack2style[5] = pieceElement.getPropertyValue('style');
            rack2style[5] = pieceElement.style;
console.log( 'rack2style[5]:', rack2style[5] );
        }
    }
    pieceElement.remove();
    
    updateGameBoard();
    
console.log( '' );
console.log( 'removeRack( piece, position ):' );
console.log( 'piece:', piece, 'position:', position, 'squareElement:', squareElement, 'pieceElement:', pieceElement );
    
} // removeRack( piece, position ) 


function removePiece( piece, position ) {
    // piece and position, an array of ZYX ids, which concat into the Id
    
    // Get the squareElement
    const squareElement = document.getElementById(`${position[0]}${position[1]}${position[2]}`);
    
    // Get the pieceElement
    const pieceElement = document.getElementById( piece ); // This now works for every tile on the board due to unique tiles.
    
console.log( '' );
console.log( 'removePiece(', '"'+piece+'"', position, '):' );
console.log( 'piece:', piece, 'position:', position, 'squareElement:', squareElement, 'pieceElement:', pieceElement );
    
    // Remove the pieceElement
    pieceElement.remove();
    
    updateGameBoard();
    
} // removePiece( piece, position )


function updateGameBoard() {
    // Add p1rack to the gameBoard, unless undefined.
    if (typeof p1rack[0] !== 'undefined') { gameBoard[0][0][0] = p1rack[0] } else { gameBoard[0][0][0] = '.' };
    if (typeof p1rack[1] !== 'undefined') { gameBoard[0][0][1] = p1rack[1] } else { gameBoard[0][0][1] = '.' };
    if (typeof p1rack[2] !== 'undefined') { gameBoard[0][0][2] = p1rack[2] } else { gameBoard[0][0][2] = '.' };
    if (typeof p1rack[3] !== 'undefined') { gameBoard[0][0][3] = p1rack[3] } else { gameBoard[0][0][3] = '.' };
    if (typeof p1rack[4] !== 'undefined') { gameBoard[0][1][0] = p1rack[4] } else { gameBoard[0][1][0] = '.' };
    if (typeof p1rack[5] !== 'undefined') { gameBoard[0][1][1] = p1rack[5] } else { gameBoard[0][1][1] = '.' };
    // Add p2rack to the gameBoard, unless undefined.
    if (typeof p2rack[0] !== 'undefined') { gameBoard[0][3][10] = p2rack[0] } else { gameBoard[0][3][10] = '.' };
    if (typeof p2rack[1] !== 'undefined') { gameBoard[0][4][9]  = p2rack[1] } else { gameBoard[0][4][9] = '.' };
    if (typeof p2rack[2] !== 'undefined') { gameBoard[0][3][8]  = p2rack[2] } else { gameBoard[0][3][8] = '.' };
    if (typeof p2rack[3] !== 'undefined') { gameBoard[0][4][7]  = p2rack[3] } else { gameBoard[0][4][7] = '.' };
    if (typeof p2rack[4] !== 'undefined') { gameBoard[0][2][10] = p2rack[4] } else { gameBoard[0][2][10] = '.' };
    if (typeof p2rack[5] !== 'undefined') { gameBoard[0][3][9]  = p2rack[5] } else { gameBoard[0][3][9] = '.' };
}


function getPieceImageSource( piece ) {
    // piece is tileandtier
    
    switch ( piece ) {
        case '.': return '';
        case 'null': return '';
        case 'A': return 'assets/_A.png'; // Blank tile substitution tiles
        case 'B': return 'assets/_B.png';
        case 'C': return 'assets/_C.png';
        case 'D': return 'assets/_D.png';
        case 'E': return 'assets/_E.png';
        case 'F': return 'assets/_F.png';
        case 'G': return 'assets/_G.png';
        case 'H': return 'assets/_H.png';
        case 'I': return 'assets/_I.png';
        case 'J': return 'assets/_J.png';
        case 'K': return 'assets/_K.png';
        case 'L': return 'assets/_L.png';
        case 'M': return 'assets/_M.png';
        case 'N': return 'assets/_N.png';
        case 'O': return 'assets/_O.png';
        case 'P': return 'assets/_P.png';
        case 'Q': return 'assets/_Q.png';
        case 'R': return 'assets/_R.png';
        case 'S': return 'assets/_S.png';
        case 'T': return 'assets/_T.png';
        case 'U': return 'assets/_U.png';
        case 'V': return 'assets/_V.png';
        case 'W': return 'assets/_W.png';
        case 'X': return 'assets/_X.png';
        case 'Y': return 'assets/_Y.png';
        case 'Z': return 'assets/_Z.png';
        case 'A0': return 'assets/_A.png'; // Blank tile substitution tiles
        case 'B0': return 'assets/_B.png';
        case 'C0': return 'assets/_C.png';
        case 'D0': return 'assets/_D.png';
        case 'E0': return 'assets/_E.png';
        case 'F0': return 'assets/_F.png';
        case 'G0': return 'assets/_G.png';
        case 'H0': return 'assets/_H.png';
        case 'I0': return 'assets/_I.png';
        case 'J0': return 'assets/_J.png';
        case 'K0': return 'assets/_K.png';
        case 'L0': return 'assets/_L.png';
        case 'M0': return 'assets/_M.png';
        case 'N0': return 'assets/_N.png';
        case 'O0': return 'assets/_O.png';
        case 'P0': return 'assets/_P.png';
        case 'Q0': return 'assets/_Q.png';
        case 'R0': return 'assets/_R.png';
        case 'S0': return 'assets/_S.png';
        case 'T0': return 'assets/_T.png';
        case 'U0': return 'assets/_U.png';
        case 'V0': return 'assets/_V.png';
        case 'W0': return 'assets/_W.png';
        case 'X0': return 'assets/_X.png';
        case 'Y0': return 'assets/_Y.png';
        case 'Z0': return 'assets/_Z.png';
        case 'a0': return 'assets/A0.png'; // Level 0 letter tiles
        case 'b0': return 'assets/B0.png';
        case 'c0': return 'assets/C0.png';
        case 'd0': return 'assets/D0.png';
        case 'e0': return 'assets/E0.png';
        case 'f0': return 'assets/F0.png';
        case 'g0': return 'assets/G0.png';
        case 'h0': return 'assets/H0.png';
        case 'i0': return 'assets/I0.png';
        case 'j0': return 'assets/J0.png';
        case 'k0': return 'assets/K0.png';
        case 'l0': return 'assets/L0.png';
        case 'm0': return 'assets/M0.png';
        case 'n0': return 'assets/N0.png';
        case 'o0': return 'assets/O0.png';
        case 'p0': return 'assets/P0.png';
        case 'q0': return 'assets/Q0.png';
        case 'r0': return 'assets/R0.png';
        case 's0': return 'assets/S0.png';
        case 't0': return 'assets/T0.png';
        case 'u0': return 'assets/U0.png';
        case 'v0': return 'assets/V0.png';
        case 'w0': return 'assets/W0.png';
        case 'x0': return 'assets/X0.png';
        case 'y0': return 'assets/Y0.png';
        case 'z0': return 'assets/Z0.png';
        case ' 0': return 'assets/BLANK0.png';
        case 'a1': return 'assets/A1.png'; // Level 1 letter tiles
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
        case 'a2': return 'assets/A2.png'; // Level 2 letter tiles
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
        case 'a3': return 'assets/A3.png'; // Level 3 letter tiles
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
        case 'a4': return 'assets/A4.png'; // Level 4 letter tiles
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
        case 'a5': return 'assets/A5.png'; // Level 5 letter tiles
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
        case '^': return 'assets/pink-rose.png';
        case '^0': return 'assets/pink-rose.png';
        case '^1': return 'assets/pink-rose.png';
        case '^2': return 'assets/pink-rose.png';
    }
} // getPieceImageSource( piece )


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
                    // gameBoard[0][0][0] = p1rack[0];
                    break;
            case 1: loadRack(p1rack[k], [1,1,2]);
                    // gameBoard[0][0][1] = p1rack[1];
                    break;
            case 2: loadRack(p1rack[k], [1,1,3]);
                    // gameBoard[0][0][2] = p1rack[2];
                    break;
            case 3: loadRack(p1rack[k], [1,1,4]);
                    // gameBoard[0][0][3] = p1rack[3];
                    break;
            case 4: loadRack(p1rack[k], [1,2,1]);
                    // gameBoard[0][1][0] = p1rack[4];
                    break;
            case 5: loadRack(p1rack[k], [1,2,2]);
                    // gameBoard[0][1][1] = p1rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
        p1rack[i].piece = getPieceImageSource( p1rack[i].replace(/\d/g, '')+'0' ); // Replace tile id with the tier
    
// console.log( '' );
// console.log( 'rePopRack1():' );
// console.log( 'currPlayer:', currPlayer, 'p1rack:', p1rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
    
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
                    // gameBoard[0][3][10] = p2rack[0];
                    break;
            case 1: loadRack(p2rack[k], [1,5,10]);
                    // gameBoard[0][4][9] = p2rack[1];
                    break;
            case 2: loadRack(p2rack[k], [1,4,9]);
                    // gameBoard[0][3][8] = p2rack[2];
                    break;
            case 3: loadRack(p2rack[k], [1,5,8]);
                    // gameBoard[0][4][7] = p2rack[3];
                    break;
            case 4: loadRack(p2rack[k], [1,3,11]);
                    // gameBoard[0][2][10] = p2rack[4];
                    break;
            case 5: loadRack(p2rack[k], [1,4,10]);
                    // gameBoard[0][3][9] = p2rack[5];
                    break;
        }
        tiles.splice(j, 1); // Delete from tiles.
        p2rack[i].piece = getPieceImageSource( p2rack[i].replace(/\d/g, '')+'0' ); // Replace tile id with the tier
    
// console.log( '' );
// console.log( 'rePopRack2():' );
// console.log( 'currPlayer:', currPlayer, 'p2rack:', p2rack, 'ctr:', i, 'dot:', dotcnt, 'rnd:', j, 'index:', k, 'tiles:', tiles );
    
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


function onFlower( position ) { // true if the position [y,x] is on a flower
    let y = position[0];
    let x = position[1];
    
    if ( (y===1 && x===4) || (y===1 && x===6) || (y===3 && x===5) ) { // flowers
        return true;
    } else {
        return false;
    }
} // onFlower( position )


// console.log( 'onFlower( [1,4] ):', onFlower( [1,4] ) );
// console.log( 'onFlower( [1,5] ):', onFlower( [1,5] ) );
// console.log( 'onFlower( [1,6] ):', onFlower( [1,6] ) );
// console.log( 'onFlower( [2,4] ):', onFlower( [2,4] ) );
// console.log( 'onFlower( [2,5] ):', onFlower( [2,5] ) );
// console.log( 'onFlower( [2,6] ):', onFlower( [2,6] ) );
// console.log( 'onFlower( [3,5] ):', onFlower( [3,5] ) );


function onPerimeter( position ) { // true if the position [y,x] is on the perimeter
    // let z = position[0];
    let y = position[0];
    let x = position[1];
    
    if ( (y===1 && x===4) || (y===1 && x===5) || (y===1 && x===6) || (y===1 && x===6) || (y===2 && x===6) || (y===3 && x===5) || (y===2 && x===4) ) { // perimeter
        return true;
    } else {
        return false;
    }
} // onPerimeter( position )


// console.log( 'onPerimeter( [1,4] ):', onPerimeter( [1,4] ) );
// console.log( 'onPerimeter( [1,5] ):', onPerimeter( [1,5] ) );
// console.log( 'onPerimeter( [1,6] ):', onPerimeter( [1,6] ) );
// console.log( 'onPerimeter( [2,4] ):', onPerimeter( [2,4] ) );
// console.log( 'onPerimeter( [3,5] ):', onPerimeter( [3,5] ) );
// console.log( 'onPerimeter( [2,6] ):', onPerimeter( [2,6] ) );

// console.log( 'onPerimeter([0,1,4]):', onPerimeter([0,1,4] ) );
// console.log( 'onPerimeter([0,1,5]):', onPerimeter([0,1,5] ) );
// console.log( 'onPerimeter([0,1,6]):', onPerimeter([0,1,6] ) );
// console.log( 'onPerimeter([0,2,4]):', onPerimeter([0,2,4] ) );
// console.log( 'onPerimeter([0,3,5]):', onPerimeter([0,3,5] ) );
// console.log( 'onPerimeter([0,2,6]):', onPerimeter([0,2,6] ) );


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
    
                currHeldPiece = piece;
                const currHeldPieceStringPosition = piece.parentElement.id.split('');
    
                if (isNaN(parseInt(currHeldPieceStringPosition[3],10))) { // If the 4th digit is NaN then don't use it.
                    currHeldPieceStartingPosition = [ parseInt(currHeldPieceStringPosition[0],10)-1,
                                                     parseInt(currHeldPieceStringPosition[1],10)-1,
                                                     parseInt(currHeldPieceStringPosition[2],10)-1 ];
                } else {
                    currHeldPieceStartingPosition = [ parseInt(currHeldPieceStringPosition[0],10)-1,
                                                     parseInt(currHeldPieceStringPosition[1],10)-1, 
                                                     Number("" + parseInt(currHeldPieceStringPosition[2],10) + parseInt(currHeldPieceStringPosition[3],10))-1 ]; // Concat the 3rd and 4th digits.
                }
    
// console.warn( 'currHeldPieceStringPosition:', currHeldPieceStringPosition );
// console.warn( '[parseInt(currHeldPieceStringPosition[0],10):', parseInt(currHeldPieceStringPosition[0],10) );
// console.warn( '[parseInt(currHeldPieceStringPosition[1],10):', parseInt(currHeldPieceStringPosition[1],10) );
// console.warn( '[parseInt(currHeldPieceStringPosition[2],10):', parseInt(currHeldPieceStringPosition[2],10) );
// console.warn( '[parseInt(currHeldPieceStringPosition[3],10):', parseInt(currHeldPieceStringPosition[3],10) );
// console.warn( '[parseInt(currHeldPieceStringPosition[2],10)+parseInt(currHeldPieceStrringPosition[3],10):', Number(""+parseInt(currHeldPieceStringPosition[2],10)+parseInt(currHeldPieceStringPosition[3],10)) );
// console.warn( 'currHeldPieceStartingPosition:', currHeldPieceStartingPosition );
    
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
    
        if (currHeldPiece !== null) {
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
    
                    if (!(pieceReleasePosition[0] === currHeldPieceStartingPosition[0] && pieceReleasePosition[1] === currHeldPieceStartingPosition[1] && pieceReleasePosition[2] === currHeldPieceStartingPosition[2])) {
                        if (currPlayer === 'white') {
                            if (validateWhiteMovement(currHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece(currHeldPiece, currHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
                        if (currPlayer === 'black') {
                            if (validateBlackMovement(currHeldPieceStartingPosition, pieceReleasePosition)) {
                                movePiece(currHeldPiece, currHeldPieceStartingPosition, pieceReleasePosition);
                            }
                        }
    
// console.log( '' );
// console.log( 'setPieceHoldEvents():' );
// console.log( 'Even/odd column:', xPosition%2 );
// console.log( 'X:', (mousePositionOnBoardX - boardBorderSize) / document.getElementsByClassName('square')[0].offsetWidth*1.0 );
// console.log( 'Y:', (mousePositionOnBoardY - boardBorderSize) / document.getElementsByClassName('square')[0].offsetHeight*0.77 );
// console.log( 'currPlayer:', currPlayer, 'yPosition:', yPosition, 'xPosition:', xPosition );
    
                    }
                }
            currHeldPiece.style.position = 'static';
            currHeldPiece = null;
            currHeldPieceStartingPosition = null;
        }
        hasIntervalStarted = false;
    });
} // setPieceHoldEvents()


function movePiece( piece, startingPosition, endingPosition ) {
    
console.log( '' );
console.log( 'movePiece(', piece, ',', startingPosition, ',', endingPosition, '):' );
    
    const boardPiece = currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    
    // If the boardPiece is not empty 
    if ( boardPiece !== '.' ) {
    // If the boardPiece is not empty AND the top rung is empty
    // if ( (boardPiece !== '.') && ( currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
    
        // move the piece
        // remove the original piece from the DOM, currBoard and the rack
        removeRack( boardPiece, startingPosition );
        currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]] = '.'; // clear the startingPosition and 
    
        // remove the sourceSquare's child(piece)
        // const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        // sourceSquare.removeChild(piece);
    
        // const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        // sourceSquare.textContent = '';
        // sourceSquare.removeChild(piece);
    
        // clear the tile from the p1rack
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 0 ) { p1rack[0] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 1 ) { p1rack[1] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 2 ) { p1rack[2] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 3 ) { p1rack[3] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 0 ) { p1rack[4] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 1 ) { p1rack[5] = '.'; }
    
        // clear the tile from the p2rack
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 10 ) { p2rack[0] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 9 ) { p2rack[1] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 8 ) { p2rack[2] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 7 ) { p2rack[3] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 2 && startingPosition[2] === 10 ) { p2rack[4] = '.'; }
        if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 9 ) { p2rack[5] = '.'; }
    
        if ( !( currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes(".") ) && !( currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes("^") ) ) {
            // level 0 is not empty AND level 0 is not R, check next level
            if (!( currBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                // level 1 is not empty, check next level
                if (!( currBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                    // level 2 is not empty, check next level
                    if (!( currBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                        // level 3 is not empty, check next level
                        if (!( currBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                            // level 4 is not empty, check next level
                            if (!( currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                                // level 5 is not empty, no more levels, this needs to be prevented
    
console.warn("No more levels available.");
    
                            } else {
                                currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 5
                                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                                destinationSquare.textContent = '';
    
                                // build a new pieceElement and append it to the destinationSquare
                                const pieceElement = document.createElement('img');
                                pieceElement.classList.add('piece');
                                pieceElement.id = boardPiece;
                                pieceElement.draggable = false;
                                pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '5' );
    
                                destinationSquare.appendChild(pieceElement);
                            }
                        } else {
                            currBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 4
                            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                            destinationSquare.textContent = '';
    
                            // build a new pieceElement and append it to the destinationSquare
                            const pieceElement = document.createElement('img');
                            pieceElement.classList.add('piece');
                            pieceElement.id = boardPiece;
                            pieceElement.draggable = false;
                            pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '4' );
    
                            destinationSquare.appendChild(pieceElement);
                        }
                    } else {
                        currBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 3
                        const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                        destinationSquare.textContent = '';
    
                        // build a new pieceElement and append it to the destinationSquare
                        const pieceElement = document.createElement('img');
                        pieceElement.classList.add('piece');
                        pieceElement.id = boardPiece;
                        pieceElement.draggable = false;
                        pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '3' );
                
                        destinationSquare.appendChild(pieceElement);
                    }
                } else {
                    currBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 2
                    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                    destinationSquare.textContent = '';
    
                    // build a new pieceElement and append it to the destinationSquare
                    const pieceElement = document.createElement('img');
                    pieceElement.classList.add('piece');
                    pieceElement.id = boardPiece;
                    pieceElement.draggable = false;
                    pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '2' );
    
                    destinationSquare.appendChild(pieceElement);
                }
            } else {
                currBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 1
                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                destinationSquare.textContent = '';
    
                // build a new pieceElement and append it to the destinationSquare
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = boardPiece;
                pieceElement.draggable = false;
                pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '1' );
             
                destinationSquare.appendChild(pieceElement);
            }
        } else {
            currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 0
            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
            destinationSquare.textContent = '';
    
            destinationSquare.appendChild(piece);
        }
    }
    // push a 5 element move record to the game_record
    game_record.push( currPlayer, turn_no, piece, startingPosition, endingPosition );
    
// console.log( '' );
// console.log( 'movePiece():' );
// console.log( 'currPlayer:', currPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                                  'to endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'p1rack:', p1rack, 'p1rack.dot_count:', p1rack.filter(x => x === '.').length );
// console.log( 'p2rack:', p2rack, 'p2rack.dot_count:', p2rack.filter(x => x === '.').length );
    
} // movePiece( piece, startingPosition, endingPosition )


function undoPiece( piece, startingPosition, endingPosition ) {
    
console.log( '' );
console.log( 'undoPiece(', piece, ',', startingPosition, ',', endingPosition, '):' );
    
    const boardPiece = currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    
    // If the boardPiece is not empty 
    if ( boardPiece !== '.' ) {
    // If the boardPiece is not empty AND the top rung is empty
    // if ( (boardPiece !== '.') && ( currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
    
        // move the piece
        // remove the original piece from the DOM, currBoard and the rack

        // undoPiece() doesn't remove from the rack
        // removeRack( boardPiece, startingPosition );
    
        currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]] = '.'; // clear the startingPosition and 
    
        // remove the sourceSquare's child(piece)
        // const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        // sourceSquare.removeChild(piece);
    
        // const sourceSquare = document.getElementById(`${startingPosition[0] + 1}${startingPosition[1] + 1}${startingPosition[2] + 1}`);
        // sourceSquare.textContent = '';
        // sourceSquare.removeChild(piece);
    
        // undoPiece() doesn't remove from the rack
        // clear the tile from the p1rack
        // if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 0 ) { p1rack[0] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 1 ) { p1rack[1] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 2 ) { p1rack[2] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 3 ) { p1rack[3] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 0 ) { p1rack[4] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 1 ) { p1rack[5] = '.'; }
    
        // clear the tile from the p2rack
        // if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 10 ) { p2rack[0] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 9 ) { p2rack[1] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 8 ) { p2rack[2] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 7 ) { p2rack[3] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 2 && startingPosition[2] === 10 ) { p2rack[4] = '.'; }
        // if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 9 ) { p2rack[5] = '.'; }
    
        if ( !( currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes(".") ) && !( currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]].includes("^") ) ) {
            // level 0 is not empty AND level 0 is not R, check next level
            if (!( currBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                // level 1 is not empty, check next level
                if (!( currBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                    // level 2 is not empty, check next level
                    if (!( currBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                        // level 3 is not empty, check next level
                        if (!( currBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                            // level 4 is not empty, check next level
                            if (!( currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]].includes(".") ) ) {
                                // level 5 is not empty, no more levels, this needs to be prevented
    
console.warn("No more levels available.");
    
                            } else {
                                currBoard[endingPosition[0]+5][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 5
                                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                                destinationSquare.textContent = '';
    
                                // build a new pieceElement and append it to the destinationSquare
                                const pieceElement = document.createElement('img');
                                pieceElement.classList.add('piece');
                                pieceElement.id = boardPiece;
                                pieceElement.draggable = false;
                                pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '5' );
    
                                destinationSquare.appendChild(pieceElement);
                            }
                        } else {
                            currBoard[endingPosition[0]+4][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 4
                            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                            destinationSquare.textContent = '';
    
                            // build a new pieceElement and append it to the destinationSquare
                            const pieceElement = document.createElement('img');
                            pieceElement.classList.add('piece');
                            pieceElement.id = boardPiece;
                            pieceElement.draggable = false;
                            pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '4' );
    
                            destinationSquare.appendChild(pieceElement);
                        }
                    } else {
                        currBoard[endingPosition[0]+3][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 3
                        const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                        destinationSquare.textContent = '';
    
                        // build a new pieceElement and append it to the destinationSquare
                        const pieceElement = document.createElement('img');
                        pieceElement.classList.add('piece');
                        pieceElement.id = boardPiece;
                        pieceElement.draggable = false;
                        pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '3' );
                
                        destinationSquare.appendChild(pieceElement);
                    }
                } else {
                    currBoard[endingPosition[0]+2][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 2
                    const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                    destinationSquare.textContent = '';
    
                    // build a new pieceElement and append it to the destinationSquare
                    const pieceElement = document.createElement('img');
                    pieceElement.classList.add('piece');
                    pieceElement.id = boardPiece;
                    pieceElement.draggable = false;
                    pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '2' );
    
                    destinationSquare.appendChild(pieceElement);
                }
            } else {
                currBoard[endingPosition[0]+1][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 1
                const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
                destinationSquare.textContent = '';
    
                // build a new pieceElement and append it to the destinationSquare
                const pieceElement = document.createElement('img');
                pieceElement.classList.add('piece');
                pieceElement.id = boardPiece;
                pieceElement.draggable = false;
                pieceElement.src = getPieceImageSource( boardPiece.replace(/\d/g, '') + '1' );
             
                destinationSquare.appendChild(pieceElement);
            }
        } else {
            currBoard[endingPosition[0]][endingPosition[1]][endingPosition[2]] = boardPiece; // move the boardPiece to the endingPosition level 0
            const destinationSquare = document.getElementById(`${endingPosition[0] + 1}${endingPosition[1] + 1}${endingPosition[2] + 1}`);
            destinationSquare.textContent = '';
    
            destinationSquare.appendChild(piece);
        }
    }

    // undoPiece() doesn't record to the game_record
    // game_record.push( currPlayer, turn_no, piece, startingPosition, endingPosition );
    
// console.log( '' );
// console.log( 'undoPiece():' );
// console.log( 'currPlayer:', currPlayer, 'moves a:"', piece.id, '" from startingPosition[', startingPosition[0], ',', startingPosition[1], ',', startingPosition[2], '], ',
//                                                                  'to endingPosition[', endingPosition[0], ',', endingPosition[1], ',', endingPosition[2], ']' );
// console.log( 'p1rack:', p1rack, 'p1rack.dot_count:', p1rack.filter(x => x === '.').length );
// console.log( 'p2rack:', p2rack, 'p2rack.dot_count:', p2rack.filter(x => x === '.').length );
    
} // undoPiece( piece, startingPosition, endingPosition )


function validateWhiteMovement( startingPosition, endingPosition ) {
    const boardPiece = currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    
    switch ( boardPiece.replace(/\d/g, '') ) { // Strip the tile_id from the tile, leaving the letter
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
            return testWhiteLetter( startingPosition, endingPosition, boardPiece );
            break;
            // return testWhiteLetter( startingPosition, endingPosition, 'b' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'c' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'd' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'e' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'f' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'g' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'h' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'i' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'j' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'k' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'l' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'm' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'n' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'o' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'p' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'q' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'r' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 's' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 't' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'u' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'v' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'w' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'x' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'y' );
            // break;
            // return testWhiteLetter( startingPosition, endingPosition, 'z' );
            // break;
        case ' ':
            if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
                pickLetter( startingPosition, endingPosition );
            }
            break;
        case '^':
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
} // validateWhiteMovement( startingPosition, endingPosition )


function validateBlackMovement( startingPosition, endingPosition ) {
    const boardPiece = currBoard[startingPosition[0]][startingPosition[1]][startingPosition[2]];
    
    switch ( boardPiece.replace(/\d/g, '') ) { // Strip the tile_id from the tile, leaving the letter
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
            return testBlackLetter( startingPosition, endingPosition, boardPiece );
            break;
        case ' ':
            if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
                pickLetter( startingPosition, endingPosition );
            }
            break;
        case '^':
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
} // validateBlackMovement( startingPosition, endingPosition )


function testWhiteLetter( startingPosition, endingPosition, piece ) {
    // if moving the piece from the p1rack to the board
    if ( inRack1(startingPosition) && onBoard(endingPosition) ) {
        // if not landing on the same letter or on a bee
        if ( ( getTopLetter( endingPosition ) !== piece.replace(/\d/g, '') ) && ( getTopLetter( endingPosition ) !== 'b' ) && ( getTopLetter( endingPosition ) !== 'q' ) ) {
            return true;
        } else { // Error condition
console.warn( 'testWhiteLetter() move denied:', 'Cannot stack a letter on top of itself, or on top of a bee.' );
            return false;
        }
    }
} // testWhiteLetter( startingPosition, endingPosition, piece )


function testBlackLetter( startingPosition, endingPosition, piece ) {
    // if moving the piece from the p2rack to the board
    if ( inRack2(startingPosition) && onBoard(endingPosition) ) {
        // if not landing on the same letter or on a bee
        if ( ( getTopLetter( endingPosition ) !== piece.replace(/\d/g, '') ) && ( getTopLetter( endingPosition ) !== 'b' ) && ( getTopLetter( endingPosition ) !== 'q' ) ) {
            return true;
        } else { // Error condition
console.warn( 'testBlackLetter() move denied:', 'Cannot stack a letter on top of itself, or on top of a bee.' );
            return false;
        }
    }
} // testBlackLetter( startingPosition, endingPosition, piece )


function pickLetter( startingPosition, endingPosition ) {
    let c = startingPosition[0];
    let b = startingPosition[1];
    let a = startingPosition[2];
    
    let z = endingPosition[0];
    let y = endingPosition[1];
    let x = endingPosition[2];
    
    // Choose a letter
    var blank = prompt( 'Choose a letter (A - Z):' );
    
    // Get blank_tile
    var blank_tile = blank.toUpperCase() + blank_no;
    blank_no = blank_no + 1;
    
    let yxCoord = y+','+x; // use the yxCoords from the lookup
    let blankLev = getTopLevel( yxCoord ); // use the yxCoords from the lookup
    
    // Get blank_tileandtier
    var blank_tileandtier = blank.toUpperCase() + blankLev; // the letter_blanks are UpperCase
    
console.log( '' );
console.log( 'pickLetter( startingPosition, endingPosition ):' );
console.log( 'startingPosition:', startingPosition );
console.log( 'endingPosition:', endingPosition );
console.log( 'blankLev:', blankLev );
console.log( 'blank_tile:', blank_tile );
console.log( 'blank_tileandtier:', blank_tileandtier );
    
    // Remove the Pink Rose img if the endingPosition is on a flower
    if ( endingPosition[0] === 0 && endingPosition[1] === 1 && endingPosition[2] === 4 ) { 
        removePiece( '^0', endingPosition );
    }
    if ( endingPosition[0] === 0 && endingPosition[1] === 1 && endingPosition[2] === 6 ) { 
        removePiece( '^1', endingPosition );
    }
    if ( endingPosition[0] === 0 && endingPosition[1] === 3 && endingPosition[2] === 5 ) { 
        removePiece( '^2', endingPosition );
    }
    
    // replace the blank tile with the zero-point letter_blank at the endingPosition
    loadPiece( blank_tile, [z+1,y+1,x+1] );
    
    // put the piece in currBoard
    currBoard[z][y][x] = blank_tile;
    
    // remove the original blank tile from the DOM, currBoard and the rack
    if ( currPlayer === 'white' ) {
        if ( p1rack.indexOf( ' 0' ) > -1 ) { removeRack( ' 0', startingPosition ); }
        if ( p1rack.indexOf( ' 1' ) > -1 ) { removeRack( ' 1', startingPosition ); }
    }
    if ( currPlayer === 'white' ) {
        if ( p2rack.indexOf( ' 0' ) > -1 ) { removeRack( ' 0', startingPosition ); }
        if ( p2rack.indexOf( ' 1' ) > -1 ) { removeRack( ' 1', startingPosition ); }
    }
    
    currBoard[c][b][a] = '.';
    // clear the blank tile from the p1rack
    if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 0 ) { p1rack[0] = '.'; } 
    if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 1 ) { p1rack[1] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 2 ) { p1rack[2] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 0 && startingPosition[2] === 3 ) { p1rack[3] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 0 ) { p1rack[4] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 1 && startingPosition[2] === 1 ) { p1rack[5] = '.'; }
    // clear the blank tile from the p2rack
    if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 10 ) { p2rack[0] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 9 ) { p2rack[1] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 8 ) { p2rack[2] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 4 && startingPosition[2] === 7 ) { p2rack[3] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 2 && startingPosition[2] === 10 ) { p2rack[4] = '.'; }
    if ( startingPosition[0] === 0 && startingPosition[1] === 3 && startingPosition[2] === 9 ) { p2rack[5] = '.'; }
    
} // pickLetter( startingPosition, endingPosition )


function switchPlayer() {
    // called by the $ onclick button:
    //   calculate the score, 
    //   redraw tile(s), 
    //   update prevBoard and then switch players
    
    words.length = 0; // empty words[]
    score_words.length = 0; // empty score_words[]
    
    // calculate the score    
    calcScore();
    
console.log( '' );
console.log( 'switchPlayer():' );
    
} // switchPlayer()


function calcScore() {
    
    findWords(); // populate the score_words[] array
        
    if ( score_words.length === 0 ) {
        // player passed - update the scores and switch player
        
        if ( currPlayer === 'white' ) {
            currPlayer = 'black';

            p1score = p1score + 0;
            const p1scoreDiv = document.getElementById('p1score');
            p1scoreText = p1scoreText + 'Player 1: ' + 'PASSED' + ' = ' + p1score + '\n';
            p1scoreDiv.innerHTML = p1scoreText;
    
            console.log( p1scoreDiv.innerHTML );
    
        } else {
            currPlayer = 'white';

            p2score = p2score + 0;
            const p2scoreDiv = document.getElementById('p2score');
            p2scoreText = p2scoreText + 'Player 2: ' + 'PASSED' + ' = ' + p2score + '\n';
            p2scoreDiv.innerHTML = p2scoreText;
        
            console.log( p2scoreDiv.innerHTML );
        
        }

    } else {
        // find and score words
    
        if ( checkWords() ) {
            // there was a problem with a word, rollback the entire move
            undo_turn();
// console.warn( 'checkWords():', checkWords() );
// console.warn( 'Rollback the move' );
        } else {
            // there was no problem
            // score the words in the score_words[] array
            scoreWords(); 
                
            // backup currBoard to prevBoard
            prevBoard = JSON.parse(JSON.stringify(currBoard));
                
            // redraw tiles and switch player
            if ( currPlayer === 'white' ) {
                // redraw for the p1 rack
                rePopRack1();
                // switch player
                currPlayer = 'black';
            } else {
                // redraw for the p2 rack
                rePopRack2();
                // increment the turn_no
                turn_no++;
                // switch player
                currPlayer = 'white';
            }
        }
    }
} // calcScore()


function undo_turn() {
    
    // use game_record to undo the current turn
    
console.warn( '' );
console.warn( 'undo_turn():' );
console.warn( 'game_record:', game_record );


    for ( let i=game_record.length; i>=0; i-- ) {
        
        if ( i%5 === 4 ) { // to position
            // get the from from the to
            unFrom = game_record[i];
        }
        if ( i%5 === 3 ) { // from position
            // get the to from the from
            unTo = game_record[i];
        }
        if ( i%5 === 2 ) { // img element
            // get the img element by the unique piece id
            unPiece = document.getElementById( game_record[i].id );
    
console.log( 'unPiece:', unPiece.id, 'unFrom:', unFrom, 'unTo:', unTo ); 
        
            undoPiece( unPiece, unFrom, unTo );
        
        }
    }

    for ( let i=game_record.length; i>=0; i-- ) {
        // remove the turn from the game_record
        game_record.pop();
    }
    
} // undo_turn()


function findWords() {
    // 1st: Find the tiles played last turn by diffing prevBoard[][][] and currBoard[][][] back into prevBoard[][][]:
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                if ( !onBoard([h,i,j]) ) {
                    // If not on the board, clear the prevBoard element
                    prevBoard[h][i][j] = '.';
                }
                if ( prevBoard[h][i][j] !== currBoard[h][i][j] && onBoard([h,i,j]) ) {
                    // if different, save the difference to prevBoard
                    prevBoard[h][i][j] = currBoard[h][i][j];
                } else {
                    // if the same, clear the element in prevBoard
                    prevBoard[h][i][j] = '.';
                }
            }
        }
    } // prevBoard now contains only the tile(s) played for the last turn
    
    // 2nd: Use the prevBoard[][][] position(s) to find any new word(s) in currBoard[][][]:
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
    
                // If the position is on the board
                if ( onBoard([h,i,j]) ) {
    
                    // If its a new tile on the board, use that position to check for any words
                    if ( prevBoard[h][i][j] !== '.' ) {
    
// console.log( 'new tile position:', '[' + h + '][' + i + '][' + j + ']' );
    
                        // the score_words[] array is reset by switchPlayer()
                        score_words = wordFinder([h,i,j]); // e.g. ['it, [2, 4], UP']
    
                        // wordFinder() returns an array of unique words to score
                        // an element = the word, the word position, and the direction
                    }
                }
            }
        }
    } // score_words[] now contains the words to score
    
console.log( '' );
console.log( 'findWords()' ); 
console.log( 'score_words[]:', score_words ); 
    
} // findWords()


function checkWords() {
    //////////////////////////////////////////////////////////////////////////////
    // Validate every word in the score_words[] array                            /
    // Return 0 for success, anything else for failure.                          /
    //////////////////////////////////////////////////////////////////////////////
    for ( let index = 0; index < score_words.length; ++index ) {
        const element = score_words[index];
    
        // convert the array element into a string
        element_str = element + '';
    
        // get the word from the element string
        word_str = element_str.substring( 0, element_str.indexOf(',') ); 
    
        // get the lead yxCoord from the element string
        yx_str = element_str.substring( element_str.indexOf(',')+3, element_str.indexOf(']') ); 
    
        y = yx_str.substring(0, yx_str.indexOf(',') );
        x = yx_str.substring(yx_str.indexOf(',')+1 );
        y = Number(y); // convert to a number
        x = Number(x); // convert to a number
    
        // get the word direction from the element string
        yx_dir = element_str.substring( element_str.length - 2, element_str.length ); 
    
// console.log( 'word_str:', word_str, 'yx_str:', yx_str, 'yx_dir:', yx_dir );
    
        // check that every word is two or more characters
        if ( word_str.length < 2 ) {
            console.warn( 'Every word must be two or more characters in length.' );
            console.warn( 'Undo the last turn.' );
            return 100;
        }
    
        // check that the first word is on a perimeter flower
        if ( ( turn_no === 0 ) && ( currPlayer === 'white' ) ) {

            // for every letter position in word_str, check if its on a perimeter flower
            var periflower = 0;
            for ( var i = 0; i < word_str.length; i++ ) {

                new_str = upwd_lookup( yx_str, i ); // lookup new yxCoords, the first one remains the same
                new_ary = new_str.split(',').map(Number); // new_ary is an array of numbers

console.log( 'onFlower( ', new_ary, '):', onFlower( new_ary ) ); 
console.log( 'onPerimeter( ', new_ary, '):', onPerimeter( new_ary ) ); 

                if ( onFlower( new_ary ) && onPerimeter( new_ary ) ) {
                    periflower = 1;
                }

                // coords = upwd_lookup( yx_str, i ); // get yxCoords and convert to an array
                // coord_array = coords.split(',').map(element => { return Number(element); } );

console.log( '' );
console.log( 'checkWords():' );
// console.log( 'coords:', coords, 'coord_array:', coord_array, 'new_str:', new_str ); 
console.log( 'new_str:', new_str ); 

            }
            if ( periflower === 0 ) {
                console.warn( 'The first word must be on a perimeter flower.' );
                console.warn( 'Undo the last turn.' );
                return 200;
            }

        }
    
        // check that every tile is played in a line

        // check that an existing word is not completely over-written

    }
    return 0;
} // checkWords()


function scoreWords() {
    let fp_bonus = 0; // Flower Power word bonus
    let po_bonus = 0; // Pollination word bonus
    let st_bonus = 0; // Stacking letter bonus
    
    // Check for a Flower Power bonus
    if ( ( prevBoard[0][1][4].replace(/\d/g, '') !== '.' ) || ( prevBoard[0][1][6].replace(/\d/g, '') !== '.' ) || ( prevBoard[0][3][5].replace(/\d/g, '') !== '.' ) ) { // Someone played on a Flower
        fp_bonus = 1;
    
        // Check for a Pollination bonus
        if ( ( prevBoard[0][1][4].replace(/\d/g, '') === 'b' ) || ( prevBoard[0][1][4].replace(/\d/g, '') === 'q' ) || 
             ( prevBoard[0][1][6].replace(/\d/g, '') === 'b' ) || ( prevBoard[0][1][6].replace(/\d/g, '') === 'q' ) ||
             ( prevBoard[0][3][5].replace(/\d/g, '') === 'b' ) || ( prevBoard[0][3][5].replace(/\d/g, '') === 'q' ) ) {
            po_bonus = 1;
        }
    }
    
console.log( '' );
console.log( 'scoreWords():' );
console.log( 'score_words:', score_words ); 
    
    // score score_words[]
    var word_score = 0;
    var turn_score = 0;
    var element_str = '';
    var word_str = '';
    var curWord_str = '';
    var turn_ledger = '';
    
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
    
console.log( 'yx_str:', yx_str, 'new_str:', new_str );
console.log( 'letter:', letter, 'letterVal:', letterVal, 'letterLev:', letterLev );
    
                        // calculate the Stacking bonus for each letter
                        st_bonus = letterLev + 1;
            
                        word_score = word_score + st_bonus * letterVal;
                    }
    
                    // check for a Flower Power bonus 
                    if ( fp_bonus === 1 ) {
                        word_score = word_score * 2;
                    }
                    // check for a Pollination bonus 
                    if ( po_bonus === 1 ) {
                        word_score = word_score + 10;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str.toLowerCase() + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    // push a 4 element score record to the game_record
                    game_record.push( currPlayer, turn_no, element_str, word_score );
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
    
                        // calculate the Stacking bonus for each letter
                        st_bonus = letterLev + 1;
            
                        word_score = word_score + st_bonus * letterVal;
                    }
    
                    // check for a Flower Power bonus 
                    if ( fp_bonus === 1 ) {
                        word_score = word_score * 2;
                    }
                    // check for a Pollination bonus 
                    if ( po_bonus === 1 ) {
                        word_score = word_score + 10;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str.toLowerCase() + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    // push a 4 element score record to the game_record
                    game_record.push( currPlayer, turn_no, element_str, word_score );
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
    
                        // calculate the Stacking bonus for each letter
                        st_bonus = letterLev + 1;
            
                        word_score = word_score + st_bonus * letterVal;
                    }
    
                    // check for a Flower Power bonus 
                    if ( fp_bonus === 1 ) {
                        word_score = word_score * 2;
                    }
                    // check for a Pollination bonus 
                    if ( po_bonus === 1 ) {
                        word_score = word_score + 10;
                    }
                    // build the turn ledger and score
                    turn_ledger = turn_ledger + word_str.toLowerCase() + ' ' + word_score + ', ';
                    turn_score = turn_score + word_score;
                    // push a 4 element score record to the game_record
                    game_record.push( currPlayer, turn_no, element_str, word_score );
                    break;
    
            }
        }
        curWord_str = word_str;
    
// console.log( 'Word:', element, 'Value:', word_score );
// console.log( 'Turn_Score:', turn_score );
    
    } // for every word in score_words[]
    
console.log( 'game_record:', game_record );
    
    // turn_ledger now has the individual word scores, and
    // turn_score now has the players total for the turn
    
    // remove trailing ', ' from turn_ledger
    turn_ledger = turn_ledger.replace(/, $/, '');
    
    if (currPlayer === 'white') {
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
} // scoreWords()


function wordFinder( position ) { // position = an array of numbers
                                  // If a word is found, return a record: ['it, [2, 4], UP']
                                  // [ the word, its position, and its direction ]
    let z = position[0];
    let y = position[1];
    let x = position[2]; 
    // the [z] coordinate is unused, the source currBoard[][][] is flattened into flatBoard[][]
    
    var str = '';
    
    flattenBoard(); // flattens global currBoard[z][y][x] into the global flatBoard[y][x]
    
    if ( onBoard( position ) ) { // only process valid board positions
    
// console.log( '' );
// console.log( 'wordFinder( position ):' );
// console.log( 'position:', position );
// console.log( 'y:', y );
// console.log( 'x:', x );
    
        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Upward strings on flatBoard[][]      /
        ///////////////////////////////////////////////////////////////////////
        upwd_str0=flatBoard[1][4].replace(/\d/g, '') + flatBoard[1][5].replace(/\d/g, '');
        upwd_str1=flatBoard[2][4].replace(/\d/g, '') + flatBoard[2][5].replace(/\d/g, '') + flatBoard[1][6].replace(/\d/g, '');
        upwd_str2=flatBoard[3][5].replace(/\d/g, '') + flatBoard[2][6].replace(/\d/g, '');
    
        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Downward strings on flatBoard[][]    /
        ///////////////////////////////////////////////////////////////////////
        dnwd_str0=flatBoard[1][5].replace(/\d/g, '') + flatBoard[1][6].replace(/\d/g, '');
        dnwd_str1=flatBoard[1][4].replace(/\d/g, '') + flatBoard[2][5].replace(/\d/g, '') + flatBoard[2][6].replace(/\d/g, '');
        dnwd_str2=flatBoard[2][4].replace(/\d/g, '') + flatBoard[3][5].replace(/\d/g, '');
    
        ///////////////////////////////////////////////////////////////////////
        // build and number all possible Down strings on flatBoard[][]        /
        ///////////////////////////////////////////////////////////////////////
        down_str0=flatBoard[1][4].replace(/\d/g, '') + flatBoard[2][4].replace(/\d/g, '');
        down_str1=flatBoard[1][5].replace(/\d/g, '') + flatBoard[2][5].replace(/\d/g, '') + flatBoard[3][5].replace(/\d/g, '');
        down_str2=flatBoard[1][6].replace(/\d/g, '') + flatBoard[2][6].replace(/\d/g, '');
    
        yandx_str = '' + y + x;
// console.log( 'yandx_str:', yandx_str );
        switch ( yandx_str ) {
    
            case '14':
            check_upwd_str0();
            check_dnwd_str1();
            check_down_str0();
            break;
    
            case '15':
            check_upwd_str0();
            check_dnwd_str0();
            check_down_str1();
            break;
    
            case '16':
            check_upwd_str1();
            check_dnwd_str0();
            check_down_str2();
            break;
    
            case '24':
            check_upwd_str1();
            check_dnwd_str2();
            check_down_str0();
            break;
    
            case '25':
            check_upwd_str1();
            check_dnwd_str1();
            check_down_str1();
            break;
    
            case '26':
            check_upwd_str2();
            check_dnwd_str1();
            check_down_str2();
            break;
    
            case '35':
            check_upwd_str2();
            check_dnwd_str2();
            check_down_str1();
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
    
}; // wordFinder( position )


function flattenBoard() {
    // This function flattens the currBoard[][][] into flatBoard[][]
    // by using the highest level letter tile in currBoard
    
    // level h, row i and column j
    for (let h = 0; h < 6 ; h++) { // 6 levels
        for (let i = 0; i < 5 ; i++) { // 5 rows
            for (let j = 0; j < 11; j++) { // 11 columns
                // Iterate over every currBoard element
                if ( ( currBoard[h][i][j] !== '.' ) && ( currBoard[h][i][j] !== '^0' ) && ( currBoard[h][i][j] !== '^1' ) && ( currBoard[h][i][j] !== '^2' ) ) {
                    // flatBoard will contain the highest letter tile in currBoard
                    flatBoard[i][j] = currBoard[h][i][j];
                }
            }
        }
    }
}; // flattenBoard()


function getTopLevel( position ) {
    // Return the highest occupied level for this position, a yxCoord string 
    
    // convert string position to an array
    const myArray = position.split(',');
    let y = Number(myArray[0]);
    let x = Number(myArray[1]); // position [y,x] is the source for finding the top z level in currBoard[][][]
    
console.log( '' );
console.log( 'getTopLevel(', position, '):' );
console.log( 'x:', x, 'y:', y );
    
    // use the yxCoords to get the top level from currBoard
    for (let level = 5; level >= 0 ; level--) { // 6 levels
        // if ( ( currBoard[level][y][x] !== '.' ) || ( level === 'undefined' ) ) {
        if ( currBoard[level][y][x] !== '.' ) {
                return level;
                break;
        } 
    }
} // getTopLevel( position )


function getTopLetter( position ) { // return the letter that is on top of the current position
    let z = position[0]; // this z-coordinate is not accurate
    let y = position[1]; // use the yxCoords
    let x = position[2];
    let top_letter = '';
    
// console.log( 'In getTopLetter:' );
// console.log( 'position:', position, 'z:', z, 'y:', y, 'x:', x );
    
    // get the top letter from currBoard for yxCoord
    for (let level = 5; level >= 0 ; level--) { // 6 levels
        if ( currBoard[level][y][x] !== '.' ) {
            top_letter = currBoard[level][y][x].replace(/\d/g, '');
            break;
        }
    }
    return top_letter.toLowerCase();
} // getTopLetter( position )


function getTopTile( position ) { // return the tile that is on top of the current position
    let z = position[0]; // this z-coordinate is not accurate
    let y = position[1]; // use the yxCoords
    let x = position[2];
    let top_letter = '';
    
// console.log( 'In getTopTile:' );
// console.log( 'position:', position, 'z:', z, 'y:', y, 'x:', x );
    
    // get the top tile from currBoard for yxCoord
    for (let level = 5; level >= 0 ; level--) { // 6 levels
        if ( currBoard[level][y][x] !== '.' ) {
            top_tile = currBoard[level][y][x];
            break;
        }
    }
    return top_tile;
} // getTopTile( position )


function getLetterValue( piece ) {
    // Return the value of the given piece.
    switch (piece) {
        case ' ':
        case 'A':
        case 'B':
        case 'C':
        case 'D':
        case 'E':
        case 'F':
        case 'G':
        case 'H':
        case 'I':
        case 'J':
        case 'K':
        case 'L':
        case 'M':
        case 'N':
        case 'O':
        case 'P':
        case 'Q':
        case 'R':
        case 'S':
        case 'T':
        case 'U':
        case 'V':
        case 'W':
        case 'X':
        case 'Y':
        case 'Z':
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
} // getLetterValue( piece )


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
} // check_upwd_str0()


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
} // check_upwd_str1()


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
} // check_upwd_str2()


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
} // check_dnwd_str0()


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
} // check_dnwd_str1()


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
} // check_dnwd_str2()


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
} // check_down_str0()


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
} // check_down_str1()


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
} // check_down_str2()


/********************/
/* lookup functions */
/********************/


function upwd_lookup( position, idx ) { // string and a number, returns yx_str
    if ( idx === 0 ) return position;
    if ( idx === 1 ) {
        if ( position === '1,4' ) return '1,5'; 
        if ( position === '2,4' ) return '2,5'; 
        if ( position === '2,5' ) return '1,6'; 
        if ( position === '3,5' ) return '2,6'; 
    }
    if ( idx === 2 ) return '1,6';
} // upwd_lookup( position, idx )


function dnwd_lookup( position, idx ) { // string and a number, returns yx_str
    if ( idx === 0 ) return position;
    if ( idx === 1 ) {
        if ( position === '1,4' ) return '2,5'; 
        if ( position === '1,5' ) return '1,6'; 
        if ( position === '2,4' ) return '3,5'; 
        if ( position === '2,5' ) return '2,6'; 
    }
    if ( idx === 2 ) return '2,6';
} // dnwd_lookup( position, idx )


startGame();
setPieceHoldEvents();

