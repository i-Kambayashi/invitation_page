// ふわっと表示（IntersectionObserver）
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible")
        io.unobserve(e.target)
      }
    })
  },
  { threshold: 0.14 }
)

document.querySelectorAll(".reveal").forEach((el) => io.observe(el))

// 各セクション内の要素に自動でスタガーアニメーションを付与
function wireStagger(root) {
  if (!root) return
  const inner =
    root.querySelector(".section-inner") ||
    root.querySelector(".hero-inner") ||
    root
  const kids = Array.from(inner.children).filter(
    (el) => el.tagName !== "SCRIPT"
  )

  kids.forEach((el, i) => {
    if (!el.classList.contains("reveal-item")) el.classList.add("reveal-item")
    el.style.setProperty("--d", `${Math.min(i, 10) * 90}ms`)
    if (i % 5 === 2) el.setAttribute("data-in", "left")
    if (i % 5 === 4) el.setAttribute("data-in", "right")
  })
}

document.querySelectorAll(".section").forEach(wireStagger)
wireStagger(document.querySelector(".hero"))

// 表紙パララックス（SVG image）
const heroPhoto = document.querySelector(".hero-photo")
const heroSvgImg = heroPhoto ? heroPhoto.querySelector(".photo-img") : null

function onScroll() {
  if (!heroSvgImg || !heroPhoto) return
  const rect = heroPhoto.getBoundingClientRect()
  const vh = window.innerHeight
  const ratio = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1)
  const offset = (ratio - 0.5) * 24
  heroSvgImg.setAttribute("transform", `translate(0 ${offset}) scale(1.06)`)
}
window.addEventListener("scroll", onScroll, { passive: true })
onScroll()

// COUNTDOWN（2026-03-28 15:00 JST）
const target = new Date("2026-03-28T15:00:00+09:00").getTime()
const dEl = document.getElementById("cd_days")
const hEl = document.getElementById("cd_hours")
const mEl = document.getElementById("cd_minutes")
const sEl = document.getElementById("cd_seconds")

function pad2(n) {
  return String(n).padStart(2, "0")
}

function tick() {
  const now = Date.now()
  let diff = Math.max(0, target - now)
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  diff -= days * (24 * 60 * 60 * 1000)
  const hours = Math.floor(diff / (60 * 60 * 1000))
  diff -= hours * (60 * 60 * 1000)
  const mins = Math.floor(diff / (60 * 1000))
  diff -= mins * (60 * 1000)
  const secs = Math.floor(diff / 1000)

  if (dEl) dEl.textContent = days
  if (hEl) hEl.textContent = pad2(hours)
  if (mEl) mEl.textContent = pad2(mins)
  if (sEl) sEl.textContent = pad2(secs)
}
tick()
setInterval(tick, 1000)

// 同伴者：人数分の「名前・アレルギー」入力欄を生成
;(function () {
  const countEl = document.getElementById("companionCount")
  const wrap = document.getElementById("companions")
  if (!countEl || !wrap) return

  // ★あなたが指定した対応関係
  const MAP = [
    { name: "entry.141648264", allergy: "entry.1754266666", label: "同伴者1" },
    { name: "entry.1323711423", allergy: "entry.2063798039", label: "同伴者2" },
    { name: "entry.471870219", allergy: "entry.505184530", label: "同伴者3" },
    { name: "entry.149259454", allergy: "entry.408397873", label: "同伴者4" }
  ]

  function block(i) {
    const m = MAP[i - 1]

    const box = document.createElement("div")
    box.style.marginTop = "18px"

    const head = document.createElement("div")
    head.className = "hint"
    head.style.marginTop = "0"
    head.style.marginBottom = "10px"
    head.textContent = m.label
    box.appendChild(head)

    const row = document.createElement("div")
    row.className = "underline-row two"

    // 名前（必須にするかは好み。ここでは任意にしておく）
    const u1 = document.createElement("div")
    u1.className = "u"
    const in1 = document.createElement("input")
    in1.name = m.name // ★Google Formのentry
    in1.type = "text"
    in1.placeholder = `${m.label} お名前`
    u1.appendChild(in1)

    // アレルギー（任意）
    const u2 = document.createElement("div")
    u2.className = "u"
    const in2 = document.createElement("input")
    in2.name = m.allergy // ★Google Formのentry
    in2.type = "text"
    in2.placeholder = `${m.label} アレルギー（任意）`
    u2.appendChild(in2)

    row.appendChild(u1)
    row.appendChild(u2)
    box.appendChild(row)

    return box
  }

  function render() {
    const n = Math.max(0, Math.min(4, parseInt(countEl.value || "0", 10)))
    wrap.innerHTML = ""
    for (let i = 1; i <= n; i++) {
      wrap.appendChild(block(i))
    }
  }

  countEl.addEventListener("change", render)
  render()
})()
// 送信後に Thanks を表示
document.getElementById("rsvpForm")?.addEventListener("submit", () => {
  setTimeout(() => {
    document.getElementById("rsvpForm").style.display = "none"
    document.getElementById("thanks").style.display = "block"
  }, 800) // Google Form送信待ち
})
