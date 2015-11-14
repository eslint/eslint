/*eslint-env node*/
/*expected
initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_11->s1_14;
s1_1->s1_5->s1_6->s1_7;
s1_3->s1_9->s1_12->s1_15;
s1_7->s1_9;
s1_8->s1_15;
s1_11->s1_15;
s1_1->s1_9;
s1_5->s1_9->s1_15->final;
s1_15->thrown;
*/

try {
    try {
        if (a) {
            return;
        } else {
            throw err;
        }
    } finally {
        foo();
    }
} finally {
    bar();
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize];
    s1_1[label="Program\nTryStatement\nBlockStatement\nTryStatement\nBlockStatement\nIfStatement\nIdentifier (a)"];
    s1_3[label="BlockStatement\nReturnStatement"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nIfStatement:exit\nBlockStatement:exit"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_11[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement
    :exit\nBlockStatement:exit"];
    s1_14[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)\nExpressio
    nStatement\nCallExpression\nIdentifier (last)"];
    s1_5[label="BlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_6[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_9[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_12[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_15[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_11->s1_14;
    s1_1->s1_5->s1_6->s1_7;
    s1_3->s1_9->s1_12->s1_15;
    s1_7->s1_9;
    s1_8->s1_15;
    s1_11->s1_15;
    s1_1->s1_9;
    s1_5->s1_9->s1_15->final;
    s1_15->thrown;
}
*/
