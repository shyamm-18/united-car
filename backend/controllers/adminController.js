const Booking = require('../models/Booking');
const User = require('../models/User');
const Car = require('../models/Car');

// @desc    Get advanced analytics for the dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Revenue & Bookings Trend (Daily for last 30 days)
    const revenueTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: 'confirmed' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. User Growth Trend
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. Most Booked Cars (Performance Leaderboard)
    const topCars = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: "$car",
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "carDetails"
        }
      },
      { $unwind: "$carDetails" }
    ]);

    // 4. Fleet Distribution (Car Types)
    const fleetDistribution = await Car.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);

    // Summary Statistics
    const allBookings = await Booking.find({});
    const totalRevenue = allBookings.reduce((acc, b) => acc + (b.status === 'confirmed' ? b.totalPrice : 0), 0);
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();

    res.json({
      summary: {
        totalRevenue,
        totalUsers,
        totalCars,
        totalBookings: allBookings.length,
      },
      trends: {
        revenue: revenueTrend,
        users: userGrowth
      },
      topCars,
      fleetDistribution
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
