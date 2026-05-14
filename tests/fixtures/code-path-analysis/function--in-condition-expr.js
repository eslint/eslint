/*expected
initial->s2_1->final;
*/
/*expected
initial->s3_1->final;
*/
/*expected
initial->s1_1->s1_2->s1_4;
s1_1->s1_3->s1_4->final;
*/
(
    foo ? function foo() {}
        : function bar() {}
)();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionExpression\nIdentifier (foo)\nBlockStatement"];
    initial->s2_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s3_1[label="FunctionExpression\nIdentifier (bar)\nBlockStatement"];
    initial->s3_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nExpressionStatement\nCallExpression\nConditionalExpression\nIdentifier (foo)"];
    s1_2[label="FunctionExpression"];
    s1_4[label="ConditionalExpression:exit\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_3[label="FunctionExpression"];
    initial->s1_1->s1_2->s1_4;
    s1_1->s1_3->s1_4->final;
}
*/
