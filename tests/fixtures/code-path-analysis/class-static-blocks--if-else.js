/*expected
initial->s2_1->s2_2->s2_4;
s2_1->s2_3->s2_4->final;
*/
/*expected
initial->s1_1->final;
*/
class Foo { static { if (bar) { this.baz = 1; } else { this.qux = 2; } } }

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="StaticBlock:enter\nIfStatement:enter\nIdentifier (bar)"];
    s2_2[label="BlockStatement:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (baz)\nMemberExpression:exit\nLiteral (1)\nAssignmentExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
    s2_4[label="IfStatement:exit\nStaticBlock:exit"];
    s2_3[label="BlockStatement:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (qux)\nMemberExpression:exit\nLiteral (2)\nAssignmentExpression:exit\nExpressionStatement:exit\nBlockStatement:exit"];
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
