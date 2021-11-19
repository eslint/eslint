/*expected
initial->s2_1->s2_2->s2_4;
s2_1->s2_3->s2_4->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { static { this.bar = a ? b : c; } }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="StaticBlock:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (bar)\nMemberExpression:exit\nConditionalExpression:enter\nIdentifier (a)"];
    s2_2[label="Identifier (b)"];
    s2_4[label="ConditionalExpression:exit\nAssignmentExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    s2_3[label="Identifier (c)"];
    initial->s2_1->s2_2->s2_4;
    s2_1->s2_3->s2_4->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nStaticBlock\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
