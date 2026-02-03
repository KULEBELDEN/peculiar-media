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

//HERE 

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
