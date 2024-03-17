var murmurHash = require("murmurhash-js");
var INF = 987654321;
var createHashFunctionArray = function (numOfHashFunctions, maxIndex) {
    var hashFunctions = [];
    function createHashFunction(seed, maxIndex) {
        return function (value) {
            // MurmurHash 결과를 양수로 변환하여 반환
            return Math.abs(murmurHash.murmur3(value.toString(), seed)) % maxIndex;
        };
    }
    for (var i = 0; i < numOfHashFunctions; i++) {
        hashFunctions.push(createHashFunction(i, maxIndex));
    }
    return hashFunctions;
};
var shingling = function (text, k) {
    var textSize = text.length;
    var result = [];
    for (var i = 0; i < textSize - k; i++) {
        var shingled = text.substring(i, k);
        result.push(shingled);
    }
    return result;
};
var getAllTokens = function (tokensArr) {
    var uniqueSet = new Set();
    tokensArr.forEach(function (tokens) {
        tokens.forEach(function (token) {
            uniqueSet.add(token);
        });
    });
    return Array.from(uniqueSet, function (token) { return String(token); });
};
var getMatrix = function (shingles, allToken) {
    var matrix = Array.from(Array(allToken.length), function () {
        return Array(shingles.length).fill(0);
    });
    shingles.forEach(function (shingle, shingleIdx) {
        allToken.forEach(function (token, tokenIdx) {
            if (shingle.includes(token))
                matrix[tokenIdx][shingleIdx] = 1;
            else
                matrix[tokenIdx][shingleIdx] = 0;
        });
    });
    return matrix;
};
var minHashing = function (inputMatrix) {
    var rowNum = inputMatrix.length;
    var columnNum = inputMatrix[0].length;
    var signatureCnt = 100;
    var hashFunctions = createHashFunctionArray(signatureCnt, rowNum - 1);
    var signatureMatrix = Array.from(Array(signatureCnt), function () {
        return Array(columnNum).fill(INF);
    });
    for (var r = 0; r < rowNum; r++) {
        for (var funcIdx = 0; funcIdx < signatureCnt; funcIdx++) {
            for (var c = 0; c < columnNum; c++) {
                var newR = hashFunctions[funcIdx](r);
                if (inputMatrix[r][c]) {
                    signatureMatrix[funcIdx][c] = Math.min(signatureMatrix[funcIdx][c], newR);
                }
            }
        }
    }
    return signatureMatrix;
};
var main = function () {
    var text01 = "hello world? Its mingwan";
    var text02 = "hello world! Its youngsu";
    var k = 4;
    var shingle1 = shingling(text01, k);
    var shingle2 = shingling(text02, k);
    var shingleArr = [shingle1, shingle2];
    var allToken = getAllTokens(shingleArr);
    var inputMatrix = getMatrix(shingleArr, allToken);
    var minHashed = minHashing(inputMatrix);
    console.log(minHashed);
    var cnt = 0;
    for (var r = 0; r < 100; r++) {
        if (minHashed[r][0] == minHashed[r][1])
            cnt++;
    }
    console.log(cnt, "/", 100);
};
main();
