import jsPDF from 'jspdf'

export function downloadSchemesPDF(schemes, profile = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const margin = 15
  const contentW = W - margin * 2
  let y = 0

  // ── Colors ──────────────────────────────────────────────
  const saffron = [255, 153, 51]
  const green   = [19, 136, 8]
  const navy    = [0, 0, 128]
  const gray    = [100, 116, 139]
  const lightGray = [241, 245, 249]
  const dark    = [15, 23, 42]

  // ── Header ───────────────────────────────────────────────
  // Flag stripe
  doc.setFillColor(...saffron); doc.rect(0, 0, W / 3, 8, 'F')
  doc.setFillColor(255, 255, 255); doc.rect(W / 3, 0, W / 3, 8, 'F')
  doc.setFillColor(...green); doc.rect((W / 3) * 2, 0, W / 3, 8, 'F')

  y = 14
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...saffron)
  doc.text('Adhikar Setu', margin, y)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text('Your Right  ·  Your Bridge  ·  Government Schemes Finder', margin, y + 5)

  // Date
  doc.setFontSize(8)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}`, W - margin, y, { align: 'right' })
  doc.text('Verify: myscheme.gov.in', W - margin, y + 5, { align: 'right' })

  // Divider
  y = 26
  doc.setDrawColor(...saffron)
  doc.setLineWidth(0.5)
  doc.line(margin, y, W - margin, y)

  // ── Profile Summary ──────────────────────────────────────
  if (profile.age || profile.state) {
    y += 6
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, y, contentW, 16, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text('YOUR PROFILE', margin + 4, y + 5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    const profileParts = [
      profile.name && `Name: ${profile.name}`,
      profile.age && `Age: ${profile.age}`,
      profile.gender && `Gender: ${profile.gender}`,
      profile.state && `State: ${profile.state}`,
      profile.occupation && `Occupation: ${profile.occupation}`,
      profile.income && `Income: ${profile.income}`
    ].filter(Boolean)
    doc.text(profileParts.join('   |   '), margin + 4, y + 11, { maxWidth: contentW - 8 })
    y += 22
  }

  // ── Title ────────────────────────────────────────────────
  y += 4
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...dark)
  doc.text(`Government Schemes You Qualify For`, margin, y)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text(`${schemes.length} schemes found`, margin, y + 5)
  y += 10

  // ── Schemes ──────────────────────────────────────────────
  const TAG_COLORS = {
    Housing: saffron, Health: [239, 68, 68], Education: [139, 92, 246],
    Agriculture: green, Women: [236, 72, 153], Employment: navy,
    Finance: [245, 158, 11], 'Social Welfare': [20, 184, 166], Loan: [6, 182, 212]
  }

  schemes.forEach((s, i) => {
    // Check page overflow
    if (y > 260) { doc.addPage(); y = 15 }

    const cardH = estimateCardHeight(s, doc, contentW)
    if (y + cardH > 275) { doc.addPage(); y = 15 }

    // Card background
    doc.setFillColor(...lightGray)
    doc.roundedRect(margin, y, contentW, cardH, 3, 3, 'F')

    // Left color bar
    const tagColor = TAG_COLORS[s.tag] || navy
    doc.setFillColor(...tagColor)
    doc.roundedRect(margin, y, 3, cardH, 1, 1, 'F')

    let cx = margin + 7

    // Scheme number + name
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(`${i + 1}. ${s.name}`, cx, y + 6)

    // Ministry + Type badges
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(`${s.ministry}  ·  ${s.type} Scheme  ·  ${s.tag}`, cx, y + 11)

    let iy = y + 16

    // Benefit box
    doc.setFillColor(...tagColor, 0.1)
    doc.setFillColor(255, 243, 224)
    doc.roundedRect(cx, iy, contentW - 12, 10, 1, 1, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...saffron)
    doc.text('BENEFIT: ', cx + 2, iy + 4)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    const benefitText = doc.splitTextToSize(s.benefit, contentW - 30)
    doc.text(benefitText[0] || s.benefit, cx + 18, iy + 4)
    iy += 13

    // Two columns: Eligibility | How to Apply
    const colW = (contentW - 14) / 2

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...gray)
    doc.text('ELIGIBILITY', cx, iy)
    doc.text('HOW TO APPLY', cx + colW + 2, iy)
    iy += 4

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    const eligLines = doc.splitTextToSize(s.eligibility || '', colW)
    const applyLines = doc.splitTextToSize(s.how_to_apply || '', colW)
    doc.text(eligLines.slice(0, 2), cx, iy)
    doc.text(applyLines.slice(0, 2), cx + colW + 2, iy)
    iy += Math.max(eligLines.slice(0,2).length, applyLines.slice(0,2).length) * 4 + 3

    // Documents
    if (s.documents?.length) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...gray)
      doc.setFontSize(7)
      doc.text('DOCUMENTS: ', cx, iy)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...dark)
      doc.text(s.documents.join('  ·  '), cx + 24, iy, { maxWidth: contentW - 36 })
      iy += 5
    }

    // Link
    doc.setFontSize(7)
    doc.setTextColor(...navy)
    doc.text(`Apply: ${s.link || 'myscheme.gov.in'}`, cx, iy)

    y += cardH + 4
  })

  // ── Footer ───────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setDrawColor(...saffron)
    doc.setLineWidth(0.3)
    doc.line(margin, 285, W - margin, 285)
    doc.setFontSize(7)
    doc.setTextColor(...gray)
    doc.text('Adhikar Setu — Your Right, Your Bridge', margin, 290)
    doc.text(`Verify all schemes at myscheme.gov.in before applying   |   Page ${p} of ${pageCount}`, W - margin, 290, { align: 'right' })
  }

  doc.save(`Adhikar-Setu-Schemes-${Date.now()}.pdf`)
}

function estimateCardHeight(s, doc, contentW) {
  let h = 18 // header
  h += 13    // benefit
  h += 18    // eligibility + apply cols
  if (s.documents?.length) h += 6
  h += 6     // link + padding
  return h
}
