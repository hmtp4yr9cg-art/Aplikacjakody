(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const locationInput = $("location");
  const barcodeInput = $("barcode");
  const quantityInput = $("quantity");
  const entriesNode = $("entries");
  const emptyState = $("emptyState");
  const message = $("message");
  const scannerState = $("scannerState");
  const STORAGE_KEY = "kody-lokalizacje-v1";
  let entries = [];
  let scanner = null;
  let scannerRunning = false;
  let lastScanned = "";
  let lastScanAt = 0;

  try {
    entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(entries)) entries = [];
  } catch (_) { entries = []; }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (_) {
      say("Pamięć przeglądarki jest pełna. Wyeksportuj dane do TXT.", true);
    }
    render();
  }
  function say(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "#b42318" : "#166534";
  }
  function csvField(value) {
    const s = String(value ?? "");
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function render() {
    entriesNode.replaceChildren();
    emptyState.hidden = entries.length > 0;
    $("entryCount").textContent = `${entries.length} ${entries.length === 1 ? "pozycja" : (entries.length >= 2 && entries.length <= 4 ? "pozycje" : "pozycji")}`;
    $("deleteLast").disabled = entries.length === 0;
    $("clearAll").disabled = entries.length === 0;
    entries.slice().reverse().forEach((entry) => {
      const card = document.createElement("div");
      card.className = "entry";
      const loc = document.createElement("div");
      loc.className = "loc";
      loc.textContent = "Lokalizacja: " + entry.location;
      const qty = document.createElement("div");
      qty.className = "qty";
      qty.textContent = "Ilość: " + entry.quantity;
      const code = document.createElement("div");
      code.className = "code";
      code.textContent = entry.barcode;
      card.append(loc, qty, code);
      entriesNode.append(card);
    });
  }
  function addEntry() {
    const location = locationInput.value.trim();
    const barcode = barcodeInput.value.trim();
    const quantity = Number.parseInt(quantityInput.value, 10);
    if (!location) { say("Najpierw wpisz numer lokalizacji.", true); locationInput.focus(); return; }
    if (!barcode) { say("Zeskanuj lub wpisz kod kreskowy.", true); barcodeInput.focus(); return; }
    if (!Number.isSafeInteger(quantity) || quantity < 1) { say("Ilość musi być liczbą całkowitą większą od zera.", true); quantityInput.focus(); return; }
    entries.push({ location, barcode, quantity, addedAt: new Date().toISOString() });
    save();
    barcodeInput.value = "";
    quantityInput.value = "1";
    say(`Dodano: ${location}, ${barcode}, ${quantity}.`);
    barcodeInput.focus();
  }
  $("addEntry").addEventListener("click", addEntry);
  $("plusQty").addEventListener("click", () => { quantityInput.value = Math.max(1, (parseInt(quantityInput.value, 10) || 1) + 1); });
  $("minusQty").addEventListener("click", () => { quantityInput.value = Math.max(1, (parseInt(quantityInput.value, 10) || 1) - 1); });
  barcodeInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); quantityInput.focus(); } });
  quantityInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); addEntry(); } });

  $("deleteLast").addEventListener("click", () => {
    if (!entries.length) return;
    entries.pop(); save(); say("Usunięto ostatnią pozycję.");
  });
  $("clearAll").addEventListener("click", () => {
    if (!entries.length) return;
    if (confirm("Czy na pewno usunąć wszystkie zapisane pozycje? Tej operacji nie można cofnąć.")) {
      entries = []; save(); say("Lista została wyczyszczona.");
    }
  });
  $("exportTxt").addEventListener("click", () => {
    if (!entries.length) { say("Nie ma pozycji do eksportu.", true); return; }
    const lines = [["Lokalizacja", "kod kreskowy", "ilość"].map(csvField).join(",")];
    entries.forEach((e) => lines.push([e.location, e.barcode, e.quantity].map(csvField).join(",")));
    const blob = new Blob(["\uFEFF" + lines.join("\r\n") + "\r\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inwentaryzacja.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    say("Przygotowano plik inwentaryzacja.txt.");
  });

  async function startScanner() {
    if (scannerRunning) return;
    if (!window.isSecureContext) {
      say("Aparat działa tylko przez HTTPS lub na localhost. Opublikuj aplikację pod adresem HTTPS.", true);
      return;
    }
    if (!window.Html5Qrcode) {
      say("Nie udało się załadować modułu skanera. Sprawdź internet i odśwież stronę.", true);
      return;
    }
    try {
      scanner = scanner || new Html5Qrcode("reader", { verbose: false });
      const config = { fps: 10, qrbox: (w, h) => {
        const width = Math.min(Math.floor(w * 0.88), 420);
        const height = Math.min(Math.floor(h * 0.42), 160);
        return { width, height };
      }, aspectRatio: 1.5, rememberLastUsedCamera: true };
      await scanner.start({ facingMode: "environment" }, config, (decodedText) => {
        const now = Date.now();
        if (decodedText === lastScanned && now - lastScanAt < 1800) return;
        lastScanned = decodedText; lastScanAt = now;
        barcodeInput.value = decodedText;
        say("Odczytano kod. Sprawdź ilość i wybierz „Dodaj pozycję”.");
        if (navigator.vibrate) navigator.vibrate(70);
      }, () => {});
      scannerRunning = true;
      scannerState.textContent = "Kamera aktywna";
      $("startScan").disabled = true;
      $("stopScan").disabled = false;
      say("Aparat działa. Ustaw kod w ramce.");
    } catch (err) {
      say("Nie udało się uruchomić aparatu. Zezwól Safari na dostęp do kamery i spróbuj ponownie.", true);
    }
  }
  async function stopScanner() {
    if (!scanner || !scannerRunning) return;
    try { await scanner.stop(); } catch (_) {}
    scannerRunning = false;
    scannerState.textContent = "Kamera wyłączona";
    $("startScan").disabled = false;
    $("stopScan").disabled = true;
  }
  $("startScan").addEventListener("click", startScanner);
  $("stopScan").addEventListener("click", stopScanner);

  if ("serviceWorker" in navigator && window.isSecureContext) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
  render();
})();
