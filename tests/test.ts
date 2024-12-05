import zlib from 'zlib';

const sentence = "Yeshua loves you, don't you love him? He is wonderful, holy and righteous and loves everyone";

// Convert the sentence to a buffer
const buffer = Buffer.from(sentence, 'utf8');

// Gzip the buffer
const gzippedBuffer = zlib.gzipSync(buffer, { level: 9 });

// Calculate the buffer size and savings
const originalSize = buffer.length;
const gzippedSize = gzippedBuffer.length;
const savings = originalSize - gzippedSize;

// Print out the buffer size and savings
console.log(`Buffer size: ${originalSize} bytes`);
console.log(`Gzipped size: ${gzippedSize} bytes`);
console.log(`Savings: ${savings} bytes`);