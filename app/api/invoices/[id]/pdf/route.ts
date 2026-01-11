import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;
  if (!id) {
    return new NextResponse("Invalid invoice id", { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const url = `${origin}/invoices/${id}`;
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    await page.waitForSelector("#invoice-pdf", { timeout: 30_000 });

    // InvoiceDocumentだけ残す（スタイルはページ側のCSSを利用する）
    await page.evaluate(() => {
      const el = document.querySelector("#invoice-pdf");
      if (!el) throw new Error("#invoice-pdf not found");
      document.body.innerHTML = (el as HTMLElement).outerHTML;
      document.documentElement.style.background = "#ffffff";
      document.body.style.background = "#ffffff";
      document.body.style.margin = "0";
    });

    // PDF時の見た目を確実に揃える（print CSSが効かない環境でも適用される）
    await page.addStyleTag({
      content: `
        #invoice-pdf {
          box-shadow: none !important;
          filter: none !important;
          display: flex !important;
          flex-direction: column !important;
          min-height: 297mm !important;
        }
        #invoice-pdf .invoice-body { flex: 1 1 auto !important; }
        #invoice-pdf .invoice-footer { margin-top: auto !important; }
      `,
    });

    // フォント読み込み完了を待つ
    await page.evaluate(() => (document as any).fonts?.ready);

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    await page.close();

    const pdfBytes = new Uint8Array(pdfBuffer.byteLength);
    pdfBytes.set(pdfBuffer);
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice-" + id + ".pdf",
      },
    });
  } catch {
    return new NextResponse("PDF生成に失敗しました", { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
