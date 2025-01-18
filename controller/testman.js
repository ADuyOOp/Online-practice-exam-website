
const fs = require('node:fs');
const path = require('path');

const testdal = require('../model/testdal');
const questionman = require('../controller/questionman');
const fileman = require('../controller/fileman');

const test = require('../entity/test')

function GetNumTest(partname, num_question) {
	var num_test = 0

	switch (partname) {
	case "Photographs":
		num_test = num_question; break;
	case "Q&A":
		num_test = num_question; break;
	case "Sentences":
		num_test = num_question; break;
	case "Conversations":
		num_test = num_question / 3; break;
	case "Talks":
		num_test = num_question / 3; break;
	case "Text":
		num_test = num_question / 4; break;
	case "Comprehension":
		num_test = num_question / 2; break;

	}
	return num_test
}

async function BuildTest(part_data, part_kit, index_test, order_test, order_question, partID) {

	entries = fs.readdirSync(part_data)

	for (var node of entries) {
		let pathnode = path.join(part_data,node)
		let isDir = fs.statSync(pathnode).isDirectory()
		if (isDir) {
			console.log(node)
			var foldername = node
			var pos = foldername.indexOf('_')
			var stestID = foldername.substring(0, pos) 
			var testID = Number(stestID)

			if (testID == index_test) {
				var test_data = part_data + "\\" + foldername
				arrnode = fs.readdirSync(test_data)

				var audioname = "", imagename = "", textname = "", questionname = "" 

				for (var item of arrnode) {
					if (item.includes(".mp3")) {
						audioname = item
					}
					if (item.includes(".jpg") || item.includes(".png")) {
						imagename = item
					}
					if (item.includes("question.txt")) {
						questionname = item
					}
						if (item.includes(".txt")) {
						textname = item
					}
				}

				var Test = new test.create("", audioname, imagename, textname, order_test, partID)


				await testdal.InsertTest(Test)
				var testID = await testdal.GetLastTest()

				console.log("BuildTest :" + node)


				await questionman.BuildQuestion(test_data, questionname, order_question, testID)


				var arrData = part_data.split("\\");
				var skillname = arrData[arrData.length-2];
		

				console.log("BuildTest :" + skillname)

				var audio_kit = part_kit + "\\audio"
				var image_kit = part_kit + "\\image"
				var text_kit = part_kit + "\\text"

				switch (skillname) {
				case "listening":
					fileman.MakeFolder(audio_kit)
					fileman.MakeFolder(image_kit)
					fileman.MakeFolder(text_kit)
					fileman.CopyFile(test_data, audioname, audio_kit)
					fileman.CopyFile(test_data, imagename, image_kit)
					fileman.CopyFile(test_data, textname, text_kit)
					break;

				case "reading":
					fileman.MakeFolder(text_kit)
					fileman.CopyFile(test_data, textname, text_kit)
				}

				console.log(Test)

				break

			}	
		}	
	}	
}

module.exports = {GetNumTest, BuildTest};
