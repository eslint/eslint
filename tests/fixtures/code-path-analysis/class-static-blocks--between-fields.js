/*expected
initial->s2_1->s2_2->s2_3;
s2_1->s2_3->final;
*/
/*expected
initial->s3_1->s3_2->s3_3->s3_4;
s3_1->s3_4;
s3_2->s3_4->final;
*/
/*expected
initial->s4_1->s4_2->s4_3->s4_4->s4_5;
s4_1->s4_5;
s4_2->s4_5;
s4_3->s4_5->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { bar = a || b; static { x || y || z } baz = p || q || r || s; }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="LogicalExpression:enter\nIdentifier (a)"];
    s2_2[label="Identifier (b)"];
    s2_3[label="LogicalExpression:exit"];
    initial->s2_1->s2_2->s2_3;
    s2_1->s2_3->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s3_1[label="StaticBlock:enter\nExpressionStatement:enter\nLogicalExpression:enter\nLogicalExpression:enter\nIdentifier (x)"];
    s3_2[label="Identifier (y)\nLogicalExpression:exit"];
    s3_3[label="Identifier (z)"];
    s3_4[label="LogicalExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s3_1->s3_2->s3_3->s3_4;
    s3_1->s3_4;
    s3_2->s3_4->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s4_1[label="LogicalExpression:enter\nLogicalExpression:enter\nLogicalExpression:enter\nIdentifier (p)"];
    s4_2[label="Identifier (q)\nLogicalExpression:exit"];
    s4_3[label="Identifier (r)\nLogicalExpression:exit"];
    s4_4[label="Identifier (s)"];
    s4_5[label="LogicalExpression:exit"];
    initial->s4_1->s4_2->s4_3->s4_4->s4_5;
    s4_1->s4_5;
    s4_2->s4_5;
    s4_3->s4_5->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nPropertyDefinition:enter\nIdentifier (bar)\nLogicalExpression\nPropertyDefinition:exit\nStaticBlock\nPropertyDefinition:enter\nIdentifier (baz)\nLogicalExpression\nPropertyDefinition:exit\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
