/* eslint-disable no-undef, no-unused-vars */
// AUTHENTICATION CHECK
const currentPage = window.location.pathname.split("/").pop();
const isLoginPage = currentPage === "index.html" || currentPage === "" || currentPage === "index";

if (!isLoginPage) {
  // Jika bukan di halaman login dan belum login, lempar ke index.html
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    alert("Akses Ditolak! Anda harus login terlebih dahulu.");
    window.location.replace("index.html");
  }
} else {
  // Jika di halaman login tapi sudah login, lempar ke dashboard
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.replace("dashboard.html");
  }
}

// LOGOUT HANDLER
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.trim().toLowerCase() === 'logout') {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('isLoggedIn');
        showToast("Anda telah keluar.", "success");
        setTimeout(() => {
          window.location.replace("index.html");
        }, 800);
      });
    }
  });
});

// CUSTOM TOAST FUNCTION (Classic)
function showToast(message, type = 'error') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const svgSuccess = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  const svgError = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <span style="display: flex; align-items: center;">${type === 'success' ? svgSuccess : svgError}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// FORM UTILS
function addShakeEffect(element) {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 400);
}

// LOGIN VALIDATION
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const btn = form.querySelector('.btn');
    
    // Simple validation
    if(!emailInput.value || !passwordInput.value) {
      showToast("Harap isi semua bidang.", "error");
      addShakeEffect(form);
      return;
    }

    const originalText = btn.innerText;
    btn.innerText = "Memverifikasi...";
    btn.disabled = true;

    setTimeout(() => {
      let isAuthenticated = false;
      let loggedInUser = null;
      if (typeof dataPengguna !== 'undefined') {
        for (let i = 0; i < dataPengguna.length; i++) {
          if (dataPengguna[i].email === emailInput.value && dataPengguna[i].password === passwordInput.value) {
            isAuthenticated = true;
            loggedInUser = dataPengguna[i].nama;
            break;
          }
        }
      } else {
        // Fallback for testing if data.js is not loaded
        if (emailInput.value === "admin@ut.ac.id" && passwordInput.value === "12345") {
          isAuthenticated = true;
          loggedInUser = "Administrator";
        }
      }

      if (isAuthenticated) {
        showToast("Otentikasi Berhasil. Mengalihkan...", "success");
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userName", loggedInUser);
        setTimeout(() => {
          window.location.replace("dashboard.html");
        }, 1500);
      } else {
        // MENGGUNAKAN ALERT DAN TEKS SESUAI INSTRUKSI
        alert("email/password yang anda masukkan salah");
        addShakeEffect(form);
        btn.innerText = originalText;
        btn.disabled = false;
      }
    }, 800);
  });
}

// MODAL FUNCTION
const forgotBtn = document.getElementById("forgotBtn");
const registerBtn = document.getElementById("registerBtn");
const modals = document.querySelectorAll(".modal");
const closes = document.querySelectorAll(".close");

if (forgotBtn)
  forgotBtn.addEventListener("click", (e) => { e.preventDefault(); openModal("forgotModal"); });
if (registerBtn)
  registerBtn.addEventListener("click", (e) => { e.preventDefault(); openModal("registerModal"); });

closes.forEach((el) =>
  el.addEventListener("click", () => {
    closeAllModals();
  }),
);

window.addEventListener("click", (e) => {
  modals.forEach((m) => {
    if (e.target === m) {
      closeAllModals();
    }
  });
});

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = "flex";
  setTimeout(() => { modal.classList.add("show"); }, 10);
}

function closeAllModals() {
  modals.forEach((m) => {
    m.classList.remove("show");
    setTimeout(() => { m.style.display = "none"; }, 300);
  });
}

// GREETING ON DASHBOARD
const greeting = document.getElementById("greeting");
if (greeting) {
  const hour = new Date().getHours();
  let greetText = "";
  const userName = sessionStorage.getItem("userName") || "Administrator";
  if (hour < 12) greetText = `Selamat Pagi, ${userName}.`;
  else if (hour < 15) greetText = `Selamat Siang, ${userName}.`;
  else if (hour < 18) greetText = `Selamat Sore, ${userName}.`;
  else greetText = `Selamat Malam, ${userName}.`;
  
  greeting.innerHTML = `<span style="font-size: 1.2em; color: var(--secondary); font-style: italic; font-weight: 600;">${greetText}</span> <br> Selamat datang kembali di panel kontrol SITTA.`;
}

// REALTIME CLOCK
const clockElement = document.getElementById("realtimeClock");
if (clockElement) {
  function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " WIB";
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// TRACKING SIMULATION
const searchDO = document.getElementById("searchDO");
if (searchDO) {
  searchDO.addEventListener("click", () => {
    const input = document.getElementById("doNumber").value.trim();
    const result = document.getElementById("trackingResult");
    if (input === "") {
      showToast("Mohon masukkan nomor DO/Billing terlebih dahulu.", "error");
      const inputEl = document.getElementById("doNumber");
      addShakeEffect(inputEl);
      return;
    }
    
    result.innerHTML = `<p style="font-style: italic; color: #777;">Mengambil catatan pengiriman...</p>`;
    
    setTimeout(() => {
      if (typeof dataTracking !== "undefined" && dataTracking[input]) {
        const data = dataTracking[input];
        let timelineHTML = '';
        data.perjalanan.forEach((step, index) => {
           const isActive = index === data.perjalanan.length - 1 ? 'active' : '';
           timelineHTML += `
            <li class="timeline-item ${isActive}">
              <div class="timeline-date">${step.waktu}</div>
              <div class="timeline-content">
                <p>${step.keterangan}</p>
              </div>
            </li>
           `;
        });

        result.innerHTML = `
          <h3 style="margin-top: 30px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
            Status: <span style="color: var(--primary);">${data.status}</span>
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 14px;">
            <div><strong>Penerima:</strong> ${data.nama}</div>
            <div><strong>Nomor DO:</strong> ${data.nomorDO}</div>
            <div><strong>Ekspedisi:</strong> ${data.ekspedisi}</div>
            <div><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</div>
            <div><strong>Jenis Paket:</strong> ${data.paket}</div>
            <div><strong>Total Pembayaran:</strong> ${data.total}</div>
          </div>
          
          <ul class="timeline">
            ${timelineHTML}
          </ul>
        `;
      } else {
        result.innerHTML = `<p style="color: var(--danger); font-weight: bold;">Nomor DO/Billing tidak ditemukan dalam sistem.</p>`;
      }
    }, 1000);
  });
}

// TAMPILKAN DATA STOK (GRID LAYOUT)
const stokGrid = document.getElementById("stokGrid");
const searchInput = document.getElementById("searchInput");

if (stokGrid && typeof dataBahanAjar !== "undefined") {
  
  function renderGrid(filterText = "") {
    stokGrid.innerHTML = "";
    
    const filteredData = dataBahanAjar.filter(item => {
      const text = `${item.namaBarang} ${item.kodeBarang} ${item.kodeLokasi}`.toLowerCase();
      return text.includes(filterText.toLowerCase());
    });

    if (filteredData.length === 0) {
      stokGrid.innerHTML = `<p style="text-align: center; font-style: italic; color: #94a3b8; grid-column: 1 / -1;">Tidak ada bahan ajar yang sesuai dengan pencarian.</p>`;
      return;
    }
    
    filteredData.forEach((item, index) => {
      const originalIndex = dataBahanAjar.indexOf(item);
      const card = document.createElement("div");
      const coverUrl = item.cover ? item.cover : 'assets/placeholder.jpg';
      
      // We will generate a mock price for the UI based on edisi/stok
      const mockPrice = 100000 + (item.edisi * 15000) + (item.kodeBarang.length * 1000);
      const formattedPrice = "Rp " + mockPrice.toLocaleString('id-ID');

      card.style.background = "var(--surface)";
      card.style.borderRadius = "16px";
      card.style.overflow = "hidden";
      card.style.border = "1px solid var(--border)";
      card.style.boxShadow = "var(--shadow-sm)";
      card.style.display = "flex";
      card.style.flexDirection = "column";

      card.innerHTML = `
        <div style="position: relative; height: 260px; overflow: hidden; background: linear-gradient(135deg, #1e3a8a, #0f172a); display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; color: rgba(255,255,255,0.2); font-weight: bold; font-size: 1.5em; text-align: center; padding: 10px;">${item.namaBarang}</span>
          <img src="${coverUrl}" alt="" style="width: 100%; height: 100%; object-fit: contain; position: relative; z-index: 1;" onerror="this.style.display='none'">
        </div>
        <div style="padding: 15px; flex-grow: 1; display: flex; flex-direction: column;">
          <h3 style="margin: 0 0 10px; font-size: 1.2em; color: var(--text-main);">${item.namaBarang}</h3>
          <p style="margin: 0 0 5px; color: var(--text-muted); font-size: 0.9em;">Kode: ${item.kodeBarang}</p>
          <p style="margin: 0 0 5px; color: var(--text-muted); font-size: 0.9em;">Stok: <strong>${item.stok}</strong></p>
          <p style="margin: 0 0 15px; color: var(--text-muted); font-size: 0.9em;">Edisi: ${item.edisi}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; margin-bottom: 15px;">
            <span style="color: var(--secondary); font-weight: bold; font-size: 1.2em;">${formattedPrice}</span>
            <span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold;">${item.jenisBarang}</span>
          </div>

          <div style="display: flex; gap: 10px;">
            <input type="number" id="qty-${originalIndex}" value="1" min="1" max="${item.stok}" style="width: 60px; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.5); border: 1px solid var(--border); color: white; text-align: center;">
            <button class="btn add-cart-btn" data-index="${originalIndex}" style="flex-grow: 1; padding: 8px; font-size: 0.9em; border-radius: 8px;">Tambah</button>
            <button class="btn delete-btn" data-index="${originalIndex}" style="background: transparent; border: 1px solid var(--danger); color: var(--danger); padding: 8px; border-radius: 8px;" title="Hapus Buku">&#10006;</button>
          </div>
        </div>
      `;
      stokGrid.appendChild(card);
    });

    // Attach delete event listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const idx = this.getAttribute("data-index");
        if(confirm(`Apakah Anda yakin ingin menghapus catatan '${dataBahanAjar[idx].namaBarang}'?`)) {
          dataBahanAjar.splice(idx, 1);
          renderGrid(searchInput ? searchInput.value : "");
          showToast("Catatan stok telah dihapus.", "success");
        }
      });
    });

    // Attach Add to Cart event listeners
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const idx = this.getAttribute("data-index");
        const qty = parseInt(document.getElementById(`qty-${idx}`).value);
        addToCart(dataBahanAjar[idx], qty);
      });
    });
  }

  // --- KERANJANG (CART) LOGIC ---
  let cart = [];
  
  // Setup Floating Cart UI
  const floatingCart = document.createElement("div");
  floatingCart.id = "floatingCart";
  floatingCart.style.cssText = "position: fixed; bottom: 30px; right: 30px; background: var(--primary); color: white; padding: 15px 25px; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; z-index: 1000; font-weight: bold; transition: 0.3s;";
  floatingCart.innerHTML = `🛒 Keranjang (<span id="cartCount">0</span>)`;
  document.body.appendChild(floatingCart);

  // Setup Cart Modal
  const cartModal = document.createElement("div");
  cartModal.id = "cartModal";
  cartModal.className = "modal";
  cartModal.innerHTML = `
    <div class="modal-content" style="max-width: 700px; background: #121212; border: 1px solid #333; border-radius: 12px; color: #fff; padding: 30px;">
      <span class="close" id="closeCart" style="color: #fff;">&times;</span>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
        <h2 style="margin: 0; font-size: 1.5em; color: #fff;">Keranjang</h2>
        <span style="color: #999; font-size: 0.9em;">Atur jumlah, hapus item, lalu checkout.</span>
      </div>
      <div id="cartItems" style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
        <p style="text-align: center; color: var(--text-muted);">Keranjang kosong.</p>
      </div>
      <div style="margin-top: 25px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; font-size: 1em; color: #ccc;">
          <span>Total Item</span>
          <span id="cartTotalItem" style="font-weight: bold; color: #fff;">0</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.1em; font-weight: bold; margin-bottom: 15px;">
          <span>Total Harga</span>
          <span id="cartTotal" style="color: #fff;">Rp 0</span>
        </div>
        <button class="btn" style="width: 100%; background: linear-gradient(90deg, #1d4ed8, #3b82f6); border: none; padding: 15px; border-radius: 8px; font-weight: bold; font-size: 1em; cursor: pointer; color: white;" onclick="checkout()">Checkout</button>
      </div>
    </div>
  `;
  document.body.appendChild(cartModal);

  floatingCart.addEventListener("click", () => {
    cartModal.style.display = "flex";
    setTimeout(() => { cartModal.classList.add("show"); }, 10);
    renderCart();
  });

  document.getElementById("closeCart").addEventListener("click", () => {
    cartModal.classList.remove("show");
    setTimeout(() => { cartModal.style.display = "none"; }, 300);
  });

  function addToCart(item, qty) {
    if (qty > item.stok) {
      showToast("Gagal! Jumlah melebihi stok yang ada.", "error");
      return;
    }
    
    // Check if item already in cart
    const existingIndex = cart.findIndex(c => c.kode === item.kodeBarang);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      const mockPrice = 100000 + (item.edisi * 15000) + (item.kodeBarang.length * 1000);
      cart.push({
        kode: item.kodeBarang,
        nama: item.namaBarang,
        harga: mockPrice,
        qty: qty
      });
    }
    document.getElementById("cartCount").innerText = cart.length;
    showToast(`Berhasil menambahkan ${qty}x ${item.namaBarang} ke keranjang`, "success");
    
    // Animate floating cart
    floatingCart.style.transform = "scale(1.1)";
    setTimeout(() => floatingCart.style.transform = "scale(1)", 200);
  }

  function renderCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `<p style="text-align: center; color: #777; margin: 40px 0;">Keranjang kosong.</p>`;
      document.getElementById("cartTotal").innerText = "Rp 0";
      document.getElementById("cartTotalItem").innerText = "0";
      return;
    }

    let html = '';
    let grandTotal = 0;
    let totalItems = 0;
    
    cart.forEach((c, index) => {
      const subtotal = c.harga * c.qty;
      grandTotal += subtotal;
      totalItems += c.qty;
      html += `
        <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="margin: 0 0 5px 0; color: #fff; font-size: 1.1em;">${c.nama}</h4>
            <p style="margin: 0 0 3px 0; color: #888; font-size: 0.85em;">Kode: ${c.kode}</p>
            <p style="margin: 0; color: #888; font-size: 0.85em;">Harga: Rp ${c.harga.toLocaleString('id-ID')}</p>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
            <div style="display: flex; gap: 10px;">
              <input type="number" min="1" value="${c.qty}" data-index="${index}" class="cart-qty-input" style="width: 60px; background: #222; border: 1px solid #444; color: #fff; padding: 5px 10px; border-radius: 6px; text-align: center;">
              <button class="cart-remove-btn" data-index="${index}" style="background: #451a03; color: #fff; border: 1px solid #78350f; padding: 5px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">Hapus</button>
            </div>
            <div style="font-weight: bold; color: #fff; font-size: 0.95em;">Subtotal: Rp ${subtotal.toLocaleString('id-ID')}</div>
          </div>
        </div>
      `;
    });
    cartItemsDiv.innerHTML = html;
    document.getElementById("cartTotal").innerText = "Rp " + grandTotal.toLocaleString('id-ID');
    document.getElementById("cartTotalItem").innerText = totalItems;

    // Attach listeners
    document.querySelectorAll(".cart-remove-btn").forEach(btn => {
      btn.addEventListener("click", function() {
        const idx = this.getAttribute("data-index");
        cart.splice(idx, 1);
        document.getElementById("cartCount").innerText = cart.length;
        renderCart();
      });
    });

    document.querySelectorAll(".cart-qty-input").forEach(input => {
      input.addEventListener("change", function() {
        const idx = this.getAttribute("data-index");
        let newQty = parseInt(this.value);
        if (newQty < 1) newQty = 1;
        cart[idx].qty = newQty;
        renderCart();
      });
    });
  }

  // Global checkout function
  window.checkout = function() {
    if(cart.length === 0) return;
    showToast("Checkout berhasil! Memproses pesanan...", "success");
    cart = [];
    document.getElementById("cartCount").innerText = "0";
    renderCart();
    setTimeout(() => { document.getElementById('closeCart').click(); }, 1500);
  };
  // --- END KERANJANG LOGIC ---

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderGrid(e.target.value);
    });
  }

  renderGrid();

  // Tambah stok baru
  const addForm = document.getElementById("addForm");
  if(addForm) {
    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const lokasiVal = document.getElementById("lokasi");
      const kodeVal = document.getElementById("kode");
      const namaVal = document.getElementById("nama");
      const jenisVal = document.getElementById("jenis");
      const edisiVal = document.getElementById("edisi");
      const stokVal = document.getElementById("stok");
      const coverVal = document.getElementById("cover");

      if (lokasiVal && kodeVal && namaVal && jenisVal && edisiVal && stokVal) {
        const newItem = {
          kodeLokasi: lokasiVal.value,
          kodeBarang: kodeVal.value,
          namaBarang: namaVal.value,
          jenisBarang: jenisVal.value,
          edisi: edisiVal.value,
          stok: parseInt(stokVal.value),
          cover: coverVal && coverVal.value ? coverVal.value : "img/placeholder.jpg"
        };
        dataBahanAjar.push(newItem);
        renderGrid(searchInput ? searchInput.value : "");
        e.target.reset();
        showToast("Catatan stok baru berhasil ditambahkan.", "success");
      }
    });
  }
}
