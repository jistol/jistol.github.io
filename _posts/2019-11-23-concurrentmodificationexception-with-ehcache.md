---
layout: post
title: "java.util.ConcurrentModificationException null (with ehcache)"
category : Java
tags : [exception,troubleshooting,ehcache,cache,concurrentmodificationexception]
metaimg : /public/img/profile.jpg
description : "병렬 프로그래밍을 하다 보면 만나게 되는 흔한 오류 중 하나가 `java.util.ConcurrentModificationException`입니다."
---   
Triggering a ConcurrentModificationException
----
병렬 프로그래밍을 하다 보면 만나게 되는 흔한 오류 중 하나가 `java.util.ConcurrentModificationException`입니다. thread-safe 하지 않은 ArrayList 같은 객체를 여러 스레드에서 동시에 조작하다 보면 발생하게 되는데 주된 원인은 for-loop 도중 조작할 경우 입니다.    

```java
// java
List<Integer> intList = new ArrayList<>();
for (Integer i : intList) {
    ...
}

// class
List<Integer> intList = new ArrayList<>();
Iterator<Integer> iter = intList.iterator();
while(iter.hasNext()) {
    Integer i = iter.next();
    ...
}
```    

for-loop 구문을 class 컴파일 하면 위와 같은 코드로 변환되는데 ArrayList가 Iterator를 생성할 때 내부 클래스인 ArrayList.Itr 클래스로 생성하여 반환되며 Itr 클래스는 생성시 ArrayList의 상위클래스인 AbstractList의 modCount 변수를 자신의 지역변수인 expectedModCount에 할당합니다. modCount는 ArrayList의 변경사항이 생길 때 마다 변경된 카운트를 기록하는 변수로 add / remove / trimToSize 등등 다수의 메서드에서 증가됩니다.       

```java
private class Itr implements Iterator<E> {
        int cursor;       // index of next element to return
        int lastRet = -1; // index of last element returned; -1 if no such
        int expectedModCount = modCount;
        ...
}
```    

expectedModCount 변수는 next() 메서드를 실행할 때 기존 자신이 참조하고 있는 ArrayList의 변경사항이 있는지 체크하게 되는데 이 때 참조 리스트의 modCount와 자신의 지역변수인 expectedModCount를 비교하여 다를 경우 `java.util.ConcurrentModificationException`를 발생시킵니다.    

```java
// ArrayList.Itr class
public E next() {
    checkForComodification();
    ...
}

final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```    

static 변수로 선언되어 여러 스레드에 조작되다 발생 할 수도 있으나 아래 예제와 같이 단일 스레드 내에서도 동일하게 발생 할 수 있습니다. 다른 블로그나 StackOverFlow의 질문들을 보면 대부분 remove 구문을 예시로 들지만 remove 뿐만 아닌 modCount가 조작되는 모든 메서드에 해당됩니다.    

```java
@Test(expected = ConcurrentModificationException.class)
public void concurrentModificationExceptionTest() {
    List<Integer> list = Lists.newArrayList(1,2,3,4,5,6,7);
    for (Integer i : list) {
        if (i==2) {
            list.add(8);
        }
    }
}
```    

회피 하는 방법은 여러가지가 존재하는데 [Avoiding the ConcurrentModificationException in Java](https://www.baeldung.com/java-concurrentmodificationexception)문서를 참고하시면 좋습니다.    

ConcurrentModificationException with Ehcache
----
자신이 병렬 스레드를 사용하지 않았고, for-loop문 내에서 조작하지 않았다고 해서 `java.util.ConcurrentModificationException`이 발생하지 않을꺼라 생각할 수 있으나 in-memory cache를 사용할 때 역시 주의해야 합니다.    

```java
// MyCacheService.class
@Cacheable
public List<Integer> getCacheList() { ... }

// OtherService
@Autowired private MyCacheService myCacheService;

public void sortList() {
    List<Integer> cachedList = myCacheService.getCacheList();
    cachedList.sort(Integer::compareTo);
    for(Integer i : cachedList) {
        System.out.println(i);
    }
}
```    

얼핏 보기엔 sortList 메서드는 안전해 보이지만 Ehcache를 사용하고 있다면 부하 상황에서 반드시 `java.util.ConcurrentModificationException`이 발생하게 됩니다. for-loop 구문 안에서 조작하지 않았는데 발생하는 이유는 Ehcache가 데이터를 heap과 disk에 나눠 관리하기 때문입니다. 해당 데이터가 heap에 존재할 경우 캐시에서 동일한 레퍼런스 객체를 반환하기 때문에 static으로 공유된 객체를 사용하는 것과 동일한 이슈를 발생 시키게 되는데 아래 테스트케이스에서 볼 수 있듯이 캐시에서 받아온 List객체를 조작하게 되면 기존 캐시에 저장된 객체가 같이 바뀌어 있는것을 확인 할 수 있습니다.     

```java
@Test
public void cacheValueReferenceTest() {
    final Cache cache = getCache();
    final String key = "TEST_KEY";
    List<Integer> value = Lists.newArrayList(7,6,5,4,3,2,1);
    cache.put(key, value);
    
    value.sort(Integer::compareTo);
    
    List<Integer> cacheValue = cache.get(key, List.class);
    assertTrue(cacheValue.get(0) == 1);
}
```

동시성 문제가 발생하는 케이스는 아래 테스트케이스에서 확인 할 수 있습니다.    

```java
@Test
public void concurrentModifiedExceptionTest() throws InterruptedException {
    final Cache cache = getCache();
    final String key = "TEST_KEY";
    List<Integer> value = Lists.newArrayList(7,6,5,4,3,2,1);
    cache.put(key, value);

    AtomicBoolean isDetectException = new AtomicBoolean(false);
    CountDownLatch latch1 = new CountDownLatch(1);
    CountDownLatch latch2 = new CountDownLatch(1);
    
    Runnable thread1 = () -> {
        try {
            List<Integer> value1 = cache.get(key, List.class);
            for (Integer v : value1) {
                latch2.await();
            }
        } catch (Exception e) {
            log.error("thread1 error : {} {}", e.getClass().getName(), e.getMessage());
            isDetectException.set(e instanceof ConcurrentModificationException);
        } finally {
            latch1.countDown();
        }
    };
    
    Runnable thread2 = () -> {
        List<Integer> value2 = cache.get(key, List.class);
        value2.sort(Integer::compareTo);
        latch2.countDown();
    };

    new Thread(thread1).start();
    Thread.sleep(100);
    new Thread(thread2).start();
    latch1.await();
    assertTrue(isDetectException.get());
}
```    

1번 스레드가 캐시에서 데이터를 가져와 for-loop 지점에 진입한 상태에서 2번 스레드가 캐시값에 접근하여 변경(sort와 같은..)작업을 시도하면 내부적으로 ArrayList의 modCount값이 바뀌면서 1번 스레드의 Iterator.next 구문 실행시 `java.util.ConcurrentModificationException`를 발생시키게 됩니다.    

Conclusion
----
동시성 문제는 평시엔 잘 발견되지 않기 때문에 일반적인 테스트만 진행하고 실 서비스에 배포되면 운영중 가장 중요한 시기에 장애가 터지게 되어 난감할 때가 많습니다. 매번 성능 테스트를 할 수 없다면 위와 같은 경우에 항상 주의하며 코딩해야하며, 필자는 Ehcache의 프로세스를 확인하지 않아 디버깅에 오래걸렸지만 `java.util.ConcurrentModificationException`의 경우 반드시 for-loop 안에서 타켓 리스트객체를 수정했거나, 공유되는 리스트객체를 동시에 조작한 두가지 경우에 발생함을 유의하고 빠르게 디버깅 하시기 바랍니다.     

Reference
----
Avoiding the ConcurrentModificationException in Java : <https://www.baeldung.com/java-concurrentmodificationexception>
