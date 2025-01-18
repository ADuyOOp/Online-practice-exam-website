
const fs = require('node:fs');
const path = require('path');

const partman = require('../controller/partman')

function LoadSkill(skill_kit) {
	var listnodes = fs.readdirSync(skill_kit)  

	for (const node of listnodes) {
		let pathnode = path.join(skill_kit,node)
		let isDir = fs.statSync(pathnode).isDirectory()
		if (isDir) {
			part_name = node
			part_kit = skill_kit + "/" + part_name
			partman.LoadPart(part_kit)
		}
	}
}

module.exports = {LoadSkill};
