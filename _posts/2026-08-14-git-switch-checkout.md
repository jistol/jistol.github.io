---
layout: post
title: "Git checkout이 switch로 바뀐 이유"
category : VCS
tags : [git,checkout,switch,restore]
---

# Git checkout이 switch로 바뀐 이유

Git을 사용하다 보면 브랜치를 변경할 때 다음과 같은 명령어를 자주 볼 수 있다.

```bash
git checkout main
```

그런데 최근 Git 사용법이나 문서를 보면 다음 명령어를 사용하는 경우가 많다.

```bash
git switch main
```

그렇다면 `git checkout`이 `git switch`로 변경된 것일까?

정확히 말하면 **`checkout`이 `switch`로 단순히 이름만 변경된 것은 아니다.**

기존 `checkout`이 담당하던 여러 역할을 명확하게 구분하기 위해 Git 2.23부터 `switch`와 `restore`라는 명령어가 추가되었다.

---

## 기존 checkout의 문제

`git checkout`은 하나의 명령어로 서로 다른 종류의 작업을 수행할 수 있었다.

### 1. 브랜치 이동

```bash
git checkout main
```

현재 브랜치에서 `main` 브랜치로 이동한다.

새로운 브랜치를 만들면서 이동할 수도 있다.

```bash
git checkout -b feature
```

### 2. 파일 복원

하지만 `checkout`은 브랜치 이동뿐만 아니라 파일을 이전 상태로 되돌리는 데도 사용된다.

```bash
git checkout -- README.md
```

특정 커밋의 파일을 가져오는 것도 가능하다.

```bash
git checkout HEAD~1 -- README.md
```

즉, 하나의 `checkout` 명령어가 다음과 같은 여러 역할을 담당하고 있었다.

- 브랜치 변경
- 브랜치 생성
- 파일 복원
- 특정 커밋에서 파일 가져오기

이 때문에 명령어만 봤을 때 **브랜치를 변경하려는 것인지 파일을 변경하려는 것인지 의도를 파악하기 어려운 문제**가 있었다.

특히 파일에 대한 `checkout`은 현재 작업 중인 내용을 덮어쓸 수도 있기 때문에 혼란을 줄 수 있었다.

---

## switch와 restore의 등장

Git은 이러한 문제를 해결하기 위해 **Git 2.23**부터 두 개의 명령어를 추가했다.

```text
git switch
git restore
```

역할은 명확하게 나뉜다.

| 명령어 | 역할 |
| --- | --- |
| `git switch` | 브랜치 변경 및 생성 |
| `git restore` | 파일 복원 |

기존 `checkout`이 담당하던 역할을 목적에 따라 분리한 것이다.

---

## checkout과 switch 비교

기존에 다음과 같이 브랜치를 변경했다면

```bash
git checkout main
```

이제는 다음과 같이 표현할 수 있다.

```bash
git switch main
```

새로운 브랜치를 만들면서 이동하는 경우도 마찬가지다.

### 기존 방식

```bash
git checkout -b feature
```

### 새로운 방식

```bash
git switch -c feature
```

`switch`라는 이름 자체가 **브랜치를 전환한다는 목적을 명확하게 표현한다.**

---

## checkout과 restore 비교

파일을 원래 상태로 되돌리는 경우 기존에는 다음과 같이 사용했다.

```bash
git checkout -- README.md
```

새로운 명령어에서는 다음과 같다.

```bash
git restore README.md
```

특정 커밋의 파일을 복원하고 싶다면 기존에는

```bash
git checkout HEAD~1 -- README.md
```

라고 했다면, `restore`에서는 다음과 같이 표현한다.

```bash
git restore --source=HEAD~1 README.md
```

`restore`라는 이름 역시 **파일을 복원한다는 목적을 직접적으로 보여준다.**

---

## 명령어 비교

정리하면 다음과 같다.

| 기존 명령어 | 새로운 명령어 | 의미 |
| --- | --- | --- |
| `git checkout main` | `git switch main` | 브랜치 이동 |
| `git checkout -b feature` | `git switch -c feature` | 브랜치 생성 후 이동 |
| `git checkout -- file.txt` | `git restore file.txt` | 파일 복원 |
| `git checkout HEAD~1 -- file.txt` | `git restore --source=HEAD~1 file.txt` | 특정 커밋에서 파일 복원 |

---

## checkout은 이제 사용할 수 없을까?

그렇지는 않다.

```bash
git checkout main
```

은 현재도 정상적으로 사용할 수 있다.

`checkout`이 완전히 제거된 것이 아니라 기존 Git 사용자와 스크립트의 호환성을 위해 계속 지원되고 있다.

다만 새로운 명령어를 사용하면 **명령 자체만으로 작업의 목적을 훨씬 쉽게 이해할 수 있다.**

```bash
git switch main
```

을 보면 브랜치를 변경하려는 것임을 알 수 있고,

```bash
git restore README.md
```

를 보면 파일을 복원하려는 것임을 바로 알 수 있다.

---

## 결론

`git checkout`이 `git switch`로 단순히 변경된 것은 아니다.

기존 `checkout`이 여러 역할을 담당하고 있었기 때문에 Git 2.23부터 그 역할을 다음과 같이 분리했다.

```text
git checkout
     │
     ├── 브랜치 관련 ──> git switch
     │
     └── 파일 복원 ────> git restore
```

따라서 다음과 같이 기억하면 쉽다.

> **브랜치를 바꿀 때는 `git switch`, 파일을 되돌릴 때는 `git restore`.**

`git checkout`은 여전히 사용할 수 있지만, `switch`와 `restore`를 사용하면 명령어의 목적을 더욱 명확하게 표현할 수 있다.
