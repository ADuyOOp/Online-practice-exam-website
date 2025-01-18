const examdal = require('../model/examdal');
const kitman = require('../controller/kitman');
const skilldal = require('../model/skilldal');
const questiondal = require('../model/questiondal');
const questionman = require('../controller/questionman');
const fileman = require('../controller/fileman');
const userman = require('../controller/userman');

class ExamControl {
  async ListAllExam(req, res) {
    var arrExam = await examdal.ListAllExam();
    if (arrExam != null) {
      res.render('listall', { earr: arrExam });
    }
  }

  async LoadExam(req, res) {
    const sid = req.params['id'];
    const root_kit = "c:/exam";
    kitman.LoadTestKit(sid, root_kit);

    var Exam = await examdal.ListExam(sid);
    var skillid = await skilldal.GetSkillID(sid);
    var skillname = await skilldal.GetSkillName(skillid);

    res.render('load', { exam: Exam, skillname: skillname });
  }

  async ListExam(req, res) {
    var sid = Number(req.params['id']);

    var mess = req.body.mess;
    console.log('mess: ' + mess);

    var arrQID = req.body.sqid;
    console.log(arrQID);

    var arrQOD = req.body.sqod;
    console.log(arrQOD);

    if (arrQOD != null) {
      for (var i = 0; i < arrQOD.length; i++) {
        var ans = arrQOD[i];
        var soq = i + 1;
        var qid = await questionman.SearchQID(arrQID, soq);
        if (qid != 0) {
          await questiondal.UpdateQuestion(qid, ans);
        }
      }
    }

    var Exam = await kitman.ListTestKit(sid);
    var countTime = Exam.Duration;
    res.render('list', { Exam: Exam, countTime: countTime });
  }

  async ScoreExam(req, res) {
    var sid = Number(req.params['id']);
    var Exam = await kitman.ScoreTestKit(sid);
    res.render('score', { Exam: Exam });
  }

  async ListExamBySkill(req, res) {
    var skill = req.body.skill;
    var id = Number(skill);

    var arrExam = [];
    switch (id) {
      case 3:
        arrExam = await examdal.ListAllExam();
        break;
      case 1:
        arrExam = await examdal.ListExamBySkill(1);
        break;
      case 2:
        arrExam = await examdal.ListExamBySkill(2);
        break;
    }

    res.render('listall', { earr: arrExam });
  }

  async ReviewExam(req, res) {
    var sid = Number(req.params['id']);
    var Exam = await kitman.ListTestKit(sid);
    res.render('review', { Exam: Exam });
  }

  async RemoveExam(req, res) {
    var createrole = ["staff", "admin"];
    var session = req.session;
    var sessionID = session.sessionID;

    if (sessionID == undefined) {
      session.job = "exam";
      var Message = "Sign in. Please!";
      res.render('login', { Message: Message });
    } else {
      var author = await userman.AuthorUser(req, createrole);
      if (author) {
        var sid = req.params['id'];
        await kitman.RemoveTestKit(sid);
        res.redirect('/manage/list');
      } else {
        console.warn('Access denied.!');
      }
    }
  }

  async CreateExam(req, res) {
    var createrole = ["staff", "admin"];
    var session = req.session;
    var sessionID = session.sessionID;

    if (sessionID == undefined) {
      session.job = "exam";
      var Message = "Sign in. Please!";
      res.render('login', { Message: Message });
    } else {
      var author = await userman.AuthorUser(req, createrole);
      if (author) {
        var root_data = fileman.GetRoot();
        var root_kit = fileman.GetKit();
        await kitman.BuildTestKit(root_data, root_kit);
        res.redirect('/manage/list');
      } else {
        console.warn('Access denied.!');
      }
    }
  }
}

const examcon = new ExamControl();
module.exports = examcon;
