/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_7->s1_9;
s1_1->s1_3;
s1_2->s1_8->s1_9;
s1_3->s1_5;
s1_4->s1_6->s1_7;
s1_1->s1_8;
s1_3->s1_6;
s1_9->final;
*/
if (a ?? b) {
    if (c ?? d) {
        foo();
    } else {
        bar();
    }
} else {
    qiz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nIfStatement\nLogicalExpression\nIdentifier (a)\nIdentifier:exit (a)"];
    s1_2[label="Identifier (b)\nIdentifier:exit (b)\nLogicalExpression:exit"];
    s1_3[label="BlockStatement\nIfStatement\nLogicalExpression\nIdentifier (c)\nIdentifier:exit (c)"];
    s1_4[label="Identifier (d)\nIdentifier:exit (d)\nLogicalExpression:exit"];
    s1_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)\nIdentifier:exit (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_7[label="IfStatement:exit\nBlockStatement:exit"];
    s1_9[label="IfStatement:exit\nProgram:exit"];
    s1_8[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (qiz)\nIdentifier:exit (qiz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_6[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nIdentifier:exit (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_7->s1_9;
    s1_1->s1_3;
    s1_2->s1_8->s1_9;
    s1_3->s1_5;
    s1_4->s1_6->s1_7;
    s1_1->s1_8;
    s1_3->s1_6;
    s1_9->final;
}
*/
