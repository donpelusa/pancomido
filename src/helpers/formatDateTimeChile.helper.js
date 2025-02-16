// frontend/src/helpers/formatDateTimeChile.helper.js

export const formatDateTimeChile = (dateStr) => {
    const d = new Date(dateStr);
    // Restar 3 horas para ajustar al huso horario CLST (UTC-3)
    d.setHours(d.getHours() - 3);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
};
