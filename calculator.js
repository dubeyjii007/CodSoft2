ocument.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let current = '';
    let resetNext = false;

    function updateDisplay(val) {
        display.textContent = val;
    }

    function safeEval(expr) {
        try {
            // Replace symbols with JS operators
            expr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/–/g, '-');
            // Remove trailing operator
            expr = expr.replace(/[+\-*/.]$/, '');
            // Evaluate
            let result = Function('return ' + expr)();
            if (typeof result === 'number' && isFinite(result)) {
                return result;
            } else {
                return 'Error';
            }
        } catch {
            return 'Error';
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const val = this.textContent;
            if (val === 'C') {
                current = '';
                updateDisplay('0');
                resetNext = false;
            } else if (val === '=') {
                const result = safeEval(current);
                updateDisplay(result);
                current = result === 'Error' ? '' : result.toString();
                resetNext = true;
            } else if ('÷×–+'.includes(val)) {
                if (current && !/[+\-×÷]$/.test(current)) {
                    current += val;
                    updateDisplay(current);
                    resetNext = false;
                }
            } else if (val === '.') {
                // Prevent multiple decimals in a number
                const parts = current.split(/[+\-×÷]/);
                if (!parts[parts.length - 1].includes('.')) {
                    current += val;
                    updateDisplay(current);
                }
            } else { // digit
                if (resetNext) {
                    current = '';
                    resetNext = false;
                }
                current += val;
                updateDisplay(current);
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        let key = e.key;
        if (key === 'Enter' || key === '=') {
            const result = safeEval(current);
            updateDisplay(result);
            current = result === 'Error' ? '' : result.toString();
            resetNext = true;
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            current = '';
            updateDisplay('0');
            resetNext = false;
            e.preventDefault();
        } else if ('0123456789'.includes(key)) {
            if (resetNext) {
                current = '';
                resetNext = false;
            }
            current += key;
            updateDisplay(current);
        } else if (key === '.') {
            const parts = current.split(/[+\-×÷]/);
            if (!parts[parts.length - 1].includes('.')) {
                current += key;
                updateDisplay(current);
            }
        } else if (['+', '-', '*', '/', '×', '÷', '–'].includes(key)) {
            let op = key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            if (op === '-') op = '–';
            if (current && !/[+\-×÷]$/.test(current)) {
                current += op;
                updateDisplay(current);
                resetNext = false;
            }
        }
    });
});