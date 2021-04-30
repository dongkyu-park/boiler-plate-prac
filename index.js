const express = require('express') // 다운받은 express 모듈을 가져온다.
const app = express() // express() 함수를 이용하여 새로운 app을 만든다.
const port = 5000 // 백서버 포트 설정
const bodyParser = require('body-parser') // 다운받은 body-parser 모듈을 가져온다.
const cookieParser = require('cookie-parser') // 다운받은 cookie-parser 모듈을 가져온다.

const config = require('./config/key') // key.js 파일을 가져온다.

const { User } = require("./models/User") // User model을 가져온다.

app.use(bodyParser.urlencoded({extended: true})) // application/x-www-form-urlencoded 형태의 데이터를 분석해서 가져올 수 있게 설정
app.use(bodyParser.json()) // application/json 형태의 데이터를 분석해서 가져올 수 있게 설정
app.use(cookieParser())

const mongoose = require('mongoose') // 다운받은 mongoose 모듈을 가져온다.
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err)) // 클러스터 생성 후 복사해 둔 connect주소를 넣어준다. 연결이 정상적으로 이루어지면 then 실행 에러시 catch

app.get('/', (req, res) => res.send('Hello World! nodemon HI'))

app.post('/register', (req, res) => {

    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => { // save()는 mongoDB의 메서드
        if(err) return res.json({ success: false, err}) // 실패한다면, json 형태로 success: false와 err메세지 반환
        return res.status(200).json({
            success: true
        })
    })

})

app.post('/login', (req, res) => {

    // 1. 요청된 이메일이 데이터베이스에 존재하는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 2. 요청된 이메일이 데이터베이스에 존재한다면, 비밀번호가 일치하는지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        })

        // 3. 비밀번호까지 일치한다면 토큰을 생성하기.
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err)

            // 토큰을 저장한다. 어디에..? 쿠키, 로컬스토리지
            res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })

    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
