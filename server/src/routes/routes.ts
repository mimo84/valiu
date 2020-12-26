import * as express from 'express';
import * as path from 'path';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

export default router;
