---
layout: post
title: Observer 패턴과 Publisher/Subscriber(Pub-Sub) 패턴의 차이점 
category : software engineering
tags : [designpattern, softwareengineering, observer, pubsub, publisher, subscriber]
---
본 글은 [토비의 봄 TV 5회 스프링 리액티브 프로그래밍 (1) - Reactive Streams](https://www.youtube.com/watch?v=8fenTR3KOJo) 영상을 보던 중 "Observer패턴과 Pub-Sub패턴의 차이"에 대한 얘기가 나와 궁금해 찾아 본 자료를 정리한 문서입니다.    
"Head First Design Patterns" 책에는  `Obaserver Pattern == Pub-Sub Pattern`으로 나와 있지만 실제 찾아보면 비슷한 개념 사이에 확연한 차이점이 존재합니다.    

가장 큰 차이점은 중간에 `Message Broker` 또는 `Event Bus`가 존재하는지 여부입니다.    

![Pattern Notification](/assets/img/softwareengineering/observer-pubsub-pattern/1.png)    

## Observer패턴은 Observer와 Subject가 서로를 인지하지만 Pub-Sub패턴의 경우 서로를 전혀 몰라도 상관없습니다. ##    
Observer패턴의 경우 Subject에 Observer를 등록하고 Subject가 직접 Observer에 직접 알려주어야 합니다.    

Pub-Sub패턴의 경우 Publisher가 Subscriber의 위치나 존재를 알 필요없이 Message Queue와 같은 Broker역활을 하는 중간지점에 메시지를 던져 놓기만 하면 됩니다.    
반대로 Subscriber 역시 Publisher의 위치나 존재를 알 필요없이 Broker에 할당된 작업만 모니터링하다 할당 받아 작업하면 되기 때문에 Publisher와 Subscriber가 서로 알 필요가 없습니다.    

## Observer패턴에 비해 Pub-Sub패턴이 더 결합도가 낮습니다.(Loose Coupling)##    
Publisher와 Subscriber가 서로의 존재를 알 필요가 없기 때문에 당연히 소스코드 역시 겹치거나 의존할 일이 없습니다.    
만약 결합도가 높다면 의도하거나 잘못된 코딩일 가능성이 큽니다.    

## Observer패턴은 대부분 동기(synchronous) 방식으로 동작하나 Pub-Sub패턴은 대부분 비동기(asynchronous) 방식으로 동작합니다.##    
이유는 Broker로 MessageQueue를 많이 사용하기 때문입니다.    

## Observer패턴은 단일 도메인 하에서 구현되어야 하나 Pub-Sub패턴은 크로스 도메인 상황에서도 구현 가능합니다. ##    
이 역시 Broker라는 중간 매개체가 있기 때문인데 어플리케이션의 도메인이 다르더라도 MessageQueue(Broker)에 접근만 가능하다면 처리가 가능하기 때문입니다.     

참고
----
Observer vs Pub-Sub pattern : <https://hackernoon.com/observer-vs-pub-sub-pattern-50d3b27f838c>    


