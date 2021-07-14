# 웹 API 서버 만들기

## 목차

1. API 서버 이해하기
2. 프로젝트 구조 갖추기
3. JWT 토큰으로 인증하기
4. 다른 서비스에서 호출하기
5. SNS API 서버 만들기
6. 사용량 제한 구현하기
7. CORS 이해하기
8. 프로젝트 마무리하기

## 10장 들어가기 전 내 생각

웹 API 서버니깐 내가 예상하기엔 API를 주고 받는 서버를 개발할 것으로 예상된다. 우리가 흔히 사용하는 API서버.. 근데 API서버가 아닌것도 있었나 싶다. 생각해 보면 전부 API 서버였는데 말이지.
기대된다. 바로 들어가 보자.

## 1. API 서버 이해하기

이 장에서는 NodeBird 앱의 REST API 서버를 만들어보겠다. 노드는 JS 문법을 사용하므로 웹 API 서버에서 데이터를 전달할 때 사용하는 JSON을 100% 활용하기에 좋다.

`API 서버는 프런트엔드와 분리되어 운영되므로 모바일 서버로도 사용할 수 있다.` (- 차이점) 노드를 모바일 서버로 사용하려면 이번 장과 같이 서버를 REST API 구조로 구성하면 된다. 특히 JWT 토큰은 모바일 앱과 노드 서버 간에 사용자 인증을 구현할 때 자주 사용된다.

사용자 인증, 사용량 제한 등의 기능을 구현하여 NodeBird의 웹 API 서버를 만들어보자. 이번 장을 위해 NodeBird 앱에 게시글을 다양하게 올려두자.

먼저 API와 웹 API 서버의 개념을 알아보자. API는 Application Programming Interface의 두문자어로, 다른 어플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 허용하는 접점을 의미한다.

웹 API는 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있는 창구이다. 흔히 API를 열었다. 또는 만들었다고 표현하는데, 이는 다른 프로그램에서 현재 기능을 사용할 수 있게 허용했음을 의미한다. 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열어놓고, 제공하고 싶지 않은 부분은 API를 만들지 않는 것이다. 또한, API를 열어놓았다 하더라도 모든 사람이 정보를 가져갈 수 있는 것이 아니라 인증된 사람만 일정 횟수 내에서 가져가게 제한을 둘 수 있다.

위와 같은 서버에 API를 올려서 URL을 통해 접근할 수 있게 만든 것을 웹 API서버 라고 한다. 이 장에서 만들 서버도 Nodebird의 정보를 제공하는 웹 API 이다. 단 정보를 모든 사람이 아닌 인증된 사용자에게만 제공할 것이다.

여기서 크롤링이라는 개념을 알아두면 좋다. 크롤링을 해서 웹 사이트의 데이터를 수집했다는 말을 들어본 적이 있을 것이다. 크롤링은 웹 사이트가 자체적으로 제공하는 API가 없거나 API 이용에 제한이 있을 때 사용하는 방법이다. 표면적으로 보이는 웹 사이트의 정보를 일정 주기로 수집해 자체적으로 가공하는 기술이다. 하지만 웹 사이트에서 직접 제공하는 API가 아니므로 원하는 정보를 얻지 못할 가능성이 있다. 또한, 웹 사이트에서 제공하길 원치 않는 정보를 수집한다면 법적인 문제가 발생할 수도 있다.

서비스 제공자 입장에서도 주기적으로 크롤링을 당하면 웹 서버의 트래픽이 증가하여 서버에 무리가 가므로, 웹 서비스를 만들 때 공개해도 되는 정보들을 API로 만들어 API를 통해 가져가게 하는 것이 좋다.