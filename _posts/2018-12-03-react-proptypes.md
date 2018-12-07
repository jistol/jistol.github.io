---
layout: post
title: (React) PropTypes 사용방법과 종류    
category : Frontend
tags : [es6,react,javascript]
---
React Component의 prop값을 검증하기 위해 PropTypes를 이용하여 값을 지정할 수 있습니다.   
React v15.5부터 다른 패키지로 변경되었는데 'prop-types'라이브러리를 사용하라고 권고하고 있습니다.       

사용방법
----
```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Foo extends Component {
  ...
  
  static propTypes = {
    strArg : PropTypes.string,            
    numArg : PropTypes.number.isRequired   
  }
}
```

위와 같이 설정할 경우 Foo 컴포넌트의 strArg값은 string 타입이여야 하며, numArg값은 number 타입이여야 합니다.   
그리고 strArg값은 지정하지 않아도 되나 `isRequired`를 지정한 numArg값은 반드시 설정해야 합니다.    

또한 propTypes은 아래와 같이 class 밖에서도 설정 가능합니다.    

```javascript
class Foo extends Component {
  ...
}

Foo.propTypes = {
  strArg : PropTypes.string
}
```

PropTypes의 종류
----
PropTypes으로 설정할 수 있는 종류는 아래와 같습니다.    

|kind|description|
|:---|:---|
|array|배열|
|bool|true/false|
|func|함수|
|number|숫자|
|object|객체|
|string|문자열|
|symbol|심벌 개체(ES6)|
|node|렌더링 가능한 모든것(number, string, element, 또는 그것들이 포함된 array/fragment)|
|element|React element|
|instanceOf(ClassName)|JS에서 instanceof로 정의 가능한 클래스 인스턴스|
|oneOf([...Value])|포함된 값들중 하나.(ex: oneOf(['남자','여자']))|
|oneOfType([...PropTypes])|포함된 PropTypes들중 하나. (ex: oneOfType([PropTypes.string, PropTypes.instanceOf(MyClass)]))|
|arrayOf(PropTypes)|해당 PropTypes으로 구성된 배열|
|objectOf(PropTypes)|주어진 종류의 값을 가진 객체|
|shape({key:PropTypes})|해당 스키마를 가진 객체.(ex:shape({name:PropTypes.string,age:PropTypes.number}))|
|exact({key:PropTypes})|명확하게 해당 스키마만 존재해야함.|


Reference
----
Typechecking With PropTypes:<https://reactjs.org/docs/typechecking-with-proptypes.html>
