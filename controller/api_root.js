
class RootControl {
    async Home(req, res){ 
        var session = req.session;
        var sessionID = session.sessionID
        if (sessionID == undefined) {
            var username = ''
        }else{
            var username = session.username
        }
        res.render('index',{Username:username})    
    }
}

const rootcon = new RootControl()
module.exports = rootcon;
