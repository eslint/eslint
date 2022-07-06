/*expected
initial->s1_1->s1_2->s1_3->s1_4;
s1_1->s1_4;
s1_2->s1_4->final;
*/
switch (a) {
    case 0:
        foo();
        break;
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nSwitchStatement\nIdentifier (a)\nSwitchCase\nLiteral (0)"];
    s1_2[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nBreakStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_4[label="SwitchStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4;
    s1_1->s1_4;
    s1_2->s1_4->final;
}
*/
