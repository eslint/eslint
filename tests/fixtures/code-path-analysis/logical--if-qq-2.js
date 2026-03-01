/*expected
initial->s1_1->s1_2->s1_3->s1_5;
s1_1->s1_3;
s1_2->s1_4->s1_5;
s1_1->s1_4;
s1_5->final;
*/
if (a ?? b) {
    foo();
} else {
    bar();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nIfStatement\nLogicalExpression\nIdentifier (a)\nIdentifier:exit (a)"];
    s1_2[label="Identifier (b)\nIdentifier:exit (b)\nLogicalExpression:exit"];
    s1_3[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)\nIdentifier:exit (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_5[label="IfStatement:exit\nProgram:exit"];
    s1_4[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nIdentifier:exit (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_5;
    s1_1->s1_3;
    s1_2->s1_4->s1_5;
    s1_1->s1_4;
    s1_5->final;
}
*/
