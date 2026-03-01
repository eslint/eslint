/*expected
initial->s1_1->s1_3->final;
*/
switch (a) {
    case 0:
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nSwitchStatement\nIdentifier (a)\nSwitchCase\nLiteral (0)"];
    s1_3[label="SwitchStatement:exit\nProgram:exit"];
    initial->s1_1->s1_3->final;
}
*/
