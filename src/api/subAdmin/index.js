const { insertSubAdmin, subAdminGetTo, updateSubAdminInfo } = require("../../lib/subadmin");

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

// update subadmin here
const updatesubAdminInfoAPI = async (req, res) => {
  try { 
    const id = req.query.id;
    const subadminfo = req.body;
      if (!id || !Object.values(subadminfo).every(item => item)) {
          message: "userInfo or Id missing";
      };
      const finalResult = await updateSubAdminInfo(id, subadminfo); // call the libray funtion for updatate userinfo 
      res.status(200).json(finalResult);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = { subAdminInsert, getingSubAdmin,updatesubAdminInfoAPI };
