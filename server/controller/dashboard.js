const dashboardModel = require("../models/Dashboard");

const getDashboard = async (req, res) => {
  try {
    const interests = await dashboardModel.getInterests();
    const attendance = await dashboardModel.getAttendance();
    const ratings = await dashboardModel.getRatings();
    const activeUsers = await dashboardModel.getActiveUsers();
    const registeredPercent = await dashboardModel.getRegistrationPercent();
    const userGrowth = await dashboardModel.getUserGrowth();

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