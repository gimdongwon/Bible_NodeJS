# 6. Express 웹서버 만들기

익스프레스는 http 모듈의 요청과 응답 객체에 추가 기능들을 부여한다. 기존 메서드들도 계속 사용할 수 있지만, 편리한 메서드들을 추가하여 기능을 보완하였다. 또한, 코드를 분리하기 쉽게 만들어 관리하기도 용이하다. 그리고 더 이상 if문으로 요청 메서드와 주소를 구별하지 않아도 된다.

## 6.1 익스프레스 서버 시작하기

## 6.2 자주 사용하는 미들웨어

미들웨어는 익스프레스의 핵심이다. 요청과 응답의 중간에 위치하여 미들웨어라고 부른다. 뒤에 나오는 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 전부라고 해도 과언이 아니다. 미들웨어는 요청과 응답을 조작하여 기능을 추가하기도 하고, 나븐 요청을 걸러내기도 한다.

미들웨어는 app.use와 함께 사용된다.

app.use에 매개변수가 req, res, next인 함수를 넣으면 된다. 미들웨어는 위에서부터 아래로 순서대로 실행되면서 요청과 응답 사이에 특별한 기능을 추가할 수 있다. 이번에는 next라는 세번째 매개변수를 사용하는데, 다음 미들웨어로 넘어가는 함수이다. `next를 실행하지 않으면 다음 미들웨어가 실행되지 않는다.`

1. 주소를 첫 번째 인수로 넣어주지 않는다면 모든 요청에서 실행되고, 주소를 넣는다면 해당하는 요청에서만 실행된다고 보면 된다.
2. app.use나 app.get 같은 라우터에 미들웨어를 여러개 장착할 수 있다.

### morgan

기존 로그 외에 추가적인 로그를 볼 수 있다. 요청과 응답에 대한 정보를 콘솔에 기록한다.

morgan미들웨어는 다음과 같이 사용한다.

`app.use(morgan('dev'))`

인수로 dev외에 combined, common, short, tiny 등을 넣을 수 있다.인수를 바꾸면 로그가 달라진다. 대체로 개발환경에서는 dev, 배포 환경에서는 combined를 사용한다. dev 모드 기준으로 GET / 500 7.409 ms - 50 은 각각 [HTTP메서드][주소][HTTP상태코드][응답속도] - [응답바이트] 요청과 응답을 한번에 볼 수 있어서 편하다.

### static

static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 한다. 기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착하면 된다.

```jsx
app.use("요청경로", express.static("실제경로"));

app.use("/", express.static(path.join(__dirname, "public")));
```

함수의 인수로 정적 파일들이 담겨 있는 폴더를 지정하면 된다. 현재 public 폴더가 지정되어 있다. 예를 들어 public/stylesheets/style.css는 [http://localhost:3000/styleshhets/style.css](http://localhost:3000/styleshhets/style.css) 로 접근할 수 있다. public 폴더를 만들고 css나 js, 이미지 파일들을 public 폴더에 넣으면 브라우저에서 접근할 수 있다.

실제 서버의 폴더 경로에는 public이 들어가지만, 요청 주소에는 public이 들어있지 않다는 점에서 외부인이 서버의 구조를 쉽게 파악할 수 없어 보안에 큰 도움이 된다.

요청 경로에 해당 파일이 없다면 알아서 내부적으로 next를 호출한다. 만약 파일을 발견했다면 다음 미들웨어는 실행되지 않는다.

### body-parser

요청의 본문에 있는 데이터를 해석해서 res.body객체로 만들어주는 미들웨어이다. 보통 폼 데이터나 AJAX 요청의 데이터를 처리한다. 단 멀티파트 데이터는 처리하지 못한다. multer 모듈을 사용하면 좋다.

```jsx
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

익스프레스 4.16 버전부터 body-parser 미들웨어의 일부 기능이 익스프레스에 내장되었다.

단 JSON, URL-encoded형식의 데이터 외에도 Raw, Text 형식의 데이터를 추가로 해석할 수 있다. 그때는 직접 설치해야 한다.

요청 데이터의 종류를 살펴보면, JSON은 JSON 형식의 데이터 전달 방식이고, URL-encoded는 주소 형식으로 데이터를 보내는 방식이다. 폼 전송은 URL-encoded 방식을 주로 사용한다. urlencoded 메서드를 보면 `{extended: false}` 라는 옵션이 들어있는데 이 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다. qs모듈은 npm 패키지이며, querystring모듈의 기능을 좀 더 확장한 모듈이다.

POST와 PUT 요청의 본문을 전달받으려면 req.on('data') 와 req.on('end')로 스트림을 사용해야 한다. body-parser를 사용하면 그럴 필요가 없다. 이 패키지가 내부적으로 스트림을 처리해 req.body에 추가한다.

### cookie-parser

요청에 동봉된 쿠키를 해석해 req.cookie 객체로 만든다. parseCookies 함수와 기능이 비슷하다.

`app.use(cookieParser(비밀키));`

해석된 쿠키들은 req.cookies 객체에 들어간다. 예를들어 name=taltube쿠키를 보낸다면 req.cookies는 {name: 'taltube'} 가 된다.

첫번째 인수로 비밀키를 넣어줄 수 있다. 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증할 수 있다. 쿠키는 클라이언트에서 위조하기 쉬우므로 비밀 키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙인다. 서명이 붙으면 쿠키가 name=taltube.sign과 같은 모양이 된다. 서명된 쿠키는 req.cookies대신 req.signedCookies객체에 들어있다.

cookie-parser가 쿠키를 생성할 때 쓰이는 것은 아니다. 쿠키를 생성,제거 하기 위해서는 res.cookie, res.clearCookie 메서드를 사용해야 한다. 옵션은 domain, expires, httpOnly, maxAge, path, secure 등이 있다.

```js
res.cookie("name", "taltube", {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
  secure: true,
});
res.clearCookie("name", "taltube", { httpOnly: true, secure: true });
```

쿠키를 지우기 위해선 옵션도 정확히 일치해야한다. 옵션 중 signed라는 옵션이 있는데, 이를 true로 해야 서명이 붙는다. 대부분 서명 옵션을 켜둔다. 서명을 위한 비밀 키는 cookieParser 미들웨어에 인수로 넣은 process.env.COOKIE_SECRET이 된다.

### express-session

세션 관리용 미들웨어이다. 로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용하다. 세션은 사용자별로 req.session 객체 안에 유지된다.

```js
app.use(
  session({
    resave: false,
    saveUnitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
```

express-session 1.5 버전 이전에는 내부적으로 cookie-parser를 사용하고 있어서 cookie-parser 미들웨어보다 뒤에 위치해야 했지만, 1.5 이후에는 순서가 상관없어졌다.

express-session은 인수로 세션에 대한 설정을 받는다. resave는 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정하는 것이고, saveUnititialized는 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정하는 것이다.

세션 관리 시 클라이언트에 쿠키를 보낸다. 안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 secret의 값이 필요하다. cookie-parser의 secret과 같게 설정하는 것이 좋다. 세션 쿠키의 이름은 name 옵션으로 설정하는데 기본 이름은 connect.sid이다.

쿠키 옵션은 세션 쿠키에 대한 설정이다. maxAge, domain, path, expires, sameSite, httpOnly, secure등 일반적인 쿠키 옵션을 제공한다. httpOnly를 true로 설정해 쿠키를 클라이언트에서 확인하지 못하고, secure는 false로 해서 https가 아닌 상황에서도 사용할 수 있게 했다. 배포시에는 https를 적용하고 secure도 true로 설정하는 것이 좋다.

store라는 옵션은 현재 메모리에 세션을 저장하도록 되어있다. 문제는 서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라진다. 따라서 배포시에는 store에 데이터베이스를 연결하여 세션을 유지하는 것이 좋다. 보통 레디스가 자주 쓰인다.

req.session 객체에 값을 대입하거나 삭제해서 세션을 변경할 수 있다. 나중에 세션을 한 번에 삭제하려면 req.session.destory 메서드를 호출하면 된다. 현재 세션의 아이디는 req.sessionID로 확인할 수 있다. 세션을 강제로 저장하기 위해 req.session.save 메서드가 존재하지만, 일반적으로 요청이 끝날 때 자동으로 호출된다.

서명한 쿠키 앞에는 s: 가 붙는다.

## 6.2.6 미들웨어 특성 활용하기

미들웨어를 직접 만들어보기도 했고, 다른 사람이 만든 미들웨어 패키지를 설치해 장착해보기도 했다. 이번 절에서는 미들웨어의 특성을 총 정리 해보자.

```js
app.use((req, res, next) => {
  console.log("모든 요청에 다 실행된다.");
  next();
});
```

미들웨어는 req, res, next를 매개변수로 가지는 함수(에러 처리 미들웨어만 예외적으로 err, req,res,next를 가진다.)로서 app.use나 app.get, app.post 등으로 장착한다. 특정한 주소의 요청에만 미들웨어가 실행되게 하려면 첫 번째 인수로 주소를 넣으면 된다.

```js
app.use(
  morgan("dev"),
  express.static("/", path.join(__dirname, "public")),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(process.env.COOKIE_SECRET)
);
```

위와 같이 동시에 여러 개의 미들웨어를 장착할 수도 있다. 다음 미들웨어로 넘어가려면 next함수를 호출해야한다. 위 미들웨어들은 내부적으로 next를 호출하고 있으므로 연달아 쓸 수 있다. next를 호출하지 않는 미들웨어는 res.send나 res.sendFile등의 메서드로 응답을 보내야 한다. 미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있다.

만약 next도 호출하지 않고 응답도 보내지 않으면 클라이언트는 응답을 받지못해 하염없이 기다리게 된다.

지금까지는 next에 아무런 인수를 넣지 않았지만 next 함수에 인수를 넣을 수도 있다. 단 인수를 넣는다면 특수한 동작을 한다. route라는 문장열을 넣으면 다음 라우터의 미들웨어로 바로 이동하고, 그 외의 인수를 넣는다면 바로 에러처리 미들웨어로 이동한다. 이 때의 인수는 에러 처리 미들웨어의 err 매개변수가 된다. 라우터에서 에러가 발생할 때 에러를 next을 통해 에러처리 미들웨어로 넘긴다.

```js
next(err)
(err, req,res,next)=>{
    ...
}
```

미들 웨어 간에 데이터를 전달하는 방법도 있다. 세션을 사용한다면 req.session 객체에 데이터를 넣어도 되지만, 세션이 유지되는 동안에만 데이터도 계속 유지된다는 단점이 있다. 만약 요청이 끝날 때까지만 데이터를 유지하고 싶다면 req 객체에 데이터를 넣어두면 된다.

```js
app.use(
  (req, res, next) => {
    req.data = "데이터 넣기";
    next();
  },
  (req, res, next) => {
    console.log(req.data);
    next();
  }
);
```

현재 요청이 처리되는 동안 req.data를 통해 미들웨어간 데이터를 공유할 수 있다. 새로운 요청이 오면 req.data는 초기화 된다. 속성명이 꼭 data일 필요는 없지만 다른 미들웨어와 겹치지 않게 조심해야 한다. 예를들어 속성명을 body로 한다면 미들웨어와 기능이 겹치게 된다.

미들웨어를 사용할 때 유용한 패턴 한가지를 소개하면, 미들웨어 안에 미들웨어를 넣는 방식이다. 아래를 보자.

```js
app.use(morgan("dev"));

또는;

app.use((req, res, next) => {
  morgan("dev")(req, res, next);
});
```

이 패턴이 유용한 이유는 기존 미들웨어의 기능을 확장할 수 있기 때문이다. 예를 들어 다음과 같이 분기 처리를 할 수도 있다. 조건문에 따라 다른 미들웨어를 적용하는 코드이다.

```js
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    morgan("combined")(req, res, next);
  } else {
    morgan("dev")(req, res, next);
  }
});
```
