/*expected
initial->s2_1->s2_2->s2_3->s2_4;
s2_2->s2_4;
s2_1->final;
s2_4->final;
s2_1->thrown;
*/
/*expected
initial->s1_1->final;
*/

function* generator(flag) {
    yield 1;
    if (flag) {
        foo();
    }
    bar();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize=true];
    s2_1[label="FunctionDeclaration:enter\nIdentifier (generator)\nIdentifier (flag)\nBlockStatement:enter\nExpressionStatement:enter\nYieldExpression:enter\nLiteral (1)"];
    s2_2[label="YieldExpression:exit\nExpressionStatement:exit\nIfStatement:enter\nIdentifier (flag)"];
    s2_3[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s2_4[label="IfStatement:exit\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nFunctionDeclaration:exit"];
    initial->s2_1->s2_2->s2_3->s2_4;
    s2_2->s2_4;
    s2_1->final;
    s2_4->final;
    s2_1->thrown;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nFunctionDeclaration\nProgram:exit"];
    initial->s1_1->final;
}
*/
