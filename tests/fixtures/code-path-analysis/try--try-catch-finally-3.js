/*languageOptions
    { "sourceType": "commonjs" }
*/
/*expected
initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_9->s1_11;
s1_1->s1_5->s1_6->s1_7;
s1_3->s1_12;
s1_7->s1_11;
s1_8->s1_12;
s1_9->s1_12;
s1_1->s1_8;
s1_5->s1_8;
s1_12->final;
s1_11->final;
s1_12->thrown;
*/

try {
    if (a) {
        return;
    } else {
        throw 0;
    }
} catch (err) {
    b();
} finally {
    c();
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];
    s1_1[label="Program:enter\nTryStatement:enter\nBlockStatement:enter\nIfStatement:enter\nIdentifier (a)"];
    s1_3[label="BlockStatement:enter\nReturnStatement"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nIfStatement:exit\nBlockStatement:exit"];
    s1_8[label="CatchClause:enter\nIdentifier (err)\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (b)"];
    s1_9[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nCatchClause:exit"];
    s1_11[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (c)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (last)\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_5[label="BlockStatement:enter\nThrowStatement:enter\nLiteral (0)\nThrowStatement:exit"];
    s1_6[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_12[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (c)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_3->s1_4->s1_7->s1_8->s1_9->s1_11;
    s1_1->s1_5->s1_6->s1_7;
    s1_3->s1_12;
    s1_7->s1_11;
    s1_8->s1_12;
    s1_9->s1_12;
    s1_1->s1_8;
    s1_5->s1_8;
    s1_12->final;
    s1_11->final;
    s1_12->thrown;
}
*/
