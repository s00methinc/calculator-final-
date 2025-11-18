
        //  Kodingan ini dijalanin pas semua elemen di halaman udah siap 
        document.addEventListener('DOMContentLoaded', function() {
            
            //  Mengambil elemen-elemen utama dari HTML, yaitu layar kalkulator, gambar status, dan semua tombol 
            const display = document.getElementById('display');
            const statusImage = document.getElementById('statusImage');
            const buttons = document.querySelectorAll('.btn-calc');

            //  Bagian ini nyimpen link gambar buat status kalkulator (normal, sukses, sama error) 
            const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
            const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
            const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

            /**
              Fungsi ini buat ganti gambar di atas kalkulator sesuai kondisi. Misalnya kalau hasilnya sukses, error, atau balik lagi ke normal
             */
            function changeImage(state) {
                if (state === 'success') {
                    statusImage.src = imgSuccess;
                    statusImage.alt = "Perhitungan Sukses";
                } else if (state === 'error') {
                    statusImage.src = imgError;
                    statusImage.alt = "Error Perhitungan";
                } else {
                    //  Bagian ini buat balikin gambar ke tampilan normal  
                    statusImage.src = imgNormal;
                    statusImage.alt = "Status Kalkulator";
                }
            }

            /**
              Fungsi ini buat nge-reset layar kalkulator, jadi semua angka yang udah diketik bakal dihapus dan gambarnya balik ke normal. 
             */
            function clearDisplay() {
                display.value = '';
                changeImage('normal'); // Memanggil function untuk merubah gambar
            }

            /**
              Fungsi ini buat hapus satu karakter terakhir di layar, mirip kayak tombol backspace 
             */
            function deleteLastChar() {
                display.value = display.value.slice(0, -1);
            }

            /**
              Fungsi ini buat nambahin angka atau simbol ke layar kalkulator sesuai tombol yang diklik.
             */
            function appendToDisplay(value) {
                display.value += value;
            }

            /**
              Fungsi ini buat ngitung hasil dari angka atau operasi yang diketik di layar kalkulator. 
             */
            function calculateResult() {
                //  Kalau layar masih kosong, tampilkan pesan "Kosong!" dan ubah gambar jadi error 
                if (display.value === '') {
                    changeImage('error');
                    display.value = 'Kosong!';
                    // Setelah 1,5 detik, layar bakal otomatis dikosongin lagi
                    setTimeout(clearDisplay, 1500);
                    return;
                }

                try {
                   //  Bagian ini buat ngitung hasil inputan di layar
                    let result = eval(display.value
                        .replace(/%/g, '/100') //  Tanda "%" diganti jadi "/100" biar bisa dibaca sama fungsi eval()
                    ); 
                    
                    // Mengecek apakah hasil perhitungannya valid (bukan tak hingga atau error) 
                    if (isFinite(result)) {
                        display.value = result;
                        changeImage('success'); //  Ganti gambar jadi sukses kalau hasilnya valid
                    } else {
                        throw new Error("Hasil tidak valid");
                    }

                } catch (error) {
                    console.error("Error kalkulasi:", error);
                    display.value = 'Error';
                    changeImage('error');  //  Ganti gambar jadi error kalau perhitungannya gagal  
                    setTimeout(clearDisplay, 1500);
                }
            }


            // Bagian ini buat ngasih fungsi ke setiap tombol kalkulator pas diklik
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const value = button.getAttribute('data-value');

                   //  Mengecek tombol mana yang diklik, terus jalanin fungsinya masing-masing
                    switch(value) {
                        case 'C':
                            //  Kalau tombol 'C' diklik, hapus semua isi layar 
                            clearDisplay();
                            break;
                        case 'DEL':
                            //  Kalau tombol 'DEL' diklik, hapus satu karakter terakhir 
                            deleteLastChar();
                            break;
                        case '=':
                           //  Kalau tombol '=' diklik, hitung hasilnya 
                            calculateResult();
                            break;
                        default:
                            //  Kalau sebelumnya hasilnya sukses atau error, reset dulu sebelum nambah angka baru
                            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                                clearDisplay();
                            }
                            appendToDisplay(value);
                            break;
                    }
                });
            });

            // Nambahin angka atau simbol ke layar sesuai tombol yang diklik  
            document.addEventListener('keydown', (e) => {
                const key = e.key;

                if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(key);
                    e.preventDefault();
                } else if (key === 'Enter' || key === '=') {
                    calculateResult();
                    e.preventDefault();
                } else if (key === 'Backspace') {
                    deleteLastChar();
                    e.preventDefault();
                } else if (key === 'Escape' || key.toLowerCase() === 'c') {
                    clearDisplay();
                    e.preventDefault();
                }
            });

        });