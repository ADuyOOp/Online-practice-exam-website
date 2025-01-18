const userman = require('../controller/userman')
const userdal = require('../model/userdal')
const dialognode = require('dialog-node');
const user = require('../entity/user')

class UserControl {
    async ListAllUser(req, res) {
        var listrole = ["admin"]
        var session = req.session;
        var sessionID = session.sessionID
        var username = session.username

        if (sessionID == undefined) {
            session.job = "user"
            var Message = "Sign in. Please !"
            res.render('login', { Message: Message })
        } else {
            var author = await userman.AuthorUser(req, listrole)
            if (author) {
                var arrUser = await userdal.ListAllUser()
                res.render('user_list', { ArrUser: arrUser, Username: username })
            } else {
                dialognode.warn('Access denied.', '');
                res.redirect('/')
            }
        }
    }

    async CreateUser(req, res) {
        var createrole = ["admin"]
        var author = await userman.AuthorUser(req, createrole)
        if (author) {
            res.render('user_create', {})
        } else {
            dialognode.warn('Access denied.', '');
            res.redirect('/')
        }
    }

    async AddUser(req, res) {
        var name = req.body.name
        var pass = req.body.password
        var role = req.body.role

        var User = new user.create("", name, pass, role)

        await userdal.InsertUser(User)

        res.redirect('/user/list')
    }

    async RemoveUser(req, res) {
        var removerole = ["admin"]
        var author = await userman.AuthorUser(req, removerole)
        if (author) {
            var sid = req.params["id"]
            var id = Number(sid)
            await userdal.RemoveUser(id)
            res.redirect('/user/list')
        } else {
            dialognode.warn('Access denied.', '');
            res.redirect('/')
        }
    }

    async EditUser(req, res) {
        var removerole = ["admin"]
        var author = await userman.AuthorUser(req, removerole)
        if (author) {
            var sid = req.params["id"]
            var id = Number(sid)
            var User = await userdal.ListUser(id)
            res.render('user_edit', { User: User })
        } else {
            dialognode.warn('Access denied.', '');
            res.redirect('/')
        }
    }

    async UpdateUser(req, res) {
        var sid = req.params["id"]
        var id = Number(sid)

        var name = req.body.name
        var pass = req.body.pass
        var role = req.body.role

        var User = new user.create(id, name, pass, role)

        await userdal.UpdateUser(User)

        res.redirect('/user/list')
    }
}

const usercon = new UserControl()
module.exports = usercon;
