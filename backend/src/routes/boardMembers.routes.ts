import { Router, Request, Response } from 'express';
import BoardMember from '../models/boardMember.model';
import User from '../models/user.model';
import { authenticate } from '../middleware/auth.middleware';
import { param, body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
// Protect all routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: BoardMembers
 *     description: CRUD operations for board members
 */

/**
 * @swagger
 * /api/board-members/board/{boardId}:
 *   get:
 *     tags: [BoardMembers]
 *     summary: Get all members of a board
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of board members
 */
router.get(
  '/board/:boardId',
  [param('boardId').isMongoId().withMessage('Invalid board ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { boardId } = req.params;
    try {
      const members = await BoardMember.find({ boardId }).populate('userId', 'fullName avatarUrl initials');
      res.json(members);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/board-members:
 *   post:
 *     tags: [BoardMembers]
 *     summary: Add a user to a board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added
 */
router.post(
  '/',
  [
    body('boardId').notEmpty().isMongoId(),
    body('userId').notEmpty().isMongoId(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { boardId, userId } = req.body;
    try {
      // Check user exists
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      // Create member
      const newMember = new BoardMember({ boardId, userId });
      const saved = await newMember.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * @swagger
 * /api/board-members/{id}:
 *   delete:
 *     tags: [BoardMembers]
 *     summary: Remove a member from a board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid member ID'), validateRequest],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await BoardMember.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ message: 'Member not found' });
      res.json({ message: 'Member removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;