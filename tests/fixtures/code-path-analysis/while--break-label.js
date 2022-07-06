/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_11->s1_4;
s1_2->s1_13;
s1_4->s1_12->s1_2;
s1_5->s1_8;
s1_6->s1_13;
s1_8->s1_11;
s1_9->s1_12;
s1_13->final;
*/
A: while (a) {
    B: while (b) {
        if (c) {
            break A;
        }
        if (d) {
            break B;
        }
        foo();
    }
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nLabeledStatement\nIdentifier (A)\nWhileStatement"];
    s1_2[label="Identifier (a)"];
    s1_3[label="BlockStatement\nLabeledStatement\nIdentifier (B)\nWhileStatement"];
    s1_4[label="Identifier (b)"];
    s1_5[label="BlockStatement\nIfStatement\nIdentifier (c)"];
    s1_6[label="BlockStatement\nBreakStatement\nIdentifier (A)"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_8[label="IfStatement\nIdentifier (d)"];
    s1_9[label="BlockStatement\nBreakStatement\nIdentifier (B)"];
    s1_10[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_11[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_13[label="WhileStatement:exit\nLabeledStatement:exit\nProgram:exit"];
    s1_12[label="WhileStatement:exit\nLabeledStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_11->s1_4;
    s1_2->s1_13;
    s1_4->s1_12->s1_2;
    s1_5->s1_8;
    s1_6->s1_13;
    s1_8->s1_11;
    s1_9->s1_12;
    s1_13->final;
}
*/
