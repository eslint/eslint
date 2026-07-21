/*expected
initial->s1_1->s1_3->s1_4->s1_5->s1_6->s1_2->s1_3->s1_6;
s1_4->s1_7->final;
*/
for (var i = 0; ; ++i) {
    if (b) {
        break;
    }
    foo();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nForStatement\nVariableDeclaration\nVariableDeclarator\nIdentifier (i)\nLiteral (0)"];
    s1_3[label="BlockStatement\nIfStatement\nIdentifier (b)"];
    s1_4[label="BlockStatement\nBreakStatement"];
    s1_5[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_6[label="ExpressionStatement\nCallExpression\nIdentifier (foo)"];
    s1_2[label="UpdateExpression\nIdentifier (i)"];
    s1_7[label="ForStatement:exit\nProgram:exit"];
    initial->s1_1->s1_3->s1_4->s1_5->s1_6->s1_2->s1_3->s1_6;
    s1_4->s1_7->final;
}
*/
