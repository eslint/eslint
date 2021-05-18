/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_4;
s1_2->s1_7;
s1_4->s1_6->s1_2;
s1_7->final;
*/
while (a)
    while (b)
        foo

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nWhileStatement"];
    s1_2[label="Identifier (a)\nIdentifier:exit (a)"];
    s1_3[label="WhileStatement"];
    s1_4[label="Identifier (b)\nIdentifier:exit (b)"];
    s1_5[label="ExpressionStatement\nIdentifier (foo)\nIdentifier:exit (foo)\nExpressionStatement:exit"];
    s1_7[label="WhileStatement:exit\nProgram:exit"];
    s1_6[label="WhileStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_4;
    s1_2->s1_7;
    s1_4->s1_6->s1_2;
    s1_7->final;
} 
*/
