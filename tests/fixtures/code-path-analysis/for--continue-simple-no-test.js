/*expected
initial->s1_1->s1_3->s1_4->s1_2->s1_3->s1_6->s1_2;
s1_4->s1_5->s1_6->s1_7;
*/
for (var i = 0; ; ++i) {
    if (b) {
        continue;
    }
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_3[label="BlockStatement\nIfStatement\nIdentifier (b)"];
    s1_4[label="BlockStatement\nContinueStatement"];
    s1_2[label="UpdateExpression\nIdentifier (i)"];
    s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_5[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_7[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_3->s1_4->s1_2->s1_3->s1_6->s1_2;
    s1_4->s1_5->s1_6->s1_7;
}
*/
