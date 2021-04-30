const { User } = require('../models/User')

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth

    // 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if (err) throw err
        if (!user) return res.json({ isAuth: false, error: ture })

        req.token = token // token과 user 정보를 req에 넣어주는 이유는, next()로 넘어갔을 때 req에 전달하여, 
                          // req.token 의 형태로 값을 사용할 수 있게하기 위함이다.
        req.user = user
        next() // 미들웨어에서 처리가 끝났으면 다음으로 넘어갈 수 있게끔 next()를 사용해주어야 한다.
               // 해당 부분이 없으면 계속 findByToken 메서드에서 머물게 된다.
    })

    // 유저가 있으면 인증 Okay

    // 유저가 없으면 인증 No !

}

module.exports = {auth}