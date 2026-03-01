/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_6->s1_8->s1_9;
s1_1->s1_9;
s1_2->s1_7->s1_8;
s1_3->s1_5->s1_6;
s1_9->final;
*/
if (a)
    if (b)
        if (c)
            foo;
        else
            bar;
    else
        baz;

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nIfStatement\nIdentifier (a)\nIdentifier:exit (a)"];
    s1_2[label="IfStatement\nIdentifier (b)\nIdentifier:exit (b)"];
    s1_3[label="IfStatement\nIdentifier (c)\nIdentifier:exit (c)"];
    s1_4[label="ExpressionStatement\nIdentifier (foo)\nIdentifier:exit (foo)\nExpressionStatement:exit"];
    s1_6[label="IfStatement:exit"];
    s1_8[label="IfStatement:exit"];
    s1_9[label="IfStatement:exit\nProgram:exit"];
    s1_7[label="ExpressionStatement\nIdentifier (baz)\nIdentifier:exit (baz)\nExpressionStatement:exit"];
    s1_5[label="ExpressionStatement\nIdentifier (bar)\nIdentifier:exit (bar)\nExpressionStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_6->s1_8->s1_9;
    s1_1->s1_9;
    s1_2->s1_7->s1_8;
    s1_3->s1_5->s1_6;
    s1_9->final;
}
*/
