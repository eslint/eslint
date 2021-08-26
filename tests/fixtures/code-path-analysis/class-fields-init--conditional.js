/*expected
initial->s2_1->s2_2->s2_4;
s2_1->s2_3->s2_4->final;
*/
/*expected
initial->s1_1->final;
*/


class Foo { a = b ? c : d }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="ConditionalExpression:enter\nIdentifier (b)"];
    s2_2[label="Identifier (c)"];
    s2_4[label="ConditionalExpression:exit"];
    s2_3[label="Identifier (d)"];
    initial->s2_1->s2_2->s2_4;
    s2_1->s2_3->s2_4->final;
}

digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nPropertyDefinition:enter\nIdentifier (a)\nConditionalExpression\nPropertyDefinition:exit\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
