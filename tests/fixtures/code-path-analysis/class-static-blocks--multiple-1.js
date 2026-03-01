/*expected
initial->s2_1->final;
*/
/*expected
initial->s3_1->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { static { this.bar = 1; } static { this.baz = 2; } }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="StaticBlock:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (bar)\nMemberExpression:exit\nLiteral (1)\nAssignmentExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s2_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s3_1[label="StaticBlock:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (baz)\nMemberExpression:exit\nLiteral (2)\nAssignmentExpression:exit\nExpressionStatement:exit\nStaticBlock:exit"];
    initial->s3_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nClassDeclaration:enter\nIdentifier (Foo)\nClassBody:enter\nStaticBlock\nStaticBlock\nClassBody:exit\nClassDeclaration:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
