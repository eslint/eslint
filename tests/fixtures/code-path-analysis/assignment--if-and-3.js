/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_7->s1_9;
s1_1->s1_8->s1_9;
s1_2->s1_8;
s1_3->s1_8;
s1_4->s1_6->s1_7;
s1_9->final;
*/
if ((a &&= b) && c) {
    d ? foo() : bar();
} else {
    baz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nIfStatement:enter\nLogicalExpression:enter\nAssignmentExpression:enter\nIdentifier (a)"];
    s1_2[label="Identifier (b)\nAssignmentExpression:exit"];
    s1_3[label="Identifier (c)\nLogicalExpression:exit"];
    s1_4[label="BlockStatement:enter\nExpressionStatement:enter\nConditionalExpression:enter\nIdentifier (d)"];
    s1_5[label="CallExpression:enter\nIdentifier (foo)\nCallExpression:exit"];
    s1_7[label="ConditionalExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_9[label="IfStatement:exit\nProgram:exit"];
    s1_8[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_6[label="CallExpression:enter\nIdentifier (bar)\nCallExpression:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_7->s1_9;
    s1_1->s1_8->s1_9;
    s1_2->s1_8;
    s1_3->s1_8;
    s1_4->s1_6->s1_7;
    s1_9->final;
}
*/
