import { Router, Request, Response } from 'express';
import Card from '../models/card.model';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = Router();
// Protect routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Cards
 *     description: CRUD operations for cards
 */

/**
 * @swagger
 * /api/cards/column/{columnId}:
 *   get:
 *     tags: [Cards]
 *     summary: Get cards by column
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/cards:
 *   post:
 *     tags: [Cards]
 *     summary: Create a card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               columnId:
 *                 type: string
 *               boardId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */

// GET all cards for a column
router.get(
  '/column/:columnId',
  [param('columnId').isMongoId().withMessage('Invalid column ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { columnId } = req.params;
    try {
      const cards = await Card.find({ columnId }).sort('position');
      res.json(cards);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST create card
router.post(
  '/',
  [
    body('columnId').notEmpty().withMessage('columnId is required').isMongoId(),
    body('boardId').notEmpty().withMessage('boardId is required').isMongoId(),
    body('title').notEmpty().withMessage('title is required').isString(),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().withMessage('dueDate must be ISO8601'),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { columnId, boardId, title, description, dueDate } = req.body;
    if (!columnId || !boardId || !title) {
      return res.status(400).json({ message: 'columnId, boardId and title required' });
    }
    try {
      // compute position
      const maxPosResult = await Card.find({ columnId }).sort('-position').limit(1);
      const position = maxPosResult.length ? maxPosResult[0].position + 1 : 0;
      const card = new Card({ columnId, boardId, title, description, dueDate, position, createdBy: userId });
      const saved = await card.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT update card
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid card ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const card = await Card.findByIdAndUpdate(id, updates, { new: true });
      if (!card) return res.status(404).json({ message: 'Card not found' });
      res.json(card);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE card
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid card ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await Card.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Card not found' });
      res.json({ message: 'Card deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
