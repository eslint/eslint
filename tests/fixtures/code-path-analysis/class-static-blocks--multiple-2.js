/*expected
initial->s2_1->s2_2->s2_3->s2_4;
s2_1->s2_4;
s2_2->s2_4->final;
*/
/*expected
initial->s3_1->s3_2->s3_3;
s3_1->s3_3->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { static { x || y || z } static { p || q } }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="StaticBlock:enter\nExpressionStatement:enter\nLogicalExpression:enter\nLogicalExpression:enter\nIdentifier (x)"];
    s2_2[label="Identifier (y)\nLogicalExpression:exit"];
    s2_3[label="Identifier (z)"];
    s2_4[label="LogicalExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s2_1->s2_2->s2_3->s2_4;
    s2_1->s2_4;
    s2_2->s2_4->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s3_1[label="StaticBlock:enter\nExpressionStatement:enter\nLogicalExpression:enter\nIdentifier (p)"];
    s3_2[label="Identifier (q)"];
    s3_3[label="LogicalExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s3_1->s3_2->s3_3;
    s3_1->s3_3->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nStaticBlock\nStaticBlock\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
