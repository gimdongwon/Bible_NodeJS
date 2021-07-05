# 트위터

mysql을 이용하여 이미지 업로드가 가능한 서비스 구현

## 추가 기능

1. 언팔로우 기능

addFollowing이 있어서 removeFollowing을 해보았는데 바로 되었다. 이유를 알고 보니 belongsToMany 를 쓸 때 as 에 적힌 문자를 바탕으로 시퀄라이즈가 만들어낸다.

1. addFollowings
2. addFollowing
3. getFollowing
4. setFoloowing
5. removeFollowing

등을 지원한다.

2. 팔로잉, 팔로우한 인원 살펴보기
