// ✅ QUOTE PAGE LOGIC (MOT + Services)
document.querySelectorAll("input[name='service']").forEach(cb => {
    cb.addEventListener("change", () => {
      const motSelected = document.querySelector("input[value='MOT']").checked;
      document.getElementById("motFields").style.display = motSelected ? "block" : "none";
    });
  });
  
  function calculateQuote() {
    const vehicle = document.getElementById("vehicleType").value;
    const selectedServices = Array.from(document.querySelectorAll("input[name='service']:checked")).map(cb => cb.value);
    const motSelected = selectedServices.includes("MOT");
    const motExpiry = document.getElementById("motExpiry")?.value;
    const serviceDateStr = document.getElementById("serviceDate")?.value;
  
    if (!vehicle || selectedServices.length === 0) {
      document.getElementById("quoteResult").innerText = "Please select a vehicle and at least one service.";
      return;
    }
  
    const pricing = {
      SUV: { "Health Check": 100, "General Service": 200, "Minor Repair": 450, "Major Repair": 1200 },
      Minibus: { "Health Check": 150, "General Service": 350, "Minor Repair": 550, "Major Repair": 1500 },
      Convertible: { "Health Check": 50, "General Service": 150, "Minor Repair": 100, "Major Repair": 800 },
      Other: { "Health Check": 70, "General Service": 150, "Minor Repair": 200, "Major Repair": 1000 }
    };
  
    let total = 0;
    selectedServices.forEach(service => {
      if (service !== "MOT") total += pricing[vehicle][service] || 0;
    });
  
    if (motSelected) {
      if (!motExpiry || !serviceDateStr) {
        document.getElementById("quoteResult").innerText = "Please enter MOT expiry and service date.";
        return;
      }
  
      const expiryDate = new Date(motExpiry);
      const serviceDate = new Date(serviceDateStr);
      const dayDiff = Math.floor((expiryDate - serviceDate) / (1000 * 60 * 60 * 24));
      const isSaturday = serviceDate.getDay() === 6;
  
      if (dayDiff >= 0 && dayDiff <= 7) {
        total += 40;
      } else if (serviceDate > expiryDate) {
        total += 40 * 1.3;
      } else {
        document.getElementById("quoteResult").innerText = "MOT can only be booked within 7 days before expiry or after it.";
        return;
      }
  
      if (isSaturday) {
        total += 50;
        total *= 1.5;
      }
    } else {
      if (serviceDateStr) {
        const serviceDate = new Date(serviceDateStr);
        if (serviceDate.getDay() === 6) {
          total += 50;
          total *= 1.5;
        }
      }
    }
  
    document.getElementById("quoteResult").innerText = `Estimated Cost: £${total.toFixed(2)} (VAT Exclusive)`;
  }
  
  
  // ✅ CONTACT FORM
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const contact = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
      receivedAt: new Date().toLocaleString()
    };
    const contacts = JSON.parse(localStorage.getItem("garageContacts") || "[]");
    contacts.push(contact);
    localStorage.setItem("garageContacts", JSON.stringify(contacts));
    document.getElementById("contactResult").innerText = "✅ Message submitted successfully!";
    contactForm.reset();
  });
}

// ✅ BOOKING FORM
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const booking = {
      name: document.getElementById("nameBooking").value,
      email: document.getElementById("emailBooking").value,
      phone: document.getElementById("phoneBooking").value,
      vehicle: document.getElementById("vehicleBooking").value,
      service: document.getElementById("serviceBooking").value,
      date: document.getElementById("bookingDate").value,
      time: document.getElementById("bookingTime").value,
      submittedAt: new Date().toLocaleString()
    };
    const bookings = JSON.parse(localStorage.getItem("garageBookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("garageBookings", JSON.stringify(bookings));

    const note = new Date(booking.date).getDay() === 6
      ? " (Saturday: Includes 50% surcharge + £50 fee)" : "";

    document.getElementById("bookingResult").innerHTML = `
      ✅ Booking Confirmed<br>
      Name: ${booking.name}<br>
      Vehicle: ${booking.vehicle}<br>
      Service: ${booking.service}<br>
      Date: ${new Date(booking.date).toDateString()}<br>
      Time: ${booking.time}<br>
      <em>${note}</em>
    `;
    bookingForm.reset();
  });
}

// ✅ LOGIN & DASHBOARD
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    const isAdmin = user === "admin" && pass === "admin123";
    const isMechanic = user === "mechanic" && pass === "mech123";

    if (isAdmin || isMechanic) {
      document.querySelector(".split-section").style.display = "none";
      document.getElementById("dashboardSection").style.display = "block";
      document.getElementById("dashboardTitle").textContent = isAdmin
        ? "Admin Dashboard"
        : "Mechanic Dashboard";

      const bookings = JSON.parse(localStorage.getItem("garageBookings") || "[]");
      const contacts = JSON.parse(localStorage.getItem("garageContacts") || "[]");

      const bookingCards = bookings.map(b => `
        <div class="card">
          <h4>${b.name} (${b.service})</h4>
          <p>${b.vehicle} | ${b.email} | ${b.phone}</p>
          <p>${new Date(b.date).toDateString()} at ${b.time}</p>
          <p><small>${b.submittedAt}</small></p>
        </div>
      `).join("") || "<p>No bookings available.</p>";

      const contactCards = contacts.map(c => `
        <div class="card">
          <h4>${c.name}</h4>
          <p><strong>${c.subject}</strong></p>
          <p>${c.message}</p>
          <small>${c.email} - ${c.receivedAt}</small>
        </div>
      `).join("") || "<p>No messages yet.</p>";

      const mechanicNote = `
        <div class="card">
          <h4>Availability</h4>
          <p>Mon–Fri: ✅ Available<br>Saturday: ⏰ 10AM–2PM</p>
        </div>
      `;

      document.getElementById("dashboardContent").innerHTML = `
        <h3>📋 Bookings</h3>
        <div class="card-grid">${bookingCards}</div>
        <h3 style="margin-top:2rem;">💬 Contact Messages</h3>
        <div class="card-grid">${contactCards}</div>
        ${isMechanic ? mechanicNote : ""}
      `;
    } else {
      alert("❌ Invalid credentials.\nUse:\nAdmin → admin/admin123\nMechanic → mechanic/mech123");
    }
  });
}

function logout() {
  document.getElementById("dashboardSection").style.display = "none";
  document.querySelector(".split-section").style.display = "flex";
  document.getElementById("loginForm").reset();
}
