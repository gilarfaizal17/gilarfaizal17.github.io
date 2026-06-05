document.addEventListener("DOMContentLoaded", function () {
    const menuButtons = document.querySelectorAll(".menu-btn");
    const contentLoader = document.getElementById("content-loader");

    // Fungsi utama mendeteksi dan mengambil data file HTML eksternal dari folder 'pages'
    async function loadPage(pageUrl) {
        try {
            // Efek transisi pudar saat memuat dokumen baru
            contentLoader.style.opacity = 0; 
            
            const response = await fetch(pageUrl);
            
            // Antisipasi jika dijalankan langsung tanpa server (CORS Policy Block)
            if (!response.ok && window.location.protocol === 'file:') {
                throw new Error("LokalFileRestriction");
            }
            
            if (!response.ok) {
                throw new Error("Gagal mengambil data halaman.");
            }
            
            const htmlContent = await response.text();
            
            // Masukkan potongan HTML isi file ke dalam index.html
            setTimeout(() => {
                contentLoader.innerHTML = htmlContent;
                contentLoader.style.opacity = 1;
            }, 150);

        } catch (error) {
            // Tampilan Penanganan Error yang Bersahabat dan Informatif
            let errorMessage = "Pastikan file HTML di dalam folder 'pages' sudah lengkap dan dinamai dengan benar.";
            
            if (error.message === "LokalFileRestriction" || window.location.protocol === 'file:') {
                errorMessage = "Keamanan Browser memblokir pembacaan file terpisah jika dibuka secara klik dua kali langsung. <br><br><span style='color: var(--primary-color); font-weight: 700;'>Solusi:</span> Jalankan menggunakan ekstensi <b>Web Server for Chrome</b> atau <b>Live Server VS Code</b> seperti panduan Langkah 4.";
            }

            contentLoader.innerHTML = `
                <div class="card text-center" style="margin-top: 30px; border-top: 5px solid #ef4444;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 3.5rem; color: #ef4444; margin-bottom: 15px;"></i>
                    <h3 style="color: #1e293b; font-size: 1.5rem; font-weight: 800;">Halaman Tidak Ditemukan / Terblokir</h3>
                    <p style="color: var(--text-muted); margin-top: 10px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">${errorMessage}</p>
                </div>
            `;
            contentLoader.style.opacity = 1;
        }
    }

    // Pasang fungsi klik ke setiap tombol menu di sebelah kiri
    menuButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Atur status warna aktif pada menu tombol
            menuButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Ambil alamat file html halaman tujuan
            const pageUrl = button.getAttribute("data-page");
            loadPage(pageUrl);
            
            // Otomatis kembali ke atas halaman setelah menu diklik
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Muat isi halaman Beranda secara otomatis saat pertama kali web diakses
    const defaultPage = document.querySelector(".menu-btn.active").getAttribute("data-page");
    loadPage(defaultPage);
});
