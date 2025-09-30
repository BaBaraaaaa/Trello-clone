import { Router, Request, Response } from 'express';
import Board from '../models/board.model';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
// Protect all routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Boards
 *     description: CRUD operations for boards
 */

/**
 * @swagger
 * /api/boards:
 *   get:
 *     tags: [Boards]
 *     summary: Get all boards for authenticated user
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  try {
    const boards = await Board.find({ createdBy: userId });
    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Get board by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get('/:id', async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  try {
    const board = await Board.findOne({ _id: id, createdBy: userId });
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/boards:
 *   post:
 *     tags: [Boards]
 *     summary: Create a new board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { title, description, background, visibility, workspaceId } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const newBoard = new Board({
      title,
      description,
      background,
      visibility,
      createdBy: userId,
      workspaceId,
    });
    const saved = await newBoard.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/boards/{id}:
 *   put:
 *     tags: [Boards]
 *     summary: Update a board
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
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const updates = req.body;
  try {
    const board = await Board.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updates,
      { new: true }
    );
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Delete a board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  try {
    const result = await Board.findOneAndDelete({ _id: id, createdBy: userId });
    if (!result) return res.status(404).json({ message: 'Board not found' });
    res.json({ message: 'Board deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
