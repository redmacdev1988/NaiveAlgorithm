
/*
class StringPatternMatchingAlg {

    constructor() {

    }

    // What is the best case?
    // The best case occurs when the first character of the pattern is not present in text at all.

    // txt[] = "AABCCAADDEE"; 
    // pat[] = "FAA";
    // The number of comparisons in best case is O(n).


    // What is the worst case ?
    // The worst case of Naive Pattern Searching occurs in following scenarios.
    // 1) When all characters of the text and pattern are same.

    // txt[] = "AAAAAAAAAAAAAAAAAA"; 
    // pat[] = "AAAAA";

    // 2) Worst case also occurs when only the last character is different.

    // txt[] = "AAAAAAAAAAAAAAAAAB"; 
    // pat[] = "AAAAB";

    naiveSearch(text, pattern) {

        console.log(`\n\nDoes pattern '${pattern}' exist in ${text} ?`);

        let patternLength = pattern.length;
        let textLength = text.length;

        for (let textSubstrIndex = 0; textSubstrIndex <= textLength - patternLength; textSubstrIndex++) {

            let patternChIndex;
            for (patternChIndex = 0; patternChIndex < patternLength; patternChIndex++) {
                
                let textSubstrCh = text[textSubstrIndex+patternChIndex];
                let patternCh = pattern[patternChIndex];

                if (patternCh != textSubstrCh) {
                    console.log(`ø Pattern does not match text substr at index ${textSubstrIndex}. The mismatch happened at index ${patternChIndex} of the pattern.`);
                    break;
                }
            }

            if (patternChIndex === patternLength) {
                console.log(`Pattern found at index ${textSubstrIndex}`);
            }

        }
    }


    // The basic idea behind KMP’s algorithm is: whenever we detect a mismatch (after some matches), 
    // we already know some of the characters in the text of the next window. 
    // We take advantage of this information to avoid matching the characters that we know will anyway match. 

    // let's take a look at an example:
    // txt = "AAAAABAAABA" 
    // pat = "AAAA"

    // We compare first window of txt with pat
    // txt = "AAAAABAAABA" 
    // pat = "AAAA"  [Initial position]
    // We find a match. This is same as Naive String Matching.

    // In the next step, we compare next window of txt with pat.
    // txt = "AAAA[A]BAAABA" 
    // pat =  "AAA[A]" [Pattern shifted one position]

    // This is where KMP does optimization over Naive. In this 
    // second window, we only compare fourth A of pattern
    // with fourth character of current window of text to decide 
    // whether current window matches or not. Since we know 
    // first three characters will anyway match, we skipped 
    // matching first three characters. 

    // An important question arises from the above explanation, 
    // how to know how many characters to be skipped. To know this, 
    // we pre-process pattern and prepare an integer array 
    // lps[] that tells us the count of characters to be skipped. 

    KMP(text, pattern) {

        let patternLength = pattern.length; 
        let textLength = text.length; 
      
        // create lps[] that will hold the longest prefix suffix 
        // values for pattern 
        let lps = [patternLength];
      
        // Preprocess the pattern (calculate lps[] array) 
        lps = this.kmp_LPS(pattern, patternLength, lps); 

        let i = 0; // index for txt[] 
        let j = 0; // index for pat[] 

        while (i < textLength) { 
            if (pattern[j] == text[i]) {j++; i++;} 
            if (j == patternLength) { 
                console.log(`Found pattern at index ${i - j}`); 
                j = lps[j - 1]; 
            } else if (i < textLength && pattern[j] != text[i]) { 
                // Do not match lps[0..lps[j-1]] characters, 
                // they will match anyway 
                if (j != 0) 
                    j = lps[j - 1]; 
                else 
                    i = i + 1; 
            } 
        }
    }


    kmp_LPS(pattern, patternLength, lps) {
        let j = 0; let i = 1; 
        lps[0] = 0; // lps[0] is always 0 
        while (i < patternLength) { 
            let iPatternCh = pattern[i];
            let jPatternCh = pattern[j];
            if (iPatternCh == jPatternCh) { 
                j++;
                lps[i] = j; 
                i++; 
            } else {
                if (j!= 0) { j = lps[j - 1]; 
                } else {
                    lps[i] = j; 
                    i++;
                }
            }
        }
        console.log(lps);
        return lps;
    }
}

//let n = new StringPatternMatchingAlg();
//n.KMP('aaaaa', 'aa');


console.log(`------ es5 way ------`);

let add = function(x) {
    // currying to another function
    return function(y) {
        // x is accessed in the inner function via closure
        return x + y;
    }
}

let sixPlus = add(6);

console.log(sixPlus(5));
console.log(sixPlus(8));
console.log(sixPlus(4));

console.log(add(5)(4));
console.log(add(8)(8));


console.log(`------ es6 way ------`);

let add2 = x => (y) => x + y;

let eightPlus = add2(8);
console.log(eightPlus(8));
console.log(eightPlus(10));
console.log(eightPlus(1));

console.log(add2(4)(6));
console.log(add2(1)(1));
console.log(add2(0)(0));


*/

const MAXCHAR = 256;

function BadHeuristic(newPattern, newText) {

    this.pattern = (newPattern) ? newPattern : null;
    this.patternLength = (this.pattern) ? this.pattern.length : 0;

    this.text = (newText) ? newText : null;
    this.textLength = (this.text) ? this.text.length : 0;

    this.arrBadChar = [];

    this.display = function() {
        console.log(`--- (BadHeuristic) display info---`);
        if (this.pattern) {
            console.log(`pattern: ${this.pattern}, with length: ${this.patternLength}`);
        } else {
            console.log('please assign valid pattern');
        }

        if (this.text) {
            console.log(`text: ${this.text}, with length: ${this.textLength}`);
        } else {
            console.log('please assign valid text');
        }
        console.log(`----------------------------------`);
    }
}

BadHeuristic.prototype.searchPattern  = function() {

    this.badCharacterHeuristic();
    let shift = 0;

    while (shift <= (this.textLength - this.patternLength)) {

        let j = this.patternLength - 1;

        // we calculate for a full match.
        while( j >= 0 && this.pattern[j] == text[shift + j]) {
            j--;
        }

        // if there is a full pattern match, j will be 0
        // if there is a mismatch, j will be > 0

        if(j < 0) { // Match

            console.log(`√ match found at ${shift}`);

            // are we still within the confinement of the array?
            if ((shift + this.patternLength) < this.textLength) {
                
                //shift += patLen - badCharacter[mainString[shift + patLen]];
                let indexOfChar = shift + this.patternLength;
                let char = this.text[indexOfChar];
                let asciiOfChar = char.charCodeAt(0);
                shift += this.patternLength - this.arrBadChar[asciiOfChar];
            } else {
                shift += 1; // going forward, it will be evaluated in the beginning of the while
            }


        } else { // pattern mismatch

            // for index of character over to the char after the mismatch. 
            let indexOfChar = shift + j;

            // then we get the character of that index
            let char = this.text[indexOfChar];

            // getting the ascii of that character, we look at the the value of that index ascii
            let asciiOfChar = char.charCodeAt(0);

            // in a 3 letter pattern, we may have 0, 1, or 2. 
            // in the end, we shift according to the max
            shift += Math.max(1, j - this.arrBadChar[asciiOfChar]);
        }
    }
}


// in the badChar array, the index represent the ascii
// 1) for each ascii, let's initialize to all -1
// 2) for each letter in the pattern, turn that letter into ascii
// then using the ascii as an index, let's assign it to the index of the pattern where this ascii is. 

BadHeuristic.prototype.badCharacterHeuristic = function() {
    for (let i = 0; i < MAXCHAR; i++) {
        this.arrBadChar[i] = -1;
    }

    for (let j = 0; j < this.patternLength; j++) {
        let letter = this.pattern[j];
        let ascii = letter.charCodeAt(0);
        this.arrBadChar[ascii] = j;
        console.log(`at index ${ascii}, we assign it ${j}`);
    }

    console.log(this.arrBadChar);
}


let bad = new BadHeuristic('dou', 'hadou ryu ken dragon paunch');
bad.display();
bad.badCharacterHeuristic();
bad.searchPattern();


