/*expected
initial->s1_1->s1_3->s1_2->s1_4->s1_6->s1_5->s1_7->s1_5;
s1_3->s1_9;
s1_6->s1_8->s1_2;
s1_7->s1_8->s1_9->final;
*/
for (var a in {}) 
    for (var b in {})
        foo;

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForInStatement"];
    s1_3[label="ObjectExpression\nObjectExpression:exit"];
    s1_2[label="VariableDeclaration\nVariableDeclarator\nIdentifier (a)\nIdentifier:exit (a)\nVariableDeclarator:exit\nVariableDeclaration:exit"];
    s1_4[label="ForInStatement"];
    s1_6[label="ObjectExpression\nObjectExpression:exit"];
    s1_5[label="VariableDeclaration\nVariableDeclarator\nIdentifier (b)\nIdentifier:exit (b)\nVariableDeclarator:exit\nVariableDeclaration:exit"];
    s1_7[label="ExpressionStatement\nIdentifier (foo)\nIdentifier:exit (foo)\nExpressionStatement:exit"];
    s1_9[label="ForInStatement:exit\nProgram:exit"];
    s1_8[label="ForInStatement:exit"];
    initial->s1_1->s1_3->s1_2->s1_4->s1_6->s1_5->s1_7->s1_5;
    s1_3->s1_9;
    s1_6->s1_8->s1_2;
    s1_7->s1_8->s1_9->final;
}
*/
