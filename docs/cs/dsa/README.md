# 数据结构与算法

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">最近更新 {{ $page.lastupdated}} 全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>
> 以大话数据结构为参考书籍对数据结构与算法做一个较全面的认知(其实本书看着真烦🤯

---

[[TOC]]


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


## 05 - 串 String

> 由零个或多个字符组成的有限序列

* 串的存储结构
  * 顺序存储(更好)
  * 链式存储
* 模式匹配算法
  * 效率太低
* KMP 模式匹配算法


## 06 - 树 Tree

> 树是 n(n >= 0) 个结点的有限集. n = 0 时称为空树.<br>
> 在任何一个非空树中:<br>
> 1) 有且只有一个特定的称为根 Root 的结点<br>
> 2) 当 n > 1 时, 其余结点可分为 m (m > 0) 个互不相交的有限集 T1, T2, ... Tm, 其中每个
> 集合本身又是一棵树, 并且称为根的子树 SubTree

* 树
  * 结点拥有的子树树称为结点的度 Degree
    * 度为 0 的结点称为叶节点 Leaf
    * 度不为 0 的结点称为分支结点
  * 树的度是树内各结点的度的最大值

* 树的存储结构
  * 双亲表示法

    ```cpp
    #define MAX_TREE_SIZE   100
    typedef int TElemType

    typedef struct {
        TElemType data;   // 结点数据
        int parent;       // parent 位置(数组下标)
    } PTNode;

    typedef struct {
      PTNode nodes[MAX_TREE_SIZE];
      int r;      // 根的位置, 根结点为 -1
      int n;      // 结点数
    } PTree;
    ```

  * 孩子表示法
    * 多重链表表示法
      * 每个结点有多个指针域, 每个指针指向一棵子树的根结点

    ```cpp
    #define MAX_TREE_SIZE   100
    typedef int TElemType

    // 孩子结点
    typedef struct CTNode {
      int child;      // 存储某个结点在表头数组中的下标
      struct CTNode *next;  // 指向某结点的下一个孩子结点
    } *ChildPtr;

    // 表头结构
    typedef struct {
      TElemType data;       // 结点数据
      ChildPtr firstchild;  // 指向结点的孩子链表
    } CTBox;

    // 树结构
    typedef struct {
      CTBox nodes[MAX_TREE_SIZE];
      int r;
      int n;
    } CTree;
    ```

  * 孩子兄弟表示法

    ```cpp
    typedef struct CSNode {
      TElemType data;
      struct CSNode *firstchild;
      struct CSNode *rightchild;
    } CSNode, *CSTree;
    ```

* 二叉树
  * 斜树
  * 满二叉树
  * 完全二叉树

* 二叉树的存储结构
  * 顺序存储结构
    * 适用于完全二叉树
  * 二叉链表

    ```cpp
    typedef struct BiTNode {
        TElemType data;
        struct BiTNode *lchild, *rchild;    // 左右孩子指针
    } BiTNode, *BiTree;
    ```

* 二叉树的遍历
  * 前序遍历
    * 若二叉树为空, 则空操作返回, 否则先访问根结点, 然后前序遍历左子树, 再前序遍历右子树

    ```cpp
    void PreOrderTraverse(BiTree T) {
        if (T == NULL) {
            return;
        }

        printf("%s", T->data);
        PreOrderTraverse(T->lchild);
        PreOrderTraverse(T->rchild);
    }
    ```

  * 中序遍历
    * 若树为空, 则空操作返回, 否则从根结点开始(不是首先访问根结点), 中序遍历根结点的左子树,
      然后访问根结点, 最后中序遍历右子树

    ```cpp
    void InOrderTraverse(BiTree T) {
        if (T == NULL) {
            return;
        }

        InOrderTraverse(T->lchild);
        printf("%s", T->data);
        InOrderTraverse(T->rchild);
    }
    ```

  * 后序遍历
    * 若树为空, 则空操作返回, 否则从左到右先叶子后结点的方式访问左右子树, 最后访问根结点

    ```cpp
    void PostOrderTraverse(BiTree T) {
        if (T == NULL) {
            return;
        }

        PostOrderTraverse(T->lchild);
        PostOrderTraverse(T->rchild);
        printf("%s", T->data);
    }
    ```

  * 层序遍历
    * 若树为空, 则空操作返回, 否则从树的第一层, 也就是根结点开始访问, 从上而下逐层遍历, 在同
      一层, 按从左到右的顺序对结点逐个访问

* 二叉树的建立

    ```cpp
    // 按照前序方式输入二叉树结点的值, 每个结点值为一个字符
    // # 表示空树, 需要将原二叉树填充 # 扩展为完全二叉树(每个结点的空指针都引出一个虚结点)
    // 如 AB#D##C##
    void CreateBiTree(BiTree *T) {
        TElemType ch;
        scanf("%c", &ch);
        if (ch == '#') {
            *T = NULL;
        } else {
            *T = (BiTree)malloc(sizeof(BiTNode));
            if (!*T) {
                exit(OVERFLOW);
            }

            (*T)->data = ch;    // 生成根结点
            CreateBiTree(&(*T)->lchild);    // 构造左子树
            CreateBiTree(&(*T)->rchild);    // 构造右子树
        }
    }
    ```

* 线索二叉树
  * 线索化的实质是将二叉链表中的空指针改为指向前驱或后继的线索. 线索化的过程就是在遍历的过程
      中修改空指针的过程.
  * 线索二叉树的操作实际上就是操作一个双向链表结构

    ```cpp
    // Link == 0 表示指向左右孩子指针
    // Thread == 0 表示指向前驱或后继的线索
    typedef enum {Link, Thread} PointerTag;

    typedef struct BiThrNode {
        TElemType data;             // 结点数据
        struct BiThrNode *lchild, *rchild;  // 左右孩子指针
        PointerTag LTag;
        PointerTag RTag;    // 左右标志
    } BiThrNode, *BiThrTree;

    // 全局变量, 指向刚刚访问过的结点
    BiThrTree pre;
    // 中序遍历进行中序线索化
    void InThreading(BiThrTree p) {
        if (p) {
            InThreading(p->lchild);
            if (!p->lchild) {
                p->LTag = Thread;   // 前驱线索
                p->lchild = pre;    // 左孩子指针指向前驱
            }

            if (!p->rchild) {
                pre->RTag = Thread; // 后继线索
                pre->rchild = p;    // 前驱右孩子指针指向后继(当前结点 p)
            }

            pre = p;                // 保持 pre 指向 p 的前驱
            InThreading(p->rchild);
        }
    }
    ```

* 树, 森林与二叉树的转换
  * 树转换为二叉树
    1. 加线. 所有兄弟结点之间加一条连线
    2. 去线. 对树中每个结点, 只保留它与第一个孩子结点的连线, 删除它与其他孩子结点之间的连线
    3. 层次调整. 以树的根结点为轴心, 将整棵树顺时针旋转一定的角度, 使之结构层次分明. 第一个
       孩子是二叉树结点的左孩子, 兄弟转换过来的孩子是结点的右孩子
  * 森林转换为二叉树
    1. 把每个树转换为二叉树
    2. 第一棵二叉树不动, 从第二棵二叉树开始依次把后一棵二叉树的根结点作为前一棵二叉树的根结点
       的右孩子, 用线连起来. 当所有二叉树连接起来后就得到了由森林转换来的二叉树

* 赫夫曼树
  * 带权路径长度 WPL 最小的二叉树叫做赫夫曼树
  * 赫夫曼编码
    * 前缀编码: 要设计长短不等的编码, 必须是任一字符的编码都不是另一个字符的编码的前缀


## 07 - 图 Graph

> 图 Graph 是由顶点的有穷非空集合和顶点之间边的集合组成, 通常表示为 G(V, E). 其中 G 表示一
> 个图, V 是图中顶点的集合, E 是图中边的集合.

* 图
  * 元素称为顶点 Vertex
  * 图中任意两个顶点之间都可能有关系, 顶点之间的逻辑关系用边来表示
  * 无向边, 无向图
    * G1 = (V1, {E1})
      * V1 = {A, B, C, D}
      * E1 = {(A, B), (B, C), (C, D)}
  * 有向边/弧, 有向图
    * G2 = (V2, {E2})
      * V2 = {A, B, C, D}
      * E2 = {<A, D>, <B, A>, <C, A>, <B, C>}
  * 简单图
    * 不存在顶点到其自身的边, 且同一条边不重复出现
  * 无向完全图
    * 无向图中, 任意两个顶点之间都存在边
  * 有向完全图
    * 有向图中, 任意两个顶点之间都存在方向护卫相反的两条弧
  * 稀疏图, 稠密图
  * 与图的边/弧相关的数叫做权 Weight
    * 带权的图称为网
  * 子图
  * 度 Gegree
    * 无向图中, 和顶点 v 相关联的边的数目, 记为 TD(v)
    * 入度 InDegree
      * 以顶点 v 为头的弧的数目, 记为 ID(v)
    * 出度 OutDegree
      * 以顶点 v 为尾的弧的数目, 记为 OD(v)
    * 有向图中, 顶点 v 的度 TD(v) = ID(v) + OD(v)
  * 路径长度: 路径上边或弧的数目
  * 环 Cycle: 第一个顶点和最后一个顶点相同的路径
  * 连通图 Connected Graph: 图中任意两个顶点都是连通的 (有向图称为强连通图)
    * 无向图中的极大连通子图称为连通分量
      * 要是子图
      * 子图要是连通的
      * 连通子图含有极大顶点数
      * 具有极大顶点数的连通子图包含依附于这些顶点的所有边
    * 有向图中的极大连通子图称为有向图的强连通分量
      * 有向图中, 每一对顶点之间都存在路径(注意路径是有向的), 称为强连通图
  * 连通图的生成树
    * 是一个极小的连通子图, 包含有图中全部的 N 个顶点, 但是只有足以构成一棵树的 N - 1 条边
    * 有向树: 一个有向图恰好有一个顶点的入度为 0, 其余顶点的入度为 1
    * 一个有向图由若干有向树构成生成森林

* 图的存储结构
  * 邻接矩阵 Adjacency Matrix
    * 使用两个数组来表示图, 一个一维数组存储图中顶点信息, 一个二维数组存储图中边/弧信息

        **无向图邻接矩阵**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_001.png')" alt="无向图邻接矩阵">

    * 有向网图中, 权值 `∞` 表示不存在

        **有向网图邻接矩阵**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_002.png')" alt="有向网图邻接矩阵">

    * 邻接矩阵
      * 边数相对顶点较少时, 存在存储空间浪费

        **邻接矩阵**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_003.png')" alt="邻接矩阵">

        ```cpp
        typedef char VertexType;        // 顶点类型
        typedef int EdgeType;           // 权值类型
        #define MAXVEX      100         // 最大顶点数
        #define INFINITY    65535       // 表示无穷大

        typedef struct {
            VertexType vexs[MAXVEX];        // 顶点表
            EdgeType arc[MAXVEX][MAXVEX];   // 邻接矩阵/边表
            int numVertexes;    // 顶点数
            int numEdges;       // 边数
        } MGraph;
        ```

    * 邻接表 Adjacency List
      * 数组与链表相结合的存储方法

        **邻接表**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_004.png')" alt="邻接表">

        ```cpp
        typedef char VertexType;
        typedef int EdgeType;

        typedef struct EdgeNode {
            int adjvex;
            EdgeType weight;
            struct EdgeNode *next;
        } EdgeNode;

        typedef struct VertexNode {
            VertexType data;
            EdgeNode *firstedge;
        } VertexNode, AdjList[MAXVEX];

        typedef struct {
            AdjList adjList;
            int numVertexes, numEdges;
        } GraphAdjList;
        ```

      * 逆邻接表

        **逆邻接表**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_005.png')" alt="逆邻接表">


    * 十字链表 Orthogonal List
      * 将邻接表和逆邻接表整合在一起, 可以容易找到以 Vi 为弧尾和弧头的弧

        **十字接表**<br>
        > 实线为邻接表, 虚线为逆邻接表

        <img :src="$withBase('/image/cs/dsa/readme/07_graph_orthogonal_list_001.png')" alt="十字接表">

    * 邻接多重表

        **邻接多重表**<br>
        <img :src="$withBase('/image/cs/dsa/readme/07_graph_adjacency_matrix_006.png')" alt="邻接多重表">

        ```
        ivex jvex: 与某条边依附的两个顶点在顶点表中的下标
        ilink: 指向依附顶点 ivex 的下一条边
        jlink: 指向依附顶点 jvex 的下一条边

        理解上图, 可以将箭头指向处的jvex 替换为起点处的ivex 就可以理解了
        ```

    * 边集数组

* 图的遍历
  * 深度优先遍历 Depth First Search

    **深度优先遍历**<br>
    <img :src="$withBase('/image/cs/dsa/readme/07_graph_dfs_001.png')" alt="深度优先遍历">

  * 广度优先遍历 Breadth First Search

    **广度优先遍历**<br>
    <img :src="$withBase('/image/cs/dsa/readme/07_graph_bfs_001.png')" alt="广度优先遍历">

* 最小生成树 Minimum Cost Spanning Tree
> 构造联通网的最小代价生成树

* Prim 算法

* Kruskal 算法


## 08 - 查找

* 查找概论
  * 静态查找表 Static Search Table
    * 只做查找操作
  * 动态查找表 Dynamic Search Table
    * 在查找过程中同时插入查找表中不存在的数据元素, 或从表中删除已存在的某个元素

* 顺序表查找 Sequential Search
  * 属于静态表查找
  * 从表中第一个(最后一个)记录开始, 逐个进行记录的关键字和给定值比较查找(就是for 循环)
  * 优化: 有哨兵顺序查找

    ```cpp
    // 避免了 for 循环中每次的 i 是否越界比较操作,
    int Sequential_Search(int *a, int n, int key) {
      int i;
      a[0] = key;   // 将a[0]设置为关键字值, 即哨兵
      i = n;
      while (a[i] != key) {
        i--;
      }

      return i;
    }
    ```

* 有序表查找
  * 二分查找 Binary Search
    * 线性表中的记录必须关键码有序, 线性表必须采用顺序存储
  * 插值查找 Interpolation Search
    * 根据要查的关键字 key 与查找表中最大最小记录的关键字比较后的查找方法
    * 插值计算公式 `(key - a[low]) / a[high] - a[low]`
  * 斐波那契查找 Fibonacci Search

* 线性索引查找
  * 索引, 把一个关键字与它对应的记录相关联的过程
    * 稠密索引, 在线性索引中, 将数据集中的每个记录对应一个索引项(索引项按关键码有序排列)
    * 分块索引
      * 对于分块有序的数据集, 将每块对应一个索引项
      * 块内无序, 块间有序

        **分块索引**<br>
        <img :src="$withBase('/image/cs/dsa/readme/08_001.png')" alt="分块索引">

    * 倒排索引 inverted index
      * 索引表, 索引项通用结构
        * 次关键码
        * 记录号表
        * 记录号表存储具有相同次关键字的所有记录的记录号
        * 不是由记录来确定属性值, 而是由属性值来确定记录的位置
        * 搜索引擎关键字检索

* 二叉树排序
  * 二叉排序树 Binary Sort Tree
    * 若左子树不空, 则左子树上所有结点的值均小于它的根结构的值
    * 若右子树不空, 则右子树上所有结点的值均大于它的根结点的值
    * 它的左右子树也分别为二叉排序树
    * 提高查找, 插入和删除关键字的速度

      **二叉排序树**<br>
      <img :src="$withBase('/image/cs/dsa/readme/08_binary_sort_tree_001.png')" alt="二叉排序树">

      ```cpp
      typedef struct BiTNode {
          int data;
          struct BiTNode *lchild, *rchild;
      } BiTNode, *BiTree;
      ```

* 平衡二叉树 High-Balanced Binary Search Tree (AVL 树)
  * 二叉排序树的每一个节点的左子树和右子树的高度差最多等于 1
  * 可以为空树
  * 二叉树上结点的左子树深度减去右子树深度的值成为平衡因子BF(Balance Factor)
  * 最小不平衡子树
    * 距离插入结点最近的, 且平衡因子绝对值大于 1 的结点为根的子树
  * 平衡二叉树的实现原理
    * 在构建二叉排序树的过程中, 每当插入一个结点时, 先检查是否因插入而破坏了树的平衡性, 若是
      则找出最小不平衡子树. 在保持二叉排序树特性的前提下, 调整最小不平衡子树中各个结点之间的
      链接关系, 进行相应的旋转, 使之成为新的平衡子树.

      ```cpp
      typedef struct BiTNode {
          int data;
          int bf;           // 结点平衡因子
          struct BiTNode *lchild, *rchild;
      } BiTNode, *BiTree;
      ```

* 多路查找树 muitl-way search tree
  * 每一个结点的孩子数可以多于两个, 且每个结点处可以存储多个元素
  * 2-3 树
    * 每个结点都具有两个孩子(2 结点)或三个孩子(3 结点)
      * 一个 2 结点包含一个元素和两个孩子(或没有孩子)
        * 左子树包含的元素小于该元素, 右子树包含的元素大于该元素
      * 一个 3 结点包含一小一大两个元素和三个孩子(或没有孩子)
        * 左子树包含小于叫嚣元素的元素, 右子树包含大于较大元素的元素, 中间子树包含介于两元素
          之间的元素
    * 所有叶子都在同一层次上

    **2-3树**<br>
    <img :src="$withBase('/image/cs/dsa/readme/08_2_3_tree_001.png')" alt="2-3树">

  * 2-3-4 树
    * 2, 3 结点同上
    * 一个 4 结点包含小中大单个元素和四个孩子(或没有孩子)
      * 左子树包含小于最小元素的元素; 第二子树包含大于最小元素, 小于第二元素的元素; 第三子树
        包含大于第二元素, 小于最大元素的元素; 右子树包含大于最大元素的元素

  * B Tree
    * 平衡的多路查找树
    * 结点最大的孩子数目称为 B 树的阶 order
    * 一个 m 阶的 B 树属性
      * 如果根结点不是叶结点, 则其至少有两棵子树
      * 每个非根的分支结点都有 k-1 个元素和 k 个孩子, 其中 `[m/2] <= k <= m`. 每个叶子
        结点 n 都有 k-1 个元素, 其中 `[m/2] <= k <= m`
      * 所有叶子结点都位于同一层次
      * 所有分支结点包含下列信息数据 (n, A0, K1, A1, K2, ... , Kn, An ), 其中
        Ki (i=1, 2, 3 ... n) 为关键字, 且 Ki < K(i+1) (i=1, 2, ..., n-1),
        Ai (i=0, 2, ..., n) 为指向子树根结点的指针, 且指针 A(i-1) 所指子树中所有结点的
        关键字均小于 Ki, An 所指子树中所有结点的关键字均大于 Kn, n (`[m/2]-1<=n<=m-1>`)
        为关键字的个数(或 n+1 为子树的个数)

      **B 树**<br>
      <img :src="$withBase('/image/cs/dsa/readme/08_b_tree_001.png')" alt="B 树">

    * B 树的使用案例
      * 要处理的硬盘数据量很大时, 无法一次全部装入内存. 此时对 B 树进行调整, 使得 B 树的阶
        数于硬盘存储的页面大小相匹配, 如 1001 阶(一个结点包含1000个关键字, 第一个数为关键
        字个数), 高度为 2, 则可以存储超过 10 亿个关键字, 此时只要根节点常驻内存, 那么在这
        棵树上, 寻找一个关键字至多需要两次硬盘的读取即可.

  * B+ Tree
    * 在 B 树的基础上, 出现在分支结点中的元素会被当做他们在该分支结点位置的中序后继者(叶子
      结点)中再次列出. 每个叶子结点都会保存一个指向后一叶子结点的指针.
    * 一个 m 阶 B+ 树的属性
      * 有 n 棵子树的结点包含有 n 个关键字
      * 所有的叶子节点包含全部关键字信息, 及指向含这些关键字记录的指针, 叶子结点本身依关键字
        的大小自小而大顺序链接
      * 所有分支结点可以看成是索引, 结点中仅含有其子树中最大(或最小)关键字

      **B+ 树**<br>
      <img :src="$withBase('/image/cs/dsa/readme/08_b+_tree_001.png')" alt="B+ 树">

  * B+ 树的使用场景
    * 适合带有范围的查找

* 散列表查找 (哈希表)
  * 散列结束时在记录的存储位置和它的关键字之间建立一个确定的对应关系 f, 使得每个关键字 key
    对应一个存储位置 f(key).
    * f 散列/Hash 函数
    * 采用散列技术将记录存储在一块连续的存储空间中, 这块连续的存储空间称为散列表/Hash table
  * 散列主要时面向查找的存储结构
    * 适合求解问题时查找于给定值相等的记录
    * 不适合
      * 关键字一对多的情况
      * 范围查找
  * 冲突不能完全避免但应尽量避免
    * 两个不同的关键字计算结果相同称为冲突
  * 散列函数的构造方法
    * 原则
      * 计算简单
      * 散列地址分布均匀
    * 直接定址法
    * 数字分析法
    * 平方取中法
    * 折叠法
    * 除留余数法
      * `f(key) = key mode p (p<=m)` m 为散列表长, p 为小于等于表长的最小质数或不包含
        小于 20 质因子的合数
    * 随机数法
      * `f(key) = random(key)`
  * 处理散列冲突方法
    * 开放定址法
      * 一旦发生冲突, 就去寻找下一个空的散列地址
      * `fi(key) = (f(key) + di) MOD m (di = 1, 2, ...., m-1)`
        * 每次冲突, 都 +di, 可以堆积加操作, 直到没有冲突位置
        * 线性探测法, 每次 +1
      * `fi(key) = (f(key) + di) MOD m (di = 1^2, -1^2, 2^2, ...., q^2, -q^2, q<=m/2)`
        * 二次探测法, 负数可以双向寻找可能的位置, 平方可避免关键字聚集
      * `fi(key) = (f(key) + di) MOD m (di = 随机数列)`
        * 随机探测法
    * 再散列函数法
      * 使用多个散列函数, 每当发生散列地址冲突时, 使用另一个散列函数计算
    * 链接地址法
      * 将所有关键字为同义词的记录存储在一个单链表中, 即同义词子表. 散列表中只存储所有同义词
        子表的头指针
    * 公共溢出区法
      * 将所有与当前散列表中关键字位置存在冲突的关键字存储到溢出表中


## 09 - 排序
* 基本概念
  * 排序的稳定性
    * 待排序的记录中, 相等的两个记录在排序后的相对位置没有改变, 则是稳定的, 反之为不稳定的
  * 内排序与外排序
    * 内排序, 整个排序过程中, 待排序的所有记录全部被放置在内存中
    * 外排序, 由于排序的记录个数太多, 不能同时放置在内存, 整个排序需要在内外存之间多次交换数据

* 冒泡排序 Bubble Sort
  * 基本思想: 两两比较相邻记录的关键字, 如果反序则交换, 直到没有反序的记录为止

  ```cpp
  #include <stdio.h>
  #include <string.h>
  #include <stdlib.h>

  #define MAXSIZE     10

  typedef struct {
      int r[MAXSIZE + 1];
      int length;
  } sq_list;

  static void print_list(sq_list *list) {
      for (int i = 0; i <= list->length; i++) {
          printf("%d ", list->r[i]);
      }

      printf("\n");
  }

  static void swap(sq_list *list, int i, int j) {
      int temp = list->r[i];
      list->r[i] = list->r[j];
      list->r[j] = temp;
  }

  static void bubble_sort_v0(sq_list *list) {
      for (int i = 1; i < list->length; i++) {
          for (int j = i + 1; j <= list->length; j++) {
              print_list(list);
              if (list->r[i] > list->r[j]) {
                  printf("swap %d %d\n", list->r[i], list->r[j]);
                  swap(list, i, j);
              }
          }
      }

      print_list(list);
  }

  static void bubble_sort_v1(sq_list *list) {
      for (int i = 1; i < list->length; i++) {
          for (int j = list->length - 1; j >= i; j--) {
              print_list(list);
              if (list->r[j] > list->r[j + 1]) {
                  printf("swap %d %d\n", list->r[j], list->r[j + 1]);
                  swap(list, j, j + 1);
              }
          }
      }

      print_list(list);
  }

  // 使用 flag 优化遍历过程, 当后续部分已经有序时, 不再继续遍历
  static void bubble_sort_v2(sq_list *list) {
      int flag = 1;
      for (int i = 1; i < list->length && flag == 1; i++) {
          flag = 0;

          for (int j = list->length - 1; j >= i; j--) {
              print_list(list);
              if (list->r[j] > list->r[j + 1]) {
                  printf("swap %d %d\n", list->r[j], list->r[j + 1]);
                  swap(list, j, j + 1);
                  flag = 1;
              }
          }
      }

      print_list(list);
  }

  int main() {
      sq_list *list = (sq_list *)malloc(sizeof(sq_list));
      memset(list, 0, sizeof(sq_list));
      list->length = MAXSIZE;
      int array[MAXSIZE] = {4, 1, 5, 8, 0, 3, 7, 9, 6, 2};

      list->r[0] = -1;

      for (int i = 0; i < MAXSIZE; i++) {
          list->r[i + 1] = array[i];
      }

      bubble_sort_v1(list);

      return 0;
  }
  ```

* 选择排序
  * 简单选择排序 Simple Selection Sort
    * 通过 n - i 次关键字的比较, 从 n - i + 1 个记录中选出关键字最小的记录, 并和第
      i(1 <= i <= n) 个记录交换之.


排序的部分暂时先不管, 后面会有专门的时间来学习这部分内容.
