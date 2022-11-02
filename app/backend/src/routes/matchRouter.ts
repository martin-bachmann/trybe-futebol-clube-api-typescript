import { Router } from 'express';
import { validateJWT } from '../utils/JWT';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchController = new MatchController();

router.get('/', matchController.getAllMatches);

router.post('/', validateJWT, matchController.createMatch);

export default router;
