# 알아두어야 할 자바스크립트

## ES2015+

2015년 자바스크립트는 문법에 큰 변화가 있었다. 이를 ES6, ES2015라고 부른다. 2015년을 기점으로 매년 문법 변경 사항이 발표되고 있다. 인터넷 익스플로어와 같은 구형 브라우저에서는 최신 문법을 사용할 수 없지만, 요즘에는 babel처럼 구형 브라우저에 맞게 문법을 변형해주는 도구가 널리 쓰이므로 큰 문제가 되지 않는다. 이번 장에서 ES6 문법에 대해 공부해보자.

### const, let

var를 이젠 const, let이 대체한다.

const와 let은 블록 스코프를 가지나 var는 함수 스코프를 가진다. 이를 통해 호이스팅 같은 문제도 해결되고 코드 관리도 수월해졌다. const, let의 차이는 값의 재할당 여부이다. const는 초기화 할때 값을 할당하지 않으면 에러가 발생하고 한번 값을 할당하면 다른 값을 할당할 수 없다.

```js
const a = 0;
a = 1; // Uncaught TypeError: Assignment to constant variable

const c; // Uncaught SyntaxError: Missing initializer in const declaration

```

### 템플릿 문자열

이 문자열은 백틱(`)으로 문자열을 감싼다. 특이한 점은 문자열 안에 변수를 넣을 수 있다.

### 객체 리터럴

객체 리터럴에 편리한 기능들이 추가되었다.

```js
var sayNode = function () {
  console.log("Node");
};
var es = "ES";
var oldObject = {
  sayJS: function () {
    console.log("JS");
  },
  sayNode: sayNode,
};
oldObject[es + 6] = "Fantastic";
oldObject.sayNode(); // Node
oldObject.sayJS(); // JS
console.log(oldObject.ES6); // Fantastic
```

이 코드를 다음과 같이 쓸 수 있다.

```js
const newObject = {
  sayJS() {
    console.log("JS");
  },
  sayNode,
  [es + 6]: "Fantastic",
};
newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic
```

위의 두 구문을 비교해보면

1. sayJS같은 객체의 메서드에 함수를 연결할 때 더는 콜론과 function을 붙이지 안아도 된다.
2. sayNode: sayNode처럼 속성명과 변수명이 동일한 경우에는 한번만 써도 된다.

`{name: name, age: age} => {name, age}`

3. 객체의 속성명은 동적으로 생성할 수 있다.

### 화살표 함수

큰 특징으로는 this의 사용이 변경되는데 function 함수안에서는 함수 스코프가 적용되어 that, self 등의 변수로 this를 제선언 해야하고 arrow function 안에서는 상위 스코프의 this를 그대로 가져와 사용할 수 있다.

### 구조분해 할당

구조 분해 할당을 통해 객체와 배열로부터 속성이나 요소를 쉽게 꺼낼 수 있다.

```js
var getCandy = candyMachine.getCandy;
var count = candyMachine.status.count;

를 변경하면

const { getCandy, status: {count}} = candyMachine

```

배열에 대한 구조분해 할당 문법도 존재한다.

```js
const array = ["nodejs", {}, 10, true];
const [node, obj, , bool] = array;
```

### 클래스

클래스 문법도 추가되었으나 여전히 프로토 타입 기반으로 동작한다. 프로토타입 기반 문법을 보기 좋게 클래스로 바꾼 것이라 이해하면 된다.

```js
// prototype example
var Human = function (type) {
  this.type = type || "human";
};

Human.isHuman = function (human) {
  return human instanceof Human;
};

Human.prototype.breathe = function () {
  alert("h-a-a-a-m");
};

var Zero = function (type, firstName, lastName) {
  Human.apply(this, arguments);
  this.firstName = firstName;
  this.lastName = lastName;
};

Zero.prototype = Object.create(Human.prototype);
Zero.prototype.constructor = Zero; // 상속
Zero.prototype.sayName = function () {
  alert(this.firstName + "" + this.lastName);
};

var oldZero = new Zero("human", "Zero", "Cho");
Human.isHuman(oldZero);
```

```js
class Human {
  constructor(type = "human") {
    this.type = type;
  }
  static isHuman(human) {
    return human instanceof Human;
  }
  breathe() {
    alert("h-a-a-a-m");
  }
}
class Zero extends Human {
  constructor(type, firstName, lastName) {
    super(type);
    this.firstName = firstName;
    this.lastName = lastName;
  }
  sayName() {
    super.breathe();
    alert(`${this.firstName} ${this.lastName}`);
  }
}

const newZero = new Zero("human", "Zero", "Cho");
Human.isHuman(newZero);
```

전반적으로 class안으로 그룹화되었다. 생성자 함수는 constructor 안으로 들어갔고, Human.isHuman 같은 클래스 함수는 static 키워드로 전환되었다. 프로토 타입 함수들도 모두 class 블록 안에 포함되어 어떤 함수가 어떤 클래스 소속인지 보기 쉽다. 상속도 간단해져서 extends 키워드로 쉽게 상속 가능하다. 다만 이렇게 클래스 문법으로 바뀌었더라도 자바스크립트는 프로토 타입 기반으로 동작한다는 것을 명심해야 한다.

### Promise

자바스크립트와 노드에서는 주로 비동기를 접한다. 특히 이벤트 리스터를 사용할 때 콜백 함수를 자주 사용한다. ES6부터 노드의 API들이 콜백 대신 프로미스 기반으로 재구성되며, 악명 높은 콜백 지옥 현상을 극복했다는 평가를 받고 있다. 프로미스는 반드시 알아두어야 하는 객체이므로 이 책 뿐만 아니라 다른 자료들을 참고해서라도 반드시 숙지해야 한다.

```js
const condition = true;
const promise = new Promise((resolver, reject) => {
  if (condition) {
    resolve("success");
  } else {
    reject("fail");
  }
});

promise
  .then((message) => {
    console.log(message); // 성공한 경우
  })
  .catch((error) => {
    console.error(error); // 실패한 경우
  })
  .finally(() => {
    console.log("무조건");
  });
```

new Promise로 프로미스를 생성할 수 있으며, 그 내부에 resolve와 reject를 매개변수로 갖는 콜백 함수를 넣습니다. 이렇게 만든 promise 변수에 then과 catch 메서드를 붙일 수 있다.
프로미스 내부에서 resolve가 호출되면 then이 실행되고, reject가 호출되면 catch가 실행됩니다. finally는 성공,실패 여부 상관없이 실행됩니다.

resolve와 reject에 넣어준 인수는 각각 then과 catch의 매개변수에서 받을 수 있다. 즉, resolve('성공')이 호출되면 then의 message가 성공이 된다. condition 변수를 false로 바꿔보면 catch에서 에러가 로깅된다.

`프로미스를 쉽게 설명하자면, 실행은 바로 하되 결괏값은 나중에 받는 객체이다.` 결과값은 실행이 완료된 후 then이나 catch 메서드를 통해 받는다. 위 예제에서는 new Promise와 promise, then 사이에 다른 코드가 들어갈 수도 있다. new Promise는 바로 실행되지만, 결괏값은 then을 붙였을 때 받게 된다. then이나 catch에서 다시 다른 then 이나 catch를 붙일 수 있다. 이전 then의 return 값을 다음 then의 매개변수로 넘긴다.

```js
promise
  .then((message) => {
    return new Promise((resolve, reject) => {
      resolve(message);
    });
  })
  .then((message2) => {
    console.log(message2);
    return new Promise((resoleve, reject) => {
      resolve(message2);
    });
  })
  .then((message3) => {
    console.log(message3);
  })
  .catch((error) => {
    console.error(error);
  });
```

then에서 new Promise를 return 해야 다음 then에서 받을 수 있다는 것을 잊지말기.

### async/await

es2017에 추가되었으며 노드처럼 비동기 프로그래밍을 할 떄 도움이 된다. Promise로 콜백지옥을 해결했지만 여전히 코드가 장황하다. then과 catch가 계속 반복되기 때문이다.

```js
function findAndSaveUser(Users) {
  Users.findOne({})
    .then((user) => {
      user.name = "zero";
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ gender: "m" });
    })
    .then((user) => {
      // 생략
    })
    .catch((err) => {
      console.error(err);
    });
}
```

콜백과 다르게 코드의 길이가 깊어지진 않지만, 코드는 여전히 길다.

```js
async function findAndSaveUser(Users) {
  let user = await Users.findOne({});
  user.name = "zero";
  user = await user.save();
  user = await User.findOne({ gender: "m" });
}
```

에러처리를 추가하면

```js
async function findAndSaveUser(User) {
  try {
    let user = await User.findOne({});
    user.name = "zero";
    user = await user.save();
    user = await User.findOne({ gender: "m" });
  } catch (err) {
    console.error(err);
  }
}
```

앞으로 중첩되는 콜백 함수가 있다면 프로미스를 거쳐 async/await 문법으로 바꾸는 연습을 해보자.

## 프론트엔드 자바스크립트

이책에서 나오는 예제들의 프런트엔드에 사용되는 기능들은 HTML에서 script 태그 안에 작성하는 부분이다.

### AJAX

AJAX(Asynchronous JavaScript And XML)는 비동기적 웹 서비스를 개발할 때 사용하는 기법이다. 이름에 XML이 들어 있지만 꼭 XML을 사용해야 하는 것은 아니며, 요즘에는 JSON을 많이 사용한다. 웹 사이트 중에서 페이지 전환 없이 새로운 데이터를 불러오는 사이트는 대부분 AJAX 기술을 사용하고 있다고 보면 된다.

보통 AJAX 요청은 jQuery나 axios 같은 라이브러리를 이용해서 보낸다. 브라우저에서 기본적으로 XMLHttpRequest 객체를 제공하긴 하지만 사용방법이 복잡하고 서버에서는 사용할 수 없으므로 이 책에서는 전반적으로 axios를 사용한다.

### FormData

HTML form 태그의 데이터를 동적으로 제어할 수 있는 기능이다. 주로 AJAX와 함께 사용된다. 먼저 FormData 생성자로 formData 객체를 만든다. 생성된 객체의 메서드로 키-값 형식의 데이터를 저장할 수 있다. append 메서드를 여러번 사용해서 키 하나에 여러 개의 값을 추가해도 된다. has 메서드는 주어진 키에 해당하는 값이 있는지 여부를 알린다.

### encodeURIComponent, decodeURIComponent

ajax 요청을 보낼때 한글이 들어가는 경우가 있다. 서버 종류에 따라 다르지만 한글 주소를 이해하지 못하는 경우가 있다. 이럴 때 window 객체의 메서드인 encodeURIComponent를 사용한다. 한글 주소가 임의의 문자열로 변환된다. 받는 쪼에서는 ㅇㄷcodeURIComponent를 사용하면 된다.

### 데이터 속성과 dataset

노드를 웹서버로 사용하는 경우, 클라이언트와 빈번하게 데이터를 주고받게 된다. 이때 서버에서 보내준 데이터를 프런트엔드 어디에 넣을지 고민된다. 프론트엔드에 데이터를 내려보낼 때 첫 번쨰로 고려해야 할 점은 보안이다. 클라이언트를 믿지 말라는 말이 있을 정도로 민감한 데이터를 내려보내는 것은 실수이다. 보안과 무관한 데이터들은 자유롭게 프런트엔드로 보내도 된다. HTML과 관련된 데이터를 저장하는 공식방법이 있는데 바로 데이터 속성이다.

HTML 태그의 속성으로 data-로 시작하는 것드을 넣는다. 화면에 나타나진 않지만 웹 어플리케이션 구동에 필요한 데이터들이다. 나중에 이 데이터들을 사용해 서버에 요청을 보내게 된다. 데이터 속성의 장점은 자바스크립트로 쉽게 접근할 수 있다는 것이다. script 태그를 보면 dataset속성을 통해 접근하고 있다.
