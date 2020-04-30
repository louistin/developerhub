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

## 05 - 串 String

> 由零个或多个字符组成的有限序列

* 串的存储结构
  * 顺序存储(更好)
  * 链式存储
* 模式匹配算法
  * 效率太低
* KMP 模式匹配算法

---

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

---

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