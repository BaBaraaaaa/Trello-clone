import { Router, Request, Response } from 'express';
import Column from '../models/column.model';
import { authenticate } from '../middleware/auth.middleware';

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

// GET all columns for a board
router.get('/board/:boardId', async (req: Request, res: Response) => {
  const { boardId } = req.params;
  try {
    const cols = await Column.find({ boardId }).sort('position');
    res.json(cols);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create column
router.post('/', async (req: Request, res: Response) => {
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
});

// PUT update column
router.put('/:id', async (req: Request, res: Response) => {
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
});

// DELETE column
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await Column.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Column not found' });
    res.json({ message: 'Column deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;