import fs from 'fs';
import client from '../database/connection';
import csvtojson from 'csvtojson';
import { insert } from './create';
import { ngram } from '../utils/ngram';
import log from '../utils/logger';
// load file
const file = require.resolve('../../cities_canada-usa.tsv')

// filepath is the path to the csv file
export async function etl(filepath: string) {
    // create readstream from the csv file
    //const readStream = fs.createReadStream(filepath);
    // convert the csv file to json
    //const json = await csvtojson().fromStream(readStream);
    // pipe stream from cstojson to ngram and then insert in to database
    const csvStream = csvtojson({
        delimiter: '\t',
        noheader: false,
        trim: true,
        ignoreEmpty: false
    });

    csvStream
        .fromFile(filepath)
        .on('data', async (data) => {
            //log.info(`Inserting ${JSON.stringify(JSON.parse(data))}`);
            // parse data to json
            const json = JSON.parse(data);
            // strip whitespaces from name and ascii using regex
            json.name = json.name.replace(/\s+/g, '');
            json.ascii = json.ascii.replace(/\s+/g, '');

            // create ngrams
            const name_ngrams = ngram(json.name, 3, false);
            const ascii_ngrams = ngram(json.ascii, 3, false);

            // generate ngrams with prefix only
            const name_ngrams_prefix = ngram(json.name, 3, true);
            const ascii_ngrams_prefix = ngram(json.ascii, 3, true);

            //console.log(name_ngrams);
            //console.log(ascii_ngrams);
            //throw new Error('stop');

            //log.info(`Inserting ${JSON.stringify(name_ngrams)}`);

            // add ngrams to data
            json.name_ngrams = name_ngrams;
            json.name_ngrams_prefix = name_ngrams_prefix;

            json.ascii_ngrams = ascii_ngrams;
            json.ascii_ngrams_prefix = ascii_ngrams_prefix;

            const dataToInsert = {
                ...json
            }

            console.log(dataToInsert);

            //await insert(client, dataToInsert);
        }).on('done', () => {
            log.info('CSV to JSON conversion finished');
        }).on('error', (err) => {
            log.error(err);
            log.error('Error while converting CSV to JSON');
        });
}

etl(file);

/*     const data = await csvtojson().fromFile(filepath);
const ngrams = data.map((item: any) => { 
    return ngram(item.name, 2, false);
}).flat();
await insert(client, ngrams); */