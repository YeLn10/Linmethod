let eps = 1e-12;
let a = [];

function extract() {
    let maxn = 0;
    let tmp = {};
    let poly = document.getElementById("poly").value.trim();
    const terms = poly.split(/(?=[+-])/g);
    poly = poly.replaceAll('{', '');
    poly = poly.replaceAll('}', '');
    poly = poly.replace(/\s+/g, "").toLowerCase();

    for (const term of terms) {
        let sign = '+';
        let rem = term.trim();
        if (rem === "") continue;
        if (rem.startsWith('+')) {
            sign = rem[0];
            rem = rem.slice(1).trim();
        }
        if (rem == "") continue;
        if (!rem.includes('x')) {
            const coe = (sign === '-') ? -parseFloat(rem) : parseFloat(rem);
            tmp[0] = (tmp[0] || 0) + coe;
            continue;
        }
        const parts = rem.split('x');
        const coePart = parts[0].trim();
        const expPart = parts[1]?.trim() || '';

        let coe;
        if (coePart == "") coe = (sign === '-') ? -1 : 1;
        else {
            coe = parseFloat(coePart);
            if (isNaN(coe)) coe = (sign === '-') ? -1 : 1;
            else if (sign == '-') coe = -coe;
        }
        let exp = 1;
        if (expPart.startsWith('^')) {
            exp = parseInt(expPart.slice(1), 10);
            if (isNaN(exp)) exp = 1;
        }
        tmp[exp] = (tmp[exp] || 0) + coe;
        maxn = Math.max(maxn, exp);
    }
    for (let i = 0; i <= maxn; i++) {
        if (tmp.hasOwnProperty(maxn - i)) a.push(tmp[maxn - i]);
        else a.push(0);
    }
    console.log(a);
    return maxn;
}


function div(f, p, q) {
    let tmp = [];
    for (let i = 0; i < f.length; i++) tmp.push(f[i]);
    let ans = [];
    let len = tmp.length;
    for (let i = 0; i < len - 2; i++) {
        ans.push(tmp[i]);
        tmp[i + 1] -= tmp[i] * p;
        tmp[i + 2] -= tmp[i] * q;
    }
    ans.push(tmp[len - 2]);
    ans.push(tmp[len - 1]);
    return ans;
}
function solve(g) {
    let f = [];
    for (let i = 0; i < g.length; i++) f.push(g[i]);
    let u = Math.random(), v = Math.random();
    let cnt = 0;
    while (1) {
        cnt++;
        if (cnt > 5000) return "nonono";
        let res1 = div(f, u, v);
        let R1 = res1.at(-2), R2 = res1.at(-1);
        if (Math.abs(R1) < eps && Math.abs(R2) < eps) break;
        let tmp = [];
        for (let j = 0; j < res1.length - 2; j++)
            tmp.push(res1[j]);
        tmp.push(0);
        let res2 = div(tmp, u, v);

        let S1 = res2.at(-2), S2 = res2.at(-1);
        let T1, T2;
        if (res2.length > 4) T1 = res1.at(-4) - res2.at(-4) * u - res2.at(-5) * v;
        else if (res2.length > 3) T1 = res1.at(-4) - res2.at(-4) * u - v;
        else T1 = res1.at(-4) + u;
        if (res2.length > 3) T2 = res1.at(-3) - res2.at(-4) * v;
        else T2 = res1.at(-3) + v;
        let det = (S1 * T2 - S2 * T1);
        let du = (R1 * T2 - R2 * T1) / det, dv = (S1 * R2 - S2 * R1) / det;
        u += du, v += dv;
    }
    res1 = div(f, u, v);
    return [u, v];
}
function trans(x, y, z) {
    let poly = "";
    if (x != 0) {
        if (x == 1) poly += "x^2";
        else if (x == -1) poly += "-x^2";
        else poly += x.toFixed(6) + "x^2";
    }
    if (y != 0) {
        if (poly.length > 0) {
            if (y > 0 && Math.abs(y) > 1e-5) poly += "+";
        }
        if (y == 1) poly += "x";
        else if (y == -1) poly += "-x";
        else if (Math.abs(y) > 1e-5) poly += y.toFixed(6) + "x";
    }
    if (z != 0) {
        if (poly.length > 0) {
            if (z > 0 && Math.abs(z) > 1e-5) poly += "+";
        }
        if (Math.abs(z) > 1e-5) poly += z.toFixed(6);
    }
    if (poly.length == 0) poly = "0";
    return poly;
}
function final() {
    let n = extract() + 1;
    if (a[0] != 1) console.log(a[0]);
    let out = "";
    if (n == 1 || a[0] != 1) out += a[0].toString();
    for (let i = 1; i < n; i++) a[i] /= a[0]; a[0] = 1;
    let cnt = 0;
    out += "\\begin{align}"
    for (let i = n; i >= 4; i -= 2) {
        let res = solve(a);
        if (res == "nonono") {
            i += 2;
            continue;
        }
        a = div(a, res[0], res[1]);
        a.pop(); a.pop();
        console.log(trans(1, res[0], res[1]));
        cnt++;
        if (cnt % 4 == 1) out += "&"
        out += "(" + trans(1, res[0], res[1]) + ")";
        if (cnt % 4 == 0) out += "\\\\"
    }
    if (a.length == 3) {
        console.log(trans(a[0], a[1], a[2]));
        cnt++;
        if (cnt % 4 == 1) out += "&"
        out += "(" + trans(a[0], a[1], a[2]) + ")";
        if (cnt % 4 == 0) out += "\\\\"
    }
    else if (a.length == 2) {
        console.log(trans(0, 1, a[1]));
        cnt++;
        if (cnt % 4 == 1) out += "&"
        out += "(" + trans(0, 1, a[1]) + ")";
        if (cnt % 4 == 0) out += "\\\\"
    }
    out += "\\end{align}"
    console.log(out);
    document.getElementById("ans").textContent = `\\[${out}\\]`;
    MathJax.typesetPromise([ans]).catch((err) => console.error(err));

    a.length = 0;
}


const input = document.getElementById("poly");
document.addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        final();
    }
});

input.addEventListener('input', function () {
    const formula = this.value;
    const output = document.getElementById("output");
    output.innerHTML = `\\[${formula}\\]`;
    if (formula == "") output.innerHTML = `\\[x^{10}+3x^3+2x^2-1+x^2\\]`;
    MathJax.typesetPromise([output]).catch((err) => console.error(err));
});
window.onload = function () {
    const output = document.getElementById("output");
    output.innerHTML = `\\[x^{10}+3x^3+2x^2-1+x^2\\]`;
    MathJax.typesetPromise([output]).catch((err) => console.error(err));
    document.getElementById("ans").textContent = `\\[\\]`;
    MathJax.typesetPromise([ans]).catch((err) => console.error(err));
};