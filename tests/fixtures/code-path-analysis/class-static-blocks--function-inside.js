/*expected
initial->s3_1->final;
*/
/*expected
initial->s2_1->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { static { (p) => {} } }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s3_1[label="ArrowFunctionExpression:enter\nIdentifier (p)\nBlockStatement\nArrowFunctionExpression:exit"];
    initial->s3_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="StaticBlock:enter\nExpressionStatement:enter\nArrowFunctionExpression\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s2_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nStaticBlock\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
