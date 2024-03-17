const murmurHash = require("murmurhash-js");

const INF = 987654321;

const createHashFunctionArray = (
  numOfHashFunctions: number,
  maxIndex: number
): ((value: number) => number)[] => {
  const hashFunctions: ((value: number) => number)[] = [];

  function createHashFunction(
    seed: number,
    maxIndex: number
  ): (value: number) => number {
    return function (value: number): number {
      // MurmurHash 결과를 양수로 변환하여 반환
      return Math.abs(murmurHash.murmur3(value.toString(), seed)) % maxIndex;
    };
  }

  for (let i = 0; i < numOfHashFunctions; i++) {
    hashFunctions.push(createHashFunction(i, maxIndex));
  }

  return hashFunctions;
};

const shingling = (text: string, k: number): string[] => {
  const textSize = text.length;
  const result: string[] = [];

  for (let i = 0; i < textSize - k; i++) {
    const shingled = text.substring(i, k);

    result.push(shingled);
  }

  return result;
};

const getAllTokens = (tokensArr: string[][]): string[] => {
  const uniqueSet = new Set();

  tokensArr.forEach((tokens) => {
    tokens.forEach((token) => {
      uniqueSet.add(token);
    });
  });

  return Array.from(uniqueSet, (token) => String(token));
};

const getMatrix = (shingles: string[][], allToken: string[]): number[][] => {
  let matrix: number[][] = Array.from(Array(allToken.length), () =>
    Array(shingles.length).fill(0)
  );
  shingles.forEach((shingle, shingleIdx) => {
    allToken.forEach((token, tokenIdx) => {
      if (shingle.includes(token)) matrix[tokenIdx][shingleIdx] = 1;
      else matrix[tokenIdx][shingleIdx] = 0;
    });
  });

  return matrix;
};

const minHashing = (inputMatrix: number[][]): number[][] => {
  const rowNum = inputMatrix.length;
  const columnNum = inputMatrix[0].length;
  const signatureCnt = 100;

  const hashFunctions: ((value: number) => number)[] = createHashFunctionArray(
    signatureCnt,
    rowNum - 1
  );

  const signatureMatrix: number[][] = Array.from(Array(signatureCnt), () =>
    Array(columnNum).fill(INF)
  );

  for (let r = 0; r < rowNum; r++) {
    for (let funcIdx = 0; funcIdx < signatureCnt; funcIdx++) {
      for (let c = 0; c < columnNum; c++) {
        const newR = hashFunctions[funcIdx](r);

        if (inputMatrix[r][c]) {
          signatureMatrix[funcIdx][c] = Math.min(
            signatureMatrix[funcIdx][c],
            newR
          );
        }
      }
    }
  }

  return signatureMatrix;
};

const main = () => {
  const text01 = "hello world? Its mingwan";
  const text02 = "hello world! Its youngsu";
  const k = 4;

  const shingle1: string[] = shingling(text01, k);
  const shingle2: string[] = shingling(text02, k);

  const shingleArr: string[][] = [shingle1, shingle2];
  const allToken: string[] = getAllTokens(shingleArr);

  const inputMatrix: number[][] = getMatrix(shingleArr, allToken);
  const minHashed = minHashing(inputMatrix);

  console.log(minHashed);

  let cnt = 0;

  for (let r = 0; r < 100; r++) {
    if (minHashed[r][0] == minHashed[r][1]) cnt++;
  }

  console.log(cnt, "/", 100);
};

main();
