import { useState } from 'react'
import { popQuestions } from './data/popQuestions.js'
import { techQuestions } from './data/techQuestions.js'
import { sportQuestions } from './data/sportQuestions.js'
import { musicQuestions } from './data/musicQuestions.js'

const THEMES = {
  pop: { label: 'Pop culture', color: '#4a3aa7', bg: '#EEEDFE' },
  tech: { label: 'Tech & IA', color: '#185FA5', bg: '#E6F1FB' },
  sport: { label: 'Sport & E-sport', color: '#3B6D11', bg: '#EAF3DE' },
  music: { label: 'Musique', color: '#854F0B', bg: '#FAEEDA' },
}

const QUESTION_BANK = {
  pop: popQuestions,
  tech: techQuestions,
  sport: sportQuestions,
  music: musicQuestions,
}

const QUESTIONS_PER_GAME = 15

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildQuizFromBank(selectedThemes) {
  // Rassemble toutes les questions des thèmes sélectionnés, mélange, et en garde 15
  let pool = []
  selectedThemes.forEach((t) => {
    pool = pool.concat(QUESTION_BANK[t] || [])
  })
  const shuffled = shuffle(pool)
  return shuffled.slice(0, QUESTIONS_PER_GAME)
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [selectedThemes, setSelectedThemes] = useState(Object.keys(THEMES))
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [chosen, setChosen] = useState(null)

  function toggleTheme(t) {
    setSelectedThemes((prev) => {
      if (prev.includes(t)) {
        if (prev.length === 1) return prev
        return prev.filter((x) => x !== t)
      }
      return [...prev, t]
    })
  }

  function startQuiz() {
    const picked = buildQuizFromBank(selectedThemes)
    setQuestions(picked)
    setCurrent(0)
    setScore(0)
    setAnswered(false)
    setChosen(null)
    setScreen('quiz')
  }

  function selectAnswer(opt) {
    if (answered) return
    setAnswered(true)
    setChosen(opt)
    if (opt === questions[current].answer) {
      setScore((s) => s + 1)
    }
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      setScreen('result')
    } else {
      setCurrent((c) => c + 1)
      setAnswered(false)
      setChosen(null)
    }
  }

  function restart() {
    setScreen('home')
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      {screen === 'home' && (
        <HomeScreen
          selectedThemes={selectedThemes}
          toggleTheme={toggleTheme}
          onStart={startQuiz}
        />
      )}
      {screen === 'quiz' && questions.length > 0 && (
        <QuizScreen
          question={questions[current]}
          index={current}
          total={questions.length}
          answered={answered}
          chosen={chosen}
          onSelect={selectAnswer}
          onNext={nextQuestion}
        />
      )}
      {screen === 'result' && (
        <ResultScreen score={score} total={questions.length} onRestart={restart} />
      )}
    </div>
  )
}

function HomeScreen({ selectedThemes, toggleTheme, onStart }) {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '32px 16px' }}>
        <div style={{ fontSize: 36 }}>🧠</div>
        <h1 style={{ fontSize: 28, fontWeight: 500, marginTop: 8 }}>Quiz Génération Z</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 8 }}>
          15 questions · 4 thèmes · niveaux mixtes
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
        {Object.entries(THEMES).map(([key, t]) => {
          const selected = selectedThemes.includes(key)
          return (
            <button
              key={key}
              onClick={() => toggleTheme(key)}
              style={{
                background: '#fff',
                border: selected ? '2px solid #2a78d6' : '0.5px solid #ddd',
                borderRadius: 12,
                padding: '20px 16px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 500, fontSize: 14 }}>{t.label}</div>
            </button>
          )
        })}
      </div>
      <button
        onClick={onStart}
        style={{
          width: '100%',
          padding: 14,
          borderRadius: 8,
          border: '0.5px solid #999',
          background: 'transparent',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Lancer le quiz
      </button>
    </div>
  )
}

function LoadingScreen({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div
        style={{
          width: 32,
          height: 32,
          border: '2px solid #ddd',
          borderTopColor: '#2a78d6',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontSize: 14, color: '#888' }}>{text}</div>
    </div>
  )
}

function QuizScreen({ question, index, total, answered, chosen, onSelect, onNext }) {
  const th = THEMES[question.theme] || THEMES.pop
  const pct = Math.round((index / total) * 100)
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: th.bg, color: th.color }}>
          {th.label}
        </span>
        <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2, margin: '0 12px' }}>
          <div style={{ height: 4, width: pct + '%', background: '#2a78d6', borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
        <span style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap' }}>
          {index + 1} / {total}
        </span>
      </div>

      <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {question.type === 'vf' ? 'Vrai ou faux' : 'QCM · ' + question.difficulty}
        </div>
        <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5 }}>{question.question}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {question.options.map((opt, i) => {
          let bg = '#fff'
          let border = '0.5px solid #ddd'
          let color = '#1a1a18'
          if (answered) {
            if (opt === question.answer) {
              bg = '#EAF3DE'
              border = '0.5px solid #639922'
              color = '#173404'
            } else if (opt === chosen) {
              bg = '#FCEBEB'
              border = '0.5px solid #E24B4A'
              color = '#501313'
            }
          }
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => onSelect(opt)}
              style={{
                background: bg,
                border,
                borderRadius: 8,
                padding: '14px 16px',
                cursor: answered ? 'default' : 'pointer',
                fontSize: 14,
                color,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '0.5px solid #999',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {question.type === 'vf' ? (i === 0 ? 'V' : 'F') : letters[i]}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16,
            background: chosen === question.answer ? '#EAF3DE' : '#FCEBEB',
            color: chosen === question.answer ? '#173404' : '#501313',
            border: chosen === question.answer ? '0.5px solid #639922' : '0.5px solid #E24B4A',
          }}
        >
          {chosen === question.answer ? '✓ Bonne réponse ! ' : '✗ '}
          {question.explanation}
        </div>
      )}

      {answered && (
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 8,
            border: '0.5px solid #999',
            background: 'transparent',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {index + 1 < total ? 'Question suivante' : 'Voir les résultats'}
        </button>
      )}
    </div>
  )
}

function ResultScreen({ score, total, onRestart }) {
  const pct = Math.round((score / total) * 100)
  let msg = ''
  if (pct === 100) msg = 'Parfait ! Tu es une encyclopédie vivante.'
  else if (pct >= 80) msg = 'Excellent ! Tu maîtrises ces thèmes.'
  else if (pct >= 60) msg = "Bien joué ! Encore un peu d'entraînement."
  else if (pct >= 40) msg = 'Pas mal ! Il y a de la marge de progression.'
  else msg = "Continue à apprendre, tu vas t'améliorer !"

  return (
    <div>
      <div style={{ background: '#fff', border: '0.5px solid #ddd', borderRadius: 12, padding: 32, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 56, fontWeight: 500, lineHeight: 1 }}>
          {score}/{total}
        </div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>sur {total} questions</div>
        <div style={{ fontSize: 16, color: '#444', marginBottom: 24 }}>{msg}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <Stat val={score} label="Bonnes réponses" />
          <Stat val={total - score} label="Mauvaises" />
          <Stat val={pct + '%'} label="Score" />
        </div>
      </div>
      <button
        onClick={onRestart}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: 8,
          border: '0.5px solid #999',
          background: 'transparent',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Rejouer
      </button>
    </div>
  )
}

function Stat({ val, label }) {
  return (
    <div style={{ background: '#f5f5f0', borderRadius: 8, padding: 12 }}>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{val}</div>
      <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
    </div>
  )
}
