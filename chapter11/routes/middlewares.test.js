test('1+1은 2입니다. 성공 케이스', () => {
  expect(1 + 1).toEqual(2);
});
test('1+1은 2입니다. 실패케이스', () => {
  expect(1 + 1).toEqual(3);
});
