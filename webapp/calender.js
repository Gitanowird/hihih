const API_TOKEN = 'pat624Rd50AbOfi3d.a7ec2a0f490fcb5571758948f8be0a4d10ff0da84c524292fb1792ebdd935e4b';
const BASE_ID = 'appVPFRjPaZovvWAh';
const TABLE_NAME = 'Chanels Kunden Liste';
let calendar;  // Globale Variable für FullCalendar-Instanz
let currentRecordId = null;  // Speichert die ID des aktuell bearbeiteten Termins

// Funktion zum Öffnen des Modal-Formulars
function openEventModal(eventData = null) {
    document.getElementById("eventModal").style.display = "flex";

    if (eventData) {
        currentRecordId = eventData.id;  // Setze die aktuelle ID
        document.getElementById("modalTitle").textContent = "Termin bearbeiten";
        document.getElementById("vorname").value = eventData.vorname || '';
        document.getElementById("nachname").value = eventData.nachname || '';
        document.getElementById("telefonnummer").value = eventData.telefonnummer || '';
        document.getElementById("datum").value = eventData.datum || '';
        document.getElementById("uhrzeit").value = eventData.uhrzeit || '';
        document.getElementById("anmerkung").value = eventData.anmerkung || '';
    } else {
        currentRecordId = null;
        document.getElementById("modalTitle").textContent = "Neuen Termin erstellen";
        document.getElementById("eventForm").reset();
    }
}

// Funktion zum Schließen des Modal-Formulars
function closeEventModal() {
    document.getElementById("eventModal").style.display = "none";
}

// Funktion zum Speichern des Termins
async function saveEvent() {
    const vorname = document.getElementById("vorname").value;
    const nachname = document.getElementById("nachname").value;
    const telefonnummer = document.getElementById("telefonnummer").value;
    const datum = document.getElementById("datum").value;
    const uhrzeit = document.getElementById("uhrzeit").value;
    const anmerkung = document.getElementById("anmerkung").value;

    const eventData = {
        fields: {
            Vorname: vorname,
            Name: nachname,
            Telefonnummer: telefonnummer,
            Datum: datum,
            Uhrzeit: uhrzeit,
            Anmerkung: anmerkung,
        },
    };

    try {
        const method = currentRecordId ? "PATCH" : "POST";
        const url = currentRecordId
            ? `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${currentRecordId}`
            : `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

        const response = await fetch(url, {
            method: method,
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        });

        if (response.ok) {
            alert("Termin erfolgreich gespeichert.");
            closeEventModal();
            calendar.refetchEvents();
        } else {
            alert("Fehler beim Speichern des Termins.");
        }
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern des Termins.");
    }
}

// Funktion zum Löschen des Termins
async function deleteEvent() {
    if (!currentRecordId) return;
    
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${currentRecordId}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        if (response.ok) {
            alert("Termin erfolgreich gelöscht.");
            closeEventModal();
            calendar.refetchEvents();
        } else {
            alert("Fehler beim Löschen des Termins.");
        }
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
        alert("Fehler beim Löschen des Termins.");
    }
}

// Funktion zum Abrufen von Ereignissen aus Airtable
async function fetchEventsFromAirtable(info, successCallback, failureCallback) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=IS_AFTER({Datum}, '${info.startStr}')&sort[0][field]=Datum&sort[0][direction]=asc`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const data = await response.json();

        const events = data.records.map(record => ({
            id: record.id,
            title: `${record.fields.Vorname || ''} ${record.fields.Name || ''}`,
            start: record.fields.Datum + 'T' + record.fields.Uhrzeit,
            extendedProps: {
                vorname: record.fields.Vorname,
                nachname: record.fields.Name,
                telefonnummer: record.fields.Telefonnummer,
                datum: record.fields.Datum,
                uhrzeit: record.fields.Uhrzeit,
                anmerkung: record.fields.Anmerkung,
            },
        }));
        
        successCallback(events);
    } catch (error) {
        console.error("Fehler beim Abrufen der Ereignisse:", error);
        failureCallback(error);
    }
}

// FullCalendar Einstellungen
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        dateClick: function (info) {
            openEventModal({ datum: info.dateStr });
        },
        eventClick: function (info) {
            const eventData = {
                id: info.event.id,
                vorname: info.event.extendedProps.vorname,
                nachname: info.event.extendedProps.nachname,
                telefonnummer: info.event.extendedProps.telefonnummer,
                datum: info.event.startStr,
                uhrzeit: info.event.extendedProps.uhrzeit,
                anmerkung: info.event.extendedProps.anmerkung,
            };
            openEventModal(eventData);
        },
        events: fetchEventsFromAirtable
    });

    calendar.render();
});
