(function () {
  const data = window.DATA;
  let cart = [];
  const rp = (a) => "Rp" + a.toLocaleString("id-ID");

  const grid = document.getElementById("product-grid");
  
  // Render produk
  data.produk.forEach(p => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div style="height:150px; background:#ddd;"></div>
      <div class="card-body">
        <div class="card-cat">${p.kategori}</div>
        <h3>${p.nama}</h3>
        <div class="price-row">Harga: <span>${rp(p.harga)}</span></div>
        <button class="btn-add" onclick="tambah(${p.id})">+ Keranjang</button>
      </div>
    `;
    grid.appendChild(el);
  });

  window.tambah = (id) => {
    const prod = data.produk.find(p => p.id === id);
    const item = cart.find(c => c.id === id);
    if (item) item.qty++;
    else cart.push({ ...prod, qty: 1 });
    updateUI();
  };

  window.ubah = (id, aksi) => {
    const idx = cart.findIndex(c => c.id === id);
    if (aksi === 'tambah') cart[idx].qty++;
    if (aksi === 'kurang') cart[idx].qty--;
    if (cart[idx].qty === 0) cart.splice(idx, 1);
    updateUI();
  };

  function updateUI() {
    const btn = document.getElementById("cart-btn");
    const container = document.getElementById("cart-items-container");
    let total = 0, harga = 0;

    container.innerHTML = "";
    
    if (cart.length === 0) {
      btn.classList.remove("show");
      container.innerHTML = "<p>Kosong.</p>";
    } else {
      btn.classList.add("show");
      cart.forEach(c => {
        total += c.qty;
        harga += (c.harga * c.qty);
        container.innerHTML += `
          <div class="cart-item">
            <div><b>${c.nama}</b><br>${rp(c.harga)}</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="ubah(${c.id}, 'kurang')">-</button>
              <span>${c.qty}</span>
              <button class="qty-btn" onclick="ubah(${c.id}, 'tambah')">+</button>
            </div>
          </div>
        `;
      });
    }
    document.getElementById("cart-text").textContent = total + " item";
    document.getElementById("cart-price").textContent = rp(harga);
    document.getElementById("modal-total-price").textContent = rp(harga);
  }

  window.tutupModal = (id) => document.getElementById(id).classList.remove("show");
  document.getElementById("cart-btn").onclick = () => { if(cart.length) document.getElementById("cart-modal").classList.add("show"); };
  window.bukaCheckout = () => { tutupModal("cart-modal"); document.getElementById("checkout-modal").classList.add("show"); };

  window.kirimKeWA = () => {
    const nama = document.getElementById("cust-name").value;
    const hp = document.getElementById("cust-phone").value;
    const alamat = document.getElementById("cust-address").value;
    const eks = document.getElementById("cust-courier").value;
    const bayar = document.getElementById("cust-payment").value;

    if (!nama || !alamat) return alert("Isi Nama dan Alamat dulu!");

    let pesan = `Halo Admin, saya mau order:\n\n`;
    let totalHarga = 0;
    cart.forEach((c, i) => {
      pesan += `${i+1}. ${c.nama} - ${c.qty} pcs = ${rp(c.harga * c.qty)}\n`;
      totalHarga += c.harga * c.qty;
    });
    pesan += `\nTotal Produk: ${rp(totalHarga)}`;
    pesan += `\n\nDATA PENGIRIMAN:\nNama: ${nama}\nHP: ${hp}\nAlamat: ${alamat}\nEkspedisi: ${eks}\nPembayaran: ${bayar}`;

    window.open(`https://wa.me/${data.whatsapp}?text=${encodeURIComponent(pesan)}`, "_blank");
  };
})();
