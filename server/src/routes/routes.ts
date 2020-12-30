import * as express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ response: 'I should not be accessed directly' }).status(200);
});

export default router;
