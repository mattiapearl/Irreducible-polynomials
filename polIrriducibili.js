const fs = require("fs");

//RETURNS
let polIrriducibili = [];
//INPUT
const primo = 7;
const gradoMax = 3;
const monici = true;

function deg(pol) {
    return pol.length - 1;
}

function cleanerPol(polinomial) {
    const res = [...polinomial];
    let cleaner = res.length - 1;
    while (cleaner != 0) {
        cleaner = res.length - 1;
        if (res[cleaner] == 0) {
            res.pop();
        } else {
            cleaner = 0;
        }
    }
    return res;
}
// arrays.
function moltPolinom(polA, polB) {
    const pol1 = [...polA];
    const pol2 = [...polB];
    // console.log("> POL MOLT", pol1, pol2);
    const res = [];
    const moltDeg = deg(pol1) + deg(pol2);
    //Il primo polinomio diventa quello di grado maggiore
    // console.log(moltDeg, pol1, pol2);
    for (let i = 0; i <= moltDeg; i++) {
        if (deg(pol1) < i) {
            pol1.push(0);
        }
        if (deg(pol2) < i) {
            pol2.push(0);
        }
        res.push(0);
        //Rispetto al grado che stiamo osservando, prendiamo tutti i termini minori o uguali a quello nel primo polinomio
        for (let a = 0; a <= i; a++) {
            const oppositeDeg = i - a;
            const coeffIA = pol1[a] * pol2[oppositeDeg];
            res[i] += coeffIA;
        }
        res[i] = res[i] % primo;
    }
    // console.log(">> DIRTY RESULT", res, "\n");
    return cleanerPol(res);
}

function radice(arrayPolinomi, numero) {
    const results = [];
    arrayPolinomi.forEach((polinomio) => {
        let calcolo = 0;
        let index = 0;
        polinomio.forEach((coeff) => {
            calcolo += coeff * numero ** index;
            calcolo = calcolo % primo;
            index++;
        });
        results.push(calcolo);
    });
    return results;
}
//!Doesn't work
function genPolin(gradoMax, primo) {
    const res = [];
    /**
     * Example:
     * pol = [4,4,4]
     * unit = [0]
     * 1 - [0, 4F,4]
     * pol = [0,4,4]
     * unit = [1]
     * 2 - [0, 0 ,4F]
     * pol = [0,4,4]
     * unit = [2]
     * 3 - [0,0,0,F]
     * pol = [0,0,0]
     * unit = [3]
     * 4.1 - length = 3, 3-1 < 3 => [0,0,0,0]
     * 4.2 - [0,0,0,1]
     */
    function recAdd1(pol, unit, i) {
        // console.log(">1 ", pol, unit, i);
        if (pol.length - 1 < unit) {
            pol[unit] = 0;
        }
        if (pol[unit] == primo - 1) {
            pol[unit] = 0;
            return recAdd1(pol, unit + 1, i);
        } else {
            // console.log(">2 ", pol, unit, i);
            if (i == 0) {
                // console.log("0 - Returning: ", pol);
                return pol;
            } else pol[unit]++;
            // console.log("Returning: ", pol);
            return pol;
        }
    }
    //NON grado max - 1, il grado già non conta il termine noto
    const iterations = primo ** (gradoMax + 1);
    let lastPol = [0];
    for (let i = 0; i < iterations; i++) {
        lastPol = recAdd1(lastPol, 0, i);
        // const monicoGradP1 = [...lastPol, 1];
        // res.push(monicoGradP1);
        res.push([...lastPol]);
    }
    return res;
}

function arrayToPol(array) {
    const _5 = "⁵";
    const _4 = "⁴";
    const _3 = "³";
    const _2 = "²";
    let result = "";
    for (let i = 0; i < array.length; i++) {
        const element = array[i].toString();
        let append;
        switch (i) {
            case 0:
                append = " + " + element;
                break;
            case 1:
                append = " + " + element + "x";
                break;
            case 2:
                append = " + " + element + "x" + _2;
                break;
            case 3:
                append = " + " + element + "x" + _3;
                break;
            case 4:
                append = " + " + element + "x" + _4;
                break;
            case 5:
                append = " + " + element + "x" + _5;
                break;
        }

        result = append + result;
    }
    return result.substring(2);
}

//RUNTIME
const allPols = genPolin(gradoMax, primo);
// console.log(allPols);

let tempArray = [...allPols];
let multArray = [...allPols];

for (let i = 0; i < allPols.length; i++) {
    //There is this fucking bug which involves JS using a reference to the array and modifying the actual thing. Which is of course obnoxious.
    const base = [...tempArray[i]];
    // console.log(base);
    if (JSON.stringify(base) != JSON.stringify([-1])) {
        for (let a = 0; a < allPols.length; a++) {
            const mult = [...multArray[a]];
            // console.log("   ", mult);
            if (deg(base) + deg(mult) <= gradoMax && deg(base) != 0 && deg(mult) != 0) {
                const prodotto = moltPolinom(base, mult);
                tempArray.forEach((pol) => {
                    // console.log(pol, prodotto);
                    if (JSON.stringify(pol) == JSON.stringify(prodotto)) {
                        tempArray = tempArray.map((el) => {
                            if (JSON.stringify(el) == JSON.stringify(prodotto)) {
                                // console.log(JSON.stringify(prodotto));
                                return [-1];
                            } else {
                                return el;
                            }
                        });
                        // console.log(tempArray);
                    }
                });
            }
        }
    }
}

tempArray = tempArray.filter((pol) => {
    if (JSON.stringify(pol) != JSON.stringify([-1])) {
        if (monici) {
            return pol[pol.length - 1] == 1;
        } else {
            return true;
        }
    }
});
const jsonOutput = {};
tempArray.forEach((element) => {
    const l = [...element].length - 1;
    if (jsonOutput.hasOwnProperty(l)) {
        jsonOutput[l].push(element);
    } else {
        jsonOutput[l] = [element];
    }
});

// console.log(genPolin(gradoMax, primo));
fs.writeFile(`./lists/p${primo}g${gradoMax}m${monici}.json`, JSON.stringify(jsonOutput), function (err) {
    if (err) throw err;
    console.log("File is created successfully. Printed results");
});
