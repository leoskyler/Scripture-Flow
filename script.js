// ==========================================================================
// SCRIPTURE FLOW // CORE ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initBibleReader();
    initTriviaEngine();
    initJournalEngine();
    loadDailyVerse();
    injectSignature(); // Initializes the signature engine safely
});

/* ==========================================================================
   1. TAB NAVIGATION CONTROLLER
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".app-page");

    if (navItems.length === 0) return;

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
        { q: "What did God do on the seventh day?", a: ["Created man", "Rested", "Flooded the earth", "Made stars"], correct: 1 },
        { q: "What did God create on the second day?", a: ["Animals", "The sky", "The sun", "Man"], correct: 1 },
        { q: "What did God create on the third day?", a: ["Light", "The moon", "Dry land and plants", "Birds"], correct: 2 },
        { q: "What did God create on the fourth day?", a: ["The sun, moon, and stars", "Fish", "Man", "Trees"], correct: 0 },
        { q: "What did God create on the fifth day?", a: ["Birds and sea creatures", "Trees and flowers", "The sun", "Angels"], correct: 0 },
        { q: "What did God create on the sixth day?", a: ["Only plants", "Animals and humans", "The moon", "Light"], correct: 1 },
        { q: "Who was the first man created by God?", a: ["Noah", "Adam", "Abraham", "Moses"], correct: 1 },
        { q: "From what did God form Adam?", a: ["Water", "Dust of the ground", "Fire", "Stone"], correct: 1 },
        { q: "How did God create Eve?", a: ["From the dust", "From Adam's rib", "From water", "From a tree"], correct: 1 },
        { q: "What tree were Adam and Eve forbidden to eat from?", a: ["Tree of Life", "Tree of Knowledge of Good and Evil", "Olive Tree", "Fig Tree"], correct: 1 },
        { q: "Who tempted Eve in the Garden of Eden?", a: ["A lion", "A serpent", "An angel", "A bird"], correct: 1 },
        { q: "What happened after Adam and Eve sinned?", a: ["They left the garden", "They became kings", "They built an ark", "They went to Egypt"], correct: 0 },
        { q: "What did Adam and Eve use to cover themselves?", a: ["Animal skins", "Fig leaves", "Cloth", "Leaves from an olive tree"], correct: 1 },
        { q: "What did God see after creating everything?", a: ["It was very good", "It was incomplete", "It was dangerous", "It was dark"], correct: 0 },
        { q: "What did God separate from the darkness?", a: ["Water", "Light", "Earth", "The moon"], correct: 1 },
        { q: "What was the first thing God created according to Genesis?", a: ["Light", "Man", "Animals", "The sun"], correct: 0 },
        { q: "What did God call the dry ground?", a: ["Earth", "Land", "Canaan", "Dust"], correct: 0 },
        { q: "What did God call the gathered waters?", a: ["Rivers", "Seas", "Oceans", "Lakes"], correct: 1 },
        { q: "What was Adam's responsibility in the Garden of Eden?", a: ["To build a city", "To work and take care of the garden", "To rule Egypt", "To build an ark"], correct: 1 },
        { q: "What did God say was not good for man to be?", a: ["Hungry", "Alone", "Poor", "Old"], correct: 1 },
        { q: "What did God make to be a helper suitable for Adam?", a: ["Eve", "Sarah", "Mary", "Rachel"], correct: 0 }
    ],

    gospels: [
        { q: "Which Gospel is the shortest in length?", a: ["Matthew", "Mark", "Luke", "John"], correct: 1 },
        { q: "In what town was Jesus born?", a: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], correct: 2 },
        { q: "How many apostles did Jesus choose?", a: ["10", "12", "7", "15"], correct: 1 },
        { q: "What was Jesus' first recorded miracle?", a: ["Walking on water", "Feeding the 5000", "Turning water to wine", "Healing a leper"], correct: 2 },
        { q: "Who baptized Jesus in the Jordan River?", a: ["Peter", "John the Baptist", "James", "Moses"], correct: 1 },
        { q: "Who was the mother of Jesus?", a: ["Mary", "Martha", "Elizabeth", "Ruth"], correct: 0 },
        { q: "Who was the earthly father of Jesus?", a: ["Joseph", "Zechariah", "Joachim", "Simon"], correct: 0 },
        { q: "Where did Jesus grow up?", a: ["Bethlehem", "Nazareth", "Jerusalem", "Cana"], correct: 1 },
        { q: "How many days did Jesus fast in the wilderness?", a: ["7", "12", "30", "40"], correct: 3 },
        { q: "Who tempted Jesus in the wilderness?", a: ["Herod", "Satan", "Pilate", "Caiaphas"], correct: 1 },
        { q: "What did Jesus use to feed the 5,000?", a: ["Five loaves and two fish", "Seven loaves", "Two loaves and five fish", "Ten loaves"], correct: 0 },
        { q: "Who walked on water toward Jesus?", a: ["John", "Peter", "James", "Andrew"], correct: 1 },
        { q: "Who was raised from the dead after being in a tomb for four days?", a: ["Jairus", "Lazarus", "Stephen", "Bartimaeus"], correct: 1 },
        { q: "Who betrayed Jesus?", a: ["Peter", "Judas Iscariot", "Thomas", "Matthew"], correct: 1 },
        { q: "How much money was Judas paid to betray Jesus?", a: ["10 pieces of silver", "30 pieces of silver", "40 pieces of silver", "50 pieces of silver"], correct: 1 },
        { q: "Who denied Jesus three times?", a: ["John", "Peter", "James", "Andrew"], correct: 1 },
        { q: "Which Roman governor sentenced Jesus to crucifixion?", a: ["Herod", "Pontius Pilate", "Felix", "Festus"], correct: 1 },
        { q: "Where was Jesus crucified?", a: ["Gethsemane", "Golgotha", "Bethany", "Cana"], correct: 1 },
        { q: "Who was the first person to see the risen Jesus according to John's Gospel?", a: ["Peter", "Mary Magdalene", "John", "Thomas"], correct: 1 },
        { q: "Which disciple doubted Jesus' resurrection until he saw Him?", a: ["Peter", "Thomas", "Matthew", "Philip"], correct: 1 },
        { q: "What prayer did Jesus teach His disciples?", a: ["The Prayer of Jabez", "The Lord's Prayer", "The Prayer of Solomon", "The Prayer of David"], correct: 1 },
        { q: "What is known as Jesus' longest recorded sermon?", a: ["The Sermon on the Mount", "The Olivet Discourse", "The Temple Sermon", "The Sermon at Cana"], correct: 0 },
        { q: "Which Gospel begins with the words 'In the beginning was the Word'?", a: ["Matthew", "Mark", "Luke", "John"], correct: 3 },
        { q: "Which Gospel was written by a physician?", a: ["Matthew", "Mark", "Luke", "John"], correct: 2 },
        { q: "Who was the tax collector who became one of Jesus' disciples?", a: ["Matthew", "Zacchaeus", "Simon", "Levi"], correct: 0 }
    ],

    ot: [
        { q: "Who built the ark to survive the great flood?", a: ["Abraham", "Noah", "Moses", "David"], correct: 1 },
        { q: "What sea did Moses part to help Israel escape?", a: ["Dead Sea", "Red Sea", "Galilee", "Mediterranean"], correct: 1 },
        { q: "Who defeated Goliath with a sling and a stone?", a: ["Saul", "Solomon", "Samson", "David"], correct: 3 },
        { q: "Who was swallowed by a great fish?", a: ["Jonah", "Job", "Daniel", "Elijah"], correct: 0 },
        { q: "Which king built the first Temple in Jerusalem?", a: ["David", "Saul", "Solomon", "Hezekiah"], correct: 2 },
        { q: "Who was Abraham's wife?", a: ["Sarah", "Rebekah", "Rachel", "Leah"], correct: 0 },
        { q: "What was the name of Abraham's promised son?", a: ["Ishmael", "Isaac", "Jacob", "Joseph"], correct: 1 },
        { q: "Who was Isaac's wife?", a: ["Rachel", "Leah", "Rebekah", "Miriam"], correct: 2 },
        { q: "What new name was given to Jacob?", a: ["Israel", "Judah", "Edom", "Benjamin"], correct: 0 },
        { q: "How many sons did Jacob have?", a: ["10", "12", "13", "7"], correct: 1 },
        { q: "Who was sold into slavery by his brothers?", a: ["Joseph", "Benjamin", "Reuben", "Moses"], correct: 0 },
        { q: "Who interpreted Pharaoh's dreams in Egypt?", a: ["Moses", "Joseph", "Daniel", "Aaron"], correct: 1 },
        { q: "Who led the Israelites out of Egypt?", a: ["Joshua", "Moses", "Aaron", "Caleb"], correct: 1 },
        { q: "What did God give Moses on Mount Sinai?", a: ["The Ten Commandments", "A crown", "A sword", "A golden calf"], correct: 0 },
        { q: "How many commandments did God give Moses?", a: ["5", "7", "10", "12"], correct: 2 },
        { q: "Who was Moses' brother?", a: ["Aaron", "Joshua", "Caleb", "Samuel"], correct: 0 },
        { q: "Who succeeded Moses as leader of Israel?", a: ["Joshua", "Aaron", "David", "Samuel"], correct: 0 },
        { q: "Which city did the Israelites march around before its walls fell?", a: ["Jericho", "Jerusalem", "Bethel", "Hebron"], correct: 0 },
        { q: "Who was the strongest judge of Israel?", a: ["Gideon", "Samson", "Deborah", "Ehud"], correct: 1 },
        { q: "Who was Samson's famous enemy who betrayed him?", a: ["Delilah", "Jezebel", "Ruth", "Esther"], correct: 0 },
        { q: "Who was the first king of Israel?", a: ["David", "Saul", "Solomon", "Samuel"], correct: 1 },
        { q: "Who was David's best friend?", a: ["Jonathan", "Abner", "Joab", "Nathan"], correct: 0 },
        { q: "Who was David's son who became king after him?", a: ["Absalom", "Solomon", "Amnon", "Rehoboam"], correct: 1 },
        { q: "Which prophet challenged the prophets of Baal on Mount Carmel?", a: ["Elijah", "Elisha", "Isaiah", "Jeremiah"], correct: 0 },
        { q: "Who was thrown into a den of lions?", a: ["Daniel", "Jeremiah", "Ezekiel", "Nehemiah"], correct: 0 }
    ],

    nt: [
        { q: "Who wrote the majority of the Epistles?", a: ["Peter", "John", "Paul", "Jude"], correct: 2 },
        { q: "What is the final book of the New Testament?", a: ["Jude", "Romans", "Hebrews", "Revelation"], correct: 3 },
        { q: "Where was Paul traveling when he saw a blinding light?", a: ["Rome", "Damascus", "Athens", "Ephesus"], correct: 1 },
        { q: "Who wrote the Book of Revelation?", a: ["John", "Paul", "Luke", "Peter"], correct: 0 },
        { q: "Which island was John exiled on when writing Revelation?", a: ["Patmos", "Crete", "Cyprus", "Malta"], correct: 0 },
        { q: "What happened to the disciples on the Day of Pentecost?", a: ["They received the Holy Spirit", "They went to Egypt", "They built a temple", "They became kings"], correct: 0 },
        { q: "Who preached the first major sermon on the Day of Pentecost?", a: ["Peter", "Paul", "John", "James"], correct: 0 },
        { q: "How many people were added to the church after Peter's Pentecost sermon?", a: ["About 300", "About 3,000", "About 5,000", "About 12,000"], correct: 1 },
        { q: "Who was the first Christian martyr recorded in Acts?", a: ["Stephen", "James", "Peter", "Barnabas"], correct: 0 },
        { q: "Who was present when Stephen was stoned?", a: ["Saul", "Peter", "John", "Philip"], correct: 0 },
        { q: "What was Paul's name before his conversion?", a: ["Saul", "Simon", "Silas", "Samuel"], correct: 0 },
        { q: "Who accompanied Paul on many missionary journeys?", a: ["Barnabas", "Caiaphas", "Nicodemus", "Lazarus"], correct: 0 },
        { q: "Who was Paul's young companion and fellow worker?", a: ["Timothy", "Titus", "Philemon", "Mark"], correct: 0 },
        { q: "Who was Paul's companion who was a physician?", a: ["Luke", "John", "Peter", "James"], correct: 0 },
        { q: "Which apostle was known as the 'Apostle to the Gentiles'?", a: ["Peter", "Paul", "James", "Andrew"], correct: 1 },
        { q: "Who was the first Gentile convert baptized by Peter?", a: ["Cornelius", "Felix", "Festus", "Sergius"], correct: 0 },
        { q: "What happened to Paul and Silas while they were in prison?", a: ["An earthquake opened the doors", "They escaped through a tunnel", "The guards released them", "They were taken to Rome"], correct: 0 },
        { q: "Who baptized the Ethiopian eunuch?", a: ["Philip", "Peter", "Paul", "Stephen"], correct: 0 },
        { q: "Which book tells the history of the early Christian church?", a: ["Acts", "Romans", "Hebrews", "James"], correct: 0 },
        { q: "Which letter is known for teaching about the armor of God?", a: ["Ephesians", "Romans", "Galatians", "Philippians"], correct: 0 },
        { q: "Which book contains the famous 'love chapter'?", a: ["1 Corinthians", "Romans", "Ephesians", "Hebrews"], correct: 0 },
        { q: "What is the famous love chapter in the Bible?", a: ["1 Corinthians 13", "Romans 8", "John 3", "Hebrews 11"], correct: 0 },
        { q: "Which book is known for the 'Hall of Faith'?", a: ["Hebrews", "Romans", "James", "Jude"], correct: 0 },
        { q: "How many churches are addressed in the opening chapters of Revelation?", a: ["5", "7", "10", "12"], correct: 1 },
        { q: "What does the word 'Gospel' generally mean?", a: ["Good News", "Holy Law", "New Covenant", "Sacred Song"], correct: 0 }
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

/* ==========================================================================
   6. SAFE SIGNATURE INJECTOR ENGINE
   ========================================================================== */
function injectSignature() {
    // We try targeting both `.app-page` and `.section` classes to be absolutely safe
    let pages = document.querySelectorAll(".app-page");
    if (pages.length === 0) {
        pages = document.querySelectorAll(".section");
    }
    
    // If we still didn't find any page divs, let's gracefully exit so it never crashes the script!
    if (pages.length === 0) return;
    
    pages.forEach(page => {
        // Prevent duplicate signatures if this gets called multiple times
        if (page.querySelector(".app-signature")) return;

        // Create footer element
        const footer = document.createElement("footer");
        footer.className = "app-signature";
        footer.style.textAlign = "center";
        footer.style.padding = "20px 10px 40px 10px";
        footer.style.fontSize = "0.85rem";
        footer.style.letterSpacing = "2px";
        footer.style.textTransform = "uppercase";
        footer.style.opacity = "0.6";
        footer.style.borderTop = "1px solid rgba(255, 255, 255, 0.05)";
        footer.style.marginTop = "30px";
        
        // Clean Developer Brand Signature (Eden OS prefix removed)
        footer.innerHTML = `
            <span style="color: #00e5ff; font-weight: bold; text-shadow: 0 0 5px rgba(0, 229, 255, 0.4);">♣︎leoskyler♣︎</span>
        `;
        
        page.appendChild(footer);
    });
}
