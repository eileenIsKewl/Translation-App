import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static("."))
app.use(function(req, res, next) {
    const origin = req.headers.origin
    if (origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        res.header("Access-Control-Allow-Origin", origin)
    }
    res.header("Access-Control-Allow-Methods", "GET,POST")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})

const openai = new OpenAI({
    apiKey: process.env.AI_KEY,
    baseURL: process.env.AI_URL
})

app.post("/translate", async function(req, res) {
    const { text, language } = req.body

    try {
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL,
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `
                    You are an expert translator and polyglot.
                    Your job is to translate the given text from the user into the language they chose.
                    Make sure that your translation is accurate.
                    Do not include anything other than the translation and only include punctuation if the user included punctuation. No periods at the end of translation.
                    `
                },
                {
                    role: "user",
                    content: `Translate ${text} into ${language}.`
                }
            ]
        })

        res.json({
            translation: response.choices[0].message.content
        })

    } catch (error) {
        console.error(error)

        res.status(500).json({
            error: "Translation failed"
        })
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, function() {
    console.log(`PollyGlot running on port ${PORT}`)
})