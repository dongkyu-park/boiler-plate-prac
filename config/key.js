if(process.env.NODE_ENV === 'production') { // process.env.NODE_ENV는 환경 변수값이다. 해당 값을 호출하면 프로젝트 환경이 String값으로 출력됨
    module.exports = require('./prod');
} else { // 환경 변수가 development라면,
    module.exports = require('./dev');
}
