/*expected
initial->s1_1->s1_2->s1_2->s1_3->final;
*/
do {
} while (a);

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nDoWhileStatement"];
    s1_2[label="BlockStatement\nIdentifier (a)"];
    s1_3[label="DoWhileStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_2->s1_3->final;
}
*/
