/*  Lexing For:
    num, bool, symbols, + - * / () {}
*/


let lex = function (s) {
    let out = []

    let sum = ""
    let type = ""
    let keywords = [
        "true", "false"
    ]

    function keywordCheck() {
        if (type === "symbol" && keywords.includes(sum)) {
            if (["true", "false"].includes(sum)) {
                out.push([sum, "bool"])
            } else {
                out.push([sum, sum])
            }
            return true
        } else {
            return false
        }
    }

    let toggleStr = false
    let escStr = false
    for (let i = 0; i < s.length; i++) {
        if (s[i] == "\"") {
            if (i > 0 && toggleStr && s[i-1] == "\\") {
                escStr = true
            } else {
                if (toggleStr) {
                    toggleStr = false
                    if (sum != "" && type === "string") {
                        out.push([sum.slice(1,sum.length), type])
                        sum = ""
                        type = ""
                    }
                } else {
                    toggleStr = true
                    type = "string"
                }
            }
        }

        if (toggleStr) {
            if (escStr) {
                sum = sum.slice(0, sum.length-1)
                escStr = false
            }

            sum += s[i]
        } else {
            if (s[i].match(/[a-zA-Z]/g)) {
                if (type != "symbol" && sum != "") {
                    out.push([sum, type])
                    sum = ""
                    type = ""
                }

                sum += s[i]
                type = "symbol"
            } else if (s[i].match(/[\w]/g) && type == "symbol") {
                sum += s[i]
            } else if (s[i].match(/[0-9]/g)) {
                if (type != "num" && sum != "") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                    sum = ""
                    type = ""
                }

                sum += s[i]
                type = "num"
            } else if (s[i].match(/[\.]/g) && type == "num" && i < s.length - 1 && s[i + 1].match(/[0-9]/g)) {
                sum += s[i]
            } else if (s[i].match(/[\+\-\*\/\(\)\{\}\%]/g)) {
                if (sum != "") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                    sum = ""
                    type = ""
                }

                out.push([s[i], s[i]])
                sum = ""
                type = ""
            } else if (s[i].match(/[\|\&]/g)) {
                if (sum != "" && type != "boolEq") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                    sum = ""
                    type = ""
                }

                if (type === "boolEq") {
                    sum += s[i]
                    out.push([sum, type])
                    sum = ""
                    type = ""
                } else {
                    if (i < s.length - 1 && s[i] === s[i + 1]) {
                        sum += s[i]
                        type = "boolEq"
                    }
                }
            } else if (s[i].match(/[\=\<\>\!]/g)) {
                if (sum != "" && type != "boolOp") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                    sum = ""
                    type = ""
                }

                if (type === "boolOp") {
                    sum += s[i]
                    out.push([sum, type])
                    sum = ""
                    type = ""
                } else {
                    if (i < s.length - 1 && s[i + 1].match(/[\=]/g)) {
                        sum += s[i]
                        type = "boolOp"
                    } else {
                        if (s[i] === "=" || s[i] === "!") {
                            out.push([s[i], s[i]])
                        } else {
                            out.push([s[i], "boolOp"])
                        }
                    }
                }
            } else if (s[i] === "\n" || s[i] === ";") {
                if (sum != "") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                }

                out.push(["eos", "eos"]) //eos = end of statement

                sum = ""
                type = ""
            } else {
                if (sum != "") {
                    if (!keywordCheck()) {
                        out.push([sum, type])
                    }
                }

                sum = ""
                type = ""
            }
        }
    }

    if (sum != "") {
        if (!keywordCheck()) {
            out.push([sum, type])
        }
        sum = ""
        type = ""
    }

    if (out.length >= 1) {
        if (out[out.length-1][0] != "eos") {
            out.push(["eos", "eos"])
        }
    }

    return out
}

module.exports = lex