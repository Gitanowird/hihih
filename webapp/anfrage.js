document.getElementById("anfrageForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const vorname = document.getElementById("vorname").value;
    const nachname = document.getElementById("nachname").value;
    const modell = document.getElementById("modell").value;
    const telefonnummer = document.getElementById("telefonnummer").value;
    const anmerkung = document.getElementById("anmerkung").value;

    const API_TOKEN = 'pat624Rd50AbOfi3d.a7ec2a0f490fcb5571758948f8be0a4d10ff0da84c524292fb1792ebdd935e4b';
    const BASE_ID = 'appVPFRjPaZovvWAh';
    const airtableTableName = "Chanels Kunden Liste";

    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(airtableTableName)}`;
    
    const data = {
        fields: {
            "Vorname": vorname,
            "Name": nachname,
            "Modell": modell,
            "Telefonnummer": telefonnummer,
            "Anmerkung": anmerkung
        }
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert("Anfrage erfolgreich gesendet!");
            document.getElementById("anfrageForm").reset();
        } else {
            alert("Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.");
        }
    })
    .catch(error => {
        console.error("Fehler:", error);
        alert("Fehler beim Senden der Anfrage.");
    });
});
