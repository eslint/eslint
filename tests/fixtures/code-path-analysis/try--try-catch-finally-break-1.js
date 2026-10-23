/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_9->s1_10->s1_2->s1_11;
s1_3->s1_6;
s1_4->s1_6;
s1_5->s1_9;
s1_6->s1_11;
s1_3->s1_9;
s1_11->final;
*/

while (a) {
    try {
        throw err;
    } catch (err) {
        break;
    } finally {
        foo();
    }
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nWhileStatement:enter"];
    s1_2[label="Identifier (a)"];
    s1_3[label="BlockStatement:enter\nTryStatement:enter\nBlockStatement:enter\nThrowStatement:enter\nIdentifier (err)"];
    s1_4[label="ThrowStatement:exit"];
    s1_5[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_6[label="CatchClause:enter\nIdentifier (err)\nBlockStatement:enter\nBreakStatement"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit\nCatchClause:exit"];
    s1_9[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_10[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nTryStatement:exit\nBlockStatement:exit"];
    s1_11[label="WhileStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (last)\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_9->s1_10->s1_2->s1_11;
    s1_3->s1_6;
    s1_4->s1_6;
    s1_5->s1_9;
    s1_6->s1_11;
    s1_3->s1_9;
    s1_11->final;
}
*/
