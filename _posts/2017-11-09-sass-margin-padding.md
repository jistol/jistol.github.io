---
layout: post
title: SASS를 이용하여 margin / padding 을 조절할 수 있는 class 자동생성하기 (@for, @if, @each)
category : Frontend 
tags : [scss,sass,css]
---
Bootstrap 으로 자주 썼던 class중 하나가 margin/padding 사이즈를 조절해주는 class였습니다.    
하지만 정확한 픽셀 단위로 조절 해주는게 아니라서 정확한 사이즈 조절이 힘들었는데 SASS를 이용해서 간단하게 만들어봤습니다.    

- as-is    

```html
<div style="margin-bottom:10px;margin-top:10px;"/>
```

- to-be    

```html
<div class="px-mb-10 px-mt-10"/>
```

- scss 코드     

```sass
/**
  px값 List를 만들어주는 함수입니다.
*/
@function size($start, $end) {
    $size : ();
    @for $i from $start through $end {
        $value : $i + 0;
        $size : append($size, $value);
    }
    @return $size;
}

/**
  값이 0일때는 0으로, 그 외에는 'px'을 붙여줍니다.
  ex) 0 => 0, 10 => 10px
*/
@function getPx($value) {
    @if $value == 0 {
        @return $value;
    } @else {
        @return $value + 0px;
    }
}

/** 
  px 값입니다.
  0 ~ 100px 까지 조정하게 만들었습니다.
*/
$size : size(0, 100);

/**
  margin과 padding의 각 위치를 지정해주는 map 입니다.
  key는 class이름 생성시 쓰이며 value는 상세 속성 정의시 쓰입니다.
*/
$position : ('l':'left', 'r':'right', 't':'top', 'b':'bottom');

/**
  margin과 padding 생성을 위한 map입니다.
  key는 class이름 생성시 쓰이며 value는 상세 속성 정의시 쓰입니다.
*/
$nameMap : ('px-m':'margin', 'px-p':'padding');
/**
  실제 css class를 만들어주는 mixin입니다.
  nameMap, position, size를 혼합하여 아래와 같은 형식으로 만들어줍니다.
  
  ex>
  px-m-0 : { margin : 0; }
  px-mt-1 : { margin-top : 1px; }
*/
@mixin generate($nameMap : (), $position : (), $size : ()) {
    @each $preKey, $preValue in $nameMap {
        @each $px in $size {
            .#{$preKey}-#{$px} {
                #{$preValue} : getPx($px);
            }
            @each $sufKey, $sufValue in $position {
                .#{$preKey}#{$sufKey}-#{$px} {
                    #{$preValue}-#{$sufValue} : getPx($px);
                }
            }
        }
    }
}


@include generate($nameMap, $position, $size);
```

node-sass를 이용하여 scss파일을 css로 빌드해보면 아래와 같이 만들어집니다.


```css
.px-m-0 {
  margin: 0; }

.px-ml-0 {
  margin-left: 0; }

.px-mr-0 {
  margin-right: 0; }

.px-mt-0 {
  margin-top: 0; }

.px-mb-0 {
  margin-bottom: 0; }

.px-m-1 {
  margin: 1px; }

.px-ml-1 {
  margin-left: 1px; }

...


.px-pb-99 {
  padding-bottom: 99px; }

.px-p-100 {
  padding: 100px; }

.px-pl-100 {
  padding-left: 100px; }

.px-pr-100 {
  padding-right: 100px; }

.px-pt-100 {
  padding-top: 100px; }

.px-pb-100 {
  padding-bottom: 100px; }
```
