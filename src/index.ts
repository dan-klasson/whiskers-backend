import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import ipfs from './assets.json';
import { env } from './environment';

const PAGE_SIZE = 13;
const port = 80;
const data = ipfs as [];

const app = express();
const router = express.Router();
const allowedOrigins = [env.CORS, 'https://d372-180-178-127-232.ngrok.io', 'http://localhost:3000', 'http://localhost:3001']
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
app.use(cors({ origin: '' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.listen(port, () =>{
  console.log(`Listening on port ${port}.`)
});

router.get('/ipfs/random', (req: any, res: any) => {
  const random = Math.floor(Math.random() * data.length);
  res.send(data[random]);
});

router.get('/ipfs/:page', (req: any, res: any) => {
  const end = (Number(req.params.page) * PAGE_SIZE) + PAGE_SIZE;
  const start = end - PAGE_SIZE;
  const results = data.slice(start, end - 1);
  res.send(results);
});
