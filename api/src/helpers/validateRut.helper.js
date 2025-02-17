// src/helpers/validateRut.helper.js
export const validaRut = (rutCompleto) => {
    // Valida el formato: solo números, un guion y luego un dígito o "k/K"
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    const [rut, dvInput] = rutCompleto.split('-');
    const dvEsperado = computeDV(parseInt(rut, 10));
    // Convertir el dígito verificador calculado a string para comparar correctamente
    return String(dvEsperado) === dvInput.toLowerCase();
};

const computeDV = (T) => {
    let M = 0,
        S = 1;
    while (T) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
        T = Math.floor(T / 10);
    }
    return S ? S - 1 : 'k';
};
