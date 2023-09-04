// compress
// the algorithm for compression is as follows
// 1. do a sliding window of 1,2,3, and 4 characters and find how often they appear in the data
// 2. if a value shows up more than once, then it should be stored in main dict for compression
// 2. do some math so that the most common 50% of characters are represented by n bits, and the rest are represented by m bits.
// use for loops for performance
// 
class Dictionary {
    occurences = new Map<string, number>();
    parse(data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = i; j > 0 && j > i - 4; j--) {
                var str = data.substring(j, i);
                this.occurences.set(str, (this.occurences.get(str) ?? 0) + 1);
            }
        }
    }
    replace(data) {
        let currentId = 1;
        let dict = new Map<string, number>();
        let compressed: number[] = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = Math.min(i + 4, data.length); j >= i; j--) {
                var str = data.substring(i, j);
                let occurences = this.occurences.get(str) as number;
                if (occurences > 1 || str.length == 1) {
                    if (!dict.has(str)) {
                        dict.set(str, currentId++);
                    }
                    compressed.push(dict.get(str) as number);
                    i += str.length - 1;
                    break;
                }
            }
        }
        return { compressed, dict };
    }
    convertToBinary(data: number[], dict: Map<string,number>) {
        // sort this.occurrences by count, multiplying by string length
        let sorted = Array.from(this.occurences.entries()).sort((a, b) => (b[1] * b[0].length) - (a[1] * a[0].length));
        // get top 50% by number of occurences.  To do this, we need to get the total number of occurences
        let total = sorted.reduce((a, b) => a + b[1], 0);
        let sum = 0;
        for (var i = 0; i < sorted.length; i++) {
            sum += sorted[i][1];
            if (sum > total / 2) {
                break;
            }
        }
        let top50 = sorted.slice(0, i);
        let bottom50 = sorted.slice(i);

        // now figure out the number of bits required to store the top 50% and bottom 50%
        let top50bits = Math.ceil(Math.log2(top50.length));
        let bottom50bits = Math.ceil(Math.log2(bottom50.length));

        // now store the data in binary. First bit is 0 if top 50, 1 if bottom 50
        let binary: number[] = [];
        for (var i = 0; i < data.length; i++) {
            let val = data[i];
            if (val < top50.length) {
                binary.push(0);
                binary.push(val.toString(2).padStart(top50bits, "0").split(""));
            } else {
                binary.push(1);
                binary.push((val - top50.length).toString(2).padStart(bottom50bits, "0").split(""));
            }
        }
        // get simple array of sorted
        let sortedKey = sorted.map(x => x[0]);
        return { binary, sortedKey, top50bits, bottom50bits };
    }
    decompress(data, dict) {
        let decompressed = "";
        for (var i = 0; i < data.length; i++) {
            decompressed += dict.get(data[i]);
        }
        return decompressed;
    }
}

export async function compress(data) {
    let sets = new Set([new Dictionary(1), new Dictionary(2), new Dictionary(3), new Dictionary(4)]);
}


export async function decompress(data) {

}

let compressed = compress("hello Yeshua loves you.");
let decompressed = decompress(compressed);
console.log(decompressed);
