---
layout: post
title: (React) Component Life Cycle   
category : Frontend
tags : [es6,react,javascript,lifecycle]
---
React Component의 생명주기에 대해 정리하고 테스트 예제를 포스팅합니다.    
참고로 version 17부터 deprecated 되는 항목(componentWillMount, componentWillUpdate, componentWillReceiveProps)은 제외했습니다.  
위 3개의 lifecycle은 오용되는 케이스가 많아 삭제 되었으며 'UNSAFE_'라는 prefix를 붙여 메소드가 남아있는 상태로 자세한 내용은 [Update on Async Rendering](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)문서를 참고하세요.    

React 버전에 따라 생명주기가 살짝 다른데 아래 그림을 참고하세요.

React v16.3 : <https://code.likeagirl.io/understanding-react-component-life-cycle-49bf4b8674de>     
![React Component LifeCycle v16.3](/assets/img/frontend/react-lifecycle/1.jpeg)         

React v16.4 : <https://medium.com/@nancydo7/understanding-react-16-4-component-lifecycle-methods-e376710e5157>     
![React Component LifeCycle v16.4](/assets/img/frontend/react-lifecycle/2.png)       

위 그림과 같이 React Component의 생명주기는 실행 이벤트 관점에서 "mount/update/unmount"로 구분 할 수 있으며 실행 단계 관점에서는 "랜더링전/DOM 반영전/DOM 반영이후"로 구분 할 수 있습니다.    

  
render()
----
React.Component에서 유일하게 필수 구현되어야 하는 함수입니다. 미구현시 아래와 같은 오류를 만나게 됩니다.    
```text
Warning: TodoApp(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.

Uncaught TypeError: instance.render is not a function
```

이 메서드 안에서는 this.props와 this.state를 사용할 수 있으나 state의 값을 변경하면 안됩니다. 변경시 아래와 같은 오류를 만나게 됩니다.    
```text
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```    

반환 값으로 일반적으로 DOM노드를 반환하나 아래와 같이 여러종류의 데이터를 넘길 수 있습니다.    

### 1. React Element ### 
- JSX타입의 요소를 반환할 수 있습니다. 
- 반환시 최상위 DOM은 단일노드여야 합니다.      
```javascript
render() {
  return <div> ... </div>;
}

render() {
  return <MyComponent/>;
}

// error case
render() {
  return <div>1</div><div>2</div>;
}
/**
* Uncaught SyntaxError: Inline Babel script: Adjacent JSX elements must be wrapped in an enclosing tag
*/
```

### 2. Fragment ###
- 특정 태그로 묶고 싶지 않다면 <React.Fragment>태그로 묶어 반환할 수 있습니다.       
- 해당 태그로 묶을 경우 렌더링시 Fragment태그는 제거됩니다.     
```javascript
render() {
  return (
    <div>
      <div>1</div>
      <div>2</div>
    </div>
  );
}
/**
* Result
* <div id="app">
*   <div>
*     <div>1</div>
*     <div>2</div>
*   </div>
* </div>
*/

render() {
  return (
    <React.Fragment>
      <div>1</div>
      <div>2</div>
    </React.Fragment>
  );
}
/**
* Result
* <div id="app">
*   <div>1</div>
*   <div>2</div>
* </div>
*/
```

### 3. Portal ###
- ReactDOM.createPortal 메서드를 이용하여 다른 DOM의 서브트리로 만들수 있습니다.    
- 반드시 리턴 할 경우에만 적용됩니다.
- 일반 렌더링값과는 달리 해당 DOM의 하위 노드를 제거후 렌더링하는것이 아니라 서브 노드로 추가가 됩니다.
```javascript
// 본 컴포넌트가 속한 부모 노드 하위가 아닌 #portal 노드 하위에 그려집니다. 
render() {
    let domNode = document.querySelector("#portal");
    return ReactDOM.createPortal(
        <div>Portal</div>,
        domNode
    );
}
// 아래와 같은 경우 아무것도 그려지지 않습니다.    
render() {
    let domNode = document.querySelector("#portal");
    ReactDOM.createPortal(
        <div>Portal</div>,
        domNode
    );
    return true;
}
```
> Portal의 경우 컴포넌트가 속하지 않은 노드에 렌더링을 할 수 있게 하는데 다음과 같은 경우에 사용하기 유용합니다.    
> ex) dialog, hovercard, tooltips ...    
> 자세한 가이드는 [React Portals](https://reactjs.org/docs/portals.html) 문서를 참고하세요.    

### 4. String, Number ###
- 문자열이나 숫자를 반환 할 수 있으며 TextNode로 렌더링 됩니다.          
```javascript
render() {
  return 'Text';
}
/**
* Result
* <div id="app">Text</div>
*/
```

### 5. boolean, null ###
- boolean(true/false)값이나 null값 역시 반환 가능합니다. 
- 반환시 화면에 아무것도 안그리는 것으로 보일수 있으나 사실상 공백을 그려줍니다. 렌더링되는 요소 하위에 다른 요소가 존재한다면 삭제 됩니다.
- 심지어 undefined도 가능합니다. 테스트 해보면 에러는 안나지만 공식문서에 undefined는 명시되 있지 않습니다.

### 6. Array ###
- 배열을 반환할 수 있습니다.
- 배열 요소들은 렌더링 가능한 모든 타입이 가능합니다. (function은 불가능합니다.)    
- 컴포넌트 배열을 렌더링 할 경우 어떤 원소에 변동이 있는지 알아내기 위해 각 원소에 고유 key가 포함되어야 합니다.
```javascript
render() {
  return [
    "start",
    1234,
    false,
    null,
    <React.Fragment key="frag"><div key="1">1</div><div key="2">2</div></React.Fragment>,
    <b key="3">{this.state.status}</b>,
    ReactDOM.createPortal(
      <div>Portal</div>,
      this.props.portal
    )
  ];
}
```

constructor
----
```javascript
constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```
컴포넌트 생성자로 생성시 맨 처음에 실행하게 되는데 props를 인자로 받는데 React.Component를 상속했을 경우 반드시 ```super(props);```를 호출해야합니다.    
그리고 constructor는 유일하게 this.state 를 직접 할당하는 메서드입니다. 이 메서드 안에서는 setState()를 호출하지 말아야 합니다. 호출시 아래와 같은 오류가 발생합니다.    
그 외 이벤트를 해당 인스턴스로 바인드 하는 등의 작업을 할 수 있습니다.        

```text
Warning: Can't call setState on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the YourApp component.
```     


getDerivedStateFromProps
----
React v16.3이후 새로 생긴 lifecycle로 초기에 마운트되거나 이후 업데이트시 render과정 전에 호출됩니다.    

업데이트가 필요한 state값을 반환하거나 null을 반환해야 하고 본 메서드는 static 메서드로 Component에 직접 접근 할 수 없습니다.       

### Usecase ###
이전 많은 개발자들이 props값의 변화에 따라 state값을 변경하기 위해 아래와 같은 버그 코드를 작성하였습니다.       
```javascript
constructor(props) {
 super(props);
 // Don't do this!
 this.state = { color: props.color };
}
```
위 예제는 props값을 직접 참조함으로써 props값이 변할 때 마다 state에 영향을 미치길 바라지만 실제로는 변경되지 않습니다.     
하지만 아래와 같이 getDerivedStateFromProps 메서드를 이용하면 props값이 변경시마다 getDerivedStateFromProps 메서드를 호출하기 때문에 state값을 변경 가능합니다.       
```javascript
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.status != prevState.status) {
    return { status : nextProps.status };
  }
  
  return null;
}
```
