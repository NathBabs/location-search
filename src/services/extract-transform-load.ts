import { ReadStream } from 'node:fs';
//import { appendFile } from "node:fs/promises";
//import {db} from '../database/connection';

import parse from 'csvtojson';
import CSVError from 'csvtojson/v2/CSVError';

import { ngram } from '../utils/ngram';
import { insert } from './create';

export function start(input: ReadStream) {
  const passed = new Set<string>();

  console.time('processing');

  const stream = input.pipe(
    parse({
      delimiter: '\t',
      alwaysSplitAtEOL: true,
      eol: '\n',
      output: 'json',
    })
  );

  let queue: any[] = [];

  const onData = async (data: any) => {
    // We've already processed it
    if (passed.has(data.id)) {
      console.log(`DUPLICATE: ${data.id}, SKIPPING`);
      return;
    }

    if (queue.length >= 1000) {
      stream.pause();

      await processQueue(queue);

      queue = [];

      stream.resume();
    }

    passed.add(data.id);

    queue.push(data);
  };

  const onError = (err: CSVError) => {
    console.log('ERROR: ', err);
  };

  const onDone = async () => {
    if (queue.length) {
      await processQueue(queue);
      queue = [];
    }

    console.log('DONE');

    console.timeEnd('processing');
  };

  stream.subscribe(onData, onError, onDone);
}

async function processQueue(queue: any[]) {
  console.log(`PROCESSING BULK OF: ${queue.length} items`);
  //const mongo_client = await client();

  const tasks = queue.map((json) => {
    //return appendFile("result.json", item.toString(), { encoding: "utf-8" });
    json.name = json.name.replace(/\s+/g, '');
    json.ascii = json.ascii.replace(/\s+/g, '');

    // create ngrams
    const name_ngrams = ngram(json.name, 3, false);
    const ascii_ngrams = ngram(json.ascii, 3, false);

    // generate ngrams with prefix only
    const name_ngrams_prefix = ngram(json.name, 3, true);
    const ascii_ngrams_prefix = ngram(json.ascii, 3, true);

    // add ngrams to data
    json.name_ngrams = name_ngrams;
    json.name_ngrams_prefix = name_ngrams_prefix;

    json.ascii_ngrams = ascii_ngrams;
    json.ascii_ngrams_prefix = ascii_ngrams_prefix;

    const dataToInsert = {
      ...json,
    };

    return dataToInsert;
  });

  await insert(tasks);

  return;
}

//start(readable);
