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

// Pilih foto
uploadBox.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Silakan pilih file gambar.");
        photoInput.value = "";
        return;
    }

    const imageURL = URL.createObjectURL(file);

    photoPreview.src = imageURL;
    photoPreview.style.display = "block";
    uploadContent.style.display = "none";
});

// Menentukan video berdasarkan prompt
function chooseVideo(prompt) {
    const text = prompt.toLowerCase();

    if (
        text.includes("spiderman") ||
        text.includes("spider-man")
    ) {
        return {
            src: "videos/prank1.mp4",
            description: "Spider-Man telah menyelesaikan misinya!"
        };
    }

    if (
        text.includes("dance") ||
        text.includes("menari") ||
        text.includes("joget")
    ) {
        return {
            src: "videos/prank2.mp4",
            description: "Video tarianmu berhasil dibuat!"
        };
    }

    return {
        src: "videos/prank3.mp4",
        description: "Kreasimu berhasil diproses!"
    };
}

// Proses generate
generateBtn.addEventListener("click", () => {
    const photo = photoInput.files[0];
    const prompt = promptInput.value.trim();

    if (!photo) {
        alert("Silakan unggah foto terlebih dahulu.");
        return;
    }

    if (!prompt) {
        alert("Silakan tulis prompt video terlebih dahulu.");
        return;
    }

    const selectedVideo = chooseVideo(prompt);

    generateBtn.disabled = true;
    loading.style.display = "block";
    result.style.display = "none";

    progressBar.style.width = "0%";

    let progress = 0;

    const messages = [
        "Menganalisis foto...",
        "Membaca prompt...",
        "Membuat gerakan karakter...",
        "Merender video...",
        "Hampir selesai..."
    ];

    loadingText.textContent = messages[0];

    const timer = setInterval(() => {
        progress += 2;

        progressBar.style.width = progress + "%";

        const index = Math.min(
            Math.floor(progress / 22),
            messages.length - 1
        );

        loadingText.textContent = messages[index];

        if (progress >= 100) {
            clearInterval(timer);

            resultVideo.src = selectedVideo.src;
            resultVideo.load();

            resultDescription.textContent =
                selectedVideo.description;

            downloadBtn.href = selectedVideo.src;

            loading.style.display = "none";
            result.style.display = "block";
            generateBtn.disabled = false;

            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, 100);
});

// Ulangi proses
resetBtn.addEventListener("click", () => {
    resultVideo.pause();
    resultVideo.removeAttribute("src");
    resultVideo.load();

    result.style.display = "none";
    loading.style.display = "none";

    progressBar.style.width = "0%";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
