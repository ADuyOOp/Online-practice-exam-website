const examdal = require('../model/examdal');
const dialognode = require('dialog-node');
const userdal = require('../model/userdal');
const userman = require('../controller/userman');
const crypto = require("crypto");

class ManageControl {
  async ListManageExam(req, res) {
    var listrole = ["staff", "admin"];
    var session = req.session;
    var sessionID = session.sessionID;
    if (sessionID == undefined) {
      session.job = "exam";
      var Message = "Please Sign in.";
      res.render('login', { Message: Message });
    } else {
      var author = await userman.AuthorUser(req, listrole);
      if (author) {
        var arrExam = await examdal.ListAllExam();
        var username = session.username;
        res.render('listmanage', { ArrExam: arrExam, Username: username });
      } else {
        dialognode.warn('Access denied.!', '');
      }
    }
  }

  async LoginUser(req, res) {
    res.render('login');
  }

  async CheckUser(req, res) {
    var name = req.body.name;
    var pass = req.body.password;
    var user = await userdal.GetUser(name, pass);
    if (user == null) {
      var errMessage = "Username or password is incorrect. Please try again !";
      res.render('login', { Message: errMessage });
    } else {
      var authen = await userman.AuthenUser(user, name, pass);
      if (authen) {
        var session = req.session;
        let uuid = crypto.randomUUID();
        session.sessionID = uuid;
        session.role = user.Role;
        session.username = user.Name;
        var job = session.job;
        switch (job) {
          case "exam":
            res.redirect("/manage/list");
            break;
          case "user":
            res.redirect("/user/list");
            break;
          case "data":
            res.redirect("/data");
            break;
        }
      } else {
        res.render('login', { Message: "Access denied. You do not have permission to this page!" });
      }
    }
  }

  async LogoutUser(req, res) {
    req.session.destroy();
    dialognode.info('Your account had Sign Out.', '');
    res.redirect('/');
  }
}

const mancon = new ManageControl();
module.exports = mancon;
