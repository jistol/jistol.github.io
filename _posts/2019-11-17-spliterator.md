---
layout: post
title: "Spliterator의 소개 및 활용 (in JDK 1.8)"
category : Java
tags : [stream,spliterator]
metaimg : {{ site.baseurl }}{{ site.author.img }}
description : "JDK 1.8 에서 추가된 Stream API 중 Spliterator 인터페이스를 학습한 내용에 대해 정리한 글입니다."
---    

Overview
----
Spliterator 인터페이스를 접한건 Stream을 복제할 수 있는 방법이 없을까 고민하다 포함된 메서드들 중 spliterator()는 어떤건지 궁금해 찾아보게 됬습니다.     
처음에 여기저기 블로그에 정리된 글을 찾아봤을땐 병렬처리를 지원하기 위해 Stream에 종속된 기능 정도로만 생각했는데, Oracle 공식 JDK 문서에는 특정 소스의 객체를 순회하거나 파티셔닝 하기 위한 인터페이스로 Stream의 파이프라이닝 처리를 위해 `java.util.stream.Sink` 클래스와 함께 핵심적인 역활을 맡고 있습니다. 
Stream외에도 배열/Collection/IOChannel 등 복수개의 개체를 지닌 모든 소스들에서 구현되거나 사용 할 수 있으며 생성 방법은 아래와 같습니다.    

```java
// Stream과 Collection의 경우 기본적으로 spliterator 메서드를 제공합니다.     
Spliterator<Integer> byStream = IntStream.range(0, 100).spliterator();    
Spliterator<Integer> byCollection = (new ArrayList<Integer>()).spliterator();    
// 배열의 경우 Spliterators 클래스를 통해 Spliterator 객체를 생성 할 수 있습니다.
Spliterator<Integer> byArray = Spliterators.spliterator(new int[]{1,2,3,4}, Spliterator.SORTED);
```     

Methods
----
## characteristics ##
Spliterator 객체의 특성에 대한 int값을 반환하는 메서드로 속성은 ORDERED, DISTINCT, SORTED, SIZED, NONNULL, IMMUTABLE, CONCURRENT, SUBSIZED 가 있으며 각 특성은 어떤 Spliterator 객체인가에 따라 다르며 그에 따른 각 메서드들의 내부적인 동작이 다를 수 있습니다.    
예를 `IntStream.of`의 Spliterator의 경우 "IMMUTABLE, ORDERED, SIZED, SUBSIZED"의 특성을 가지고 있으나 `IntStream.generate`의 Spliterator의 경우 "IMMUTABLE"의 특성만을 지니고 있습니다. 또한 `Set`의 Spliterator의 경우 "DISTINCT, SIZED"의 특성을 가지고 있으며 `List`의 Spliterator의 경우 "ORDERED, SIZED, SUBSIZED"의 특성을 가집니다.      

`characteristics`메서드의 반환값은 int형인데 Spliterator 객체에 포함된 모든 특성값의 합을 반환합니다.

```java
// Set의 경우 DISTINCT=1, SIZED=64 의 합인 65를 반환합니다.
new HashSet().spliterator().characteristics();  // 65
// List의 경우 ORDERED=16, SIZED=64, SUBSIZED=16384 의 합인 16464를 반환합니다.
new ArrayList().spliterator().characteristics(); // 16464
```

Spliterator의 각 특성은 `hasCharacteristics`메서드를 통해 확인 할 수 있습니다.

## estimateSize ##
순회할 개체의 사이즈를 알 수 있는 메서드로 SIZED/SUBSIZED 특성을 지녔으며 순회할 남은 개체의 사이즈를 반환해줍니다. 쉽게 말해 개수가 제한되어 있는 Stream의 사이즈를 알 수 있습니다.     
Spliterator의 총 개체수가 아닌 순회 할 수 있는 개체의 개수이기 때문에 이미 순회한 개체의 수는 포함되지 않습니다.    

```java
@Test
public void estimateSize_test() {
    Spliterator<Integer> spliterator = IntStream.of(1,2,3,4,5).spliterator();
    System.out.println(spliterator.estimateSize()); // print 5
    spliterator.tryAdvance(t -> {});
    spliterator.tryAdvance(t -> {});
    spliterator.tryAdvance(t -> {});
    System.out.println(spliterator.estimateSize()); // print 2
}
``` 

## tryAdvance ##    
Spliterator의 요소가 남아 있을 경우 인자로 주어진 액션을 실행하고 요소의 존재 유무를 반환하는데, 특성에 ORDERED가 포함되어 있을 경우 순차적으로 요소를 제공하게 됩니다.    
이 메서드의 주의할 점은 리턴값이 hasNext의 개념이 아니라 isExecuted의 개념이란 점입니다. 아래 예제를 보면 요소가 3개이나 3번째 호출까지 계속 true를 반환하는 것을 볼 수 있습니다.        

```java
@Test
public void tryAdvance_test() {
    Spliterator<Integer> spliterator = IntStream.of(1,2,3).spliterator();
    
    boolean r1 = spliterator.tryAdvance(System.out::println); // print 1
    boolean r2 = spliterator.tryAdvance(System.out::println); // print 2
    boolean r3 = spliterator.tryAdvance(System.out::println); // print 3
    boolean r4 = spliterator.tryAdvance(System.out::println); // not execute

    System.out.println(r1 + ", " + r2 + ", " + r3 + ", " + r4); // true, true, true, false
}
```

Spliterator 인터페이스에선 본 메서드를 사용하여 순회하는 `forEachRemaining` 메서드를 기본적으로 제공하며 코드는 아래와 같습니다.    

```java
default void forEachRemaining(Consumer<? super T> action) {
    do { } while (tryAdvance(action));
}
```

구현 메서드가 위와 같이 hasNext / isExecuted의 양쪽 개념을 다 포괄 할 수 있기 때문에 어느쪽이든 크게 상관없다 싶지만 가능하면 isExecuted 개념으로 구현하는 것을 권장합니다.    

## trySplit ##
Spliterator를 분할 하는 메서드로 원 객체에서 분할된 Spliterator를 반환하는데 ORDERED 특성일 경우 반환된 값이 앞부분이 되고 원 객체가 뒷부분이 됩니다.    

```java
@Test
public void trySplit_test() {
    Spliterator<Integer> origin = IntStream.range(0, 19).spliterator();
    Spliterator<Integer> dest = origin.trySplit();

    System.out.println(dest.estimateSize());  // size is 9
    dest.forEachRemaining(System.out::print); // print 0~8
    System.out.println();
    System.out.println(origin.estimateSize());  // size is 10
    origin.forEachRemaining(System.out::print);  // print 9 ~ 18
}
```

아쉽게도 분할할 사이즈나 범위는 제어 할 수 없도록 되어 있으며 절반으로 나뉘게 됩니다. 일반적인 Stream의 경우 parallel일 경우에만 분할이 가능하며 아닐 경우 분할한 Spliterator는 null로 반환합니다.    

```java
// java.util.stream.StreamSpliterators.AbstractWrappingSpliterator
@Override
public Spliterator<P_OUT> trySplit() {
    if (isParallel && !finished) {
        init();

        Spliterator<P_IN> split = spliterator.trySplit();
        return (split == null) ? null : wrap(split);
    }
    else
        return null;
}
```        

Customize
----
Stream을 분할 할 수도 있고, size를 미리 알수 있으며, 흐름에 따라 일괄 처리되던 Stream을 단 건으로 실행 할 수 있는 등 이미 그 자체로도 충분히 활용할 곳이 많지만 Spliterator 자체를 커스텀하여 만들 경우 좀 더 다양하게 활용 가능합니다.    
다음 Spliterator는 카운트를 지정하여 해당 카운트 만큼 Stream이 실행되면 pinned 메소드에 등록한 리스너를 실행합니다.    

```java
public class PinPointSpliterator<T> implements Spliterator<T> {
    private final Spliterator<T> spliterator;
    private final AtomicInteger counter = new AtomicInteger();
    private int pinCount = -1;
    private IntFunction<Boolean> listener = null;
    private boolean isListen = false;
    
    public PinPointSpliterator(Spliterator<T> spliterator) {
        this.spliterator = spliterator;
    }
    
    public PinPointSpliterator(Stream<T> stream) {
        this(stream.spliterator());
    }
    
    public static <T> PinPointSpliterator<T> newInstance(Stream<T> stream) {
        return new PinPointSpliterator<>(stream);
    }
    
    public PinPointSpliterator pinCount(int pinCount) {
        this.pinCount = pinCount;
        return this;
    }

    public PinPointSpliterator pinned(IntFunction<Boolean> listener) {
        this.isListen = listener != null;
        this.listener = listener;
        return this;
    }

    @Override
    public boolean tryAdvance(Consumer<? super T> action) {
        boolean hasNext = this.spliterator.tryAdvance(action);
        if (isListen && pinCount > 0 && counter.incrementAndGet() % pinCount == 0) {
            isListen = listener.apply(counter.get());
        }
        return hasNext;
    }

    @Override
    public Spliterator<T> trySplit() {
        return new PinPointSpliterator(this.spliterator.trySplit());
    }

    @Override
    public long estimateSize() {
        return this.spliterator.estimateSize();
    }

    @Override
    public int characteristics() {
        return this.spliterator.characteristics();
    }
}
```

실행은 아래와 같이 할 수 있습니다.    

```java
@Test
public void pinPointSpliterator_test() {
    List<Integer> buffer = new ArrayList<>();
    PinPointSpliterator<Integer> spliterator = PinPointSpliterator.newInstance(IntStream.range(0, 1000).boxed())
            .pinCount(100)
            .pinned(count -> {
                System.out.println("do listen. buffer size is " + buffer.size());
                buffer.clear();
                return count < 500;
            });
    StreamSupport.stream(spliterator, false)
        .peek(i -> buffer.add(i))
        .collect(Collectors.toList());

    System.out.println("final buffer size is " + buffer.size());
}
```

위 예제에서 100회 실행시마다 pinned에 설정된 리스너를 실행하는데 buffer의 사이즈를 출력하고 초기화하며, 500회보다 적게 실행된 경우에만 동작하므로 500회 이후엔 모두 buffer에 쌓이므로 500개가 쌓이게 됩니다. 최종 출력은 다음과 같습니다.    

```text
do listen. buffer size is 100
do listen. buffer size is 100
do listen. buffer size is 100
do listen. buffer size is 100
do listen. buffer size is 100
final buffer size is 500
```

Conclusion
----
워낙 Stream에서 많은 기능을 제공하기에 잘 사용하지 않았었지만 Stream을 쓰다보면 무언가 조금씩 아쉬운 부분들이 존재했습니다. 예를 들어 1000개씩 분할해서 List로 담고 싶다던가, 특정 실행 횟수마다 어떤 동작을 한다던가, Stream의 전체 개수에 따라 다른 액션이 필요할 경우 등등 ... 기존 Stream으로는 번거로운 작업들을 좀 더 쉽게 처리 할 수 있어 잘 쓰기만 한다면 많이 활용 할 수 있을것 같습니다.    




