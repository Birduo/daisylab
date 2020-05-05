const fs = require("fs")
const readline = require("readline")
const lex = require("./lex")
const parse = require("./parse")

let data = ""
try { data = fs.readFileSync("test.txt", "utf8") } catch (err) { console.err(err) }

function repl() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '::'
    });

    rl.prompt();

    rl.on('line', (line) => {
        if (line == "quit") {
            process.exit(0);
        } else {
            console.log(evaluate(parse(lex(line))))
        }
        
        rl.prompt();
    }).on('close', () => {
        process.exit(0);
    });
}

/*

let ast = parse(lex(data))
console.log(walk(ast))
console.log(walkEval(ast))

/*  TREE STRUCTURE
    Keys: type (string), value (string), children (array)
    Binary Operations: type: binOp, value: [+, -, *, /], children: [a, b] (values)
    Values: type: [num, string], value: x
*/

let indent = 0
function walk(tree) {
    console.log("-".repeat(indent * 2) + tree.value)
    if ("children" in tree) {
        indent++
        for (let i = 0; i < tree.children.length; i++) walk(tree.children[i])
        indent--
    }
}

let symbols = []

function evaluate(ast) {
    /*  Symbol Data Format:
        Name: a-z
        Data: type, value
    */

    function symbolLookup(name) {
        for (i in symbols) {
            if (symbols[i].name == name) {
                return symbols[i].data
            }
        }
        return ""
    }

    function indexOfSymbol(name) {
        for (i in symbols) {
            if (symbols[i].name == name) {
                return i
            }
        }
        return -1
    }

    function walkEval(tree) {
        if ("children" in tree) {
            if (tree.type === "binOp") {
                let a = walkEval(tree.children[0])
                let b = walkEval(tree.children[1])
                let out = 0
                switch (tree.value) {
                    case "+":
                        out = a + b; break;
                    case "-":
                        out = a - b; break;
                    case "*":
                        out = a * b; break;
                    case "/":
                        out = a / b; break;
                    default: break;
                }
                return out
            } else {
                let a = tree.children[0]
                let b = walkEval(tree.children[1])
                let bType = (typeof (b) === "number") ? "num" : "";
                if (a.type === "symbol") {
                    let val; let index = indexOfSymbol(a.value)
                    if (index >= 0) {
                        if (symbols[index].data.type === bType) {
                            symbols[index].data.value = b.toString() 
                            return symbols[index].data.value
                        } else {
                            console.log("Attempt to assign type " + bType + " to variable with type " + symbols[index].data.type)
                        }
                    } else {
                        val = ""
                        symbols.push({
                            name: a.value,
                            data: {
                                type: bType,
                                value: b.toString()
                            }
                        })
                        return b
                    }
                } else {
                    console.log("Cannot assign a value to a non-symbol. (" + a.type + ")")
                    return {}
                }
            }
        } else {
            if (tree.type === "symbol") {
                let val = symbolLookup(tree.value)
                if (val != "") {
                    return walkEval(val)
                }
            } else {
                return parseFloat(tree.value)
            }
        }
    }

    return walkEval(ast)
}
