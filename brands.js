// Show today's date in the quotation
document.getElementById("quoteDate").textContent = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
});

// When user types in these fields, update the quotation
document.getElementById("clientName").addEventListener("input", updateQuotation);
document.getElementById("projectDesc").addEventListener("input", updateQuotation);
document.getElementById("pricePerSqm").addEventListener("input", updateQuotation);

// Add listeners to all height and width inputs
let heightInputs = document.querySelectorAll(".height");
let widthInputs = document.querySelectorAll(".width");

heightInputs.forEach(function(input) {
  input.addEventListener("input", updateQuotation);
});
widthInputs.forEach(function(input) {
  input.addEventListener("input", updateQuotation);
});


// Show or hide price per sqm input
function togglePricePerSqm() {
  let priceGroup = document.getElementById("pricePerSqmGroup");
  if (priceGroup.style.display === "none") {
    priceGroup.style.display = "block";
  } else {
    priceGroup.style.display = "none";
  }
}


// Payment method selection
let selectedPaymentMethod = null;

function selectPaymentMethod(method) {
  // Remove highlight from all buttons
  let buttons = document.querySelectorAll(".payment-method");
  buttons.forEach(function(btn) {
    btn.classList.remove("active");
  });

  // Highlight the chosen button
  if (method === "airtel") {
    document.getElementById("paymentAirtel").classList.add("active");
    window.open("https://www.airtel.ug/", "_blank");
  }
  else if (method === "mtn") {
    document.getElementById("paymentMTN").classList.add("active");
    window.open("https://www.mtn.ug/", "_blank");
  }
  else if (method === "cash") {
    document.getElementById("paymentCash").classList.add("active");
  }

  selectedPaymentMethod = method;

  // Show payment status
  if (method) {
    updatePaymentStatus(true);
  }
}

function updatePaymentStatus(done) {
  let statusEl = document.getElementById("paymentStatusIndicator");
  let statusText = document.getElementById("statusText");

  if (done) {
    statusEl.className = "payment-status-completed";
    statusText.textContent = "✓ Completed";
  } else {
    statusEl.className = "payment-status-pending";
    statusText.textContent = "Pending";
  }
}

// Add new rows for items if needed
function setupDynamicRows() {
  let rows = document.querySelectorAll("#itemsBody tr");
  rows.forEach(function(row, index) {
    let h = row.querySelector(".height");
    let w = row.querySelector(".width");

    h.addEventListener("input", function() {
      checkAndAddRow(index);
      updateQuotation();
    });
    w.addEventListener("input", function() {
      checkAndAddRow(index);
      updateQuotation();
    });
  });
}

function checkAndAddRow(index) {
  let rows = document.querySelectorAll("#itemsBody tr");
  let lastIndex = rows.length - 1;

  if (index === lastIndex) {
    let lastRow = rows[lastIndex];
    let hVal = lastRow.querySelector(".height").value;
    let wVal = lastRow.querySelector(".width").value;

    if (hVal || wVal) {
      addNewTableRow();
    }
  }
}

function addNewTableRow() {
  let itemsBody = document.getElementById("itemsBody");
  let rows = itemsBody.querySelectorAll("tr");
  let lastRow = rows[rows.length - 1];
  let lastLetter = lastRow.querySelector("td strong").textContent;
  let nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);

  // Left table row
  let newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><strong>${nextLetter}</strong></td>
    <td><input type="number" class="height" placeholder="0"></td>
    <td><input type="number" class="width" placeholder="0"></td>
    <td class="area">0.00</td>
  `;
  itemsBody.appendChild(newRow);

  // Right table row
  let quoteTableBody = document.getElementById("quoteTableBody");
  let newQuoteRow = document.createElement("tr");
  newQuoteRow.innerHTML = `
    <td>${nextLetter}</td>
    <td class="size">0.00</td>
    <td class="rate">0</td>
    <td class="amount">0</td>
  `;
  let grandTotalRow = quoteTableBody.querySelector(".grand-total-row");
  quoteTableBody.insertBefore(newQuoteRow, grandTotalRow);

  // Add listeners to new inputs
  let h = newRow.querySelector(".height");
  let w = newRow.querySelector(".width");

  h.addEventListener("input", function() {
    checkAndAddRow(itemsBody.querySelectorAll("tr").length - 1);
    updateQuotation();
  });
  w.addEventListener("input", function() {
    checkAndAddRow(itemsBody.querySelectorAll("tr").length - 1);
    updateQuotation();
  });
}

// Update quotation details
function updateQuotation() {
  let client = document.getElementById("clientName").value || "___________";
  let project = document.getElementById("projectDesc").value || "___________";
  let rate = Number(document.getElementById("pricePerSqm").value) || 0;

  document.getElementById("displayClient").textContent = client;
  document.getElementById("displayProject").textContent = project;
  document.getElementById("displayRate").textContent = "UGX " + rate.toLocaleString();

  let total = 0;
  let rows = document.querySelectorAll("#itemsBody tr");

  rows.forEach(function(row, index) {
    let h = Number(row.querySelector(".height").value) || 0;
    let w = Number(row.querySelector(".width").value) || 0;
    let area = ((h * w) / 10000).toFixed(2);

    row.querySelector(".area").textContent = area;

    let rightRow = document.querySelectorAll("#quoteTableBody tr")[index];
    if (rightRow) {
      rightRow.querySelector(".size").textContent = area;
      rightRow.querySelector(".rate").textContent = rate.toLocaleString();
      rightRow.querySelector(".amount").textContent = Math.round(area * rate).toLocaleString();
    }

    total += area * rate;
  });

  document.getElementById("grandTotal").textContent = Math.round(total).toLocaleString();
}

// Button to generate quotation
function generateQuotation() {
  updateQuotation();
  let quote = document.querySelector(".quotation-section");
  if (quote) {
    quote.scrollIntoView({ behavior: "smooth" });
  }
}

// Run setup when page loads
document.addEventListener("DOMContentLoaded", setupDynamicRows);

