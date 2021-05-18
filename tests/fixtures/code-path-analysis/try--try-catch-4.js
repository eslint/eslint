/*expected
initial->s1_1->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_11->s1_12;
s1_1->s1_5;
s1_3->s1_6;
s1_5->s1_9;
s1_6->s1_10;
s1_7->s1_10;
s1_9->s1_12;
s1_1->s1_6;
s1_12->final;
s1_10->thrown;
*/

try {
    try {
        if (a) {
            throw err;
        }
    } catch (err) {
        throw err;
    }
} catch (err) {
    throw err;
}


/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize];
    s1_1[label="Program\nTryStatement\nBlockStatement\nTryStatement\nBlockStatement\nIfStatement\nIdentifier (a)"];
    s1_3[label="BlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_4[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s1_5[label="IfStatement:exit\nBlockStatement:exit"];
    s1_6[label="CatchClause\nIdentifier (err)\nBlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_7[label="ThrowStatement:exit"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit\nCatchClause:exit"];
    s1_9[label="TryStatement:exit\nBlockStatement:exit"];
    s1_10[label="CatchClause\nIdentifier (err)\nBlockStatement\nThrowStatement\nIdentifier (err)"];
    s1_11[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit\nCatchClause:exit"];
    s1_12[label="TryStatement:exit\nProgram:exit"];
    initial->s1_1->s1_3->s1_4->s1_5->s1_6->s1_7->s1_8->s1_9->s1_10->s1_11->s1_12;
    s1_1->s1_5;
    s1_3->s1_6;
    s1_5->s1_9;
    s1_6->s1_10;
    s1_7->s1_10;
    s1_9->s1_12;
    s1_1->s1_6;
    s1_12->final;
    s1_10->thrown;
}
*/
