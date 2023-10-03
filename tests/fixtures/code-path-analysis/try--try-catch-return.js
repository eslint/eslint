/*expected
initial->s2_1->s2_2->s2_3->s2_4->s2_5;
s2_1->s2_4;
s2_2->final;
s2_5->final;
*/

/*expected
initial->s1_1->final;
*/

function foo() {
    try {
        bar();
        return;
    } catch {}
    baz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration:enter\nIdentifier (foo)\nBlockStatement:enter\nTryStatement:enter\nBlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)"];
    s2_2[label="CallExpression:exit\nExpressionStatement:exit\nReturnStatement"];
    s2_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s2_4[label="CatchClause:enter\nBlockStatement\nCatchClause:exit"];
    s2_5[label="TryStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (baz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nFunctionDeclaration:exit"];
    initial->s2_1->s2_2->s2_3->s2_4->s2_5;
    s2_1->s2_4;
    s2_2->final;
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
