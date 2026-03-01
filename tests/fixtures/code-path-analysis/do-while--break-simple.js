/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_2->s1_5;
s1_3->s1_6;
s1_5->s1_6->final;
*/
do {
    if (b) {
        break;
    }
    foo();
} while (a);

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nDoWhileStatement"];
    s1_2[label="BlockStatement\nIfStatement\nIdentifier (b)"];
    s1_3[label="BlockStatement\nBreakStatement"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_5[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nIdentifier (a)"];
    s1_6[label="DoWhileStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_2->s1_5;
    s1_3->s1_6;
    s1_5->s1_6->final;
}
*/
