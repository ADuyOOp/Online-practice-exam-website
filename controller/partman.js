const fs = require('node:fs');
const path = require('path');

const fileman = require('../controller/fileman')
const testman = require('../controller/testman')
const partdal = require('../model/partdal')

const part = require('../entity/part')

function LoadPart(part_kit) {
    listnodes = fs.readdirSync(part_kit)

    var curr = process.cwd()

    for (const node of listnodes) {
        let pathnode = path.join(part_kit, node)
        let isDir = fs.statSync(pathnode).isDirectory()
        if (isDir) {
            folder_name = node
            src_path = part_kit + "/" + folder_name
            dst_path = curr + "/" + folder_name
            fileman.CopyFolder(src_path, dst_path)
        }
    }
}

function MarkPart(arrQues, rAns) {
    for (const ques of arrQues) {
        if (ques.Answer == ques.Result) {
            rAns = rAns + 1
        }
    }
    return rAns
}

async function BuildPart(skill_name, skill_data, skill_kit, order_question, exam_id) {
    var arrPart = []

    switch (skill_name) {
        case "listening":
            partsOfSkill = [
                { Partname: "Photographs", Numquestion: 6 },
                { Partname: "Q&A", Numquestion: 6 },
                { Partname: "Conversations", Numquestion: 12 },
                { Partname: "Talks", Numquestion: 12 }
            ];
            break;
        case "reading":
            partsOfSkill = [
                { Partname: "Sentences", Numquestion: 6 },
                { Partname: "Text", Numquestion: 16 },
                { Partname: "Comprehension", Numquestion: 8 }
            ];
    }

    for (var item of partsOfSkill) {
        var part_name = item.Partname
        var num_question = item.Numquestion
        var num_test = testman.GetNumTest(part_name, num_question)

        var part_data = skill_data + "\\" + part_name

        var Part = new part.create("", part_name, num_question, exam_id)
        await partdal.InsertPart(Part)
        var partID = await partdal.GetLastPart()

        var part_kit = skill_kit + "\\" + part_name
        if (!fs.existsSync(part_kit)) {
            fs.mkdirSync(part_kit, { recursive: true });
            console.log("BuildPart :" + item)
        } else {
            console.log("directory " + item + " existed")
        }

        var order_test = 1
        var rand_size = 20
        var arrIndex = []    
        while (order_test <= num_test) {
            var index_test = GetRandom(arrIndex, rand_size)
            await testman.BuildTest(part_data, part_kit, index_test, order_test, order_question, partID)
            order_test = order_test + 1
        }
    }
}

function GetRandom(arrIndex, rand_size) {
    var stop = false
    var index 

    while (!stop) {
        index = Math.floor(Math.random() * (rand_size - 1)) + 1
        if (arrIndex.length == 0 || !SearchIndex(arrIndex, index)) {
            arrIndex.push(index)
            stop = true
        }
    }
    return index
}

function SearchIndex(arrIndex, index) {
    var find = false

    for (var i of arrIndex) {
        if (index == i) {
            find = true
            break
        }
    }

    return find
}

function getRandInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min)) + min  
}

module.exports = { LoadPart, MarkPart, BuildPart, getRandInt };
