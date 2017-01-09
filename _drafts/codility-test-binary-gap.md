      // you can also use imports, for example:
      // import java.util.*;

      // you can write to stdout for debugging purposes, e.g.
      // System.out.println("this is a debug message");

      class Solution {
          public int solution(int N) {
              // write your code in Java SE 8
              return divide(N);
          }

          public int divide(int N)
          {
              Link link = getLink(N, null);
              int maxCount = 0;
              while(link.right != null)
              {
                  link = link.right;

                  maxCount = (maxCount < link.count && link.right != null)? link.count : maxCount;
              }
              return maxCount;
          }

          public Link getLink(int N, Link right)
          {
              if (N == 0) return new Link(null, 1, null);
              else if (N == 1) return new Link(null, 0, right);

              int mod = N % 2;
              int div = (int)((double)Math.ceil(N / 2));

              if (mod == 0){
                  right.count++;
              } else {
                  right = new Link(null, 0, right);
              }
              
              return getLink(div, right);
          }

          private class Link
          {
              public int count;
              public Link left;
              public Link right;

              public Link(Link left, int count, Link right)
              {
                  this.left = left;
                  this.count = count;
                  this.right = right;
              }
          }
      }
