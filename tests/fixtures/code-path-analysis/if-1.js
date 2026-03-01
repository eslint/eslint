/*expected
initial->s1_1->s1_2->s1_3;
s1_1->s1_3->final;
*/
if (a) {
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nIfStatement\nIdentifier (a)"];
    s1_2[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_3[label="IfStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3;
    s1_1->s1_3->final;
}
*/
