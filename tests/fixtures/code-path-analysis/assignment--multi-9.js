/*expected
initial->s1_1->s1_2->s1_4->s1_5->s1_7->s1_8->s1_9;
s1_1->s1_3->s1_4->s1_6->s1_7->s1_9->final;
*/
a[b ? c : d] = e[f ? g : h] ||= i;

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nIdentifier (a)\nConditionalExpression:enter\nIdentifier (b)"];
    s1_2[label="Identifier (c)"];
    s1_4[label="ConditionalExpression:exit\nMemberExpression:exit\nAssignmentExpression:enter\nMemberExpression:enter\nIdentifier (e)\nConditionalExpression:enter\nIdentifier (f)"];
    s1_5[label="Identifier (g)"];
    s1_7[label="ConditionalExpression:exit\nMemberExpression:exit"];
    s1_8[label="Identifier (i)"];
    s1_9[label="AssignmentExpression:exit\nAssignmentExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    s1_3[label="Identifier (d)"];
    s1_6[label="Identifier (h)"];
    initial->s1_1->s1_2->s1_4->s1_5->s1_7->s1_8->s1_9;
    s1_1->s1_3->s1_4->s1_6->s1_7->s1_9->final;
}
*/
