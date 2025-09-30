import { Router, Request, Response } from 'express';
import Column from '../models/column.model';
import { authenticate } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
// Protect routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Columns
 *     description: CRUD operations for columns
 */

/**
 * @swagger
 * /api/columns/board/{boardId}:
 *   get:
 *     tags: [Columns]
 *     summary: Get all columns for a board
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Create a new column
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - title
 *             properties:
 *               boardId:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Column created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/columns/{id}:
 *   put:
 *     tags: [Columns]
 *     summary: Update column by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated column
 *       404:
 *         description: Column not found
 */

/**
 * @swagger
 * /api/columns/{id}:
 *   delete:
 *     tags: [Columns]
 *     summary: Delete column by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Column deleted
 *       404:
 *         description: Column not found
 */

// GET all columns for a board
router.get(
  '/board/:boardId',
  [param('boardId').isMongoId().withMessage('Invalid board ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { boardId } = req.params;
    try {
      const cols = await Column.find({ boardId }).sort('position');
      res.json(cols);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// POST create column
router.post(
  '/',
  [
    body('boardId').notEmpty().withMessage('boardId is required').isMongoId(),
    body('title').notEmpty().withMessage('title is required').isString(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { boardId, title } = req.body;
    if (!boardId || !title) return res.status(400).json({ message: 'boardId and title required' });
    try {
      // compute position
      const maxPos = await Column.find({ boardId }).sort('-position').limit(1);
      const position = maxPos.length ? maxPos[0].position + 1 : 0;
      const col = new Column({ boardId, title, position });
      const saved = await col.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT update column
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid column ID'),
    body('title').optional().isString(),
    body('isArchived').optional().isBoolean(),
    validateRequest
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const col = await Column.findByIdAndUpdate(id, updates, { new: true });
      if (!col) return res.status(404).json({ message: 'Column not found' });
      res.json(col);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE column
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid column ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await Column.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Column not found' });
      res.json({ message: 'Column deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;