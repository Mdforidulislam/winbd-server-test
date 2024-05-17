const { insertSubAdmin, subAdminGetTo } = require("../../lib/subadmin");

// subadmin data insert
const subAdminInsert = async (req, res) => {
  try {
    const subAdminInfo = req.body;
    const result = await insertSubAdmin(subAdminInfo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// geting data to database
const getingSubAdmin = async (req, res) => {
  try {
    const searchValue = req.query.search;
    const pageNumbers = req.query.pageNumber;
    const result = await subAdminGetTo(searchValue,pageNumbers);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { subAdminInsert, getingSubAdmin };
