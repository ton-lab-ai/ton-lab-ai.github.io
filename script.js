// ========================================
// PRANK AI VIDEO GENERATOR
// ========================================

const photoInput = document.getElementById("photoInput");
const uploadBox = document.getElementById("uploadBox");
const uploadContent = document.getElementById("uploadContent");
const photoPreview = document.getElementById("photoPreview");

const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");

const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const progressBar = document.getElementById("progressBar");

const result = document.getElementById("result");
const resultVideo = document.getElementById("resultVideo");
const resultDescription = document.getElementById("resultDescription");

const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");

let previewUrl = null;
let generationTimer = null;


// ========================================
// DAFTAR VIDEO PRANK
// ========================================

const prankVideos = [
    {
        src: "videos/prank1.mp4",
        description: "sepertinya prompt yg kamu masukkan kurang tepat"
    },
    {
        src: "videos/prank2.mp4",
        description: " di larang memasukkan prompt vulgar"
    },
    {
        src: "videos/prank3.mp4",
        description: " sepertinya kamu harus ngopi dulu biar hasilnya sesuai"
    }
];


// ========================================
// UPLOAD DAN PREVIEW FOTO
// ========================================

uploadBox.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Silakan pilih file gambar yang valid.");
        photoInput.value = "";
        return;
    }

    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }

    previewUrl = URL.createObjectURL(file);

    photoPreview.src = previewUrl;
    photoPreview.style.display = "block";
    uploadContent.style.display = "none";
});


// ========================================
// MEMILIH VIDEO SECARA ACAK
// ========================================

function chooseRandomVideo() {

    const randomIndex = Math.floor(
        Math.random() * prankVideos.length
    );

    return prankVideos[randomIndex];
}


// ========================================
// TOMBOL GENERATE VIDEO
// ========================================

generateBtn.addEventListener("click", () => {

    const photo = photoInput.files[0];
    const prompt = promptInput.value.trim();

    // Periksa foto
    if (!photo) {
        alert("Silakan unggah foto terlebih dahulu!");
        return;
    }

    // Periksa prompt
    if (!prompt) {
        alert("Silakan tulis prompt terlebih dahulu!");
        return;
    }

    // Hentikan timer sebelumnya jika ada
    if (generationTimer) {
        clearInterval(generationTimer);
        generationTimer = null;
    }

    // Pilih video secara acak
    const selectedVideo = chooseRandomVideo();

    // Persiapan tampilan
    generateBtn.disabled = true;
    loading.style.display = "block";
    result.style.display = "none";

    progressBar.style.width = "0%";

    let progress = 0;

    const messages = [
        "🔍 Menganalisis foto...",
        "🧠 Membaca prompt...",
        "🎬 Menyiapkan gerakan karakter...",
        "⚡ Merender video...",
        "✨ Hampir selesai..."
    ];

    loadingText.textContent = messages[0];

    // Animasi pemrosesan
    generationTimer = setInterval(() => {

        progress += 2;

        progressBar.style.width = progress + "%";

        const messageIndex = Math.min(
            Math.floor(progress / 22),
            messages.length - 1
        );

        loadingText.textContent = messages[messageIndex];

        // Setelah proses selesai
        if (progress >= 100) {

            clearInterval(generationTimer);
            generationTimer = null;

            loadingText.textContent = "Menyiapkan hasil video...";

            // Tampilkan video yang dipilih
            playSelectedVideo(selectedVideo);

        }

    }, 100);

});


// ========================================
// MEMUAT DAN MEMUTAR VIDEO
// ========================================

function playSelectedVideo(videoData) {

    // Bersihkan sumber video sebelumnya
    resultVideo.pause();
    resultVideo.removeAttribute("src");
    resultVideo.load();

    // Tentukan video baru
    const videoURL = new URL(
        videoData.src,
        document.baseURI
    ).href;

    resultVideo.src = videoURL;

    resultDescription.textContent =
        videoData.description;

    downloadBtn.href = videoURL;
    downloadBtn.download =
        videoData.src.split("/").pop();

    // Perlihatkan hasil
    loading.style.display = "none";
    result.style.display = "block";

    generateBtn.disabled = false;

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Periksa apakah video berhasil dimuat
    resultVideo.onerror = () => {

        resultDescription.textContent =
            "⚠️ Video gagal dimuat. Periksa nama file, lokasi video, dan format MP4.";

        downloadBtn.removeAttribute("href");

        console.error(
            "Gagal memuat video:",
            videoURL,
            resultVideo.error
        );

    };

    resultVideo.onloadeddata = () => {

        resultDescription.textContent =
            videoData.description;

    };

    resultVideo.load();

}


// ========================================
// TOMBOL COBA LAGI
// ========================================

resetBtn.addEventListener("click", () => {

    if (generationTimer) {
        clearInterval(generationTimer);
        generationTimer = null;
    }

    resultVideo.pause();
    resultVideo.removeAttribute("src");
    resultVideo.load();

    result.style.display = "none";
    loading.style.display = "none";

    progressBar.style.width = "0%";

    generateBtn.disabled = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ========================================
// SELESAI
// ========================================

console.log("PrankAI Video Generator berhasil dimuat.");
console.log(
    "Jumlah video prank:",
    prankVideos.length
);
