# 数据结构与算法

> 以大话数据结构为参考书籍对数据结构与算法做一个较全面的认知(其实本书看着真烦>_<)

---

## 01 - 算法简介

> 数据结构: 相互之间存在一种或多种特定关系的数据元素的集合

* 逻辑结构与物理结构
  * 逻辑结构
    * 集合结构
    * 线性结构
    * 树形结构
    * 图形结构
  * 物理结构
    * 顺序存储结构
    * 链式存储结构

* 抽象数据类型 ADT
  * 一个数学模型及定义在该模型上的一组操作
  * 抽象数据类型体现了程序设计中问题分解, 抽象和信息隐藏的特性

---

## 02 - 算法

> 算法是解决特定问题求解步骤的描述, 在计算机中表现为指令的有限序列, 并且每条指令表示一个或多个
> 操作.

* 算法特性
  * 输入
  * 输出
  * 有穷性
  * 确定性
  * 可行性
* 算法设计要求
  * 正确性
  * 可读性
  * 健壮性
  * 时间效率高和存储量低
* 算法时间复杂度
  * `O()`
    * `O(1)` 常数阶
    * `O(logn)` 对数阶
    * `O(n)` 线性阶
    * `O(nlogn)` nlogn阶
    * `O(n^2)` 平方阶
    * `O(n^3)` 立方阶
    * `O(2^n)` 指数阶
  * 算法空间复杂度

---

## 03 - 线性表 List

> 零个或多个数据元素的有限序列

* 线性表
  * 元素有顺序的序列, 第一个元素无前驱, 最后一个元素无后继, 其他每个元素有且只有一个前驱和后继
  * 元素个数有限
  * 每个数据元素可以由若干个数据项组成
* 线性表的顺序存储结构
  * 可以使用一维数组实现顺序存储结构
  * 优点
    * 无需为表中元素之间的逻辑关系而增加额外的空间
    * 可以快速存取表中任一位置的元素
  * 缺点
    * 插入和删除需要移动大量元素
    * 线性表长度较大时, 难以确定存储空间和容量
    * 造成存储空间碎片
* 线性表的链式存储结构
  * 单链表

    ```cpp
    typedef struct Node {
        ElemType data;      // 数据域
        struct Node *next;  // 指针域
    };

    typedef struct Node *LinkList;
    ```

    * 循环链表
      * 将单链表终端节点的指针域由空指针改为指向头结点
  * 双向链表

    ```cpp
    typedef struct DulNode {
        ElemType data;
        struct DulNode *prior;  // 直接前驱指针
        struct DulNode *next;   // 直接后继指针
    };

    typedef struct DulNode *DuLinkList;
    ```

    * 双向循环链表

---

## 04 - 栈与队列

> 栈: 仅在表尾进行插入和删除操作的线性表, 先进后出<br>
> 队列: 只允许在一端进行插入操作, 在另一端进行删除操作的线性表, 先进先出

* 栈

  ```cpp
  // 栈的顺序存储结构
  typedef int SElemType;
  typedef struct SqStack {
      SElemType data[MAXSIZE];
      int top;          // 用于栈顶指针, -1 空栈
  };

  // 链栈
  typedef struct StackNode {
      SElemType data;
      struct StackNode *next;
  } StackNode, *LinkStackPtr;

  typedef struct LinkStack {
      LinkStackPtr top;
      int count;
  } LinkStack;
  ```

* 递归

    ```cpp
    #include <stdio.h>

    int fbi(int num) {
        if (num == 0) {
            return 0;
        } else if (num == 1) {
            return 1;
        }

        return fbi(num - 1) + fbi(num - 2);
    }

    int main() {
        for (int i = 0; i < 12; i++) {
            printf("第 %d 月, 兔子数量为: %d.\n", i, fbi(i));
        }

        return 0;
    }
    ```

* 栈的应用: 四则预案算表达式求值
  * 后缀表达式

    ```bash
    9 + (3 - 1) * 3 + 10 / 2    # 中缀表达式
    9 3 1 - 3 * + 10 2 / +      # 后缀表达式

    将中缀表达式转化为后缀表达式(栈用来进出运算符号)
    将后缀表达式进行运算得出结果(栈用来进出运算数字)
    ```

* 队列
  * 头出尾插

* 循环队列
  * 头尾相接的顺序存储结构

    ```bash
    # rear 后保留一个空单元, 即认为已满
    0    1    2    3    4 空         0    1    2 空 3    4
    front                rear                  rear front

    队列满的条件: (rear + 1) % QueueSize == front
    队列长度计算: (rear - front + QueueSize) % QueueSize
    ```

* 队列的链式存储结构

---

## 05 - 串

> 由零个或多个字符组成的有限序列

* 串的存储结构
  * 顺序存储(更好)
  * 链式存储
* 模式匹配算法
  * 效率太低
* KMP 模式匹配算法