const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// All routes here require authentication
router.use(authMiddleware);

/**
 * GET /api/users
 * Get all users (admin & moderator)
 * - Admin sees all users
 * - Moderator sees only regular users
 */
router.get('/', roleMiddleware('admin', 'moderator'), async (req, res) => {
  try {
    let query = {};
    // Moderators can only see regular users
    if (req.user.role === 'moderator') {
      query = { role: 'user' };
    }
    const users = await User.find(query).select('-__v').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PATCH /api/users/:id/role
 * Update a user's role (admin only)
 */
router.patch('/:id/role', roleMiddleware('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: user, moderator, or admin.',
      });
    }

    // Prevent admin from changing own role
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after', runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      message: `Role updated to "${role}" for ${user.name}.`,
      user,
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * PATCH /api/users/:id
 * Edit a user's name & email (admin & moderator)
 * - Admin can edit anyone (except self)
 * - Moderator can only edit regular users
 */
router.patch('/:id', roleMiddleware('admin', 'moderator'), async (req, res) => {
  try {
    const { name, email } = req.body;

    // Prevent editing own account from this route
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot edit your own account from here.',
      });
    }

    // If moderator, check that the target is a regular user
    if (req.user.role === 'moderator') {
      const targetUser = await User.findById(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      if (targetUser.role !== 'user') {
        return res.status(403).json({
          success: false,
          message: 'Moderators can only edit regular users.',
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: 'after', runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      message: `User "${user.name}" updated successfully.`,
      user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user (admin only)
 */
router.delete('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account from here.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      message: `User "${user.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
