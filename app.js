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

  function companionBlock(i) {
    const box = document.createElement("div")
    box.style.marginTop = "18px"

    const head = document.createElement("div")
    head.className = "hint"
    head.style.marginTop = "0"
    head.style.marginBottom = "10px"
    head.textContent = `同伴者${i}`
    box.appendChild(head)

    const row1 = document.createElement("div")
    row1.className = "underline-row two"

    const u1 = document.createElement("div")
    u1.className = "u"
    const in1 = document.createElement("input")
    in1.name = `companion_${i}_name`
    in1.type = "text"
    in1.placeholder = `同伴者${i} お名前`
    in1.required = true
    u1.appendChild(in1)

    const u2 = document.createElement("div")
    u2.className = "u"
    const in2 = document.createElement("input")
    in2.name = `companion_${i}_allergy`
    in2.type = "text"
    in2.placeholder = `同伴者${i} アレルギー（任意）`
    u2.appendChild(in2)

    row1.appendChild(u1)
    row1.appendChild(u2)
    box.appendChild(row1)

    return box
  }

  function render() {
    const n = parseInt(countEl.value || "0", 10)
    wrap.innerHTML = ""
    if (!n) return
    for (let i = 1; i <= n; i++) wrap.appendChild(companionBlock(i))
  }

  countEl.addEventListener("change", render)
  render()
})()
