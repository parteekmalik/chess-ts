import { Router } from 'express';

const router = Router();

/** Healthcheck */
router.get('/ping', (req, res) => {
  return res.status(200).json({ message: 'pong' });
});

/** Error handling for 404 */
router.use((req, res) => {
  return res.status(404).json({ message: 'Not found' });
});

export default router;
