import { Router, Request, Response } from 'express';
import ChecklistItem from '../models/checklist.model';
import { authenticate } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
// Protect all checklist routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Checklists
 *     description: CRUD operations for checklist items
 */

/**
 * @swagger
 * /api/checklists/card/{cardId}:
 *   get:
 *     tags: [Checklists]
 *     summary: Get all checklist items for a card
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/card/:cardId',
  [param('cardId').isMongoId().withMessage('Invalid card ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { cardId } = req.params;
    try {
      const items = await ChecklistItem.find({ cardId }).sort('position');
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/checklists:
 *   post:
 *     tags: [Checklists]
 *     summary: Create a checklist item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - text
 *             properties:
 *               cardId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  [
    body('cardId').notEmpty().withMessage('cardId is required').isMongoId(),
    body('text').notEmpty().withMessage('text is required').isString(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { cardId, text } = req.body;
    try {
      const maxPos = await ChecklistItem.find({ cardId }).sort('-position').limit(1);
      const position = maxPos.length ? maxPos[0].position + 1 : 0;
      const item = new ChecklistItem({ cardId, text, position });
      const saved = await item.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/checklists/{id}:
 *   put:
 *     tags: [Checklists]
 *     summary: Update a checklist item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid checklist ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const item = await ChecklistItem.findByIdAndUpdate(id, updates, { new: true });
      if (!item) return res.status(404).json({ message: 'Checklist item not found' });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/checklists/{id}:
 *   delete:
 *     tags: [Checklists]
 *     summary: Delete a checklist item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid checklist ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await ChecklistItem.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Checklist item not found' });
      res.json({ message: 'Checklist item deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;