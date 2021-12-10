import axios, { AxiosError, AxiosResponse } from 'axios';
import fs from 'fs';
import PQueue from 'p-queue';
import path from 'path';
import { mapResponseToMeta, IMeta } from './utils';

const MAX_TOTAL_KITTIES = 10;
const assetName = 'assets.json';
const META_HASH = 'QmRQ9mB8UDRd3adMndj5NGTD9ajbJYuSQkbdm5mVQFWVxN';

const queue = new PQueue({ concurrency: 100 });

(async () => {
  // @ts-ignore
  const assetPath = path.join(__dirname, assetName);
  const asset = JSON.parse(fs.readFileSync(assetPath, 'utf-8'));
  if (asset.length) {
    console.log('asset file already has content');
    return;
  }

  let done = false;
  const results: any[] = [];
  const axiosInstance = axios.create();    

  const uri = (i: number) => {
    return `https://ipfs.io/ipfs/${META_HASH}/${i}`;        
  }

  const fetchMeta = async (i: number) => {
    await axiosInstance.get(uri(i))
      .then((item: AxiosResponse) => {
        const parsed = mapResponseToMeta(item.data);
        fetchImage(i, parsed);
      })
      .catch(async (res: AxiosError) => {
        if (res.response?.status === 404) {
          done = true; // exit as there are no more kitties
        } else {
          await queue.add(async () => fetchMeta(i));
        }
      });
  }

  const fetchImage = async (i: number, parsed: IMeta) => {
    axiosInstance
      .get(parsed.thumbnailUri, {
        responseType: 'arraybuffer'
      })
      .then((response: AxiosResponse) => {
        parsed.thumbnail = Buffer.from(response.data, 'binary').toString('base64');
        results[i] = parsed;
      }).catch(async (err: any) => {
        await queue.add(async () => fetchMeta(i));
      });
  }

  for (let i = 0; i < MAX_TOTAL_KITTIES; i++) {                
    if (!done) {
      await queue.add(async () => fetchMeta(i));
      console.log(i);
    }
  }

  // wait for queue to finish
  await queue.onIdle();

  // wait for the last calls to be processed
  await new Promise(r => setTimeout(r, 60000));

  // ensure no null values in array
  const clean = results.filter((item) => item !== null);

  fs.writeFileSync(assetPath, JSON.stringify(clean));
})();
