/*expected
initial->s2_1->s2_2->s2_3->s2_4->s2_5;
s2_1->s2_3->s2_5->final;
*/
/*expected
initial->s1_1->final;
*/
function foo({a: {b = 0} = {}}) {
    bar();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration\nIdentifier (foo)\nObjectPattern\nProperty\nIdentifier (a)\nAssignmentPattern\nObjectPattern\nProperty\nIdentifier (b)\nAssignmentPattern\nIdentifier (b)"];
    s2_2[label="Literal (0)"];
    s2_3[label="AssignmentPattern:exit\nProperty:exit\nObjectPattern:exit"];
    s2_4[label="ObjectExpression"];
    s2_5[label="BlockStatement\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
    initial->s2_1->s2_2->s2_3->s2_4->s2_5;
    s2_1->s2_3->s2_5->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nFunctionDeclaration\nEmptyStatement"];
    initial->s1_1->final;
}
*/
