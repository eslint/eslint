/* eslint-env node */
/*expected
initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_9;
s1_1->s1_5->s1_6->s1_7->s1_9;
s1_1->s1_8;
s1_5->s1_8;
s1_3->final;
s1_9->final;
*/

try {
    if (a) {
        return a;
    } else {
        throw b;
    }
} catch (err) {
    // do nothing.
}

foo();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nTryStatement\nBlockStatement\nIfStatement\nIdentifier (a)"];
    s1_3[label="BlockStatement\nReturnStatement\nIdentifier (a)"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nIfStatement:exit\nBlockStatement:exit"];
    s1_8[label="CatchClause\nIdentifier (err)\nBlockStatement"];
    s1_9[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_5[label="BlockStatement\nThrowStatement\nIdentifier (b)"];
    s1_6[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_9;
    s1_1->s1_5->s1_6->s1_7->s1_9;
    s1_1->s1_8;
    s1_5->s1_8;
    s1_3->final;
    s1_9->final;
}
*/
