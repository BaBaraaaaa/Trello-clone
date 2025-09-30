import { Router, Request, Response } from "express";
import { body, param } from "express-validator";
import CardLabel from "../models/cardLabel.model";
import Label from "../models/label.model";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: CardLabels
 *     description: Assign/unassign labels to cards
 */

/**
 * @swagger
 * /api/card-labels/card/{cardId}:
 *   get:
 *     tags: [CardLabels]
 *     summary: Get labels assigned to a card
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of labels assigned to the card
 */
// Get labels assigned to a card
router.get(
  "/card/:cardId",
  [param("cardId").isMongoId().withMessage("Invalid card ID"), validateRequest],
  async (req: Request, res: Response) => {
    const { cardId } = req.params;
    try {
      const assignments = await CardLabel.find({ cardId }).populate(
        "labelId",
        "name color"
      );
      const labels = assignments.map((a) => a.labelId);
      res.json(labels);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /api/card-labels:
 *   post:
 *     tags: [CardLabels]
 *     summary: Assign a label to a card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *               - labelId
 *             properties:
 *               cardId:
 *                 type: string
 *               labelId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Label assigned to card
 *       404:
 *         description: Label not found
 *       409:
 *         description: Label already assigned to card
 */
// Assign a label to a card
router.post(
  "/",
  [
    body("cardId").notEmpty().withMessage("cardId is required").isMongoId(),
    body("labelId").notEmpty().withMessage("labelId is required").isMongoId(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { cardId, labelId } = req.body;
    try {
      // check label exists
      const label = await Label.findById(labelId);
      if (!label) return res.status(404).json({ message: "Label not found" });
      // check card exists
      const cardExists = await CardLabel.findOne({ cardId, labelId });
      if (!cardExists)
        return res.status(404).json({ message: "Card not found" });
      const assignment = new CardLabel({ cardId, labelId });
      const saved = await assignment.save();
      res.status(201).json(saved);
    } catch (err: any) {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ message: "Label already assigned to card" });
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * @swagger
 * /api/card-labels/{id}:
 *   delete:
 *     tags: [CardLabels]
 *     summary: Unassign a label from a card
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Label unassigned from card
 *       404:
 *         description: Assignment not found
 */
// Unassign a label from a card
router.delete(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid assignment ID"),
    body("cardId").isMongoId(),
    body("labelId").isMongoId(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { cardId, labelId } = req.params;
    try {
      const result = await CardLabel.findOneAndDelete({ cardId, labelId });
      if (!result)
        return res.status(404).json({ message: "Assignment not found" });
      res.json({ message: "Label unassigned from card" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
