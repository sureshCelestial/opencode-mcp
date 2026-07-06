import { Router } from 'express';
import * as controller from '../controllers/habitController';
import { validateRequest } from '../middleware/validateRequest';
import { createHabitSchema, updateHabitSchema } from '../types/habitSchemas';

const router = Router();

router.post('/', validateRequest(createHabitSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', validateRequest(updateHabitSchema), controller.update);
router.delete('/:id', controller.remove);

export default router;
