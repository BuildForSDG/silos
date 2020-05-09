import express from 'express';

const router = express.Router();


/**
 * @api {get} /api/v1 Api Landing Route
 * @apiName Landing
 * @apiGroup Api
 *
 *
 * @apiSuccess {String} status Status of the request.
 * @apiSuccess {Object} body  Body of the response.
 */

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    data: {
      message: 'BuildForSdg Silos Api'
    }
  });
});

export default router;
