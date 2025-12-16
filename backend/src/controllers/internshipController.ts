import { Request, Response } from 'express';
import Internship from '../models/Internship';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private (Company)
export const createInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('=== Create Internship Request ===');
    console.log('User:', req.user);
    console.log('Request body:', req.body);
    
    const {
      companyName,
      hrName,
      hrEmail,
      hrMobile,
      companyWebsite,
      companyLocation,
      city,
      internshipTitle,
      duration,
      durationUnit,
      positions,
      deadline,
      deadlineType,
      stipendType,
      eligibility,
      perks,
      skills,
      selectionSteps,
      status = 'active',
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !hrName ||
      !hrEmail ||
      !hrMobile ||
      !companyWebsite ||
      !companyLocation ||
      !city ||
      !internshipTitle ||
      !duration ||
      !positions ||
      !deadline
    ) {
      console.log('Validation failed - missing required fields');
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Validate skills array
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      console.log('Validation failed - skills array missing or empty');
      res.status(400).json({ message: 'Please provide at least one required skill' });
      return;
    }

    // Validate selection steps
    if (!selectionSteps || !Array.isArray(selectionSteps) || selectionSteps.length === 0) {
      console.log('Validation failed - selection steps missing or empty');
      res.status(400).json({ message: 'Please provide at least one selection step' });
      return;
    }

    console.log('Validation passed, creating internship...');

    // Create internship
    const internship = await Internship.create({
      companyId: req.user!.id,
      companyName,
      hrName,
      hrEmail,
      hrMobile,
      companyWebsite,
      companyLocation,
      city,
      internshipTitle,
      duration: parseInt(duration),
      durationUnit: durationUnit || 'Weeks',
      positions: parseInt(positions),
      deadline: new Date(deadline),
      deadlineType: deadlineType || 'Hybrid',
      stipendType: stipendType || 'Paid',
      eligibility: eligibility || '',
      perks: perks || '',
      skills,
      selectionSteps,
      status,
    });

    console.log('Internship created successfully:', internship._id);

    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: internship,
    });
  } catch (error: any) {
    console.error('Create internship error:', error);
    res.status(500).json({
      message: error.message || 'Error creating internship',
    });
  }
};

// @desc    Get all internships (with filters)
// @route   GET /api/internships
// @access  Public
export const getInternships = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      city,
      stipendType,
      status = 'active',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by stipend type
    if (stipendType) {
      query.stipendType = stipendType;
    }

    // Text search
    if (search) {
      query.$or = [
        { internshipTitle: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    // Only show internships with future deadlines
    query.deadline = { $gte: new Date() };

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Internship.countDocuments(query);

    res.status(200).json({
      success: true,
      data: internships,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get internships error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching internships',
    });
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internships/:id
// @access  Public
export const getInternshipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      res.status(404).json({ message: 'Internship not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: internship,
    });
  } catch (error: any) {
    console.error('Get internship error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching internship',
    });
  }
};

// @desc    Get internships by company
// @route   GET /api/internships/company/my-internships
// @access  Private (Company)
export const getMyInternships = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const internships = await Internship.find({ companyId: req.user!.id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: internships,
      count: internships.length,
    });
  } catch (error: any) {
    console.error('Get my internships error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching your internships',
    });
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Company - own internships only)
export const updateInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      res.status(404).json({ message: 'Internship not found' });
      return;
    }

    // Check if the company owns this internship
    if (internship.companyId.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized to update this internship' });
      return;
    }

    // Update fields
    const allowedUpdates = [
      'companyName',
      'hrName',
      'hrEmail',
      'hrMobile',
      'companyWebsite',
      'companyLocation',
      'city',
      'internshipTitle',
      'duration',
      'durationUnit',
      'positions',
      'deadline',
      'deadlineType',
      'stipendType',
      'eligibility',
      'perks',
      'skills',
      'selectionSteps',
      'status',
    ];

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (internship as any)[key] = req.body[key];
      }
    });

    await internship.save();

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      data: internship,
    });
  } catch (error: any) {
    console.error('Update internship error:', error);
    res.status(500).json({
      message: error.message || 'Error updating internship',
    });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Company - own internships only)
export const deleteInternship = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      res.status(404).json({ message: 'Internship not found' });
      return;
    }

    // Check if the company owns this internship
    if (internship.companyId.toString() !== req.user!.id) {
      res.status(403).json({ message: 'Not authorized to delete this internship' });
      return;
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete internship error:', error);
    res.status(500).json({
      message: error.message || 'Error deleting internship',
    });
  }
};

// @desc    Get internship statistics
// @route   GET /api/internships/stats/overview
// @access  Public
export const getInternshipStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalActive = await Internship.countDocuments({ status: 'active', deadline: { $gte: new Date() } });
    const totalCompanies = await Internship.distinct('companyId').then((ids) => ids.length);
    
    const topCities = await Internship.aggregate([
      { $match: { status: 'active', deadline: { $gte: new Date() } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const byStipendType = await Internship.aggregate([
      { $match: { status: 'active', deadline: { $gte: new Date() } } },
      { $group: { _id: '$stipendType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActive,
        totalCompanies,
        topCities,
        byStipendType,
      },
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: error.message || 'Error fetching statistics',
    });
  }
};
