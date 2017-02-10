---
layout: post
title: (Java) JVM 구조 정리
category : Java
tags : [java,jvm]
---
그 동안 미뤄왔던 JVM의 기본 구조에 대해 여기 저기 사이트를 참고하여 최종 구조를 그려보았습니다.
여기서 제일 고민했던 부분은 보통 Heap의 Permanent Area로 불리는 영역이 Method Area와 별개인가? 하는 점이였는데 최종 결론은 같은 영역이다!! 라고 결론을 내렸습니다. ([RUNTIME DATA AREAS – JAVA’S MEMORY MODEL](http://www.pointsoftware.ch/en/under-the-hood-runtime-data-areas-javas-memory-model/))참고

JVM 구조
----
![JVM 전체구조](/assets/img/java/java-jvm-structure/1.png)    

참고
----
- [Naver D2 - JVM Internal](http://d2.naver.com/helloworld/1230)
- [RUNTIME DATA AREAS – JAVA’S MEMORY MODEL](http://www.pointsoftware.ch/en/under-the-hood-runtime-data-areas-javas-memory-model/)
