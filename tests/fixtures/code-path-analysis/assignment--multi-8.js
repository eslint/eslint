/*expected
initial->s1_1->final;
*/
a = b = c;

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nIdentifier (a)\nAssignmentExpression:enter\nIdentifier (b)\nIdentifier (c)\nAssignmentExpression:exit\nAssignmentExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
