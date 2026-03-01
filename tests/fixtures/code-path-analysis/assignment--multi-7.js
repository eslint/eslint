/*expected
initial->s1_1->s1_2->s1_3->s1_4->s1_5;
s1_1->s1_5;
s1_2->s1_5;
s1_3->s1_5->final;
*/
a ??= b ||= c &&= d;

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nIdentifier (a)"];
    s1_2[label="AssignmentExpression:enter\nIdentifier (b)"];
    s1_3[label="AssignmentExpression:enter\nIdentifier (c)"];
    s1_4[label="Identifier (d)\nAssignmentExpression:exit\nAssignmentExpression:exit"];
    s1_5[label="AssignmentExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    initial->s1_1->s1_2->s1_3->s1_4->s1_5;
    s1_1->s1_5;
    s1_2->s1_5;
    s1_3->s1_5->final;
}
*/
