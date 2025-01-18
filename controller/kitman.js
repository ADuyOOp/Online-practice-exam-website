const fs = require('node:fs');
const path = require('path');

const examman = require('../controller/examman')
const skillman = require('../controller/skillman')
const fileman = require('../controller/fileman');
const { log } = require('node:console');
const examdal = require('../model/examdal')
const partdal = require('../model/partdal')
const testdal = require('../model/testdal')
const questiondal = require('../model/questiondal')
const partman = require('../controller/partman');
const e = require('express');

class KitController {
	async LoadTestKit(examID, root_kit) {

		fileman.CleanFolder()
	

		let exam_kit = examman.FindExam(examID, root_kit)

		if (exam_kit != "") {
			let listnodes = fs.readdirSync(exam_kit) 
			for (const node of listnodes) {
				let pathnode = path.join(exam_kit,node)
				let isDir = fs.statSync(pathnode).isDirectory()
				if(isDir){
					let skill_name = node
					let skill_kit = exam_kit + "/" + skill_name
					skillman.LoadSkill(skill_kit)
				}
			}
		}
	}
	

	async ListTestKit(examID) {
		var Exam = await examdal.ListExam(examID)
		if (Exam == null) {
			console.log("exam not existing")
		} else {

			

			var Parts = await partdal.ListParts(examID)

			Exam.ArrPart = Parts


			for (const Part of Parts) {				
				var Tests = await testdal.ListTests(Part.Partid)

				Part.ArrTest = Tests
	
				for (const Test of Tests) {	
					var Questions = await questiondal.ListQuestions(Test.Testid)

					Test.ArrQues = Questions
	
					for (const Question of Questions) {
						console.log("Questions: " + Question.Orderquestion)
						Question.ArrOpt = Question.StrOpt.split("#")

					} 
					
				} 
	
			} 
	
		} 
		return Exam
	}	

	async ScoreTestKit(examID) {
		var Exam = await examdal.ListExam(examID)
		if (Exam == null) {
			console.log("exam not existing")
		} else {
			console.log("ScoreTestKit")
			console.log("examid: " + Exam.Examid)

			var Parts = await partdal.ListParts(examID)
			Exam.ArrPart = Parts

			for (const Part of Parts) {
				var rightAns = 0
				var Tests = await testdal.ListTests(Part.Partid)
				Part.ArrTest = Tests



				for (const Test of Tests){					
					var Questions = await questiondal.ListQuestions(Test.Testid)
					Test.ArrQues = Questions


					rightAns =  partman.MarkPart(Questions, rightAns)
				}
				Part.Rightanswer = rightAns
				var ratio = (Part.Rightanswer / Part.Numquestion) * 100
				Part.Ratio = ratio.toFixed(0)
			}
		}
		return Exam
	}


	async RemoveTestKit(sid) {

		fileman.CleanFolder()


		var pathdir = "C:\\exam\\e" + sid
		if (fs.existsSync(pathdir)) {
			fileman.RemoveFolder(pathdir)
		}


		var id = Number(sid)
		await examdal.RemoveExam(id)

	}


	async BuildTestKit(root_data, root_kit) {

		var arrSkill = ["listening", "reading"]


		for (var skill_name of arrSkill) {
			var skill_data = root_data + "\\" + skill_name

			var skill_kit = await  examman.BuildExam(root_kit, skill_name)
			var examID = await examdal.GetLastExam()

			var order_question = {val:0}	

			console.log("BuildTestKit :" + skill_name)


			await partman.BuildPart(skill_name, skill_data, skill_kit, order_question, examID)
		}
	}

}

const kitcon = new KitController()
module.exports = kitcon;


