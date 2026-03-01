/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9;
s1_1->s1_4;
s1_2->s1_9;
s1_4->s1_7;
s1_5->s1_8;
s1_9->final;
*/

A: {
    B: {
        if (a) {
            break A;
        }
        if (b) {
            break B;
        }
        foo();
    }
    bar();
}

baz();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nLabeledStatement\nIdentifier (A)\nBlockStatement\nLabeledStatement\nIdentifier (B)\nBlockStatement\nIfStatement\nIdentifier (a)"];
    s1_2[label="BlockStatement\nBreakStatement\nIdentifier (A)"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_4[label="IfStatement\nIdentifier (b)"];
    s1_5[label="BlockStatement\nBreakStatement\nIdentifier (B)"];
    s1_6[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_7[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_8[label="ExpressionStatement\nCallExpression\nIdentifier (bar)"];
    s1_9[label="ExpressionStatement\nCallExpression\nIdentifier (baz)"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9;
    s1_1->s1_4;
    s1_2->s1_9;
    s1_4->s1_7;
    s1_5->s1_8;
    s1_9->final;
}
*/
