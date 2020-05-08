/*  GRAMMAR
    B (block)::= {st(1)...st(n)}
    st (stmt)::= beq | x = beq | ::beq
    beq (bool equation) ::= exPt | exPt && exPt | exPt || exPt
    exPt (!) ::= !be
    be (boolean expression) ::= e == e | e <= e | e >= e | e != e
    e (expr) ::= t | t + t | t - t
    t (term) ::= v | v * v | v / v
    v (val)  ::= n | s | b | (beq)
    n (num)  ::= double
    s (str)  ::= string
    b (bool) ::= true | false
*/


let parse = function (toks) {
    let tokPtr = 0

    let tree = []

    try {
        while (tokPtr < toks.length) {
            tree.push(St())
        }

        return tree.filter((val) => val != undefined)
    } catch (err) {
        console.log(err)
        return "There was an error evaluating that expression."
    }

    function St() {
        let a = Beq()
        let b; let op = ""
        let assignmentFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][0] === "=") {
                op = "="
                assignmentFound = true
                ++tokPtr
                b = Beq()
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

    function Beq() {
        let a = ExPt()
        let b; let op = ""
        let isFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][1] === "boolEq") {
                op = toks[tokPtr][0]
                isFound = true
                ++tokPtr
                b = ExPt()
            }
        }

        if (isFound) {
            let out = {
                type: "boolEq",
                value: op,
                children: [a, b]
            }
            return out
        } else {
            return a
        }
    }

    function ExPt() {
        let a = toks[tokPtr][0]
        if (a === "!") {
            tokPtr++
            let b = Be()
            let out = {
                type: "!",
                value: b
            }
            return out
        } else {
            return Be()
        }
    }

    function Be() { //Boolean expression detector/parser. Should be done after doing all math operations.
        let a = E()
        let b; let op = ""
        let isFound = false
        if (tokPtr < toks.length) {
            while (toks[tokPtr][1] === "boolOp") {
                op = toks[tokPtr][0]
                isFound = true
                ++tokPtr
                b = E()
            }
        }

        if (isFound) {
            let out = {
                type: "boolOp",
                value: op,
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
            while (toks[tokPtr][0] === "+" || toks[tokPtr][0] === "-") {
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
            out.value = op;
            return out
        } else {
            return a
        }
    }

    function T() { //Term
        let a = V()
        let b; let op = ""
        let isFound = false
        if (tokPtr < toks.length) {
            while (["*", "/", "%"].includes(toks[tokPtr][0])) {
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
            out.value = op;
            return out
        } else {
            return a
        }
    }

    function V() { //Value
        if (tokPtr < toks.length) {
            if (toks[tokPtr][1] === "num") {
                let out = {
                    type: "num",
                    value: toks[tokPtr++][0]
                }
                //return toks[tokPtr++][0]
                return out
            } else if (toks[tokPtr][1] === "symbol") {
                let out = {
                    type: "symbol",
                    value: toks[tokPtr++][0]
                }

                return out
            } else if (toks[tokPtr][1] === "bool") {
                let out = {
                    type: "bool",
                    value: toks[tokPtr++][0]
                }

                return out
            } else if (toks[tokPtr][0].indexOf("(") > -1) {
                ++tokPtr //consumes (
                let sum = Beq()
                ++tokPtr //consumes )
                return sum
            } else if (toks[tokPtr][0] === "eos") {
                tokPtr++
            } else {
                console.log("Expression expected but not found. Value: " + toks[tokPtr][0])
            }
        }
    }
}

module.exports = parse