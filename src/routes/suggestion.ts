import express from 'express';

const router = express.Router();

import { getSuggestionsController } from '../controller/suggestion.controller';

router.route('/api/suggestion').get(getSuggestionsController);

export default router;
