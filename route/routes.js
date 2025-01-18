const express = require('express');
require('express-group-routes');

const api_exam = require('../controller/api_exam');
const api_root = require('../controller/api_root');
const api_manage = require('../controller/api_manage');
const api_data = require('../controller/api_data');
const api_user = require('../controller/api_user');

const router = express.Router();

router.get("/", api_root.Home);

router.group("/exam", (router) => {
    router.get("/list", api_exam.ListAllExam);
    router.get("/load/:id", api_exam.LoadExam);
    router.get("/list/:id", api_exam.ListExam);
    router.post("/list/:id", api_exam.ListExam);
    router.get("/score/:id", api_exam.ScoreExam);
    router.post("/score/:id", api_exam.ScoreExam);
    router.post("/skill", api_exam.ListExamBySkill);
    router.get("/review/:id", api_exam.ReviewExam);
    router.get("/remove/:id", api_exam.RemoveExam);
    router.get("/create", api_exam.CreateExam);
    router.post("/create", api_exam.CreateExam);
});

router.group("/manage", (router) => {
    router.get("/list", api_manage.ListManageExam);
    router.get("/login", api_manage.LoginUser);
    router.post("/login", api_manage.CheckUser);
    router.get("/logout", api_manage.LogoutUser);
});

router.group("/data", (router) => {
    router.get("/", api_data.Ware);
    router.get("/list/:skill", api_data.Ware);
    router.get("/list/:skill/:part", api_data.Ware);
    router.post("/create/:skill/:part", api_data.ComposeTest);
    router.post("/save", api_data.SaveTest);
    router.get("/edit/:skill/:part/:test", api_data.EditTest);
});

router.group("/user", (router) => {
    router.get("/list", api_user.ListAllUser);
    router.get("/create", api_user.CreateUser);
    router.post("/create", api_user.AddUser);
    router.post("/remove/:id", api_user.RemoveUser);
    router.post("/edit/:id", api_user.EditUser);
    router.post("/update/:id", api_user.UpdateUser);
});

module.exports = router;
