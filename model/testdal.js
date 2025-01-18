
const { sql,poolPromise } = require('../model/dbutil')

const fs = require('fs');
var rawdata = fs.readFileSync('./query/queries.json');
var queries = JSON.parse(rawdata);

const test = require('../entity/test')

class TestModel {

    async ListTests(partID) {
        var sid = partID
        var arrTest = []

        try {
            const pool =  await poolPromise
            const result =  await pool.query(queries.getListTest, [sid])
            if (result != null){
                for (var i = 0; i < result.rows.length; i++) {
                    let row = result.rows[i]
                    arrTest.push(new test.create(row.test_id, row.audioname, row.imagename, row.textname, row.order_test, row.part_id))
                }
            }                     
        } catch (error) {
            console.log(error.message)
        }  

        return arrTest
    }


    async InsertTest(Test) {
        try {
            const pool =  await poolPromise
            const result =  await pool.query(queries.inserTest, [Test.Audio, Test.Image, Test.Text, Test.Ordertest, Test.Partid])
        } catch (error) {
            console.log(error.message)
        }  
    }


    async GetLastTest() {
        var testID = 0

        try {
            const pool = await poolPromise
            const result = await pool.query(queries.getLastTest, [])
            if (result != null){
                testID = result.rows[0].max
            }     
        } catch (error) {
            console.log(error.message)
        }     

        return testID
    }
}

const testmod = new TestModel()
module.exports = testmod;
