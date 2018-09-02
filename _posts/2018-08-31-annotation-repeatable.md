---
layout: post
title: "어노테이션 반복정의를 위한 @Repeatable 작성법과 주의점" 
category : Java
tags : [java,mannotation,repeatable]
---
개발시 어노테이션을 많이 이용하는 편인데 종종 하나의 클래스, 또는 메소드에 여러 속성을 정의하고 싶을때가 있습니다.    
JDK ~1.7 에서는 아래와 같은 방식으로 정의가 가능했습니다.    

```java
// case 1
@GreenColor
@BlueColor
@RedColor
public class RGBColor { ... }

// case 2
@Color(colors={"green", "blue", "red"}
public class RGBColor { ... }
``` 

JDK 1.8부터는 같은 어노테이션을 중복정의 가능한 `@Repeatable` 어노테이션을 제공합니다. 

@Repeatable Tutorial
----
JavaDoc에 정의된 정식 설명은 아래와 같습니다.    

```text
The annotation type java.lang.annotation.Repeatable is used to indicate that the annotation type whose declaration it (meta-)annotates is repeatable. The value of @Repeatable indicates the containing annotation type for the repeatable annotation type.
```

`@Repeatable` 어노테이션을 이용하면 다음과 같이 정의가 가능해집니다.    

```java
@Color("green")
@Color("blue")
@Color("red")
public class RGBColor { ... }
```

어노테이션을 정의하는 방법은 실 사용할 어노테이션과 그 어노테이션 묶음 값을 관리하는 컨테이너 어노테이션을 작성해야 합니다.   

```java
@Repeatable(value = Colors.class)
public @interface Color {}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Colors {
    Color[] value();  
}
```

위와 같이 정의시 아래와 같은 방법으로 해당 클래스에 정의된 어노테이션을 뽑아올 수 있습니다.    

```java
Colors colors = this.getClass().getAnnotation(Colors.class);
```

주의점
----
위와 같이 설정된 상태에서 아래와 같이 클래스를 작성하게 될 경우 이슈가 있습니다.    

```java
public class AnnotationTest {
    @Repeatable(value = Colors.class)
    public @interface Color {
        String value();
    }

    @Retention(RetentionPolicy.RUNTIME)
    public @interface Colors {
        Color[] value();
    }

    @Color("green")
    @Color("blue")
    @Color("red")
    public class RGBColor {}

    @Color("green")
    public class GreenColor {}

    @Test
    public void repeatableAnnotationTest() {
        RGBColor rgbColor = new RGBColor();
        GreenColor greenColor = new GreenColor();

        Colors rgbColors = rgbColor.getClass().getAnnotation(Colors.class);
        Color[] rgbColorArray = rgbColor.getClass().getAnnotationsByType(Color.class);

        Colors greenColors = greenColor.getClass().getAnnotation(Colors.class);
        Color[] greenColorArray = greenColor.getClass().getAnnotationsByType(Color.class);

        System.out.println("rgbColors : " + rgbColors);
        System.out.println("rgbColorArray : " + rgbColorArray);
        System.out.println("rgbColorArray.length : " + (rgbColorArray != null ? rgbColorArray.length : 0));
        System.out.println("greenColors : " + greenColors);
        System.out.println("greenColorArray : " + greenColorArray);
        System.out.println("greenColorArray.length : " + (greenColorArray != null ? greenColorArray.length : 0));
    }
}
```

테스트 코드를 돌려보면 결과는 아래와 같이 나옵니다.    

```text
rgbColors : @com.tmoncorp.module.sduf.test.common.AnnotationTest$Colors(value=[@com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=green), @com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=blue), @com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=red)])
rgbColorArray : [Lcom.tmoncorp.module.sduf.test.common.AnnotationTest$Color;@1996cd68
rgbColorArray.length : 3
greenColors : null
greenColorArray : [Lcom.tmoncorp.module.sduf.test.common.AnnotationTest$Color;@3339ad8e
greenColorArray.length : 0
```

`GreenColor`의 클래스는 `@Color`어노테이션이 1개만 정의되어 있어 `@Colors`로 묶이지 않고 `getAnnotation`로 가져올 경우 null을 반환하게 됩니다.    
그리고 `@Color`어노테이션이 1개만 정의되어 있을 경우 `@Colors`로 묶이지 않아 Retention Policy 정책이 생성되지 않으므로 `getAnnotationsByType` 메소드 호출시 반환값이 0개가 됩니다.

위와 같은 현상을 해결하기 위해서는 하위 어노테이션 정의시 `@Retention`을 정의해주고 `getAnnotationsByType`메소드를 이용하여 값을 찾으면 정확한 반환값을 찾을 수 있습니다.    

```java
    @Repeatable(value = Colors.class)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Color {
        String value();
    }
```

실행하면 아래와 같이 값이 존재하는것을 확인할 수 있습니다.    

```text
rgbColors : @com.tmoncorp.module.sduf.test.common.AnnotationTest$Colors(value=[@com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=green), @com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=blue), @com.tmoncorp.module.sduf.test.common.AnnotationTest$Color(value=red)])
rgbColorArray : [Lcom.tmoncorp.module.sduf.test.common.AnnotationTest$Color;@19e1023e
rgbColorArray.length : 3
greenColors : null
greenColorArray : [Lcom.tmoncorp.module.sduf.test.common.AnnotationTest$Color;@7cef4e59
greenColorArray.length : 1
```

참고
----
![Oracle JDK Doc - Annotation Type Repeatable](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html)      
![Java 8 Repeating Annotations Tutorial using @Repeatable with examples](https://www.javabrahman.com/java-8/java-8-repeating-annotations-tutorial/)







