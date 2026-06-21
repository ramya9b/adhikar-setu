export async function downloadSchemesPDF(schemes, profile = {}, lang = "en") {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, margin = 14, contentW = W - margin * 2;
  const saffron = [255,153,51], green = [19,136,8], navy = [0,0,128], gray = [100,100,100], light = [248,250,255];
  let y = 0;

  // Flag stripe header
  doc.setFillColor(...saffron); doc.rect(0,0,W,7,"F");
  doc.setFillColor(255,255,255); doc.rect(0,7,W,7,"F");
  doc.setFillColor(...green); doc.rect(0,14,W,7,"F");

  // Title
  y = 30;
  doc.setFontSize(20); doc.setFont("helvetica","bold"); doc.setTextColor(...navy);
  doc.text("Adhikar Setu", W/2, y, { align:"center" });
  y += 6;
  doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(...gray);
  doc.text("Your Rights. Your Bridge. — Verified scheme data from myscheme.gov.in", W/2, y, { align:"center" });

  // Profile summary
  y += 10;
  doc.setFillColor(240,244,255);
  doc.roundedRect(margin, y, contentW, 20, 2, 2, "F");
  y += 6;
  doc.setFontSize(8); doc.setFont("helvetica","bold"); doc.setTextColor(...navy);
  doc.text("Profile:", margin+3, y);
  doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
  const pText = [
    profile.age && `Age: ${profile.age}`,
    profile.gender && `Gender: ${profile.gender}`,
    profile.state && `State: ${profile.state}`,
    profile.category && `Category: ${String(profile.category).toUpperCase()}`,
    profile.occupation && `Occupation: ${profile.occupation}`,
    profile.income && `Income: ₹${Number(profile.income).toLocaleString("en-IN")}`,
  ].filter(Boolean).join("  |  ");
  doc.text(pText, margin+18, y, { maxWidth: contentW-20 });
  y += 8;
  doc.setFontSize(8); doc.setTextColor(...gray);
  const central = schemes.filter(s=>s.scope==="central").length;
  const state = schemes.filter(s=>s.scope==="state").length;
  doc.text(`${schemes.length} schemes  |  ${central} Central  |  ${state} State  |  ${new Date().toLocaleDateString("en-IN")}`, margin+3, y);
  y += 10;

  // Scheme cards
  for (const s of schemes) {
    const isState = s.scope === "state";
    const accent = isState ? green : saffron;
    const cardH = 36 + (s.documents?.length ? 6 : 0);

    if (y + cardH > 272) { doc.addPage(); y = 16; }

    // Card bg + left stripe
    doc.setFillColor(...light); doc.roundedRect(margin, y, contentW, cardH, 2, 2, "F");
    doc.setFillColor(...accent); doc.rect(margin, y, 3, cardH, "F");

    // Scope badge
    doc.setFillColor(...accent); doc.roundedRect(W-margin-28, y+2, 26, 5, 1, 1, "F");
    doc.setFontSize(6); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
    doc.text(isState ? `STATE·${(s.states||[])[0]||""}` : "CENTRAL", W-margin-15, y+5.5, { align:"center" });

    // Name
    doc.setFontSize(9); doc.setFont("helvetica","bold"); doc.setTextColor(...navy);
    doc.text(s.name, margin+6, y+8, { maxWidth: contentW-38 });

    // Ministry
    doc.setFontSize(7); doc.setFont("helvetica","normal"); doc.setTextColor(...gray);
    doc.text(s.ministry || "", margin+6, y+13);

    // Benefit
    doc.setFontSize(7.5); doc.setFont("helvetica","bold"); doc.setTextColor(...green);
    doc.text("BENEFIT: ", margin+6, y+19);
    doc.setFont("helvetica","normal"); doc.setTextColor(30,30,30);
    doc.text(s.benefit || "", margin+24, y+19, { maxWidth: contentW-30 });

    // Documents
    if (s.documents?.length) {
      doc.setFontSize(7); doc.setTextColor(...gray);
      doc.text(`Docs: ${s.documents.slice(0,3).join(", ")}`, margin+6, y+25);
    }

    // Apply URL
    doc.setFontSize(7); doc.setTextColor(...navy);
    doc.text(`Apply: ${s.applyUrl||""}`, margin+6, y+31);

    y += cardH + 4;
  }

  // Footer on all pages
  const pages = doc.internal.getNumberOfPages();
  for (let p=1; p<=pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...saffron); doc.setLineWidth(0.3);
    doc.line(margin, 285, W-margin, 285);
    doc.setFontSize(7); doc.setTextColor(...gray);
    doc.text("Adhikar Setu — Your Right, Your Bridge", margin, 290);
    doc.text(`Verify at myscheme.gov.in before applying  |  Page ${p}/${pages}`, W-margin, 290, { align:"right" });
  }

  doc.save(`Adhikar-Setu-${Date.now()}.pdf`);
}
