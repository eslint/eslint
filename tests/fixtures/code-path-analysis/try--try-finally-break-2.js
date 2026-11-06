/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_6->s1_7->s1_8->s1_4;
s1_2->s1_14;
s1_4->s1_11->s1_12->s1_2;
s1_6->s1_9->s1_13->s1_14;
s1_7->s1_9;
s1_4->s1_13;
s1_11->s1_13;
s1_14->final;
s1_13->thrown;
*/

outer: while (a) {
    try {
        while (b) {
            try {
                break outer;
            } finally {
                foo();
            }
        }
        bar();
    } finally {
        baz();
    }
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];
    s1_1[label="Program:enter\nLabeledStatement:enter\nIdentifier (outer)\nWhileStatement:enter"];
    s1_2[label="Identifier (a)"];
    s1_3[label="BlockStatement:enter\nTryStatement:enter\nBlockStatement:enter\nWhileStatement:enter"];
    s1_4[label="Identifier (b)"];
    s1_6[label="BlockStatement:enter\nTryStatement:enter\nBlockStatement:enter\nBreakStatement:enter\nIdentifier (outer)\nBreakStatement:exit"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nBlockStatement:exit"];
    s1_14[label="WhileStatement:exit\nLabeledStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (last)\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_11[label="WhileStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_12[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nBlockStatement:exit"];
    s1_9[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_13[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_6->s1_7->s1_8->s1_4;
    s1_2->s1_14;
    s1_4->s1_11->s1_12->s1_2;
    s1_6->s1_9->s1_13->s1_14;
    s1_7->s1_9;
    s1_4->s1_13;
    s1_11->s1_13;
    s1_14->final;
    s1_13->thrown;
}
*/
