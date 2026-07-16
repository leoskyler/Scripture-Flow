// ==========================================================================
// SCRIPTURE FLOW // CORE ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initBibleReader();
    initTriviaEngine();
    initJournalEngine();
    loadDailyVerse();
});

/* ==========================================================================
   1. TAB NAVIGATION CONTROLLER
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".app-page");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetId = item.getAttribute("data-target");

            // Swap active nav classes
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");

            // Swap active page classes
            pages.forEach(page => page.classList.remove("active"));
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add("active");
            }
        });
    });
}

/* ==========================================================================
   2. DYNAMIC BIBLE READER (COBALT)
   ========================================================================== */
// Simplified book list with standard chapter counts for easy navigation
const BIBLE_BOOKS = [
    { name: "Genesis", chapters: 50 },
    { name: "Exodus", chapters: 40 },
    { name: "Leviticus", chapters: 27 },
    { name: "Numbers", chapters: 36 },
    { name: "Deuteronomy", chapters: 34 },
    { name: "Joshua", chapters: 24 },
    { name: "Judges", chapters: 21 },
    { name: "Ruth", chapters: 4 },
    { name: "1 Samuel", chapters: 31 },
    { name: "2 Samuel", chapters: 24 },
    { name: "1 Kings", chapters: 22 },
    { name: "2 Kings", chapters: 25 },
    { name: "Matthew", chapters: 28 },
    { name: "Mark", chapters: 16 },
    { name: "Luke", chapters: 24 },
    { name: "John", chapters: 21 },
    { name: "Acts", chapters: 28 },
    { name: "Romans", chapters: 16 },
    { name: "1 Corinthians", chapters: 16 },
    { name: "Ephesians", chapters: 6 },
    { name: "Philippians", chapters: 4 },
    { name: "Hebrews", chapters: 13 },
    { name: "James", chapters: 5 },
    { name: "Revelation", chapters: 22 }
];

async function initBibleReader() {
    const bookSelect = document.getElementById("book-select");
    const chapterSelect = document.getElementById("chapter-select");
    const textContainer = document.getElementById("bible-text-container");

    if (!bookSelect || !chapterSelect || !textContainer) return;

    // Populate Books Dropdown
    bookSelect.innerHTML = BIBLE_BOOKS.map(b => `<option value="${b.name}">${b.name}</option>`).join("");

    // Update chapters dropdown when book changes
    function updateChapterDropdown() {
        const selectedBookName = bookSelect.value;
        const bookObj = BIBLE_BOOKS.find(b => b.name === selectedBookName);
        if (bookObj) {
            let options = "";
            for (let i = 1; i <= bookObj.chapters; i++) {
                options += `<option value="${i}">Chapter ${i}</option>`;
            }
            chapterSelect.innerHTML = options;
        }
    }

    // Fetch and render verses using free public bible-api.com
    async function fetchChapterText() {
        textContainer.innerHTML = `<p class="loading-placeholder">Syncing scriptures from Cloud Library...</p>`;
        const book = bookSelect.value;
        const chapter = chapterSelect.value;

        try {
            const response = await fetch(`https://bible-api.com/${book}+${chapter}?translation=web`);
            if (!response.ok) throw new Error("API Offline");
            const data = await response.json();

            if (data.verses && data.verses.length > 0) {
                textContainer.innerHTML = data.verses.map(v => `
                    <div class="bible-verse-row">
                        <span class="verse-num">${v.verse}</span>
                        <span class="verse-body-text">${v.text.trim()}</span>
                    </div>
                `).join("");
            } else {
                textContainer.innerHTML = `<p class="loading-placeholder">No verses found.</p>`;
            }
        } catch (error) {
            textContainer.innerHTML = `<p class="loading-placeholder" style="color: #ff1744;">Error syncing scriptural matrix. Check your internet connection.</p>`;
        }
    }

    // Bind event listeners
    bookSelect.addEventListener("change", () => {
        updateChapterDropdown();
        fetchChapterText();
    });

    chapterSelect.addEventListener("change", fetchChapterText);

    // Initial load
    updateChapterDropdown();
    fetchChapterText();
}

/* ==========================================================================
   3. RETRO ARCADE TRIVIA SYSTEM (AMBER)
   ========================================================================== */
const TRIVIA_DATA = {
    creation: [
        { q: "What did God create on the first day?", a: ["Light", "Sun & Moon", "Animals", "Plants"], correct: 0 },
        { q: "How many days did God take to complete creation?", a: ["5 Days", "6 Days", "7 Days", "8 Days"], correct: 1 },
        { q: "Who was the first woman?", a: ["Sarah", "Esther", "Eve", "Mary"], correct: 2 },
        { q: "Where was the garden that Adam and Eve lived in?", a: ["Eden", "Babylon", "Sinai", "Canaan"], correct: 0 },
        { q: "What did God do on the seventh day?", a: ["Created man", "Rested", "Flooded the earth", "Made stars"], correct: 1 }
    ],
    gospels: [
        { q: "Which Gospel is the shortest in length?", a: ["Matthew", "Mark", "Luke", "John"], correct: 1 },
        { q: "In what town was Jesus born?", a: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], correct: 2 },
        { q: "How many apostles did Jesus choose?", a: ["10", "12", "7", "15"], correct: 1 },
        { q: "What was Jesus' first recorded miracle?", a: ["Walking on water", "Feeding the 5000", "Turning water to wine", "Healing a leper"], correct: 2 },
        { q: "Who baptized Jesus in the Jordan River?", a: ["Peter", "John the Baptist", "James", "Moses"], correct: 1 }
    ],
    ot: [
        { q: "Who built the ark to survive the great flood?", a: ["Abraham", "Noah", "Moses", "David"], correct: 1 },
        { q: "What sea did Moses part to help Israel escape?", a: ["Dead Sea", "Red Sea", "Galilee", "Mediterranean"], correct: 1 },
        { q: "Who defeated Goliath with a sling and a stone?", a: ["Saul", "Solomon", "Samson", "David"], correct: 3 },
        { q: "Who was swallowed by a great fish?", a: ["Jonah", "Job", "Daniel", "Elijah"], correct: 0 },
        { q: "Which king built the first Temple in Jerusalem?", a: ["David", "Saul", "Solomon", "Hezekiah"], correct: 2 }
    ],
    nt: [
        { q: "Who wrote the majority of the Epistles?", a: ["Peter", "John", "Paul", "Jude"], correct: 2 },
        { q: "What is the final book of the New Testament?", a: ["Jude", "Romans", "Hebrews", "Revelation"], correct: 3 },
        { q: "Where was Paul traveling when he saw a blinding light?", a: ["Rome", "Damascus", "Athens", "Ephesus"], correct: 1 },
        { q: "Who wrote the Book of Revelation?", a: ["John", "Paul", "Luke", "Peter"], correct: 0 },
        { q: "Which island was John exiled on when writing Revelation?", a: ["Patmos", "Crete", "Cyprus", "Malta"], correct: 0 }
    ]
};

function initTriviaEngine() {
    const categoriesDiv = document.getElementById("trivia-categories");
    const quizArena = document.getElementById("quiz-arena");
    const catTitle = document.getElementById("quiz-category-title");
    const progressSpan = document.getElementById("quiz-progress");
    const questionTxt = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.getElementById("next-question-btn");

    if (!categoriesDiv || !quizArena) return;

    let activeDeck = [];
    let currentIdx = 0;
    let score = 0;
    let answered = false;

    // Start a category quiz
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const cat = card.getAttribute("data-category");
            activeDeck = TRIVIA_DATA[cat];
            currentIdx = 0;
            score = 0;

            catTitle.textContent = `${cat.toUpperCase()} TRIVIA`;
            categoriesDiv.classList.add("hidden");
            quizArena.classList.remove("hidden");
            loadQuestion();
        });
    });

    function loadQuestion() {
        answered = false;
        nextBtn.classList.add("hidden");
        optionsContainer.innerHTML = "";

        const qData = activeDeck[currentIdx];
        progressSpan.textContent = `${currentIdx + 1}/${activeDeck.length}`;
        questionTxt.textContent = qData.q;

        qData.a.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.textContent = option;
            btn.addEventListener("click", () => handleAnswer(btn, idx));
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(selectedBtn, selectedIdx) {
        if (answered) return;
        answered = true;

        const qData = activeDeck[currentIdx];
        const correctIdx = qData.correct;

        const allButtons = optionsContainer.querySelectorAll(".option-btn");
        allButtons.forEach((btn, idx) => {
            if (idx === correctIdx) {
                btn.classList.add("correct");
            } else if (idx === selectedIdx) {
                btn.classList.add("wrong");
            }
        });

        if (selectedIdx === correctIdx) {
            score++;
        }

        nextBtn.classList.remove("hidden");
    }

    nextBtn.addEventListener("click", () => {
        currentIdx++;
        if (currentIdx < activeDeck.length) {
            loadQuestion();
        } else {
            // End of Quiz
            questionTxt.textContent = `CRITICAL ANALYSIS COMPLETE.\nScore Matrix: ${score} / ${activeDeck.length}`;
            optionsContainer.innerHTML = "";
            nextBtn.textContent = "RETURN TO DECKS";
            nextBtn.classList.remove("hidden");
            nextBtn.onclick = resetTrivia;
        }
    });

    function resetTrivia() {
        quizArena.classList.add("hidden");
        categoriesDiv.classList.remove("hidden");
        nextBtn.textContent = "NEXT QUESTION";
        nextBtn.onclick = null; // Clean up unique assignment
    }
}

/* ==========================================================================
   4. LOCAL STUDY JOURNAL STORAGE ENGINE (ME)
   ========================================================================== */
function initJournalEngine() {
    const input = document.getElementById("journal-input");
    const saveBtn = document.getElementById("save-note-btn");
    const notesList = document.getElementById("saved-notes-list");

    if (!input || !saveBtn || !notesList) return;

    // Load existing notes
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem("scripture_flow_notes") || "[]");
        notesList.innerHTML = notes.map(note => `
            <div class="saved-note">
                <div class="note-time">${note.timestamp}</div>
                <div class="note-text">${escapeHTML(note.text)}</div>
            </div>
        `).join("");
    }

    saveBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;

        const notes = JSON.parse(localStorage.getItem("scripture_flow_notes") || "[]");
        const newNote = {
            text: text,
            timestamp: new Date().toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric", 
                year: "numeric", 
                hour: "2-digit", 
                minute: "2-digit" 
            })
        };

        notes.unshift(newNote); // Put newest note first
        localStorage.setItem("scripture_flow_notes", JSON.stringify(notes));
        
        input.value = "";
        loadNotes();
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    loadNotes();
}

/* ==========================================================================
   5. VERSE OF THE DAY SYNC (TODAY)
   ========================================================================== */
function loadDailyVerse() {
    const dailyVerses = [
        { text: "For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
        { text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures; He leads me beside still waters.", ref: "Psalm 23:1-2" },
        { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" }
    ];

    // Pick a verse based on the current day of the year
    const now = new Date();
    const day = now.getDate() % dailyVerses.length;
    const todayVerse = dailyVerses[day];

    const verseTextEl = document.getElementById("daily-verse-content");
    const verseRefEl = document.getElementById("daily-verse-ref");

    if (verseTextEl && verseRefEl) {
        verseTextEl.textContent = `"${todayVerse.text}"`;
        verseRefEl.textContent = todayVerse.ref;
    }
}
