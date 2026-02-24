document.addEventListener("DOMContentLoaded", function () {

let currentMode = 'single';
let lastResults = [];
let lastSession = null;

const states = document.querySelectorAll('.state');
const fileInput = document.getElementById('fileInput');
const fileName  = document.getElementById('fileName');
const previewList = document.getElementById('previewList');
const resultList  = document.getElementById('resultList');
const downloadBtn = document.getElementById('downloadBtn');
const modeButtons = document.querySelectorAll('.mode-btn');
const dropzone = document.getElementById('dropzone');

function showState(name) {
    states.forEach(s => s.classList.remove('active'));
    document.querySelector('.state-' + name).classList.add('active');
}

/* MODE SWITCH */
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentMode = btn.dataset.mode;
        fileInput.multiple = currentMode === 'multi';

        resetAll();
    });
});

/* DROPZONE */
dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('dragging');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragging');
});

dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('dragging');

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    for (let file of e.dataTransfer.files) {
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG images are allowed.");
            return;
        }
    }

    fileInput.files = e.dataTransfer.files;
    handleFiles();
});

/* FILE SELECT */
fileInput.addEventListener('change', handleFiles);

function handleFiles() {

    if (!fileInput.files.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    for (let file of fileInput.files) {
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG and PNG images are allowed.");
            fileInput.value = '';
            return;
        }
    }

    previewList.innerHTML = '';

    Array.from(fileInput.files).forEach(file => {
        const div = document.createElement('div');
        div.className = 'preview-item';
        div.innerHTML = `<img src="${URL.createObjectURL(file)}">`;
        previewList.appendChild(div);
    });

    fileName.textContent =
        currentMode === 'single'
            ? fileInput.files[0].name
            : `${fileInput.files.length} images selected`;

    showState('preview');
}

/* PROCESS */
document.getElementById('removeBg').onclick = async () => {

    if (!fileInput.files.length) return;

    showState('processing');

    const formData = new FormData();
    const files = Array.from(fileInput.files);

    files.forEach(f => {
        formData.append('files', f);
    });

    try {
        const res = await fetch('/bg/process/', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Processing failed");
            showState('preview');
            return;
        }

        lastResults = data.results;
        lastSession = data.session_id;

        resultList.innerHTML = '';

        data.results.forEach((item, index) => {

            const row = document.createElement('div');
            row.className = 'result-row';

            row.innerHTML = `
                <div class="result-box">
                    <div class="result-label">Before</div>
                    <img src="${URL.createObjectURL(files[index])}">
                </div>

                <div class="arrow">→</div>

                <div class="result-box">
                    <div class="result-label">After</div>
                    <img src="${item.result_url}">
                </div>
            `;

            resultList.appendChild(row);
        });

        showState('result');

    } catch (err) {
        alert("Processing failed");
        showState('preview');
    }
};

/* DOWNLOAD */
downloadBtn.onclick = async () => {

    if (!lastResults.length || !lastSession) return;

    try {

        for (const r of lastResults) {

            const response = await fetch(
                `/bg/download/${lastSession}/${r.result_name}/`
            );

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Bg_Remover_by_mediaTools.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
        }

        // 🔥 cleanup setelah SEMUA download selesai
        await fetch('/bg/cleanup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: lastSession })
        });

        resetAll();

    } catch (err) {
        alert("Download failed");
    }
};

/* CHANGE IMAGE */
document.getElementById('changeImage').onclick = async () => {

    if (lastSession) {
        await fetch('/bg/cleanup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: lastSession })
        });
    }

    resetAll();
};

/* PROCESS ANOTHER */
document.getElementById('processAnother').onclick = async () => {

    if (lastSession) {
        await fetch('/bg/cleanup/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: lastSession })
        });
    }

    resetAll();
};

function resetAll() {
    fileInput.value = '';
    previewList.innerHTML = '';
    resultList.innerHTML = '';
    lastResults = [];
    lastSession = null;
    showState('idle');
}

});