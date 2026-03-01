/*expected
initial->s1_1->s1_2->s1_2->s1_3;
*/
for (;;) {
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement"];
    s1_2[label="BlockStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_2->s1_3;
}
*/
