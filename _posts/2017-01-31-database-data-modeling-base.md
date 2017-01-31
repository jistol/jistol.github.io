---
layout: post
title: 데이터모델링 정리
category : Database
tags : [data-modeling]
---

데이터 모델링이란?
----
시스템 구축을 위해 업무의 데이터를 **분석하는 방법**, 명확하게 표현하는 **추상화 기법**

중요성
----
- 파급효과(Leverage) : 데이터 구조가 프로젝트 막바지에 바뀌게 되면 영향도가 큽니다.    
- 요구사항의 간결한 표현(Conciseness) : 요구사항 파악하기 좋고, 많은 관련자들이 소통하기 좋습니다.    
- 데이터 품질(Data Quality) : 데이터는 시스템의 자산. 정확성이 떨어지는 데이터는 가치가 없습니다.    

유의점
----
**중복**을 피하고, **유연**해야하며, **일관성**있어야 합니다.

데이터 모델링 단계
----
- 개념적 데이터 모델링 : 핵심 엔터티와 그들 간의 관계를 찾고 엔터티-관계 다이어 그램을 생성합니다.    

![개념적 데이터 모델링](/assets/img/database-data-modeling-base/3.jpg)    
※ 출처 : http://dbteam6.pbworks.com/f/1179078501/%EC%A7%84%EC%A7%9C%EC%A7%84%EC%A7%9C%EC%B5%9C%EC%A2%85.jpg

- 논리적 데이터 모델링 : 실질적으로 프로젝트에서 사용할 비지니스 정보의 논리적인 구조와 규칙을 명시하는 단계로 실질적으로 모델링을 완료하는 단계입니다.(정규화 활동이 포함)

![논리적 데이터 모델링](/assets/img/database-data-modeling-base/4.gif)    
※ 출처 : http://cfs9.tistory.com/upload_control/download.blog?fhandle=YmxvZzE5NDM0MkBmczkudGlzdG9yeS5jb206L2F0dGFjaC8wLzc5LmdpZg%3D%3D

- 물리적 데이터 모델링 : 논리모델에서 설계된 내용을 실제 물리적으로 어떻게 표현될지를 정합니다.

![물리적 데이터 모델링](/assets/img/database-data-modeling-base/5.png)    
※ 출처 : https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Data_model_in_ER.png/700px-Data_model_in_ER.png

데이터 모델링 구조 및 독립성
----
데이터 모델링의 구조와 독립성에 대한 여러가지 설명이 있지만 아래 두 그림으로 딱 설명이 되는것 같습니다.    
![데이터모델링 구조](/assets/img/database-data-modeling-base/1.jpg)    
※ 출처 : http://cfile28.uf.tistory.com/image/2119243556BD75431EB784    

![데이터모델링 예제](/assets/img/database-data-modeling-base/2.png)          
※ 출처 : http://cfile233.uf.daum.net/image/2056933C4F60B0312DC599    

- 외부스키마(외부단계)는 S/w, 개발자가 직접 접근하는 DB View입니다.
- 개념스키마(개념적단계)는 전체 DB를 기술합니다.
- 내부스키마(내부적단계)는 물리적 장치에 데이터가 실제적으로 저장되는 방법을 표현합니다.  

각 독립성은 각 스키마가 변경되더라도 서로 영향을 끼치지 않아야 한다는 의미입니다.

- 논리적 독립성 : 개념스키마가 변해도 외부스키마는 변하지 않도록 지원해야함.   
- 물리적 독립성 : 내부스키마가 변해도 개념스키마가 변하지 않도록 지원해야함.    

사상은 Mapping이라고 부르는것이 더 이해하기 쉽습니다. 각 저장구조가 바뀐다면 Mapping정보가 바뀌어야 독립성이 유지됩니다.    

- 논리적사상 : 외부뷰는 개념뷰에서 Mapping된 정보
- 물리적사상 : 개념뷰는 내부뷰에서 Mapping된 정보
