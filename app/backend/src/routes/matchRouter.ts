import { Router } from 'express';
import MatchController from '../controllers/MatchController';

const router = Router();

const matchController = new MatchController();

router.get('/', matchController.getAllMatches);

export default router;
