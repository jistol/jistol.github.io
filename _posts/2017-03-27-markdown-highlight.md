---
layout: post
title: Markdown syntax highlight
category : Etc
tags : [markdown,jekyll]
---
기존 Github Page에서 코드라인의 문법 하이라이팅 방법은 아래 방법을 사용했었습니다.

\{% highlight java %\}     
public static void main(String... args)     
{     
  System.out.println("Hello World.")     
}    
\{% endhighlight %\}    

위 방식은 Jekyll에서 사용할 수 있는 liquid tag 방식으로 이렇게 사용할 경우 Jekyll서버상에서는 예쁘게 변경되어 보이나, 문서 작업시 Atom Editor의 미리보기에서는 아래와 같이 문자열로 보이게 됩니다.     

![liquid tag](/assets/img/etc/markdown-highlight/1.png)     

Atom Editor 미리보기에서도 하이라이팅된 코드를 보고 싶을 경우 아래와 같이 코드블럭을 통해 쓸 수 있습니다.

\```java    
public static void main(String... args)     
{     
  System.out.println("Hello World.")     
}    
\```

![another style](/assets/img/etc/markdown-highlight/2.png)    

사용가능한 하이라이팅 포맷은 c, java, bash, sql, html, js, scala, xml... 등 다양하며 전체 포맷은 [Syntax highlighting in markdown](https://support.codebasehq.com/articles/tips-tricks/syntax-highlighting-in-markdown) 링크를 참고 하시기 바랍니다.
