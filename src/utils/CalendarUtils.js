function parseDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day);
}

export function sortAppointmentsByDateAndTime(appointmentList) {
    return appointmentList.slice().sort((a, b) => {
        // Tarih karşılaştırması
        const dateComparison = parseDate(a.booked_date)?.getTime() - parseDate(b?.booked_date).getTime();
        if (dateComparison === 0) {
            // Eğer tarihler aynıysa saatlere göre sırala
            return a.booked_time.localeCompare(b.booked_time);
        }
        return dateComparison;
    });
}