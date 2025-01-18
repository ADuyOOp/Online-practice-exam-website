

const fs = require('node:fs');
const skill = require('../entity/skill')
const part = require('../entity/part')
const test = require('../entity/test')
const fileman = require('../controller/fileman')
const questionman = require('../controller/questionman')


async function ReadDirSkill(root_data, skill_name) {

    var Skill = new skill.create(skill_name)

	var path_skill = root_data + "\\" + skill_name

    var nodes = fs.readdirSync(path_skill)  

    for (var node of nodes) { 
		var part_name = node
		var Part = new part.create("",part_name,"", 0)
		var path_part = path_skill + "\\" + part_name

        var items = fs.readdirSync(path_part)   

        for (var cnode of items) {             
			var test_name = cnode
			var Test = new test.create(0,"","","",0,0)
            Test.Testname = cnode
			var path_test = path_part + "\\" + test_name

            var files = fs.readdirSync(path_test)  

            for (var gnode of files) {          

				var file_name = gnode
                Test.ArrFile.push(file_name)    
			}
            Part.ArrTest.push(Test) 
		}
        Skill.ArrPart.push(Part)   
	}

	return Skill
}

async function GetDirPart(skill, part_name) {
	var Part = new part.create(part_name)
	for (var item of skill.ArrPart) {
		if (item.Partname == part_name) {
			Part = item
			break
		}
	}
	return Part
}


async function SaveDirTest(skill_name, part_name, test_name, audio, image, text, arrQues, arrOpt, arrRes) {
	var path_test 
	if (test_name == undefined) {
		path_test = GetNewTest(skill_name, part_name)
	} else {
		path_test = GetOldTest(skill_name, part_name, test_name)
		fileman.RemoveFolder(path_test)
	}

	fileman.MakeFolder(path_test)


	var ware_house = fileman.GetWare()

	if (skill_name == "listening") {
		fileman.CopyFile(ware_house, audio, path_test)
		if (part_name == "Photographs") {
			fileman.CopyFile(ware_house, image, path_test)
		}
	}


	var ft = fs.writeFileSync(path_test + "\\text.txt", text)


	var f = fs.createWriteStream(path_test + "\\question.txt")


	var start = 0
	var jump = 4
	if (part_name == "Q&A") {
		jump = 3
	}
	var end = jump

	for (var i=0; i < arrQues.length; i++) {
		f.write("c-" + arrQues[i] + "\n")
		for (var j=start; j<end; j++) {
			f.write(arrOpt[j] + "\n")
		}
		start = end
		end = end + jump
		f.write("r-" + arrRes[i] + "\n")
		f.write("" + "\n")
	}

	f.close()
}


function GetNewTest(skill_name , part_name)  {
	var root_data = fileman.GetRoot()
	var path_part = root_data + "\\" + skill_name + "\\" + part_name


	var nodes= fs.readdirSync(path_part)

	var lastID = 0
	for (var node of nodes) {
		var test_name = node

		var pos = test_name.indexOf('_')
		var stestID = test_name.substring(0,pos)
		var testID = Number(stestID)
		if (lastID < testID){
			lastID = testID
		}
	}
	var sNewID = (lastID + 1).toString()
	var path_test = path_part + "\\" + sNewID + "_test"

	return path_test
}


function GetOldTest(skill_name, part_name, test_name) {
	var root_data = fileman.GetRoot()
	var path_test = root_data + "\\" + skill_name + "\\" + part_name + "\\" + test_name
	return path_test
}

async function CopyDirTest(skillname, path_test) {

	var curr = process.cwd()

	var audio_curr = curr + "\\" + "audio"
	var image_curr = curr + "\\" + "image"
	var text_curr = curr + "\\" + "text"

	var audioname 
	var imagename 
	var textname 

	var nodes= fs.readdirSync(path_test)
	for (var node of nodes) {
		if (node.includes("mp3")) {
			audioname = node
		} else {
				if (node.includes("png") || node.includes("jpg")) {
					imagename = node
			} else {
				if (node.includes("txt") && node.includes("text")) {
					textname = node
				}
			}
		}
	}


	fileman.CleanFolder()

	switch (skillname) {
	case "listening":
		fileman.MakeFolder(audio_curr)
		fileman.MakeFolder(image_curr)
		fileman.MakeFolder(text_curr)

		fileman.CopyFile(path_test, audioname, audio_curr);
		fileman.CopyFile(path_test, imagename, image_curr);
		fileman.CopyFile(path_test, textname, text_curr);
		break;

	case "reading":
		fileman.MakeFolder(text_curr)

		fileman.CopyFile(path_test, textname, text_curr)
	}
}

async function GetDirTest(path_test, Part, test_name ) {
	var Test = new test.create(0,"","","",0,0)
	Test.Testname = test_name

	for (var item of Part.ArrTest ) {
		if (item.Testname == test_name) {
			Test = item
			var orderQues = {val:0}
			var ques_data = path_test + "\\" + "question.txt"
			Test.ArrQues = await questionman.ReadQuestion(ques_data, orderQues, Test.Testid)

			for (var pt of Test.ArrFile) {
				if (pt.includes("mp3")) {
					Test.Audio = pt
				} else {
					if (pt.includes("png") || pt.includes("jpg")) {
						Test.Image = pt
					} else {
						if (pt.includes("txt") && (pt.includes("text"))) {
							Test.Text = pt
							var path_text = path_test + "\\" + pt
							Test.CoText = GetContainText(path_text)
						}
					}
				}
			}
			break
		}
	}
	return Test
}

function GetContainText(path_file) {
	var con = ""

	var data = fs.readFileSync(path_file, 'UTF-8')

	while (data.includes("\r\n")) {
		data = data.replace("\r\n", "\n")
	}
	con = data

	return con
}

module.exports = {ReadDirSkill,GetDirPart,SaveDirTest,CopyDirTest,GetDirTest};
