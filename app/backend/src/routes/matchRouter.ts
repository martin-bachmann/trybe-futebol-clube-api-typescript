import { Router } from 'express';
import { validateJWT } from '../utils/JWT';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchController = new MatchController();

router.get('/', matchController.getAllMatches);

router.post('/', validateJWT, matchController.createMatch);

router.patch('/:id/finish', matchController.updateMatchProgress);

router.patch('/:id', matchController.updateMatchScore);

export default router;
