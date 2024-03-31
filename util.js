"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const murmurHash = require("murmurhash-js");
const INF = 987654321;
const createHashFunctionArray = (numOfHashFunctions, maxIndex) => {
    const hashFunctions = [];
    function createHashFunction(seed, maxIndex) {
        return function (value) {
            // MurmurHash 결과를 양수로 변환하여 반환
            return Math.abs(murmurHash.murmur3(value.toString(), seed)) % maxIndex;
        };
    }
    for (let i = 0; i < numOfHashFunctions; i++) {
        hashFunctions.push(createHashFunction(i, maxIndex));
    }
    return hashFunctions;
};
const shingling = (text, k) => {
    const textSize = text.length;
    const result = [];
    for (let i = 0; i < textSize - k; i++) {
        const shingled = text.substring(i, i + k);
        result.push(shingled);
    }
    return result;
};
const getAllTokens = (tokensArr) => {
    const uniqueSet = new Set();
    tokensArr.forEach((tokens) => {
        tokens.forEach((token) => {
            uniqueSet.add(token);
        });
    });
    return Array.from(uniqueSet, (token) => String(token));
};
const getMatrix = (shingles, allToken) => {
    let matrix = Array.from(Array(allToken.length), () => Array(shingles.length).fill(0));
    shingles.forEach((shingle, shingleIdx) => {
        allToken.forEach((token, tokenIdx) => {
            if (shingle.includes(token))
                matrix[tokenIdx][shingleIdx] = 1;
            else
                matrix[tokenIdx][shingleIdx] = 0;
        });
    });
    return matrix;
};
const minHashing = (inputMatrix, signatureCnt) => {
    const rowNum = inputMatrix.length;
    const columnNum = inputMatrix[0].length;
    const hashFunctions = createHashFunctionArray(signatureCnt, rowNum - 1);
    const signatureMatrix = Array.from(Array(signatureCnt), () => Array(columnNum).fill(INF));
    for (let r = 0; r < rowNum; r++) {
        for (let funcIdx = 0; funcIdx < signatureCnt; funcIdx++) {
            for (let c = 0; c < columnNum; c++) {
                const newR = hashFunctions[funcIdx](r);
                if (inputMatrix[r][c]) {
                    signatureMatrix[funcIdx][c] = Math.min(signatureMatrix[funcIdx][c], newR);
                }
            }
        }
    }
    return signatureMatrix;
};
const main = (text01, text02, k, signatureCnt) => {
    const shingle1 = shingling(text01, k);
    const shingle2 = shingling(text02, k);
    const shingleArr = [shingle1, shingle2];
    const allToken = getAllTokens(shingleArr);
    const inputMatrix = getMatrix(shingleArr, allToken);
    const minHashed = minHashing(inputMatrix, signatureCnt);
    let cnt = 0;
    for (let r = 0; r < signatureCnt; r++) {
        if (minHashed[r][0] == minHashed[r][1])
            cnt++;
    }
    return {
        getFistShingle() {
            return shingle1;
        },
        getSecondShingle() {
            return shingle2;
        },
        getAllTokens() {
            return allToken;
        },
        getInputMatrix() {
            return inputMatrix;
        },
        getMinHashed() {
            return minHashed;
        },
        getSimilarity() {
            return cnt / signatureCnt;
        },
    };
};
exports.main = main;
console.log((0, exports.main)("gdflkgnemnterlkhdfngm,dsfngernlgndfsgherierlkgndsfjkgelrwktmergbsldkfjgblertheri;lgnel;fbndsjfherlknerkjgne;roi", "dfksjgrngerndfk;lgdfg,.df,smn;eronglkdfnbdfnoiergmdfnb;dshdsrgnerlkndfoibdflbndsoigherlkgndfsl;nbisfdogdflknd,.", 8, 1000).getInputMatrix());
