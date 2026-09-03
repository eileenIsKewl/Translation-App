const textToTranslateEl = document.getElementById("text-to-translate")
const translationForm = document.getElementById("translation-form")
const translateBtn = document.getElementById("translate-btn")
const title1 = document.getElementById("title-1")
const title2 = document.getElementById("title-2")
const optionsDiv = document.getElementById("options")
const translationResultEl = document.getElementById("translation-result")

translationForm.addEventListener("submit", async function(e) {
    e.preventDefault()

    if (translateBtn.textContent === "Start Over") {
        translationForm.reset()

        optionsDiv.style.display = "flex"
        translationResultEl.style.display = "none"

        translateBtn.textContent = "Translate"

        title1.textContent = "Text to translate 👇"
        title2.textContent = "Select language 👇"

        return
    }

    const language = document.querySelector(
        'input[name="language"]:checked'
    ).value

    optionsDiv.style.display = "none"
    translationResultEl.style.display = "flex"

    title1.textContent = "Original text 👇"
    title2.textContent = "Your translation 👇"
    translateBtn.textContent = "Start Over"

    const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: textToTranslateEl.value,
            language: language
        })
    })

    const data = await response.json()

    translationResultEl.value = data.translation
})
