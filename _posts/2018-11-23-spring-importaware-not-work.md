---
layout: post
title: (Spring) ImportAware is not work
category : Java
tags : [spring,importaware,beanfactorypostprocessor,lifecycle]
--- 
ImportAware 구현체가 동작하지 않는 이슈가 발생해 구글링해보다가 해결이 되지 않아 직접 스프링 코어 소스를 까서 원인을 확인한 부분에 대해 기록한 글입니다.    

Issue
----
개발중인 모듈을 ```@EnableXXX``` 방식으로 어노테이션 지정시 별도 설정없이 동작하기 위해 아래와 같은 Configuration을 Import 하도록 하였습니다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(LocalCacheConfig.class)
public @interface EnableLocalCache {
    ……
}
 
public class LocalCacheConfig implements ImportAware, BeanFactoryPostProcessor {
    ……
 
@Override
    public void setImportMetadata(AnnotationMetadata importMetadata) {
        enabled = importMetadata.hasAnnotation(EnableLocalCache.class.getName());
        if (! enabled) {
            return;
        }
……
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        if (! enabled) {
            return;
        }

        beanFactory.registerSingleton("localCacheManager", localCacheManager());
    }
}
```

ImportAware.setImportMetadata 메소드에서 ```@EnableLocalCache``` 여부를 파악하고 다른 bean이 생성되기전 BeanFactoryPostProcessor.postProcessBeanFactory 메소드를 통해 localCacheManager를 주입하여 다른 Bean 생성시 주입되는 localCacheManager Bean이 null이 되지 않게하는 처리 부분입니다.    
간단하게 테스트용 프로젝트를 만들고 위와 같이 실행시    

1. ImportAware.setImportMetadata    
2. BeanFactoryPostProcessor.postProcessBeanFactory
    
위 순서대로 동작함을 확인하고 개발을 진행하였습니다.    

모듈 개발을 완료하고 실 서비스에 적용하였는데 POC를 진행한 Spring 5.x 버전에서는 이상이 없었으나 Spring 4.x 버전에서는 ImportAware가 실행되지 않아 localCacheManager Bean을 등록하지 못하는 이슈가 발생하였습니다. (사실 이슈가 처음 발생했을때는 버전 문제라는 것 조차 인식하지 못한 상태이긴 합니다.)
 
Spring Context refresh 주요 단계
----
```java
// AbstractApplicationContext.java
// Allows post-processing of the bean factory in context subclasses.
postProcessBeanFactory(beanFactory);

// Invoke factory processors registered as beans in the context.
invokeBeanFactoryPostProcessors(beanFactory);

// Register bean processors that intercept bean creation.
registerBeanPostProcessors(beanFactory);

// Initialize message source for this context.
initMessageSource();

// Initialize event multicaster for this context.
initApplicationEventMulticaster();

// Initialize other special beans in specific context subclasses.
onRefresh();

// Check for listener beans and register them.
registerListeners();

// Instantiate all remaining (non-lazy-init) singletons.
finishBeanFactoryInitialization(beanFactory);

// Last step: publish corresponding event.
finishRefresh();
```
 
Spring 기동시 context를 초기화 하는 과정의 일부입니다.     
BeanFactoryPostProcessor 구현시 두번째 단계인 invokeBeanFactoryPostProcessors메소드를 실행하게 되는데 이 과정에서 bean 생성에 필요한  BeanDefinition을 추가하거나 BeanFactory 생성 후 작업을 진행하게 됩니다.
 
Spring 4.x
----
invokeBeanFactoryPostProcessors 메소드 실행과정에서 bean이 Singleton으로 생성되며 beanFactory에 저장되게 됩니다.    
PriorityOrdered를 구현하거나 ```@Order```어노테이션이 추가되 있지 않다면 위 코드에서 beanFactory.getBean시 생성되어 beanFactory에 저장되게 됩니다.    

```java
// PostProcessorRegistrationDelegate.java
// Finally, invoke all other BeanFactoryPostProcessors.
List<BeanFactoryPostProcessor> nonOrderedPostProcessors = new ArrayList<BeanFactoryPostProcessor>();
for (String postProcessorName : nonOrderedPostProcessorNames) {
   nonOrderedPostProcessors.add(beanFactory.getBean(postProcessorName, BeanFactoryPostProcessor.class));
}
invokeBeanFactoryPostProcessors(nonOrderedPostProcessors, beanFactory);
```

Bean 생성이후 BeanFactoryPostProcessor.postProcessBeanFactory 메소드를 실행한 후 invokeBeanFactoryPostProcessors 메소드 실행과정이 끝나며 이 때 ImportAware.setImportMetadata는 실행되지 않습니다.        
이 후 ImportAware.setImportMetadata 메소드가 실행되는 시점은 finishBeanFactoryInitialization 메소드에서 BeanDefinition중 생성되지 않은 bean에 대해 생성하면서 실행되게 되는데 이 때 BeanFactoryPostProcessor를 구현한 구현체는 이미 singleton으로 생성되었기 때문에 더 이상 실행되지 않고 끝나게 됩니다.    
 
Spring 5.x
----
5.x 버전의 경우 똑같이 invokeBeanFactoryPostProcessors메소드 실행과정을 거치나  BeanDefinitionRegistryPostProcessor중 ConfigurationClassPostProcessor의 postProcessBeanFactory 동작시 차이가 생깁니다.    

```java
// PostProcessorRegistrationDelegate.java
invokeBeanFactoryPostProcessors(registryProcessors, beanFactory);
invokeBeanFactoryPostProcessors(regularPostProcessors, beanFactory);
```

BeanFactoryPostProcessor만 구현한 구현체를 처리하기전 BeanDefinitionRegistryPostProcessor를 구현한 구현체를 먼저 처리하는 과정이 있는데 Spring에서 기본적으로 실행하는 구현체로 ConfigurationClassPostProcessor가 존재합니다.

```java
//ConfigurationClassPostProcessor.java
@Override
public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
   int factoryId = System.identityHashCode(beanFactory);
   if (this.factoriesPostProcessed.contains(factoryId)) {
      throw new IllegalStateException(
            "postProcessBeanFactory already called on this post-processor against " + beanFactory);
   }
   this.factoriesPostProcessed.add(factoryId);
   if (!this.registriesPostProcessed.contains(factoryId)) {
      // BeanDefinitionRegistryPostProcessor hook apparently not supported...
      // Simply call processConfigurationClasses lazily at this point then.
      processConfigBeanDefinitions((BeanDefinitionRegistry) beanFactory);
   }

   enhanceConfigurationClasses(beanFactory);
   beanFactory.addBeanPostProcessor(new ImportAwareBeanPostProcessor(beanFactory));
}
```

위 구현체의 먼저 실행하는 postProcessBeanFactory 메소드를 보면 마지막줄에 beanFactory에 ImportAwareBeanPostProcessor를 추가하는 부분이 있습니다.     
이로 인해 bean을 생성할때 ImportAwareBeanPostProcessor.postProcessBeforeInitialization이 실행되면서 ImportAware.setImportMetadata 메소드가 먼저 실행하게 되고 그 이후 BeanFactoryPostProcessor.postProcessBeanFactory 실행되게 됩니다.      
참고로 ConfigurationClassPostProcessor는 PriorityOrdered를 구현한 구현체로 실행순서는 최하위 입니다.      

```java
@Override
public int getOrder() {
   return Ordered.LOWEST_PRECEDENCE;  // within PriorityOrdered
}
```

그래서 BeanFactoryPostProcessor가 아닌 BeanDefinitionRegistryPostProcessor를 구현한 구현체와 함께 ImportAware를 사용할 경우 5.x 버전에서도 똑같이 동작하지 않게 됩니다.      
 
Conclusion
----
- BeanFactoryPostProcessor는 bean을 생성하기 전 BeanFactory 초기화 이후 실행되며 ImportAware는 bean이 생성되는 시점에 실행되므로 일반적으로 실행시점은 ImportAware가 더 늦게 실행됩니다.    
- bean생성 이전 (또는 BeanFactoryPostProcessor실행 이전)에 로직을 실행하고 싶을 경우 ImportBeanDefinitaionRegistrar를 이용할 수 있습니다.    

```java
public class LocalCacheConfig implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        if (!importingClassMetadata.hasAnnotation(EnableLocalCache.class.getName())) {
            return;
        }

        try {
            Map<String, Object> metaData = importingClassMetadata.getAnnotationAttributes(EnableLocalCache.class.getName());
……
        } catch (Exception e) {
            log.error("localcache initialize error : {}", e.getMessage());
        }
    }
}
```

ConfigurationClassPostProcessor가 postProcessBeanDefinitionRegistry를 실행하면서 ImportBeanDefinitaionRegistrar구현체를 모두 실행해줍니다.    
- POC진행은 꼭 같은버전에서 하세요 ㅠㅠㅠㅠㅠ     
