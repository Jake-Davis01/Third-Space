const dashboardModel = require("../models/Dashboard");

const getDashboard = async (req, res) => {
  try {
    const [
      interests,
      attendance,
      ratings,
      activeUsers,
      registeredPercent,
      userGrowth
    ] = await Promise.all([
      dashboardModel.getInterests(),
      dashboardModel.getAttendance(),
      dashboardModel.getRatings(),
      dashboardModel.getActiveUsers(),
      dashboardModel.getRegistrationPercent(),
      dashboardModel.getUserGrowth()
    ]);

    res.json({
      interests: interests.rows,
      attendance: attendance.rows,
      ratings: ratings.rows,
      activeUsers: activeUsers.rows[0].count,
      registrationPercent: registeredPercent.rows[0].percent,
      userGrowth: userGrowth.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard failed" });
  }
};

module.exports = {
  getDashboard
};