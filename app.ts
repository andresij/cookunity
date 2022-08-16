/**
 * Each Letter has a value.
 * surrounding is an Array with the values arround current letter. Each position in the array correspond to the letter position: 
 *         
 *         7 0 1
 *         6 V 2
 *         5 4 3
 * 
 * next indicates the position of the next letter in the path (from 0 to 7)
 */
 type Letter = {
    value: string;
    xpos: number;
    ypos: number;
    surrounding:  Array<string | null>;
    next: number|null;
};
type Puzzle = Array<Array<string>>

let puzz: Puzzle = [
    ['A', 'B', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['A', 'C', 'A', 'D', 'D', 'E', 'A', 'C', 'C', 'C', 'D', 'A'],
    ['A', 'C', 'C', 'D', 'A', 'E', 'A', 'D', 'A', 'D', 'A', 'A'],
    ['A', 'A', 'A', 'A', 'A', 'E', 'D', 'D', 'A', 'D', 'E', 'A'],
    ['A', 'C', 'C', 'D', 'D', 'D', 'A', 'A', 'A', 'A', 'E', 'A'],
    ['A', 'C', 'A', 'A', 'A', 'A', 'A', 'D', 'D', 'D', 'E', 'A'],
    ['A', 'D', 'D', 'D', 'E', 'E', 'A', 'C', 'A', 'A', 'A', 'A'],
    ['A', 'A', 'A', 'E', 'A', 'E', 'A', 'C', 'C', 'D', 'D', 'A'],
    ['A', 'D', 'E', 'E', 'A', 'D', 'A', 'A', 'A', 'A', 'A', 'A'],
    ['A', 'A', 'D', 'A', 'A', 'D', 'A', 'C', 'D', 'D', 'A', 'A'],
    ['A', 'D', 'D', 'D', 'A', 'D', 'C', 'C', 'A', 'D', 'E', 'B'],
    ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A']
];


class Maze {
    
    puzzle: Puzzle;
    solution: Letter[] = [];
    possibleStartings: Letter[] = [];

    startingLetter:string = 'B';
    endingLetter:string = 'B';
    sequence:string = 'CCCDDDEEEDDD';
    sequenceIndex: number = -1;

    enableDiagonal:boolean;

    constructor (puzzle:Puzzle, diagonal:boolean = false){
        this.enableDiagonal = diagonal;
        this.puzzle = puzzle;
        this.getStartingLetters();
    }

    getStartingLetters(): void {
        let letter: Letter;
        for (let x = 0; x < this.puzzle.length; x++) {
            for (let y = 0; y < this.puzzle[x].length; y++) {
                if (this.startingLetter == this.puzzle[x][y]){
                    letter = {                
                        value: this.puzzle[x][y],
                        xpos: x,
                        ypos: y,
                        surrounding: this.getSurroundingLetters (x, y),
                        next: null 
                    };
                    this.possibleStartings.push (letter);
                }
            }        
        }
    };

    // Verify if a given (x, y) letter position was already used in the solution. 
    // if it was used, returns null - else, returns the value
    getValue(x:number, y:number):string|null {
        for (let j:number = 0; j<this.solution.length; j++){
            if (this.solution[j].xpos == x && this.solution[j].ypos == y){
                return null;
            } 
        }
        return this.puzzle[x][y];
    }

    // Find surrounding chars for a given Letter 
    getSurroundingLetters(x: number, y: number): Array<string | null> {
        let r: Array<string | null> = [];
        let newx: number, newy:number ;
        //Current letter is not at top or bottom border
        if (x > 0 && x < this.puzzle.length-1) {
            //middle of the row
            if (y > 0 && y < this.puzzle[x].length - 1) {
                r[0] = this.getValue(x-1, y);
                r[1] = this.getValue(x-1, y+1);
                r[2] = this.getValue(x, y+1);
                r[3] = this.getValue(x+1, y+1);
                r[4] = this.getValue(x+1, y);
                r[5] = this.getValue(x+1, y-1);
                r[6] = this.getValue(x, y-1);
                r[7] = this.getValue(x-1, y-1);
            //left border
            } else if (y == 0) {
                r[5] = null;
                r[6] = null;
                r[7] = null;
                r[0] = this.getValue(x-1, y);
                r[1] = this.getValue(x-1, y+1);
                r[2] = this.getValue(x, y+1);
                r[3] = this.getValue(x+1, y+1);
                r[4] = this.getValue(x+1, y);
            // right border
            } else {
                r[1] = null;
                r[2] = null;
                r[3] = null;
                r[0] = this.getValue(x-1, y);            
                r[4] = this.getValue(x+1, y);
                r[5] = this.getValue(x+1, y-1);
                r[6] = this.getValue(x, y-1);
                r[7] = this.getValue(x-1, y-1);
            }
        //Current letter is at top border
        } else if (x == 0) {
            r[0] = null;
            r[1] = null;
            r[7] = null;
            //middle of the row
            if (y > 0 && y < this.puzzle[x].length - 1){
                r[2] = this.getValue(x, y+1);
                r[3] = this.getValue(x+1, y+1);
                r[4] = this.getValue(x+1, y);
                r[5] = this.getValue(x+1, y-1);
                r[6] = this.getValue(x, y-1);
            //left border
            } else if (y == 0) {
                r[5] = null;
                r[6] = null;
                r[2] = this.getValue(x, y+1);
                r[3] = this.getValue(x+1, y+1);
                r[4] = this.getValue(x+1, y);
            // right border
            } else {
                r[2] = null;
                r[3] = null;
                r[4] = this.getValue(x+1, y);
                r[5] = this.getValue(x+1, y-1);
                r[6] = this.getValue(x, y-1);
            
            }
        //Current letter is at bottom border
        } else {
            r[3] = null;
            r[4] = null;
            r[5] = null;
            //middle of the row
            if (y > 0 && y < this.puzzle[x].length - 1){
                r[0] = this.getValue(x-1, y);
                r[1] = this.getValue(x-1, y+1);
                r[2] = this.getValue(x, y+1);
                r[6] = this.getValue(x, y-1);
                r[7] = this.getValue(x-1, y-1);
            //left border
            } else if (y == 0) {
                r[6] = null;
                r[7] = null;
                r[0] = this.getValue(x-1, y);
                r[1] = this.getValue(x-1, y+1);
                r[2] = this.getValue(x, y+1);
            // right border
            } else {
                r[1] = null;
                r[2] = null;
                r[0] = this.getValue(x-1, y);
                r[6] = this.getValue(x, y-1);
                r[7] = this.getValue(x-1, y-1);
            }
        }
        //Disable diagonals
        if (this.enableDiagonal == false) {
            r[1] = null;
            r[3] = null;
            r[5] = null;
            r[7] = null;
        } 
        return r;
    }
    //Builds new letter based on current letter and "Next" index
    buildLetter (l:Letter):Letter {
        let x: number;
        let y: number;
        switch (l.next) {
            case 0:
                x = l.xpos-1;
                y = l.ypos;
                break;
            case 1:
                x = l.xpos-1;
                y = l.ypos+1;
                break;
            case 2:
                x = l.xpos;
                y = l.ypos+1;
                break;
            case 3:
                x = l.xpos+1;
                y = l.ypos+1;
                break;
            case 4:
                x = l.xpos+1;
                y = l.ypos;
                break;
            case 5:
                x = l.xpos+1;
                y = l.ypos-1;
                break;
            case 6:
                x = l.xpos;
                y = l.ypos-1;
                break;
            case 7:
                x = l.xpos-1;
                y = l.ypos-1;
                break;
            default:
                x = 0;
                y = 0;
                break;
        }
        return {
            xpos: x,
            ypos: y,
            value: this.puzzle[x][y],
            surrounding: this.getSurroundingLetters(x, y),
            next: null
        };
    }

    //verify if current letter is in contact with the desired letter and return the position in the surrounding array
    buildNextValue (l:Letter, char:string):number {    
        return l.surrounding.indexOf(char, (l.next==null)?0:l.next+1);;
    }

    // For given letter, calculates next direction.
    // first it verifies if it is surrounded by an ending char.
    // if not, it tries to find the expected character inside the surrounding array (from 0 to 7)
    // if char isn't found, it will return -1
    getNextDirection (l:Letter, char:string): number{
        let res:number;
        //Verify if there is an ending character arround 
        const solution = this.buildNextValue(l, this.endingLetter);
        if (solution > -1) {
            res = solution;
        } else {
            //already tried all the options
            if (l.next == 7) {
                res = -1;        //-1 = tried all the options in the arr and couldn't find a valid one
            } else {
                res = this.buildNextValue(l, char);
            }
        }
        return res;
    }

    //sequence next letter
    getNextLetter():string {
        this.sequenceIndex++;
        //when sequence is finish, start again
        if (this.sequenceIndex == this.sequence.length) {
            this.sequenceIndex = 0;
        }
        return this.sequence.substring (this.sequenceIndex, this.sequenceIndex+1);
    }

    //sequence previous letter
    getPreviousLetter():string {
        this.sequenceIndex--;
        //when sequence is finish, start again
        if (this.sequenceIndex < 0) {
            this.sequenceIndex = this.sequence.length - 1 
        } 
        return this.sequence.substring (this.sequenceIndex, this.sequenceIndex+1);
    }

    findPath (lastLetter:Letter):boolean {
        let nextLetter:string = this.getNextLetter();
        let resolved:boolean = false;
        let result:boolean = false;
        
        if (this.solution.length == 0) {
            lastLetter.next = this.getNextDirection (lastLetter, nextLetter);
            if (lastLetter.next > -1) {
                this.solution.push (lastLetter);
            }
        } 
        while (!resolved) {
            if (<number>lastLetter.next > -1) {
                lastLetter = this.buildLetter (lastLetter);
                if (lastLetter.value == this.endingLetter){
                    //found a solution
                    resolved = true;
                    result = true;
                    this.solution.push (lastLetter);
                } else {
                    nextLetter = this.getNextLetter();
                    lastLetter.next = this.getNextDirection (lastLetter, nextLetter);
                    if (lastLetter.next > -1) {
                        this.solution.push (lastLetter);
                    }
                }
            } else {
                // rollback
                if (this.solution.length > 0) { 
                    lastLetter = <Letter>this.solution.pop();
                    nextLetter = this.getPreviousLetter ();
                    lastLetter.next = this.getNextDirection (lastLetter, nextLetter);
                    if (lastLetter.next > -1) {
                        this.solution.push (lastLetter);
                    }
                } else {
                    // rolled bock to the starting point: no solution
                    resolved = true;
                    result = false;
                }
            }
        }
        return result;
    } 

    // returns an array of Letter with the solution or false
    run ():Letter[]|false {
        for (let j:number = 0; j < this.possibleStartings.length; j++){
            if (this.findPath (this.possibleStartings[j])){
                //console.log ("Found a solution!");
                return this.solution;
            }
        }
        return false;
    }

    // displays the Maze
    dumpMaze (): void {
        this.dump (this.puzzle);
    }

    // displays the solution
    dumpSolution (): void {
        let row:Array<string> = [];
        let matrix:Array<Array<string>> = [];
        for (let x = 0; x < this.puzzle.length; x++) {
            for (let y = 0; y < this.puzzle.length; y++) {
                row.push('.');
            }
            matrix.push(row);
            row = [];
        }

        this.solution.forEach((l:Letter) => {
            matrix[l.xpos][l.ypos] = l.value;
        })

        this.dump (matrix);
    }

    // displays a 2 dim array
    dump (arr:Puzzle): void {
        let row:string = '';
        for (let x = 0; x < arr.length; x++) {
            for (let y = 0; y < arr[x].length; y++) {
                row += arr[x][y] + ' ';
            }
            console.log (row);
            row = '';
        }

    }
}

let myMaze = new Maze (puzz);
let solution = myMaze.run();
if (solution !== false) {
    myMaze.dumpMaze();
    console.log ("Solution");
    myMaze.dumpSolution();
} else {
    console.log ("Couldn't find a solution");
}

//console.log (solution);
