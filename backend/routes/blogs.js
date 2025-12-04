import express from 'express';
import Blog from '../models/Blog.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { category, tag, limit } = req.query;
    const filter = { isPublished: true };
    
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    
    let query = Blog.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1 });
    
    if (limit) query = query.limit(parseInt(limit));
    
    const blogs = await query;
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Get all blogs (MUST be before /:slug route)
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Public: Get blog by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    }).populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DEPRECATED: Old route kept for compatibility
router.get('/:slug', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Create blog
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id
    };
    
    if (blogData.isPublished && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }
    
    const blog = new Blog(blogData);
    await blog.save();
    
    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Update blog
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // If publishing for first time, set publishedAt
    if (req.body.isPublished && !blog.isPublished) {
      req.body.publishedAt = new Date();
    }
    
    Object.assign(blog, req.body);
    await blog.save();
    
    res.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Delete blog
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;
