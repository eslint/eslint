/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_6;
s1_1->s1_3;
s1_2->s1_6;
s1_3->s1_7;
s1_4->s1_7;
s1_6->final;
s1_7->thrown;
*/

try {
    foo();
} catch (err) {
    bar();
} finally {
    baz();
}

last();

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];
    s1_1[label="Program:enter\nTryStatement:enter\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)"];
    s1_2[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s1_3[label="CatchClause:enter\nIdentifier (err)\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)"];
    s1_4[label="CallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nCatchClause:exit"];
    s1_6[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (last)\nCallExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_7[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_6;
    s1_1->s1_3;
    s1_2->s1_6;
    s1_3->s1_7;
    s1_4->s1_7;
    s1_6->final;
    s1_7->thrown;
}
*/
