---
layout: post
title: (SpringBoot) Enum 사용하기 - `@Enumerated`
category : Springboot
tags : [springboot,jpa,enum,enumrated]
---
[OKKY-Java Enum 활용하기](http://okky.kr/article/374496) 글을 보고 괜찮다 싶어서 제가 만들어 놨던 프로젝트에 적용해 보았습니다.     

우선 아래와 같이 `enum`을 선언했습니다.    

    {% highlight java %}
    public enum EnumCode
    {
        L("대형"),  // name : L, ordinal : 0
        M("중형"),  // name : M, ordinal : 1
        S("소형");  // name : S, ordinal : 2

        private String description;

        StoreTypeCode(String description)
        {
            this.description = description;
        }

        public String getDescription()
        {
            return description;
        }
    }
    {% endhighlight %}

Entity객체를 통해 테이블 컬럼에 'L', 'M', 'S'값을 저장할 예정이며 아래와 같이 설정하였습니다.

    {% highlight java %}
    @Enumerated(value = EnumType.STRING)
    @Column(name="enum_code", nullable = false)
    private EnumCode enumCode;
    {% endhighlight %}

위와 같이 `@Enumerated` 어노테이션을 선언해주면 해당 컬럼은 `enum`객체를 이용하여 저장하겠다고 선언이 되며 value값은 아래와 같이 설정 할 수 있습니다.

- EnumType.ORDINAL
  + `enum`객체의 `ordinal()`메서드를 이용하여 컬럼값을 저장합니다.
- EnumType.STRING
  + `enum`객체의 `name()`메서드를 이용하여 컬럼값을 저장합니다.

Repository에서는 아래와 같이 `enum`객체를 이용하여 불러오기가 가능해집니다.

    {% highlight java %}
    @Repository
    public interface IJpaRepository extends JpaRepository<MyEntity, Long>
    {
        List<MyEntity> findByEnumCode(EnumCode code);
        Page<MyEntity> findByEnumCode(EnumCode code, Pageable pageable);
    }
    {% endhighlight %}

Controller에서도 자동 맵핑이 가능한데 `@InitBinder`를 이용할 수 있습니다.

    {% highlight java %}
    @ControllerAdvice
    public class CommonDataBinder
    {
        @InitBinder
        public void enumCodeBinding(WebDataBinder binder)
        {
            binder.registerCustomEditor(EnumCode.class, new PropertyEditorSupport() {
                @Override public void setAsText(String text) throws IllegalArgumentException
                {
                    super.setValue(EnumCode.valueOf(text));
                }
            });
        }
    }

    public class ParamForm
    {
        private EnumCode storeTypeCode;

        public EnumCode getEnumCode()
        {
            return enumCode;
        }

        public void setEnumCode(EnumCode enumCode)
        {
            this.enumCode = enumCode;
        }
    }

    @RestController
    public class MyEntityController
    {
        @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
        public List<MyEntity> getList(ParamForm form)
        {
            return jpaRepository.findByEnumCode(form);
        }
    }
    {% endhighlight %}

위와 같이 설정하면 '/list?enumCode=L'과 같이 호출시 enumCode는 `@InitBinder`구문에 의해 자동으로 `enum`객체로 변경되어 파라메터 맵핑됩니다.
