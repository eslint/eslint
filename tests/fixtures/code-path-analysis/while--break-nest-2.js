/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_2->s1_11;
s1_3->s1_6;
s1_4->s1_11;
s1_6->s1_9;
s1_7->s1_10;
s1_11->final;
*/
while (a) {
    A: {
        if (b) {
            break;
        }
        if (c) {
            break A;
        }
        foo();
    }
}

bar();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nWhileStatement"];
    s1_2[label="Identifier (a)"];
    s1_3[label="BlockStatement\nLabeledStatement\nIdentifier (A)\nBlockStatement\nIfStatement\nIdentifier (b)"];
    s1_4[label="BlockStatement\nBreakStatement"];
    s1_5[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_6[label="IfStatement\nIdentifier (c)"];
    s1_7[label="BlockStatement\nBreakStatement\nIdentifier (A)"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_9[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_10[label="LabeledStatement:exit\nBlockStatement:exit"];
    s1_11[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_2->s1_11;
    s1_3->s1_6;
    s1_4->s1_11;
    s1_6->s1_9;
    s1_7->s1_10;
    s1_11->final;
}
*/
