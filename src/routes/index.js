import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'BuildForSdg Silos Api Version 1'
    }
  });
});

export default router;
