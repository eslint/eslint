/*expected
initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_8->s1_10->s1_11->s1_12->s1_13->s1_14->s1_15->s1_16;
s1_1->s1_10;
s1_2->s1_4->s1_5->s1_10;
s1_6->s1_8;
s1_10->s1_16;
s1_11->s1_13->s1_15;
s1_16->final;
*/

(obj?.[cond ? k1 : k2]?.[k3 || k4])?.(a1 && a2, b1 ?? b2).foo(arg)

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nExpressionStatement:enter\nChainExpression:enter\nCallExpression:enter\nMemberExpression:enter\nCallExpression:enter\nChainExpression:enter\nMemberExpression:enter\nMemberExpression:enter\nIdentifier (obj)"];
    s1_2[label="ConditionalExpression:enter\nIdentifier (cond)"];
    s1_3[label="Identifier (k1)"];
    s1_5[label="ConditionalExpression:exit\nMemberExpression:exit"];
    s1_6[label="LogicalExpression:enter\nIdentifier (k3)"];
    s1_7[label="Identifier (k4)"];
    s1_8[label="LogicalExpression:exit\nMemberExpression:exit"];
    s1_10[label="ChainExpression:exit"];
    s1_11[label="LogicalExpression:enter\nIdentifier (a1)"];
    s1_12[label="Identifier (a2)"];
    s1_13[label="LogicalExpression:exit\nLogicalExpression:enter\nIdentifier (b1)"];
    s1_14[label="Identifier (b2)"];
    s1_15[label="LogicalExpression:exit\nCallExpression:exit\nIdentifier (foo)\nMemberExpression:exit\nIdentifier (arg)\nCallExpression:exit"];
    s1_16[label="ChainExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_4[label="Identifier (k2)"];
    initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_7->s1_8->s1_10->s1_11->s1_12->s1_13->s1_14->s1_15->s1_16;
    s1_1->s1_10;
    s1_2->s1_4->s1_5->s1_10;
    s1_6->s1_8;
    s1_10->s1_16;
    s1_11->s1_13->s1_15;
    s1_16->final;
}
*/
