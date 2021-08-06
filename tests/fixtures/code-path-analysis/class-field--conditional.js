/*expected
initial->s1_1->s1_2->s1_4;
s1_1->s1_3->s1_4->final;
*/

class x { a = b ? c : d }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (x)\nClassBody:enter\nPropertyDefinition:enter\nIdentifier (a)\nConditionalExpression:enter\nIdentifier (b)"];
    s1_2[label="Identifier (c)"];
    s1_4[label="ConditionalExpression:exit\nPropertyDefinition:exit\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    s1_3[label="Identifier (d)"];
    initial->s1_1->s1_2->s1_4;
    s1_1->s1_3->s1_4->final;
}
*/
