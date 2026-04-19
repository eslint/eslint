/*expected
initial->s2_1->s2_2->s2_3->s2_5;
s2_1->s2_3;
s2_2->s2_5;
s2_3->s2_6;
s2_1->s2_6->final;
s2_5->final;
*/
/*expected
initial->s1_1->final;
*/

function* generator() {
    try {
        yield 1;
        foo();
    } catch (err) {
        bar(err);
    } finally {
        baz();
    }
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration:enter\nIdentifier (generator)\nBlockStatement:enter\nTryStatement:enter\nBlockStatement:enter\nExpressionStatement:enter\nYieldExpression:enter\nLiteral (1)"];
    s2_2[label="YieldExpression:exit\nExpressionStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s2_3[label="CatchClause:enter\nIdentifier (err)\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)\nIdentifier (err)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nCatchClause:exit"];
    s2_5[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nTryStatement:exit\nBlockStatement:exit\nFunctionDeclaration:exit"];
    s2_6[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    initial->s2_1->s2_2->s2_3->s2_5;
    s2_1->s2_3;
    s2_2->s2_5;
    s2_3->s2_6;
    s2_1->s2_6->final;
    s2_5->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nFunctionDeclaration\nProgram:exit"];
    initial->s1_1->final;
}
*/
