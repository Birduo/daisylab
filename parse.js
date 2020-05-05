/*  GRAMMAR
    B (block)::= {st(1)...st(n)}
    st (stmt)::= e | x = e | return e | if e then B else B
    e (expr) ::= t | t + t | t - t
    t (term) ::= v | v * v | v / v
    v (val)  ::= n | s | b | (e)
    n (num)  ::= double
    s (str)  ::= string
    b (bool) ::= true | false
*/


let parse = function (toks) {
    let tokPtr = 0

    try {
        return St()
    } catch (err) {
        console.log(err)
        return "There was an error evaluating that expression."
    }

    function St() {
        let a = E()
        let b; let op = ""
        let assignmentFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][0] == "=") {
                op = "="
                assignmentFound = true
                ++tokPtr
                b = E()
            }
        }
        if (assignmentFound) {
            let out = {
                type: "assignment",
                value: "",
                children: [a, b]
            }
            return out
        } else {
            return a
        }
    }

    function E() {
        let a = T()
        let b; let op = ""
        let isFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][0] == "+" || toks[tokPtr][0] == "-") {
                op = toks[tokPtr][0]
                isFound = true
                ++tokPtr
                b = T()
            }
        }
        if (isFound) {
            let out = {
                type: "binOp",
                value: "",
                children: [a, b]
            }
            out.value = (op == "+") ? "+" : "-";
            return out
        } else {
            return a
        }
    }

    function T() {
        let a = V()
        let b; let op = ""
        let isFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][0] == "*" || toks[tokPtr][0] == "/") {
                op = toks[tokPtr][0]
                isFound = true
                ++tokPtr
                b = V()
            }
        }
        if (isFound) {
            let out = {
                type: "binOp",
                value: "",
                children: [a, b]
            }
            out.value = (op == "*") ? "*" : "/";
            return out
        } else {
            return a
        }
    }

    function V() {
        if (tokPtr < toks.length) {
            if (toks[tokPtr][1] == "num") {
                let out = {
                    type: "num",
                    value: toks[tokPtr++][0]
                }
                //return toks[tokPtr++][0]
                return out
            } else if (toks[tokPtr][1] == "symbol") {
                let out = {
                    type: "symbol",
                    value: toks[tokPtr++][0]
                }

                return out
            } else if (toks[tokPtr][0].indexOf("(") > -1) {
                ++tokPtr //consumes (
                let sum = E()
                ++tokPtr //consumes )
                return sum
            } else {
                console.log("Num expected but not found. Value: " + toks[tokPtr][0])
            }
        }
    }
}

module.exports = parse