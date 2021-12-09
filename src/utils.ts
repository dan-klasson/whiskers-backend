import moment from 'moment';
import { Moment } from 'moment';

export interface IMeta {
  identifier: string;
  symbol: string;
  name: string;
  uri: string;
  description: string;
  date: Moment;
  minter: string;
  thumbnail: string;
  thumbnailUri: string;
  externalUri: string;
  backgroundColor: string;
}

export const parseIpfsUri = (uri: string) => {
  const cId = uri.split('/').length > 2 ? uri.split('/')[2] : '';
  const index = uri.split('/').length > 3 ? uri.split('/')[3] : '';
  const baseUri = 'https://ipfs.io/ipfs/';
  return `${baseUri}${cId}/${index}/`;
};

export const mapResponseToMeta = (data: any): IMeta => {
  const meta: IMeta = {
    identifier: data.identifier,
    name: data.name,
    symbol: data.symbol,
    description: data.description,
    backgroundColor: data.backgroundColor,
    minter: data.minter,
    date: moment(data.date),
    externalUri: data.externalUri,
    thumbnail: '',
    thumbnailUri: parseIpfsUri(data.thumbnailUri),
    uri: parseIpfsUri(data.uri),
  };
  return meta;
};