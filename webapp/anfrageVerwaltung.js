const API_TOKEN = 'pat624Rd50AbOfi3d.a7ec2a0f490fcb5571758948f8be0a4d10ff0da84c524292fb1792ebdd935e4b';
const BASE_ID = 'appVPFRjPaZovvWAh';
const TABLE_NAME = 'Chanels Kunden Liste';

function loadAnfragen() {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=NOT({Status} = 'Angenommen')`;

    fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    .then(response => response.json())
    .then(data => {
        const anfragenContainer = document.getElementById("anfragenContainer");
        anfragenContainer.innerHTML = "";

        if (data.records && data.records.length > 0) {
            data.records.forEach(record => {
                const anfrageDiv = document.createElement("div");
                anfrageDiv.className = "anfrage-item";
                anfrageDiv.innerHTML = `
                    <p><strong>Vorname:</strong> ${record.fields.Vorname || "N/A"}</p>
                    <p><strong>Name:</strong> ${record.fields.Name || "N/A"}</p>
                    <p><strong>Telefon:</strong> ${record.fields.Telefonnummer || "N/A"}</p>
                    <p><strong>Modell:</strong> ${record.fields.Modell || "N/A"}</p>
                    
                    <label for="datum_${record.id}">Datum:</label>
                    <input type="date" id="datum_${record.id}" name="datum">

                    <label for="uhrzeit_${record.id}">Uhrzeit:</label>
                    <input type="time" id="uhrzeit_${record.id}" name="uhrzeit">

                    <div class="action-buttons">
                        <button class="accept" onclick="acceptAnfrage('${record.id}', 'datum_${record.id}', 'uhrzeit_${record.id}')">Annehmen</button>
                        <button class="delete" onclick="deleteAnfrage('${record.id}')">Ablehnen</button>
                    </div>
                `;
                anfragenContainer.appendChild(anfrageDiv);
            });
        } else {
            anfragenContainer.innerHTML = "<p>Keine offenen Anfragen.</p>";
        }
    })
    .catch(error => console.error("Fehler beim Laden der Anfragen:", error));
}


function acceptAnfrage(recordId, datumInputId, uhrzeitInputId) {
    const datum = document.getElementById(datumInputId).value;
    const uhrzeit = document.getElementById(uhrzeitInputId).value;

    if (!datum || !uhrzeit) {
        alert("Bitte Datum und Uhrzeit eingeben.");
        return;
    }

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`;
    const data = { fields: { "Datum": datum, "Uhrzeit": uhrzeit, "Status": "Angenommen" } };

    fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        alert("Anfrage erfolgreich angenommen.");
        document.getElementById(datumInputId).closest(".anfrage-item").remove(); // Entfernt die Anfrage aus der Anzeige
    })
    .catch(error => console.error("Fehler beim Annehmen der Anfrage:", error));
}

function deleteAnfrage(recordId) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`;

    fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    .then(response => {
        if (response.ok) {
            alert("Anfrage erfolgreich gelöscht.");
            loadAnfragen(); // Aktualisiert die Liste der Anfragen
        }
    })
    .catch(error => console.error("Fehler beim Löschen der Anfrage:", error));
}

// Beim Laden der Seite Anfragen laden
document.addEventListener("DOMContentLoaded", loadAnfragen);
