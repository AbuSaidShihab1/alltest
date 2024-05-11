const isadmin = (req, res, next) => {
    try {
      if (req.session.adminId) {
      } else {
        res.redirect("/login");
      }
      next();
    } catch (err) {
      console.log(err);
    }
  };
  const islogout = (req, res, next) => {
    try {
      if (req.session.adminId) {
        res.redirect("/admin");
      }
      next();
    } catch (err) {
      console.log(err);
    }
  };
  module.exports = { isadmin, islogout };
  