/*expected
initial->s1_1->final;
*/

A: foo();
bar();

/*DOT
digraph {
node[shape=box,style="rounded,filled",fillcolor=white];
initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
s1_1[label="Program\nLabeledStatement\nIdentifier (A)\nExpressionStatement\nCallExpression\nIdentifier (foo)\nExpressionStatement\nCallExpression\nIdentifier (bar)"];
initial->s1_1->final;
}
*/
