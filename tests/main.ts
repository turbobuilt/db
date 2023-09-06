// compress
// the algorithm for compression is as follows
// 1. do a sliding window of 1,2,3, and 4 characters and find how often they appear in the data
// 2. if a value shows up more than once, then it should be stored in main dict for compression
// 2. do some math so that the most common 50% of characters are represented by n bits, and the rest are represented by m bits.
// use for loops for performance
// 
class Dictionary {
    static parse(data) {
        let occurences = new Map<string, number>();
        for (var i = 0; i < data.length; i++) {
            for (var j = i; j > 0 && j > i - 4; j--) {
                var str = data.substring(j, i);
                occurences.set(str, (occurences.get(str) ?? 0) + 1);
            }
        }
        return occurences;
    }
    static replace(data, occurences: Map<string, number>) {
        let currentId = 1;
        let dict = new Map<string, number>();
        let compressed: number[] = [];
        let strthing = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = Math.min(i + 4, data.length); j >= i; j--) {
                var str = data.substring(i, j);
                let numOccurrences = occurences.get(str) as number;
                if (numOccurrences > 1 || str.length == 1) {
                    if (!dict.has(str)) {
                        dict.set(str, currentId++);
                    }
                    compressed.push(dict.get(str) as number);
                    strthing.push(str);
                    i += str.length - 1;
                    break;
                }
            }
        }
        return { compressed, dict };
    }
    static convertToBinary(data: number[], dict: Map<string, number>) {
        let occurencesInNew = new Map<number, number>();
        for (var i = 0; i < data.length; i++) {
            let val = data[i];
            occurencesInNew.set(val, (occurencesInNew.get(val) ?? 0) + 1);
        }
        let inverseDict = new Map<number, string>();
        for (let [key, value] of dict.entries()) {
            inverseDict.set(value, key);
        }
        // sort by frequency * number of chars
        let sortedResults = Array.from(occurencesInNew.entries()).sort((a, b) => {
            let aStr = inverseDict.get(a[0]) as string;
            let bStr = inverseDict.get(b[0]) as string;
            return (bStr.length * b[1]) - (aStr.length * a[1]);
        });
        // get top 50% by number of occurences.  To do this, we need to get the total number of occurences
        let total = 0;
        for (var i = 0; i < sortedResults.length; i++) {
            total += sortedResults[i][1];
        }
        let sum = 0;
        for (var i = 0; i < sortedResults.length; i++) {
            sum += sortedResults[i][1];
            if (sum > total / 2) {
                break;
            }
        }
        // make i a power of 2 rounding down, except minimum is 1
        i = Math.max(1, Math.pow(2, Math.floor(Math.log2(i))));
        let top50 = sortedResults.slice(0, i).map(item => item[0])
        let bottom50 = sortedResults.slice(i).map(item => item[0])

        // let sorted = sortedResults.map(item => item[0]);
        // console.log("sorted", sorted);

        // now figure out the number of bits required to store the top 50% and bottom 50%
        let top50bits = Math.ceil(Math.log2(top50.length));
        let bottom50bits = Math.ceil(Math.log2(bottom50.length));

        // now store the data in binary. First bit is 0 if top 50, 1 if bottom 50
        let binary: number[] = [];
        for (var i = 0; i < data.length; i++) {
            if (top50.includes(data[i])) {
                let val = top50.indexOf(data[i]);
                let b = toBinary(val, top50bits)
                binary.push(0);
                binary.push(...b);
            } else {
                let val = bottom50.indexOf(data[i]);
                let b = toBinary(val, bottom50bits)
                binary.push(1);
                binary.push(...b);
            }
        }
        // get simple array of sorted
        let sortedKey = top50.concat(bottom50).map(item => inverseDict.get(item) as string);
        return { binary, sortedKey, top50bits, bottom50bits };
    }
    static decompress(binary, sortedKey, top50bits, bottom50bits) {
        let data: number[] = [];
        let bottomOffset = Math.pow(2, top50bits);
        for (var i = 0; i < binary.length; i++) {
            let bit = binary[i];
            let bits = bit == 0 ? top50bits : bottom50bits;
            let binaryVal = binary.slice(i + 1, i + 1 + bits).join("");
            let val = parseInt(binaryVal, 2);
            if (bit == 0) {
                data.push(sortedKey[val]);
            } else {
                data.push(sortedKey[val + bottomOffset]);
            }
            i += bits;
        }
        return data.join("");
    }
    static compress(str) {
        let occurences = this.parse(str);
        let { compressed, dict } = this.replace(str, occurences);
        let { binary, sortedKey, top50bits, bottom50bits } = this.convertToBinary(compressed, dict);
        return { binary, sortedKey, top50bits, bottom50bits };
    }
}

export function toBinary(num, bits) {
    return num.toString(2).padStart(bits, "0").split("").map(x => parseInt(x));
}



let { binary, sortedKey, top50bits, bottom50bits } = Dictionary.compress("hello Yeshua loves you.");
console.log(binary, sortedKey, top50bits, bottom50bits);
let decompressed = Dictionary.decompress(binary, sortedKey, top50bits, bottom50bits);
console.log(decompressed);
