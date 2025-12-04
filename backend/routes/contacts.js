import express from 'express';
import Contact from '../models/Contact.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Submit contact form
router.post('/', async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress
    };
    
    const contact = new Contact(contactData);
    await contact.save();
    
    // TODO: Send email notification to admin
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.',
      error: error.message
    });
  }
});

// Admin: Get all contacts
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Get contact by id
router.get('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Update contact (PUT)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    if (status) contact.status = status;
    if (notes !== undefined) contact.notes = notes;
    
    await contact.save();
    
    res.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Update contact status (PATCH - alternative)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    if (status) contact.status = status;
    if (notes !== undefined) contact.notes = notes;
    
    await contact.save();
    
    res.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Delete contact
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Admin: Get statistics
router.get('/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const readCount = await Contact.countDocuments({ status: 'read' });
    const repliedCount = await Contact.countDocuments({ status: 'replied' });
    const archivedCount = await Contact.countDocuments({ status: 'archived' });
    
    res.json({
      success: true,
      data: {
        total,
        new: newCount,
        read: readCount,
        replied: repliedCount,
        archived: archivedCount
      }
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
