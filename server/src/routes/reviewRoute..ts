import Express  from "express";
import review from "../contollers/reviewController.js";
const router = Express.Router();



router.get('/', review. getReviews);
router.post('/', review.createReview);
router.get('/:id', review.getReview);
router.put('/:id', review.updateReview);
router.delete('/:id', review.deleteReview);



export default router