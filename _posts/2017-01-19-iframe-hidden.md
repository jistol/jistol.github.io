---
layout: post
title: IFrame을 숨기는 방법
category : Web
tags : [iframe,hidden,html,javascript]
---

웹 작업시 내부적인 통신을 위해 iframe 숨겨서 사용하는 경우가 있습니다.   
이 때 iframe은 보여선 안되기 때문에 `width=0, height=0`으로 설정하는데 그럴 경우 크롬에서 아래 그림과 같이 여백으로 떠버리는 경우가 있습니다.     

![iframe이 공백으로 보이는 현상](/assets/img/6.png)

그래서 추가하는 방법이 style에 `display:none;`을 추가하게 되는데 이 역시 다른 브라우저에서 문제를 일으킬 소지가 있습니다.

_The iframes used to load test requests all have style="display:none".     
Firefox does not compute styles or perform certain other rendering tasks in elements that are display:none or are children of an element with display:none.      
Therefore, there are numerous test failures that are false negatives because the behavior in question isn't being triggered.     
This problem can be easily resolved by using style="visibility:hidden" instead._

`display:none;`으로 할 경우 iframe이 정상 로딩 되지 않을수 있다는 점인데, 이를 해결하기 위해 `display:none;` 대신 `visibility:hidden;`을 사용하면 됩니다.

iframe을 숨기기 위해 최종적으로 아래와 같은 방법으로 할 수 있습니다.

    {% highlight javascript %}
    iframe.setAttribute('style', 'height:0;width:0;border:0;border:none;visibility:hidden;');
    {% endhighlight %}
