const fileman = require('../controller/fileman');
const dataman = require('../controller/dataman');
const userman = require('../controller/userman');

class DataControl {
    async Ware(req, res) {
        var listrole = ["staff", "admin"];
        var session = req.session;
        var sessionID = session.sessionID;

        if (sessionID == undefined) {
            session.job = "data";
            var Message = "Sign in. Please!";
            res.render('login', { Message: Message });
        } else {
            var author = await userman.AuthorUser(req, listrole);
            if (author) {
                var skill_name = req.params["skill"];
                var part_name = req.params["part"];
                var skill = null;
                var part = null;

                if (skill_name != undefined) {
                    var root_data = fileman.GetRoot();
                    skill = await dataman.ReadDirSkill(root_data, skill_name);

                    if (part_name != undefined) {
                        part = await dataman.GetDirPart(skill, part_name);
                    }
                }

                var username = session.username;
                res.render('test_home', { skill: skill, skill_name: skill_name, part: part, part_name: part_name, Username: username });
            }
        }
    }

    async ComposeTest(req, res) {
        var skill_name = req.params["skill"];
        var part_name = req.params["part"];
        res.render('test_compose', { skill_name: skill_name, part_name: part_name });
    }

    async SaveTest(req, res) {
        var skill = req.body.skill;
        var part = req.body.part;
        var test = req.body.test;
        var audio = req.body.audiohidden;
        var faudio = req.body.audiofile;
        var image = req.body.imagehidden;
        var fimage = req.body.imagefile;

        var saudio = faudio == undefined || faudio == '' ? audio : faudio;
        var simage = fimage == undefined || fimage == '' ? image : fimage;

        var text = req.body.text;
        var Ques = req.body.question;
        var arrOpt = req.body.opt;
        var arrRes = req.body.result;

        var arrQues = Array.isArray(Ques) ? Ques : [Ques];

        await dataman.SaveDirTest(skill, part, test, saudio, simage, text, arrQues, arrOpt, arrRes);
        var url_path = "/data/list/" + skill + "/" + part;
        res.redirect(url_path);
    }

    async EditTest(req, res) {
        var skill_name = req.params.skill;
        var part_name = req.params.part;
        var test_name = req.params.test;
        var Skill, Part, Test, path_test;

        if (skill_name != undefined) {
            var root_data = fileman.GetRoot();
            Skill = await dataman.ReadDirSkill(root_data, skill_name);

            if (part_name != undefined) {
                Part = await dataman.GetDirPart(Skill, part_name);

                if (test_name != undefined) {
                    path_test = fileman.GetRoot() + "\\" + skill_name + "\\" + part_name + "\\" + test_name;
                    Test = await dataman.GetDirTest(path_test, Part, test_name);
                    await dataman.CopyDirTest(skill_name, path_test);
                }
            }
        }

        var arrResult = ["a", "b", "c", "d"];
        res.render('test_edit', { skill_name: skill_name, part_name: part_name, test_name: test_name, path_test: path_test, Test: Test, arrResult: arrResult });
    }
}

const datacon = new DataControl();
module.exports = datacon;
