// a function to extract ngrams from a string with a minimum length option increasing the ngram size
export function ngram(
  str: string,
  min_size = 2,
  prefix_only = false
): string[] {
  const ngrams: string[] = [];

  for (let i = 0; i < str.length - min_size + 1; i++) {
    if (prefix_only) {
      ngrams.push(str.substring(0, i + min_size));
    } else {
      for (let j = i; j < str.length - min_size + 1; j++) {
        ngrams.push(str.substring(i, j + min_size));
      }
    }
  }
  return ngrams;
}
