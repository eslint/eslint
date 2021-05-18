/*expected
initial->s2_1->final;
*/
/*expected
initial->s1_1->s1_2->s1_3;
s1_1->s1_3->final;
*/
var foo = native || function foo() {};

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionExpression\nIdentifier (foo)\nBlockStatement"];
    initial->s2_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nVariableDeclaration\nVariableDeclarator\nIdentifier (foo)\nLogicalExpression\nIdentifier (native)"];
    s1_2[label="FunctionExpression"];
    s1_3[label="LogicalExpression:exit\nVariableDeclarator:exit\nVariableDeclaration:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3;
    s1_1->s1_3->final;
}
*/
