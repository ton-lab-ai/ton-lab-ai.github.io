// TON LAB AI — generator demo + galeri karya video
const photoInput = document.getElementById("photoInput");
const uploadBox = document.getElementById("uploadBox");
const uploadContent = document.getElementById("uploadContent");
const choosePhotoBtn = document.getElementById("choosePhotoBtn");
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
const videoGrid = document.getElementById("videoGrid");
const gallerySearch = document.getElementById("gallerySearch");
const videoCount = document.getElementById("videoCount");
const playerModal = document.getElementById("playerModal");
const galleryPlayer = document.getElementById("galleryPlayer");
const playerTitle = document.getElementById("playerTitle");
const playerDescription = document.getElementById("playerDescription");
const closePlayer = document.getElementById("closePlayer");

let previewUrl = null;
let generationTimer = null;
let activeFilter = "all";

// GALERI: file di folder videos/ hanya untuk tontonan galeri.
const prankVideos = [
  { id: "prank1", src: "videos/prank1.mp4", title: "-", description: ".", category: "2026", tag: "-" },
  { id: "prank2", src: "videos/prank2.mp4", title: "-", description: ".", category: "2026", tag: "-" },
  { id: "prank3", src: "videos/prank3.mp4", title: "-", description: ".", category: "2026", tag: "-" }
];

// GENERATOR DEMO: sumbernya TERPISAH dari galeri.
// Upload file-file ini ke folder generated/ di GitHub.
const generatorVideos = [
  { src: "generated/hasil-generate-1.mp4", description: "-" },
  { src: "generated/hasil-generate-2.mp4", description: ">" },
  { src: "generated/hasil-generate-3.mp4", description: "-" }
];

function safeVideoUrl(src) {
  return new URL(src, document.baseURI).href;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}

// Galeri menampilkan video sebagai kartu; tombol Play membuka pemutar video.
function renderGallery() {
  const term = gallerySearch.value.trim().toLowerCase();
  const filtered = prankVideos.filter(video => {
    const matchesFilter = activeFilter === "all" || video.category === activeFilter;
    const matchesSearch = `${video.title} ${video.description} ${video.category}`.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });
  videoCount.textContent = `${filtered.length} video`;
  if (!filtered.length) {
    videoGrid.innerHTML = '<div class="empty-state"><span>🔎</span><h3>Video tidak ditemukan</h3><p>Coba kata pencarian atau kategori lain.</p></div>';
    return;
  }
  videoGrid.innerHTML = filtered.map((video, index) => `
    <article class="video-card">
      <button class="video-thumb" type="button" data-play-video="${escapeHtml(video.id)}" aria-label="Putar ${escapeHtml(video.title)}">
        <video muted playsinline preload="metadata" tabindex="-1" aria-hidden="true"></video>
        <span class="thumb-gradient"></span><span class="video-tag">${escapeHtml(video.tag)}</span>
        <span class="play-button">▶</span><span class="play-label">Putar video</span>
      </button>
      <div class="video-info">
        <div class="video-avatar">🎬</div><div class="video-copy">
          <h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.description)}</p>
          <span class="video-meta">Ton Lab AI · ${escapeHtml(video.category)}</span>
        </div>
        <button class="card-more" type="button" data-play-video="${escapeHtml(video.id)}" aria-label="Putar ${escapeHtml(video.title)}">•••</button>
      </div>
    </article>`).join("");

  // Poster diambil dari frame video jika browser mendukung metadata.
  videoGrid.querySelectorAll(".video-thumb").forEach((thumb, index) => {
    const video = filtered[index];
    const preview = thumb.querySelector("video");
    preview.src = safeVideoUrl(video.src);
    preview.addEventListener("loadeddata", () => {
      try { preview.currentTime = Math.min(0.2, preview.duration || 0.2); } catch (_) {}
    }, { once: true });
    preview.addEventListener("error", () => {
      thumb.classList.add("no-preview");
      thumb.insertAdjacentHTML("afterbegin", '<span class="fallback-icon">🎞️</span>');
    }, { once: true });
  });
}

function openPlayer(videoData) {
  if (!videoData) return;
  galleryPlayer.pause();
  galleryPlayer.src = safeVideoUrl(videoData.src);
  galleryPlayer.load();
  playerTitle.textContent = videoData.title;
  playerDescription.textContent = videoData.description;
  playerModal.classList.add("open");
  playerModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const playAttempt = galleryPlayer.play();
  if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(() => {});
}
function closeGalleryPlayer() {
  galleryPlayer.pause();
  galleryPlayer.removeAttribute("src");
  galleryPlayer.load();
  playerModal.classList.remove("open");
  playerModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
videoGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-play-video]");
  if (button) openPlayer(prankVideos.find(video => video.id === button.dataset.playVideo));
});
gallerySearch.addEventListener("input", renderGallery);
document.querySelectorAll(".filter-btn").forEach(button => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(item => item.classList.toggle("active", item === button));
  renderGallery();
}));
closePlayer.addEventListener("click", closeGalleryPlayer);
playerModal.addEventListener("click", event => { if (event.target.matches("[data-close-player]")) closeGalleryPlayer(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeGalleryPlayer(); });

// Upload foto
function choosePhoto() { photoInput.click(); }
uploadBox.addEventListener("click", event => {
  if (event.target.closest("button")) return;
  choosePhoto();
});
choosePhotoBtn.addEventListener("click", event => { event.stopPropagation(); choosePhoto(); });
uploadBox.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choosePhoto(); }
});
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Silakan pilih file gambar yang valid.");
    photoInput.value = "";
    return;
  }
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = URL.createObjectURL(file);
  photoPreview.src = previewUrl;
  photoPreview.style.display = "block";
  uploadContent.style.display = "none";
});

// Catatan: ini masih demo front-end, bukan panggilan ke API pembuat video.
generateBtn.addEventListener("click", () => {
  const photo = photoInput.files[0];
  const prompt = promptInput.value.trim();
  if (!photo) { alert("Silakan unggah foto terlebih dahulu!"); return; }
  if (!prompt) { alert("Silakan tulis prompt terlebih dahulu!"); return; }
  if (generationTimer) clearInterval(generationTimer);
  const selectedVideo = generatorVideos[Math.floor(Math.random() * generatorVideos.length)];
  generateBtn.disabled = true;
  loading.style.display = "block";
  result.style.display = "none";
  progressBar.style.width = "0%";
  let progress = 0;
  const messages = ["🔍 Menganalisis foto...", "🧠 Membaca prompt...", "🎬 Menyiapkan gerakan karakter...", "⚡ Menyiapkan contoh hasil generator...", "✨ Hampir selesai..."];
  loadingText.textContent = messages[0];
  generationTimer = setInterval(() => {
    progress += 2;
    progressBar.style.width = `${progress}%`;
    loadingText.textContent = messages[Math.min(Math.floor(progress / 22), messages.length - 1)];
    if (progress >= 100) {
      clearInterval(generationTimer); generationTimer = null;
      playSelectedVideo(selectedVideo);
    }
  }, 100);
});

function playSelectedVideo(videoData) {
  resultVideo.pause();
  resultVideo.removeAttribute("src");
  resultVideo.src = safeVideoUrl(videoData.src);
  resultDescription.textContent = videoData.description;
  downloadBtn.href = safeVideoUrl(videoData.src);
  downloadBtn.download = videoData.src.split("/").pop();
  loading.style.display = "none";
  result.style.display = "block";
  generateBtn.disabled = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
  resultVideo.onerror = () => {
    resultDescription.textContent = "⚠️ Video gagal dimuat. Pastikan file MP4 tersedia di folder generated/ dan nama file sesuai dengan daftar generatorVideos.";
    downloadBtn.removeAttribute("href");
  };
  resultVideo.load();
}
resetBtn.addEventListener("click", () => {
  if (generationTimer) { clearInterval(generationTimer); generationTimer = null; }
  resultVideo.pause(); resultVideo.removeAttribute("src"); resultVideo.load();
  result.style.display = "none"; loading.style.display = "none";
  progressBar.style.width = "0%"; generateBtn.disabled = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderGallery();
console.log("Ton Lab AI Studio dimuat. Jumlah video galeri:", prankVideos.length);
