


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



