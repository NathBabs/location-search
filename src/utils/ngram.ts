// create a function to extract ngrams from a string with a minimum length option increasing the ngram size
export function ngram(str: string, min_size: number, prefix_only: boolean): string[] { 
    let ngrams: string[] = [];

    for (let i = 0; i < str.length - min_size + 1; i++) { 
        if (prefix_only) {
            ngrams.push(str.substring(0, i + min_size));
        }
        else { 
            for (let j = i; j < str.length - min_size + 1; j++) {
                ngrams.push(str.substring(i, j + min_size));
            }
        }

    }
    return ngrams;
}

console.log(ngram('Sidharth', 2, false));

function makeNgrams(word, minSize = 2, prefixOnly = false) {
  const length = word.length;
  const result = [];

  const sizeRange = [minSize, Math.max(length, minSize) + 1];

  if (prefixOnly) {
    for (let i = sizeRange[0]; i < sizeRange[1]; i++) {
      result.push(word.slice(0, i));
    }
    return result;
  }

  for (let i = sizeRange[0]; i < sizeRange[1]; i++) {
    const range = [0, Math.max(0, length - i) + 1];

    for (let j = range[0]; j < range[1]; j++) {
      result.push(word.slice(j, j + i ));
    }
  }

  return result
}

console.log(makeNgrams('Sidharth', 2, false));