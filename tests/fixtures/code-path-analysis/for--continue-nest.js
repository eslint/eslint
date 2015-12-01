/*expected
initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_8->s1_7->s1_5;
s1_2->s1_12;
s1_5->s1_11->s1_4->s1_2;
s1_6->s1_10->s1_7;
s1_8->s1_9->s1_10;
s1_12->final;
*/
for (var i = 0; i < 10; ++i) {
    for (var i = 0; i < 10; ++i) {
        if (c) {
            continue;
        }
        foo();
    }
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_2[label="BinaryExpression\nIdentifier (i)\nLiteral (10)"];
    s1_3[label="BlockStatement\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_5[label="BinaryExpression\nIdentifier (i)\nLiteral (10)"];
    s1_6[label="BlockStatement\nIfStatement\nIdentifier (c)"];
    s1_8[label="BlockStatement\nContinueStatement"];
    s1_7[label="UpdateExpression\nIdentifier (i)"];
    s1_12[label="ForStatement:exit\nProgram:exit"];
    s1_11[label="ForStatement:exit\nBlockStatement:exit"];
    s1_4[label="UpdateExpression\nIdentifier (i)"];
    s1_10[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_9[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_8->s1_7->s1_5;
    s1_2->s1_12;
    s1_5->s1_11->s1_4->s1_2;
    s1_6->s1_10->s1_7;
    s1_8->s1_9->s1_10;
    s1_12->final;
}
*/
