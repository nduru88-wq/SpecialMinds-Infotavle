const API_URL =
  "https://script.google.com/macros/s/AKfycbwL7jMUKgp9nFqIzqlIg_oa8HxOWIT4Qc_Jni1DqZMVD8q__sTlpscK2av9e9QPdmwe/exec";

function $(id) {
  return document.getElementById(id);
}

function visStatus(tekst, erFejl) {
  const status = $("status");

  status.textContent = tekst;
  status.className = erFejl ? "fejl" : "ok";
}

function nulstilKnap() {
  const knap = $("gemKnap");

  knap.disabled = false;
  knap.textContent = "Gem fødselsdag";
}

function gemFoedselsdag() {
  const navn = $("navn").value.trim();
  const kortDato = $("kortDato").value.trim();
  const manuelDato = $("manuelDato").value;

  const knap = $("gemKnap");

  visStatus("", false);

  if (!navn) {
    visStatus("Du skal skrive et fornavn.", true);
    return;
  }

  if (!kortDato && !manuelDato) {
    visStatus(
      "Du skal enten skrive dato som tal eller vælge dato manuelt.",
      true
    );
    return;
  }

  knap.disabled = true;
  knap.textContent = "Gemmer...";

  const params = new URLSearchParams({
    action: "gemFoedselsdag",
    navn: navn,
    kortDato: kortDato,
    manuelDato: manuelDato
  });

  fetch(API_URL + "?" + params.toString())
    .then(response => response.json())
    .then(resultat => {

      if (resultat && resultat.ok === false) {
        throw new Error(resultat.message || "Ukendt fejl");
      }

      visStatus(
        resultat || "Fødselsdagen er gemt.",
        false
      );

      $("navn").value = "";
      $("kortDato").value = "";
      $("manuelDato").value = "";

      nulstilKnap();
    })
    .catch(function(err) {
      visStatus(
        err.message || "Der skete en fejl.",
        true
      );

      nulstilKnap();
    });
}
