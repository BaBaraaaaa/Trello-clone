import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import Label from '../models/label.model';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Labels
 *     description: CRUD operations for labels
 */

/**
 * @swagger
 * /api/labels/board/{boardId}:
 *   get:
 *     tags: [Labels]
   summary: Get labels for a board
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of labels for the board
 */
// Get labels for a board
router.get(
  '/board/:boardId',
  [param('boardId').isMongoId().withMessage('Invalid board ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { boardId } = req.params;
    try {
      const labels = await Label.find({ boardId }).sort('name');
      res.json(labels);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/labels:
 *   post:
 *     tags: [Labels]
   summary: Create a new label
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - name
 *               - color
 *             properties:
 *               boardId:
 *                 type: string
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *                 description: Hex color code (e.g. #FF0000)
 *     responses:
 *       201:
 *         description: Label created
 *       409:
 *         description: Label already exists
 */
// Create a label
router.post(
  '/',
  [
    body('boardId').notEmpty().withMessage('boardId is required').isMongoId(),
    body('name').notEmpty().withMessage('name is required').isString(),
    body('color').notEmpty().withMessage('color is required').matches(/^#[0-9A-F]{6}$/i).withMessage('color must be hex code'),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { boardId, name, color } = req.body;
    try {
      const label = new Label({ boardId, name, color });
      const saved = await label.save();
      res.status(201).json(saved);
    } catch (err: any) {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Label already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/labels/{id}:
 *   put:
 *     tags: [Labels]
   summary: Update a label by ID
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
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *                 description: Hex color code
 *     responses:
 *       200:
 *         description: Updated label
 *       404:
 *         description: Label not found
 */
// Update a label
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid label ID'),
    body('name').optional().isString(),
    body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('color must be hex code'),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;
    try {
      const label = await Label.findByIdAndUpdate(id, updates, { new: true });
      if (!label) return res.status(404).json({ message: 'Label not found' });
      res.json(label);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/labels/{id}:
 *   delete:
 *     tags: [Labels]
   summary: Delete a label by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label deleted
 *       404:
 *         description: Label not found
 */
// Delete a label
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid label ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await Label.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Label not found' });
      res.json({ message: 'Label deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
