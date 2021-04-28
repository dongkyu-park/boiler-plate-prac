const express = require('express') // 다운받은 express 모듈을 가져온다.
const app = express() // express() 함수를 이용하여 새로운 app을 만든다.
const port = 5000 // 백서버 포트 설정

const mongoose = require('mongoose') // 다운받은 mongoose 모듈을 가져온다.
mongoose.connect('mongodb+srv://dongkyu:abcd1234@boilerplate.yxgnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err)) // 클러스터 생성 후 복사해 둔 connect주소를 넣어준다. 연결이 정상적으로 이루어지면 then 실행 에러시 catch

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
