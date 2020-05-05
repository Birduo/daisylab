/*  Lexing For:
    num, bool, symbols, + - * / () {}
*/


let lex = function (s) {
    let out = []

    let sum = ""
    let type = ""
    for (let i = 0; i < s.length; i++) {
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
                out.push([sum, type])
                sum = ""
                type = ""
            }

            sum += s[i]
            type = "num"
        } else if (s[i].match(/[\.]/g) && type == "num" && i < s.length - 1 && s[i + 1].match(/[0-9]/g)) {
            sum += s[i]
        } else if (s[i].match(/[\+\-\*\/\(\)\=]/g)) {
            if (sum != "") {
                out.push([sum, type])
            }

            out.push([s[i], s[i]])
            sum = ""
            type = ""
        } else if (s[i] === "\n") {
            if (sum != "") {
                out.push([sum, type])
            }
            
            out.push(["eos", "eos"]) //eos = end of statement

            sum = ""
            type = ""
        } else {
            if (sum != "") {
                out.push([sum, type])
            }

            sum = ""
            type = ""
        }
    }
    if (sum != "") {
        out.push([sum, type])
    }

    return out
}

module.exports = lex