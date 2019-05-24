


const ALPHABET_SIZE = 26;
const MATCH_NAME = 'Boyer-Moore';

class BmStringMatcher {

    constructor() {

        console.log(`constructing an BmStringMatcher instance`);

        // all private variables
        let _pattern = null; 
        let _text = null; 
        let _patternLength = 0; 
        let _textLength = 0; 
        let _occ = [];           // occurence function

        // A border is a substring which is both proper suffix and proper prefix. 
        // For example, in string “ccacc”, “c” is a border, 
        // “cc” is a border because it appears in both end of string but “cca” is not a border.

        // Each entry _borderPositions[i] contains the starting index 
        // of border for suffix starting at index i in given pattern P.
        let _borderPositions= []; // integers

        // As a part of preprocessing, an array shift is created. 
        // Each entry shift[i] contain the distance pattern will shift if mismatch occur at position i-1. 
        // That is, the suffix of pattern starting at position i is matched and a mismatch occur at position i-1. 
        let _shift = []; 

        function bmInitOcc() {
            console.log(` -- bminitocc --`);
            let a; 
            let j;

            // init occ array
            for (a = 0; a < ALPHABET_SIZE; a++) _occ[a] = -1;
            for (j = 0; j < _patternLength; j++) {
                a = _pattern[j];
                _occ[a] = j;
            } 

            //console.log(_occ);
        }

       
        function processSuffixBorderIndexes() {
           
            let i = _patternLength;
            let j = _patternLength+1;
 
            _borderPositions[i] = j;

            while (i > 0) {

                let p_i = _pattern[i-1];
                let p_j = _pattern[j-1];

                while (j <= _patternLength && (p_i != p_j)) {
                    if (_shift[j] == 0) {
                        _shift[j] = j - i;
                    }
                    j = _borderPositions[j]; 
                }

                i--; j--;
                _borderPositions[i] = j;
            }
        }

        function processShiftIndexes() {
            console.log(` -- bmPreprocess2 -- `);
            let i;
            let j;

            j = _borderPositions[0];

             
            for (i = 0; i <= _patternLength; i++) {

                // set the border postion of first character of pattern to all indices in array shift having shift[i] = 0 
                if (_shift[i] == 0) _shift[i] = j;

                // suffix become shorter than bpos[0], use the position of next widest border as value of j 
                if (i == j) j = _borderPositions[i];
            }
        }


        function bmPreprocess() {
            console.log(' -- bmPreprocess -- ');
            bmInitOcc();
            processSuffixBorderIndexes();
            processShiftIndexes();
        }

        function setText(tt) {
            _textLength = tt.length;
            _text = tt;
        }

        function setPattern(pp) {
            _patternLength = pp.length;
            _pattern = pp;
            console.log(`_pattern set to ${_pattern}, length is: ${_patternLength}`);

            for (let i = 0; i < _patternLength; i++) {
                _borderPositions[i] = 0;
                _shift[i] = 0; // initialize all shifts to 0
            }
            bmPreprocess();
        }

     
        function bmSearch() {
            console.log(` ------------------- Now, lets search! --------------------`);

            console.log(`----- _borderPositions ---------`);
            console.log(_borderPositions);

            let i = 0;
            let j = 0;

            while (i <= _textLength - _patternLength) {
                console.log(`lets process i ${i}`);
                j = _patternLength - 1;

                // Keep reducing index j of pattern while characters of pattern and text are matching at this shift s
                while ( j >= 0 && _pattern[j] == _text[i+j]) { j--; }

                if (j < 0) {
                    // If the pattern is present at current shift, then index j will become -1 after the above loop 
                    console.log(` √ at ${i}`);
                    i += _shift[0];
                } else {
                    // pattern at [i] != pattern at [s+j] so shift the pattern  shift[j+1] times  */
                    let a = (_shift[j+1]) ? _shift[j+1] : 0;
                    let b = (_occ[_text[i+j]]) ? _occ[_text[i+j]] : 0;
                    i += Math.max(a, j - b);

                    //i += _shift[j+1]; 
                }
            }
        }

        this.search = function(tt, pp) {
            console.log(`set text: ${tt}, set pattern: ${pp}`);
            setText(tt);
            setPattern(pp);
            bmSearch();
        }
    }   
}

let a = new BmStringMatcher();
a.search('aacaaaacaa', 'aacaa');





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

let n = new StringPatternMatchingAlg();
n.KMP('aaaaa', 'aa');


*/

