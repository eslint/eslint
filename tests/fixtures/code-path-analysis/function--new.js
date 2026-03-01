/*expected
initial->s2_1->s2_2->s2_4;
s2_1->s2_3->s2_4->final;
*/
/*expected
initial->s1_1->final;
*/
function Foo() { this.a = b ? c : d }; new Foo()

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration:enter\nIdentifier (Foo)\nBlockStatement:enter\nExpressionStatement:enter\nAssignmentExpression:enter\nMemberExpression:enter\nThisExpression\nIdentifier (a)\nMemberExpression:exit\nConditionalExpression:enter\nIdentifier (b)"];
    s2_2[label="Identifier (c)"];
    s2_4[label="ConditionalExpression:exit\nAssignmentExpression:exit\nExpressionStatement:exit\nBlockStatement:exit\nFunctionDeclaration:exit"];
    s2_3[label="Identifier (d)"];
    initial->s2_1->s2_2->s2_4;
    s2_1->s2_3->s2_4->final;
}
 
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program:enter\nFunctionDeclaration\nEmptyStatement\nExpressionStatement:enter\nNewExpression:enter\nIdentifier (Foo)\nNewExpression:exit\nExpressionStatement:exit\nProgram:exit"];
    initial->s1_1->final;
}
*/
