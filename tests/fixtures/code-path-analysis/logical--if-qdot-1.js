/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_9->s1_11;
s1_1->s1_3->s1_10->s1_11;
s1_4->s1_6->s1_8->s1_9;
s1_11->final;
*/
if (obj?.foo) {
    if (obj?.bar) {
        foo();
    } else {
        bar();
    }
} else {
    qiz();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nIfStatement:enter\nChainExpression:enter\nMemberExpression:enter\nIdentifier (obj)"];
    s1_2[label="Identifier (foo)\nMemberExpression:exit"];
    s1_3[label="ChainExpression:exit"];
    s1_4[label="BlockStatement:enter\nIfStatement:enter\nChainExpression:enter\nMemberExpression:enter\nIdentifier (obj)"];
    s1_5[label="Identifier (bar)\nMemberExpression:exit"];
    s1_6[label="ChainExpression:exit"];
    s1_7[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (foo)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];        
    s1_9[label="IfStatement:exit\nBlockStatement:exit"];
    s1_11[label="IfStatement:exit\nProgram:exit"];
    s1_10[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (qiz)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];       
    s1_8[label="BlockStatement:enter\nExpressionStatement:enter\nCallExpression:enter\nIdentifier (bar)\nCallExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];        
    initial->s1_1->s1_2->s1_3->s1_4->s1_5->s1_6->s1_7->s1_9->s1_11;
    s1_1->s1_3->s1_10->s1_11;
    s1_4->s1_6->s1_8->s1_9;
    s1_11->final;
}
*/
