import express from 'express';
import {
  createInternship,
  getInternships,
  getInternshipById,
  getMyInternships,
  updateInternship,
  deleteInternship,
  getInternshipStats,
} from '../controllers/internshipController';
import { protectCompany } from '../middleware/companyAuth';

const router = express.Router();

// Public routes
router.get('/', getInternships);
router.get('/stats/overview', getInternshipStats);
router.get('/:id', getInternshipById);

// Protected routes (Company only)
router.post('/', protectCompany, createInternship);
router.get('/company/my-internships', protectCompany, getMyInternships);
router.put('/:id', protectCompany, updateInternship);
router.delete('/:id', protectCompany, deleteInternship);

export default router;
