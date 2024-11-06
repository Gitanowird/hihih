const API_TOKEN = 'pat624Rd50AbOfi3d.a7ec2a0f490fcb5571758948f8be0a4d10ff0da84c524292fb1792ebdd935e4b';
const BASE_ID = 'appVPFRjPaZovvWAh';
const TABLE_NAME = 'Chanels Kunden Liste';

// Globale Variable für das ausgewählte Datum
let selectedDate = new Date();

// Popup für Benachrichtigungen ein- und ausblenden
function togglePopup() {
    const popup = document.getElementById("notificationPopup");
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}

// Funktion zum Laden der Benachrichtigungen
function loadNotifications() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=Status=''`;

    fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    .then(response => response.json())
    .then(data => {
        const notificationList = document.getElementById("notificationList");
        notificationList.innerHTML = "";  // Zurücksetzen der Liste

        if (data.records && data.records.length > 0) {
            data.records.forEach(record => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${record.fields.Vorname} ${record.fields.Name}</strong> - ${record.fields.Modell}`;
                notificationList.appendChild(listItem);
            });

            // Aktualisierung der Badge-Anzahl
            document.getElementById("notificationBadge").textContent = data.records.length;
        } else {
            notificationList.innerHTML = "<li>Keine neuen Anfragen</li>";
            document.getElementById("notificationBadge").textContent = "0";
        }
    })
    .catch(error => console.error("Fehler beim Laden der Benachrichtigungen:", error));
}

// Funktion zur Anzeige des aktuellen Datums und der heutigen Termine
function updateDateDisplay() {
    const datumDisplay = document.getElementById("datumDisplay");
    if (datumDisplay) {
        datumDisplay.innerText = selectedDate.toISOString().split("T")[0];
        loadTermine();  // Lädt die Termine für das aktuelle Datum
    } else {
        console.error("Das Datumselement 'datumDisplay' wurde nicht gefunden.");
    }
}

// Funktion zur Änderung des Datums
function changeDay(days) {
    selectedDate.setDate(selectedDate.getDate() + days);
    updateDateDisplay();
}

// Funktion zum Laden der heutigen Termine
function loadTermine() {
    const datum = selectedDate.toISOString().split("T")[0];
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=AND(IS_SAME({Datum}, '${datum}', 'day'), {Status} = 'Angenommen')`;

    fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    .then(response => response.json())
    .then(data => {
        const terminListe = document.getElementById("terminListe");
        terminListe.innerHTML = "";  // Zurücksetzen der Terminliste

        if (data.records && data.records.length > 0) {
            data.records.forEach(record => {
                const terminItem = document.createElement("li");
                terminItem.className = "termin-item";
                terminItem.innerHTML = `
                    <div><strong>${record.fields.Vorname} ${record.fields.Name}</strong></div>
                    <div>Dienstleistung: ${record.fields.Modell}</div>
                    <div>Uhrzeit: ${record.fields.Uhrzeit}</div>
                    <div>Anmerkung: ${record.fields.Anmerkung || 'Keine Anmerkung'}</div>
                `;
                terminListe.appendChild(terminItem);
            });
        } else {
            terminListe.innerHTML = "<li>Keine angenommenen Termine für heute.</li>";
        }
    })
    .catch(error => console.error("Fehler beim Laden der Termine:", error));
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();  // Lädt die Benachrichtigungen
    updateDateDisplay();  // Lädt das Datum und die heutigen Termine
});
// Funktion zum Ein- und Ausblenden des Benachrichtigungsfensters
function toggleNotificationPopup() {
    const popup = document.getElementById("notificationPopup");
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
}

// Funktion zum Laden der Benachrichtigungen
function loadNotifications() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=Status=''`;

    fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    .then(response => response.json())
    .then(data => {
        const notificationList = document.getElementById("notificationList");
        notificationList.innerHTML = "";  // Zurücksetzen der Liste

        if (data.records && data.records.length > 0) {
            data.records.forEach(record => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${record.fields.Vorname} ${record.fields.Name}</strong> - ${record.fields.Modell}`;
                notificationList.appendChild(listItem);
            });

            // Aktualisierung der Badge-Anzahl
            document.getElementById("notificationBadge").textContent = data.records.length;
        } else {
            notificationList.innerHTML = "<li>Keine neuen Anfragen</li>";
            document.getElementById("notificationBadge").textContent = "0";
        }
    })
    .catch(error => console.error("Fehler beim Laden der Benachrichtigungen:", error));
}

// Beim Laden der Seite initialisieren
document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();  // Benachrichtigungen laden
});
