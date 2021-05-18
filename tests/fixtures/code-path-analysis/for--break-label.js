/*expected
initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_8->s1_9->s1_10->s1_11->s1_12->s1_13->s1_7->s1_5;
s1_2->s1_15;
s1_5->s1_14->s1_4->s1_2;
s1_6->s1_10;
s1_8->s1_15;
s1_10->s1_13;
s1_11->s1_14;
s1_15->final;
*/
A: for (var i = 0; i < 10; ++i) {
    B: for (var j = 0; j < 10; ++j) {
        if (c) {
            break A;
        }
        if (d) {
            break B;
        }
        foo();
    }
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nLabeledStatement\nIdentifier (A)\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_2[label="BinaryExpression\nIdentifier (i)\nLiteral (10)"];
    s1_3[label="BlockStatement\nLabeledStatement\nIdentifier (B)\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (j)\nLiteral (0)"];
    s1_5[label="BinaryExpression\nIdentifier (j)\nLiteral (10)"];
    s1_6[label="BlockStatement\nIfStatement\nIdentifier (c)"];
    s1_8[label="BlockStatement\nBreakStatement\nIdentifier (A)"];
    s1_9[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_10[label="IfStatement\nIdentifier (d)"];
    s1_11[label="BlockStatement\nBreakStatement\nIdentifier (B)"];
    s1_12[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_13[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_7[label="UpdateExpression\nIdentifier (j)"];
    s1_15[label="ForStatement:exit\nLabeledStatement:exit\nProgram:exit"];
    s1_14[label="ForStatement:exit\nLabeledStatement:exit\nBlockStatement:exit"];
    s1_4[label="UpdateExpression\nIdentifier (i)"];
    initial->s1_1->s1_2->s1_3->s1_5->s1_6->s1_8->s1_9->s1_10->s1_11->s1_12->s1_13->s1_7->s1_5;
    s1_2->s1_15;
    s1_5->s1_14->s1_4->s1_2;
    s1_6->s1_10;
    s1_8->s1_15;
    s1_10->s1_13;
    s1_11->s1_14;
    s1_15->final;
}
*/
