function debounce(func, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, arguments), delay);
    };
}

function isEmpty(value) {
    return value === null || value === undefined || value.trim() === '' || /^[\s\n]*$/.test(value);
}

async function tryExecute(callback: () => Promise<void>) {
    try {
        await callback();
    }
    catch (e) {
        console.error(e);
    }
}

export { debounce, isEmpty, tryExecute };
