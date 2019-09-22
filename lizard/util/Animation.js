class Animation {
    // n 거리동안 r만큼씩 p번 움직이고 싶을때
    static wave = (n, p, r, initY = 0) => x => {
        return (r * Math.sin(x * ((Math.PI*2) * p/n))) + initY;
    }
}